import { useState, useEffect } from "react";

import ProfileImage from "./profileImage";
import Modal from "./modal";

export default function App() {
    const DEFAULT_AVATAR = "/avatar.svg";

    const [modal, setModal] = useState(false);
    const [user, setUser] = useState(null); // =null

    useEffect(() => {
        async function getUser() {
            const response = await fetch("/api/user/me");
            const parseJSON = await response.json();
            // console.log('parseJSON', parseJSON)
            //if()
            setUser(parseJSON);
        }
        getUser();
    }, []);
    console.log("user:", user);

    function onAvatarClick() {
        setModal(true);
    }

    function onModalClose() {
        setModal(false);
    }

    function onUpload(img_url) {
        console.log({ ...user, img_url });
        setUser({ ...user, img_url });
        setModal(false);
    }

    if (!user) {
        return <h2>Its Loading</h2>;
    }

    return (
        <section>
            <header>
                <img className="logo" src="/logo.svg" alt="logo" />
                <ProfileImage
                    first_name={user.first_name}
                    last_name={user.last_name}
                    avatar={user.img_url ? user.img_url : DEFAULT_AVATAR}
                    onClick={onAvatarClick}
                />
            </header>
            {modal && <Modal onClose={onModalClose} onUpload={onUpload} />}
        </section>
    );
}
