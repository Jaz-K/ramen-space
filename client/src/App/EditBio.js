import { useState } from "react";

export default function EditBio({ bio, onBioUpdate }) {
    const [editBio, setEditBio] = useState(false);

    function onEditButtonClick() {
        setEditBio(!editBio);
    }
    async function onSubmit(event) {
        const newBio = event.target.bio.value;
        event.preventDefault();

        const response = await fetch("/api/users/bio", {
            method: "POST",
            body: JSON.stringify({ bio: newBio }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        setEditBio(false);
        onBioUpdate(data.bio);
    }

    function renderForm() {
        return (
            <form onSubmit={onSubmit}>
                <textarea
                    name="bio"
                    defaultValue={bio}
                    // onChange={handleChange}
                ></textarea>
                <button className="classic">Save Bio</button>
            </form>
        );
    }

    const buttonStartBio = editBio ? "Cancel" : "Start Your Bio";
    const buttonEditBio = editBio ? "Cancel" : "Edit Bio";

    return (
        <>
            {editBio ? renderForm() : <p className="bioText">{bio}</p>}
            {!bio && (
                <button className="classic" onClick={onEditButtonClick}>
                    {buttonStartBio}
                </button>
            )}
            {bio && (
                <button className="classic" onClick={onEditButtonClick}>
                    {buttonEditBio}
                </button>
            )}
        </>
    );
}
