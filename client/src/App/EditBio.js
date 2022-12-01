import { useState } from "react";

export default function EditBio({ bio, onBioUpdate }) {
    const [editBio, setEditBio] = useState(false);
    const [newBioEntry, setNewBioEntry] = useState("");

    function onEditButtonClick() {
        setEditBio(!editBio);
    }
    async function onSubmit(event) {
        event.preventDefault();

        const response = await fetch("/api/users/bio", {
            method: "POST",
            body: JSON.stringify({ bio: newBioEntry }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        setEditBio(false);
        onBioUpdate(data.bio);
    }

    function handleChange(event) {
        const newBioText = event.target.value;
        setNewBioEntry(newBioText);
    }

    function renderForm() {
        return (
            <form onSubmit={onSubmit}>
                <textarea
                    name="bio"
                    defaultValue={bio}
                    onChange={handleChange}
                ></textarea>
                <button>Save Bio</button>
            </form>
        );
    }

    const buttonStartBio = editBio ? "Cancel" : "Start Your Bio";
    const buttonEditBio = editBio ? "Cancel" : "Edit Bio";

    return (
        <>
            {editBio ? renderForm() : <p className="bioText">{bio}</p>}
            {!bio && (
                <button onClick={onEditButtonClick}>{buttonStartBio}</button>
            )}
            {bio && (
                <button onClick={onEditButtonClick}>{buttonEditBio}</button>
            )}
        </>
    );
}
