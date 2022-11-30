import { useState, useEffect } from "react"

import ProfileImage from "./profileImage"
import Modal from "./modal"

export default function App(){
    const DEFAULT_AVATAR = "/avatar.svg"

    const [modal, setModal] = useState(false)
    const [user, setUser] = useState({profile_picture_url: DEFAULT_AVATAR})
    
    useEffect(()=>{
        async function getUser(){
            const response = await fetch('/api/user/me')
            const parseJSON = await response.json()
            // console.log('parseJSON', parseJSON)
            setUser(parseJSON)
        }
        getUser();    
    }, [])
    console.log("user:",user)

    function onAvatarClick(){
        setModal(true)
    }

    function onModalClose(){
        setModal(false)
    }

    function onUpload(newAvatar){
        console.log({...user, profile_picture_url: newAvatar})
        setUser({...user, profile_picture_url: newAvatar})
        setModal(false)
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
                <ProfileImage first_name={user.first_name} last_name={user.last_name} avatar={user.profile_picture_url} onClick={onAvatarClick}/>
            </header>
            {modal && <Modal onClose={onModalClose} onUpload={onUpload} />}
        </section>
    )
}