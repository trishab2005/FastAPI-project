import { useState } from "react";
import '../App.css';

function Delete() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

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
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleDelete = async (email) => {
    try {
      const response = await fetch(`http://localhost:4072/api/delete?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
      const data = await response.json();
      console.log(data.message);
      setResults(results.filter(contact => contact.email !== email));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="delete-container">
      <h1>Delete Contacts</h1>
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
                  onClick={() => handleDelete(contact.email)}
                >
                  🗑️
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No contacts found</p>
        )}
      </div>
    </div>
  );
}

export default Delete;
