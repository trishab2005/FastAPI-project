import { useState } from "react";
import '../App.css';

function Read() {
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

  return (
    <div className="read-container">
      <h1>Search Contacts</h1>
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
                <strong>{contact.name}</strong> - {contact.contact} - {contact.email}
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

export default Read;
