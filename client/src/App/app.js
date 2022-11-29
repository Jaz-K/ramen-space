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
            // console.log('parseJSON', parseJSON)
            setUser({...parseJSON, profile_picture_url: DEFAULT_AVATAR})
        }
        getUser();    
    }, [])
    console.log("user:",user)

    function onAvatarClick(){
        setModal(true)
    }

    function onModalClose(avatarUrl){
        console.log(avatarUrl)
        setModal(false)
        console.log({...user, profile_picture_url: avatarUrl})
        setUser({...user, profile_picture_url: avatarUrl})
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
            {modal && <Modal onClose={onModalClose} />}
        </section>
    )
}