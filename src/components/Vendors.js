import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Vendors.css"; // Import the CSS file for styling

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", upi: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/vendors");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.upi) newErrors.upi = "UPI is required";

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
    if (!validateForm()) return; // Stop if validation fails
    try {
      await axios.post("http://localhost:8080/vendors", form);
      fetchVendors();
      setForm({ name: "", email: "", upi: "" }); // Clear form after submission
      setErrors({}); // Clear errors
      setGeneralError(""); // Clear general error message
    } catch (error) {
      console.error("Error creating vendor", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="send-emails-container">
      <h1>Vendors</h1>
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
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <input
            type="text"
            name="upi"
            placeholder="UPI"
            value={form.upi}
            onChange={handleChange}
            className={errors.upi ? "input-error" : ""}
          />
          {errors.upi && <p className="error">{errors.upi}</p>}
        </div>
        <button type="submit">Add Vendor</button>
      </form>
      <ul>
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            {vendor.name} - {vendor.email} - {vendor.upi}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vendors;
