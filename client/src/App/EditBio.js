import { useState } from "react";

export default function EditBio({ bio, onBioUpdate }) {
    const [editBio, setEditBio] = useState(false);

    function onEditButtonClick() {
        console.log("edit button click");
        setEditBio(!editBio);
    }
    function onSubmit(event) {
        event.preventDefault();
        // console.log("submit is clicked");
        onBioUpdate();
    }

    function renderForm() {
        return (
            <form onSubmit={onSubmit}>
                <textarea name="bio" defaultValue={bio}></textarea>
                <button>Save Bio</button>
            </form>
        );
    }

    const buttonText = editBio ? "Cancel" : "Edit Bio";

    return (
        <>
            {editBio && <h2>I am here</h2>}
            <p>{bio}</p>
            {renderForm()}
            <button onClick={onEditButtonClick}>{buttonText}</button>
        </>
    );
}
