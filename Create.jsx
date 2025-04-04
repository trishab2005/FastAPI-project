import { useState } from "react";
import '../App.css';

function Header() {
    return (
        <h1>Add Contact Details</h1>
    );
}

function Form() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4072/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error Caught: ', error);
        }
    };

    return (
        <div className="create-form">
            <form onSubmit={handleSubmit} className="form-class">
                <label htmlFor="name">Enter your Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                />
                <label htmlFor="contact">Enter your Contact</label>
                <input
                    type="text"
                    name="contact"
                    id="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter your contact"
                    required
                />
                <label htmlFor="email">Enter your Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

function Create() {
    return (
        <>
            <Header />
            <Form />
        </>
    );
}
export default Create;
