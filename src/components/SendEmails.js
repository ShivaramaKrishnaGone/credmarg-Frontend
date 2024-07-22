import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SendEmails.css"; // Import CSS file for styling if needed

const SendEmails = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);

  useEffect(() => {
    fetchVendors();
    fetchEmailLogs(); // Fetch email logs when the component mounts
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/vendors");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  };

  const fetchEmailLogs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/emails/logs");
      setEmailLogs(response.data);
    } catch (error) {
      console.error("Error fetching email logs", error);
    }
  };

  const handleCheckboxChange = (vendorId) => {
    setSelectedVendors((prev) => {
      if (prev.includes(vendorId)) {
        return prev.filter((id) => id !== vendorId);
      } else {
        return [...prev, vendorId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/emails/send", selectedVendors);
      alert("Emails sent successfully!");
      setSelectedVendors([]); // Clear selections after sending
      fetchEmailLogs(); // Refresh email logs after sending
    } catch (error) {
      console.error("Error sending emails", error);
    }
  };

  return (
    <div className="send-emails-container">
      <h1>Send Emails to Vendors</h1>
      <form onSubmit={handleSubmit}>
        {vendors.map((vendor) => (
          <div key={vendor.id} className="vendor-item">
            <input
              type="checkbox"
              id={`vendor-${vendor.id}`}
              value={vendor.id}
              checked={selectedVendors.includes(vendor.id)}
              onChange={() => handleCheckboxChange(vendor.id)}
              className="vendor-checkbox"
            />
            <label htmlFor={`vendor-${vendor.id}`} className="vendor-label">
              {vendor.name} - {vendor.email}
            </label>
          </div>
        ))}
        <button type="submit" disabled={selectedVendors.length === 0}>
          Send Emails
        </button>
      </form>

      <h2>Email Logs</h2>
      {emailLogs.length > 0 ? (
        <table className="email-logs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Recipient</th>
              <th>Subject</th>
              <th>Body</th>
              <th>Sent At</th>
            </tr>
          </thead>
          <tbody>
            {emailLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.recipient}</td>
                <td>{log.subject}</td>
                <td>{log.body}</td>
                <td>{new Date(log.sentAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No email logs available.</p>
      )}
    </div>
  );
};

export default SendEmails;
