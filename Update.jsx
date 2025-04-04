import { useState } from "react";
import '../App.css';

function Update() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [editData, setEditData] = useState({ name: "", contact: "", email: "" });

  const handleSearch = async (e) => {
    e.preventDefault();
    const encodedTerm = encodeURIComponent(searchTerm.trim());
    if (!encodedTerm) return;
    try {
      const response = await fetch(`http://localhost:4072/api/search?name=${encodedTerm}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setResults(data.results);
      // Reset any current editing state on new search
      setEditingContact(null);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleEditClick = (contact) => {
    setEditingContact(contact);
    setEditData({ name: contact.name, contact: contact.contact, email: contact.email });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Here you would normally call an update API endpoint.
    // For now, we simply alert and update the local state.
    alert("Changes have been made!");
    // Update the results list with the edited contact info.
    setResults(
      results.map((item) =>
        item.email === editingContact.email ? editData : item
      )
    );
    // Clear the editing state after update.
    setEditingContact(null);
  };

  return (
    <div className="update-container">
      <h1>Update Contacts</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter name to search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        {results.length > 0 ? (
          <ul>
            {results.map((contact, index) => (
              <li key={index}>
                <span>
                  <strong>{contact.name}</strong> - {contact.contact} - {contact.email}
                </span>
                <span
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                  onClick={() => handleEditClick(contact)}
                >
                  ✏️
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No contacts found</p>
        )}
      </div>
      {editingContact && (
        <div className="edit-form">
          <h2>Edit Contact</h2>
          <form onSubmit={handleEditSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder={editingContact.name}
              value={editData.name}
              onChange={handleEditChange}
            />
            <label htmlFor="contact">Contact:</label>
            <input
              type="text"
              name="contact"
              id="contact"
              placeholder={editingContact.contact}
              value={editData.contact}
              onChange={handleEditChange}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder={editingContact.email}
              value={editData.email}
              onChange={handleEditChange}
            />
            <button type="submit">Update Contact</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Update;