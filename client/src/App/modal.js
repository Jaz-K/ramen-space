import { useState } from "react"

export default function Modal({ onClose, onUpload }){
    const [image, setimage] = useState ("")

        async function onUpload(event){
        event.preventDefault()
        
        const formData = new FormData();
        formData.append = ("profile_picture_url", image)
        console.log("image", image)
        console.log("formData", formData)

            const response = await fetch("/api/user/upload", {
                method: "POST",
                body: formData,
            });
            const newAvatar = await response.json();
            
            onUpload(newAvatar)
    }


    function handleChange(event){
        const imageUrl = event.target.files[0]
        // console.log("handle change", imageUrl)
        setimage(imageUrl)
    }

    return(
        <section className="modal">
            <button onClick={onClose}>x</button>
            <h1>Upload New Avatar</h1>
            
            <form onSubmit={onUpload} >
                <label htmlFor="avatar"></label>
                <input type="file" id="avatar" accept="image/*" name="avatar" onChange={handleChange}/>
                <button>Upload Avatar</button>
            </form>
        </section>
    )
}