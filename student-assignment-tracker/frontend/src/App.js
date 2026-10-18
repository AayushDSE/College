import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:5000/assignments';

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Page view: 'assignments' | 'subjects'
  const [activePage, setActivePage] = useState('assignments');

  // Assignment data from MongoDB backend
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // New assignment form fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState('');

  // 1. Fetch assignments from Express API
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      setApiError('Unable to connect to backend server at http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // 2. Demo login: require both fields
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }
    setLoginError('');
    setIsLoggedIn(true);
    setActivePage('assignments');
  };

  // 3. Logout: return to login screen
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setActivePage('assignments');
  };

  // 4. Add assignment: send POST request to backend
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !subject.trim() || !dueDate.trim()) {
      setFormError('Please fill in title, subject, and due date.');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subject: subject.trim(),
          dueDate: dueDate.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add assignment');
      }

      setTitle('');
      setSubject('');
      setDueDate('');
      fetchAssignments();
    } catch (err) {
      setFormError(err.message);
    }
  };

  // 5. Delete assignment: confirm and send DELETE request
  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete assignment');
      }
      fetchAssignments();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // 6. Calculate unique subjects and counts from loaded assignments
  const subjectCounts = {};
  assignments.forEach((item) => {
    const name = item.subject ? item.subject.trim() : 'General';
    subjectCounts[name] = (subjectCounts[name] || 0) + 1;
  });

  const subjectList = Object.keys(subjectCounts).map((name) => ({
    name,
    count: subjectCounts[name],
  }));

  // VIEW 1: Login Page
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Student Assignment Tracker</h2>

          {loginError && <div className="error-message">{loginError}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="e.g. student"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="e.g. password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Container with Navigation
  return (
    <div className="container">
      {/* Navigation Header */}
      <header className="navbar">
        <h2>Student Assignment Tracker</h2>
        <div className="nav-links">
          <button
            type="button"
            className={`nav-btn ${activePage === 'assignments' ? 'active' : ''}`}
            onClick={() => setActivePage('assignments')}
          >
            Assignments ({assignments.length})
          </button>
          <button
            type="button"
            className={`nav-btn ${activePage === 'subjects' ? 'active' : ''}`}
            onClick={() => setActivePage('subjects')}
          >
            Subjects
          </button>
        </div>
        <div className="nav-user">
          <span>👤 {username}</span>
          <button type="button" className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main>
        {activePage === 'assignments' ? (
          /* VIEW 2: Assignments Page */
          <div className="assignments-page">
            {apiError && (
              <div className="error-banner">
                <p>{apiError}</p>
                <button type="button" className="btn btn-secondary" onClick={fetchAssignments}>
                  Retry
                </button>
              </div>
            )}

            {/* Add Assignment Form */}
            <section className="card">
              <h3>Add New Assignment</h3>
              {formError && <div className="error-message">{formError}</div>}

              <form onSubmit={handleAddAssignment} className="add-form">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Physics Lab Report"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="e.g. Physics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date *</label>
                  <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Add Assignment
                </button>
              </form>
            </section>

            {/* Saved Assignments List */}
            <section className="list-section">
              <h3>Saved Assignments ({assignments.length})</h3>

              {loading ? (
                <p className="status-msg">Loading assignments from database...</p>
              ) : assignments.length === 0 ? (
                <p className="empty-msg">No assignments found. Add your first assignment above!</p>
              ) : (
                <div className="assignment-list">
                  {assignments.map((item) => (
                    <div key={item._id} className="assignment-item">
                      <div className="assignment-info">
                        <h4>{item.title}</h4>
                        <p><strong>Subject:</strong> {item.subject}</p>
                        <p><strong>Due Date:</strong> {item.dueDate}</p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-delete"
                        onClick={() => handleDeleteAssignment(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          /* VIEW 3: Subjects Page */
          <div className="subjects-page">
            <div className="subjects-header">
              <h3>Subject Overview</h3>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActivePage('assignments')}
              >
                ← Back to Assignments
              </button>
            </div>

            {subjectList.length === 0 ? (
              <p className="empty-msg">
                No subjects found yet. Add an assignment in the Assignments tab to see subjects here!
              </p>
            ) : (
              <div className="subjects-grid">
                {subjectList.map((sub) => (
                  <div key={sub.name} className="subject-card">
                    <h4>{sub.name}</h4>
                    <p className="subject-count">
                      {sub.count} {sub.count === 1 ? 'assignment' : 'assignments'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
