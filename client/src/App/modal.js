import { useState } from "react"

export default function Modal({ onClose, onUpload }){
    const [image, setimage] = useState ("")
    console.log("image", image)

        async function avatarUpload(event){

            try {
                event.preventDefault()
            console.log("inside function")
            const formData = new FormData();
            formData.append = ("avatar", image)
            console.log("image inside", image)
            console.log("formData", formData)

            const response = await fetch("/api/users/profile_picture", {
                method: "POST",
                body: formData,
            });
            console.log("response", response);
            const newAvatar = await response.json();
            
            onUpload(newAvatar)
            } catch (error) {
                console.log("error", error)
            }
            
    }


    function handleChange(event){
        const imageUrl = event.target.files[0]
        // console.log("handle change", imageUrl)
        setimage(imageUrl)
    }

    return(
        <section className="modal">
            <button onClick={onClose}>x</button>
            <h2>Upload New Avatar</h2>
            <img src={image.name} alt={image.name}/>
            <form onSubmit={avatarUpload} >
                <label htmlFor="avatar"></label>
                <input type="file" id="avatar" accept="image/*" name="avatar" onChange={handleChange}/>
                <button>Upload Avatar</button>
            </form>
        </section>
    )
}