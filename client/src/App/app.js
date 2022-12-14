import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import ProfileImage from "./profileImage";
import Modal from "./modal";
import Profile from "./profile";
import FindUsers from "./find-users";
import OtherProfile from "./otherProfile";
import Friends from "./friends";
import Chat from "./chat";

import { socket } from "../socket";

export default function App() {
    const DEFAULT_AVATAR = "/avatar.svg";

    const [modal, setModal] = useState(false);
    const [user, setUser] = useState(0);
    const [shroud, setShroud] = useState(false);
    const [newFriends, setNewFriends] = useState(null);
    const [toggleMenu, setToggleMenu] = useState("menu");

    useEffect(() => {
        async function getUser() {
            const response = await fetch("/api/user/me");
            const parseJSON = await response.json();
            setUser(parseJSON);
        }
        getUser();
    }, []);

    useEffect(() => {
        socket.on("newFriendRequest", function (data) {
            console.log(data);
            setNewFriends((newFriends) => newFriends + 1);
        });

        return () => {
            console.log("chat cleanup");
            socket.off("newFriends");
        };
    }, []);

    function onAvatarClick() {
        setShroud(true);
        setModal(true);
        setToggleMenu("menu");
    }

    function onModalClose() {
        setModal(false);
        setShroud(false);
    }

    function onUpload(img_url) {
        setUser({ ...user, img_url });
        setModal(false);
        setShroud(false);
    }

    function onBioUpdate(bio) {
        setUser({ ...user, bio });
        console.log("bioupdate");
    }

    function burgerMenu() {
        setShroud("shroud active");
        setToggleMenu("menu active");
    }

    function onShroud() {
        setShroud(false);
        setModal(false);
        setToggleMenu("menu");
        setNewFriends(null);
    }

    async function deleteProfile(event) {
        event.preventDefault();
        if (!confirm("Are you sure?")) {
            return;
        }
        setModal(false);
        setShroud(false);
        console.log("it clicks");
        const response = await fetch(`/api/remove-profile`, {
            method: "POST",
        });
        const removeProfile = await response.json();
        console.log("profile removed", removeProfile);
    }

    if (!user) {
        return <h2>Its Loading</h2>;
    }

    return (
        <>
            <BrowserRouter>
                {shroud && <div className="shroud" onClick={onShroud}></div>}
                <header>
                    <div className="header">
                        <div className="navLogo">
                            <Link to="/">
                                <img
                                    className="logo"
                                    src="/logo_ramen_width.svg"
                                    alt="logo"
                                    title="This is some text I want to display."
                                />
                            </Link>
                            <img
                                className="burerMenuIcon"
                                src="/burger.svg"
                                alt="mobile menu icon"
                                onClick={burgerMenu}
                            />
                        </div>

                        <nav className={toggleMenu}>
                            <button
                                onClick={onShroud}
                                className="closeButton menuClose"
                            >
                                ✖
                            </button>
                            <div className="navLinks navGap ">
                                <Link to="/chat" onClick={onShroud}>
                                    Chat
                                </Link>
                                <Link
                                    to="/friends"
                                    className="friendsLink"
                                    onClick={onShroud}
                                >
                                    Friends
                                    {newFriends > 0 && (
                                        <div className="friendsIndicator">
                                            {newFriends}
                                        </div>
                                    )}
                                </Link>
                                <Link to="/users" onClick={onShroud}>
                                    Find Users
                                </Link>

                                <a href="/logout" className="logout">
                                    Logout
                                </a>
                                <img
                                    src="/settings.svg"
                                    alt="settings"
                                    className="settings"
                                    onClick={onAvatarClick}
                                />
                            </div>
                            <div className="navUser navGap ">
                                <p>Welcome {user.first_name}</p>
                                <Link to="/">
                                    <ProfileImage
                                        first_name={user.first_name}
                                        last_name={user.last_name}
                                        avatar={
                                            user.img_url
                                                ? user.img_url
                                                : DEFAULT_AVATAR
                                        }
                                        // onClick={onAvatarClick}
                                    />
                                </Link>
                            </div>
                        </nav>
                    </div>
                </header>
                {modal && (
                    <Modal
                        onClose={onModalClose}
                        onUpload={onUpload}
                        user_img={user.img_url}
                        deleteProfile={deleteProfile}
                    />
                )}
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
                                    user_id={user.id}
                                    default_img={DEFAULT_AVATAR}
                                />
                            </>
                        }
                    />
                    <Route
                        path="/chat"
                        element={
                            <Chat
                                user_id={user.id}
                                default_img={DEFAULT_AVATAR}
                            />
                        }
                    />
                    <Route
                        path="/friends"
                        element={<Friends default_avatar={DEFAULT_AVATAR} />}
                    />
                    <Route
                        path="/users"
                        element={<FindUsers default_avatar={DEFAULT_AVATAR} />}
                    />
                    <Route
                        path="/users/:otherUserId"
                        element={
                            <OtherProfile
                                default_avatar={DEFAULT_AVATAR}
                                img_url={user.img_url}
                                onModalClose={onModalClose}
                                setShroud={setShroud}
                            />
                        }
                    />
                </Routes>
            </BrowserRouter>
            <footer> Made with ❤ by Jaz</footer>
        </>
    );
}
