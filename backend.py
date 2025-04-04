from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
import os

CSV_FILE = "contacts.csv"

# Create CSV file with headers if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["name", "contact", "email"])

class Contact(BaseModel):
    name: str
    contact: str
    email: str

# Model used for updating a contact.
# The 'old_email' field is used to find the existing contact,
# and the new details (name, contact, email) are the updated values.
class UpdateContact(BaseModel):
    old_email: str
    name: str
    contact: str
    email: str

app = FastAPI()

# Allow requests from your React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/data")
def get_data():
    return {"message": "Hello from FastAPI!", "data": [1, 2, 3, 4, 5]}

@app.post("/api/submit")
def submit_data(contact: Contact):
    try:
        with open(CSV_FILE, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([contact.name, contact.contact, contact.email])
        return {"message": "Data saved successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/search")
def search_contacts(name: str = Query(..., min_length=1)):
    """
    Search for contacts by name (case-insensitive substring search).
    Requires a query parameter 'name' with at least 1 character.
    """
    try:
        results = []
        with open(CSV_FILE, mode='r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if name.lower() in row["name"].lower():
                    results.append(row)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/update")
def update_contact(update: UpdateContact):
    """
    Update a contact's details. The 'old_email' field is used to identify
    the contact to update, and the rest of the fields contain the new details.
    """
    try:
        found = False
        rows = []
        # Read all rows and update the matching contact
        with open(CSV_FILE, mode='r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row["email"] == update.old_email:
                    found = True
                    # Replace with new details
                    row = {
                        "name": update.name,
                        "contact": update.contact,
                        "email": update.email
                    }
                rows.append(row)
        if not found:
            raise HTTPException(status_code=404, detail="Contact not found")
        # Write all rows back to the CSV file
        with open(CSV_FILE, mode='w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=["name", "contact", "email"])
            writer.writeheader()
            writer.writerows(rows)
        return {"message": "Contact updated successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/delete")
def delete_contact(email: str = Query(..., min_length=1)):
    """
    Delete a contact by email. Searches for an exact match in the CSV file.
    """
    try:
        found = False
        rows = []
        with open(CSV_FILE, mode='r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row["email"] == email:
                    found = True
                    continue
                rows.append(row)
        if not found:
            raise HTTPException(status_code=404, detail="Contact not found")
        with open(CSV_FILE, mode='w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=["name", "contact", "email"])
            writer.writeheader()
            writer.writerows(rows)
        return {"message": "Contact deleted successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4072)