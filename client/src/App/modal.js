import { useState } from "react";

export default function Modal({ onClose, onUpload }) {
    const [image, setImage] = useState("");
    console.log("image", image);

    async function avatarUpload(event) {
        try {
            event.preventDefault();
            const formData = new FormData();
            formData.append("avatar", image);

            const response = await fetch("/api/users/profile_picture", {
                method: "POST",
                body: formData,
            });
            const newAvatar = await response.json();

            onUpload(newAvatar.img_url);
        } catch (error) {
            console.log("error", error);
        }
    }

    function handleChange(event) {
        const imageUrl = event.target.files[0];
        setImage(imageUrl);
    }

    return (
        <section className="modal">
            <button onClick={onClose}>x</button>
            <h2>Upload New Avatar</h2>
            <img src={image.name} alt={image.name} />
            <form onSubmit={avatarUpload}>
                <label htmlFor="avatar"></label>
                <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    name="avatar"
                    onChange={handleChange}
                />
                <button>Upload Avatar</button>
            </form>
        </section>
    );
}
