import { useState } from "react";

// Form Component
function Form({ submit }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            submit({ name, email });
        }}>
            <h2>Student Form</h2>

            <input
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <br /><br />

            <input
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <br /><br />

            <button>Submit</button>
        </form>
    );
}

// Display Component
function Display({ student }) {
    return (
        <div>
            <h2>Student Details</h2>
            <p>Name: {student.name}</p>
            <p>Email: {student.email}</p>
        </div>
    );
}

// Main Component
function App() {
    const [student, setStudent] = useState(null);

    return (
        <div>
            <Form submit={setStudent} />

            {student && <Display student={student} />}
        </div>
    );
}

export default App;