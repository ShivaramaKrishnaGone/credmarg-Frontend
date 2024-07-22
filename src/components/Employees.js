import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Employees.css"; // Import the CSS file for styling

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    ctc: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.designation) newErrors.designation = "Designation is required";
    if (!form.ctc || isNaN(form.ctc) || form.ctc <= 0)
      newErrors.ctc = "CTC must be a positive number";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email is required";

    setErrors(newErrors);

    // Set a general error message if there are any field-specific errors
    if (Object.keys(newErrors).length > 0) {
      setGeneralError("Highlighted fields are mandatory");
    } else {
      setGeneralError("");
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post("http://localhost:8080/employees", form);
      fetchEmployees();
      setForm({ name: "", designation: "", ctc: "", email: "" });
      setErrors({});
      setGeneralError("");
    } catch (error) {
      console.error("Error creating employee", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ctc") {
      if (/^\d*$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <div className="send-emails-container">
      <h1>Employees</h1>
      <form onSubmit={handleSubmit}>
        {generalError && <div className="general-error">{generalError}</div>}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className={errors.designation ? "input-error" : ""}
          />
          {errors.designation && <p className="error">{errors.designation}</p>}
        </div>
        <div>
          <input
            type="text"
            name="ctc"
            placeholder="CTC"
            value={form.ctc}
            onChange={handleChange}
            className={errors.ctc ? "input-error" : ""}
          />
          {errors.ctc && <p className="error">{errors.ctc}</p>}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <button type="submit">Add Employee</button>
      </form>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.designation} - {employee.ctc} -{" "}
            {employee.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Employees;
