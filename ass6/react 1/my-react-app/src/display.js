import { useLocation } from "react-router-dom";

function Display() {
  const location = useLocation();

  return (
    <div className="form">
      <h2>Student Details</h2>

      <p>Name: {location.state.name}</p>
      <p>Email: {location.state.email}</p>
    </div>
  );
}

export default Display;