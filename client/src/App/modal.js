import { useState, useEffect } from "react";

export default function Modal({ onClose, onUpload, user_img }) {
    const [image, setImage] = useState("");
    const [imgPreview, setImagePreview] = useState();
    const DEFAULT_AVATAR = "/avatar.svg";

    useEffect(() => {
        console.log("userImage", user_img);
        if (user_img) {
            setImagePreview(user_img);
        } else {
            setImagePreview(DEFAULT_AVATAR);
        }
    }, []);

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
        const preview = document.getElementById(preview);
        const imageUrl = event.target.files[0];
        setImage(imageUrl);
        //creates preview in modal
        setImagePreview(URL.createObjectURL(event.target.files[0]));
    }

    return (
        <section className="modal">
            <button onClick={onClose} className="closeButton">
                ✖
            </button>
            <h2>Upload New Avatar</h2>
            <form onSubmit={avatarUpload}>
                {
                    <img
                        className="circle imgPreview"
                        id="preview"
                        src={imgPreview}
                        alt={image.name}
                    />
                }

                <label htmlFor="avatar"></label>
                <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    name="avatar"
                    onChange={handleChange}
                />
                <button className="classic">Upload Avatar</button>
            </form>
        </section>
    );
}
