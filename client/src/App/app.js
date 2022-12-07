import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import ProfileImage from "./profileImage";
import Modal from "./modal";
import Profile from "./profile";
import FindUsers from "./find-users";
import OtherProfile from "./otherProfile";
import Friends from "./friends";

export default function App() {
    const DEFAULT_AVATAR = "/avatar.svg";

    const [modal, setModal] = useState(false);
    const [user, setUser] = useState(null); // =null

    useEffect(() => {
        async function getUser() {
            const response = await fetch("/api/user/me");
            const parseJSON = await response.json();
            setUser(parseJSON);
        }
        getUser();
    }, []);

    function onAvatarClick() {
        setModal(true);
    }

    function onModalClose() {
        setModal(false);
    }

    function onUpload(img_url) {
        setUser({ ...user, img_url });
        setModal(false);
    }

    function onBioUpdate(bio) {
        setUser({ ...user, bio });
        console.log("bioupdate");
    }

    if (!user) {
        return <h2>Its Loading</h2>;
    }

    return (
        <>
            <BrowserRouter>
                <header>
                    <div>
                        <Link to="/">
                            <img
                                className="logo"
                                src="/logo_ramen.svg"
                                alt="logo"
                            />
                        </Link>

                        <nav className="menu">
                            <Link to="/">Home</Link>
                            <Link to="/friends">Friends</Link>
                            <Link to="/users">Find Users</Link>
                            <a href="/logout">Logout</a>
                            <ProfileImage
                                first_name={user.first_name}
                                last_name={user.last_name}
                                avatar={
                                    user.img_url ? user.img_url : DEFAULT_AVATAR
                                }
                                onClick={onAvatarClick}
                            />
                            {modal && (
                                <Modal
                                    onClose={onModalClose}
                                    onUpload={onUpload}
                                />
                            )}
                        </nav>
                    </div>
                </header>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Profile
                                    first_name={user.first_name}
                                    last_name={user.last_name}
                                    img_url={
                                        user.img_url
                                            ? user.img_url
                                            : DEFAULT_AVATAR
                                    }
                                    bio={user.bio}
                                    onBioUpdate={onBioUpdate}
                                />
                            </>
                        }
                    />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/users" element={<FindUsers />} />
                    <Route
                        path="/users/:otherUserId"
                        element={<OtherProfile />}
                    />
                </Routes>
            </BrowserRouter>
            <footer> Made with ❤ by Jaz</footer>
        </>
    );
}
