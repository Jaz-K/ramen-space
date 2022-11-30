import { useState } from "react";

export default function EditBio({ bio, onBioUpdate }) {
    const [editBio, setEditBio] = useState(false);
    const [newBioEntry, setNewBioEntry] = useState("");

    function onEditButtonClick() {
        console.log("edit button click");
        setEditBio(!editBio);
    }
    async function onSubmit(event) {
        // const newBio = event.target.bio.defaultValue;
        console.log("newBio", newBioEntry);
        event.preventDefault();

        const response = await fetch("/api/users/bio", {
            method: "POST",
            body: JSON.stringify({ bio: newBioEntry }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log("response", data);

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

    const buttonText = editBio ? "Cancel" : "Edit Bio";

    return (
        <>
            {editBio ? renderForm() : <p>{bio}</p>}
            {/* <button onClick={onEditButtonClick}>Testbutton</button> */}
            <button onClick={onEditButtonClick}>{buttonText}</button>
        </>
    );
}
