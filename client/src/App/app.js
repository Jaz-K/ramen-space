import { useState, useEffect } from "react"

import ProfileImage from "./profileImage"
import Modal from "./modal"

export default function App(){
    // const DEFAULT_AVATAR = "https://via.placeholder.com/150"
    const DEFAULT_AVATAR = "/avatar.svg"

    const [modal, setModal] = useState(false)
    const [user, setUser] = useState(null)
    
    useEffect(()=>{
        async function getUser(){
            const response = await fetch('/api/user/me')
            const parseJSON = await response.json()
            console.log('parseJSON', parseJSON.loggedUser)
            setUser(parseJSON.loggedUser)
        }
        getUser();    
    }, [])
    console.log("user:",user)
    function onAvatarClick(){
        console.log("Modal open")
        setModal(true)
    }

    function onModalClose(){
        console.log("Modal close")
        setModal(false)
    }
    
    function onUpload(event){
        event.preventDefault()
        console.log("UploadClick")
    }

    if(!user){
        return(
            <h2>Its Loading</h2>
        );
    }

   return(
        <section>
            <header>
                <img className="logo" src="/logo.svg" alt="logo" />
                <ProfileImage first_name={user.first_name} last_name={user.last_name} avatar={DEFAULT_AVATAR} onClick={onAvatarClick}/>
            </header>
            {modal && <Modal onClose={onModalClose} onClick={onUpload}/>}
        </section>
    )
}