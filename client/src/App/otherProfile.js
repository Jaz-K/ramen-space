import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import FriendButton from "./friendButton";
import MyFriends from "./myFriends";
import WallMessage from "./wallMessage";

export default function OtherProfile({ default_avatar, img_url, setShroud }) {
    const [friends, setFriends] = useState([]);
    const [friendshipStatus, setFriendshipStatus] = useState([]);
    const [otherUser, setOtherUser] = useState({});

    const [modal, setModal] = useState("friendModal");
    // const [toggleFriends, setToggleFriends] = useState("friendModal");

    const { otherUserId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("useEffect is running");
        async function getUser() {
            const response = await fetch(`/api/users/${otherUserId}`);
            const data = await response.json();
            setOtherUser(data);

            if (!data) {
                navigate("/", { replace: true });
            }
        }
        getUser();
    }, [otherUserId]);

    function showFriendsPreview(friends) {
        setFriends(friends);
    }
    function getFriendshipStatus(friendshipStatus) {
        setFriendshipStatus(friendshipStatus);
    }

    function moreFriends() {
        console.log("modal", modal);
        setModal("friendModal active");
        setShroud(true);
    }

    function onClose() {
        setModal("friendModal");
        setShroud(false);
    }

    //-----

    return (
        <section className="profile">
            <section className="profileCard">
                <img
                    className="user_img circle"
                    src={otherUser.img_url ? otherUser.img_url : default_avatar}
                    alt={`${otherUser.first_name} ${otherUser.last_name}`}
                />
                <FriendButton
                    user_id={otherUserId}
                    getFriendshipStatus={getFriendshipStatus}
                />
                <h2>
                    {otherUser.first_name} {otherUser.last_name}
                </h2>
                <h3>About me</h3>
                <p>{otherUser.bio}</p>

                {!friends.length == 0 && <h3>Friends</h3>}

                <ul className="friendPreview">
                    {friends.map((friend) => (
                        <li key={friend.user_id}>
                            <Link to={`/users/${friend.user_id}`}>
                                <img
                                    src={friend.img_url}
                                    alt=""
                                    className="friendPreviewImg"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
                {!friends.length == 0 && (
                    <p onClick={moreFriends}>show all Friends</p>
                )}
            </section>

            {friendshipStatus === "ACCEPTED_FRIENDSHIP" && (
                <WallMessage user_id={otherUserId} img_url={img_url} />
            )}

            <MyFriends
                user_id={otherUserId}
                default_img={default_avatar}
                showFriendsPreview={showFriendsPreview}
                onClose={onClose}
                className={modal}
            />
        </section>
    );
}
