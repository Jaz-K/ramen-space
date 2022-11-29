import { useState } from "react"

export default function Modal({ onClose }){
    const [image, setimage] = useState ("")

        async function onUpload(event){
        event.preventDefault()
        
        const formData = new FormData();
        formData.append = ("profile_picture_url", image)
        console.log("image", image)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const newAvatar = await response.json();
            onClose(newAvatar)
    }


    function handleChange(event){
        const imageUrl = event.target.files[0]
        console.log("handle change", imageUrl)
        setimage(imageUrl.name)
    }

    return(
        <section className="modal">
            <button onClick={onClose}>x</button>
            <h1>Upload New Avatar</h1>
            
            <form onSubmit={onUpload} >
                <label htmlFor="profile_picture_url"></label>
                <input type="file" id="profile_picture_url" accept="image/*" name="profile_picture_url" onChange={handleChange}/>
                <button>Upload Avatar</button>
            </form>
        </section>
    )
}