import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Input() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  function submit() {
    navigate("/display", {
      state: {
        name: name,
        email: email
      }
    });
  }

  return (
    <div className="form">
      <h2>Registration Form</h2>

      <input
        type="text"
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default Input;