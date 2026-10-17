import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [event, setEvent] = useState("Workshop");
  const [date, setDate] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const url = "http://localhost:5000/registrations";

  const login = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    setCurrentPage(2);
  };

  const getRegistrations = async () => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        setMessage("Could not fetch registrations.");
        return;
      }

      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      setMessage("Cannot connect to backend. Start the server first.");
    }
  };

  useEffect(() => {
    if (loggedIn) {
      getRegistrations();
    }
  }, [loggedIn]);

  const saveRegistration = async (e) => {
    e.preventDefault();

    const registration = {
      name: name,
      email: email,
      department: department,
      event: event,
      date: date
    };

    try {
      let response;

      if (editId) {
        response = await fetch(url + "/" + editId, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registration)
        });
      } else {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registration)
        });
      }

      if (!response.ok) {
        setMessage("Could not save registration.");
        return;
      }

      setMessage(
        editId ? "Registration updated!" : "Registration added!"
      );

      clearForm();
      await getRegistrations();
      setCurrentPage(3);
    } catch (error) {
      setMessage("Backend is not responding.");
    }
  };

  const editRegistration = (registration) => {
    setName(registration.name);
    setEmail(registration.email);
    setDepartment(registration.department);
    setEvent(registration.event);
    setDate(registration.date || "");
    setEditId(registration._id);
    setMessage("");
  };

  const deleteRegistration = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this registration?")
    ) {
      return;
    }

    try {
      const response = await fetch(url + "/" + id, {
        method: "DELETE"
      });

      if (!response.ok) {
        setMessage("Could not delete registration.");
        return;
      }

      setMessage("Registration deleted!");
      await getRegistrations();
    } catch (error) {
      setMessage("Backend is not responding.");
    }
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setEvent("Workshop");
    setDate("");
    setEditId(null);
  };

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>EventEase</h1>
          <p>Event Registration System</p>

          <form onSubmit={login}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>EventEase</h1>
        <p>Register for campus events</p>

        <button
          onClick={() => {
            setLoggedIn(false);
            setUsername("");
            setPassword("");
            setMessage("");
            setCurrentPage(2);
            clearForm();
          }}
        >
          Logout
        </button>
      </header>

      <nav className="container">
        <button onClick={() => {
          setCurrentPage(2);
          setMessage("");
        }}>
          Registration Form
        </button>

        <button onClick={() => {
          setCurrentPage(3);
          setMessage("");
          getRegistrations();
        }}>
          All Registrations
        </button>
      </nav>

      <main className="container">
        {currentPage === 2 && (
          <section className="form-card">
            <h2>
              {editId ? "Edit Registration" : "Register for an Event"}
            </h2>

            <form onSubmit={saveRegistration}>
              <label>Student Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />

              <label>Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Enter department"
                required
              />

              <label>Event</label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
              >
                <option>Workshop</option>
                <option>Hackathon</option>
                <option>Coding Competition</option>
                <option>Technical Seminar</option>
                <option>Cultural Fest</option>
              </select>

              <label>Event Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <button type="submit">
                {editId ? "Update Registration" : "Register"}
              </button>

              {editId && (
                <button type="button" onClick={() => {
                  clearForm();
                  setMessage("");
                }}>
                  Cancel
                </button>
              )}
            </form>

            {message && <p className="message">{message}</p>}
          </section>
        )}

        {currentPage === 3 && (
          <section className="registration-card">
            <h2>All Registrations</h2>
            <p>Total registrations: {registrations.length}</p>

            {registrations.length === 0 ? (
              <p>No registrations yet.</p>
            ) : (
              registrations.map((registration) => (
                <div
                  className="registration-item"
                  key={registration._id}
                >
                  <h3>{registration.name}</h3>
                  <p>Email: {registration.email}</p>
                  <p>Department: {registration.department}</p>
                  <p>Event: {registration.event}</p>
                  <p>Date: {registration.date}</p>

                  <button onClick={() => {
                    editRegistration(registration);
                    setCurrentPage(2);
                  }}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteRegistration(registration._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}

            {message && <p className="message">{message}</p>}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;