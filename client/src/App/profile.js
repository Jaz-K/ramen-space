// import { useState } from "react";
// import { Link } from "react-router-dom";
import EditBio from "./EditBio";
// import MyFriends from "./myFriends";
import WallMessage from "./wallMessage";

export default function Profile({
    first_name,
    last_name,
    img_url,
    bio,
    onBioUpdate,
    user_id,
    // default_img,
}) {
    // const [friends, setFriends] = useState([]);

    // function showFriendsPreview(friends) {
    //     setFriends(friends);
    // }
    // function moreFriends() {
    //     console.log("more friends click");
    // }
    return (
        <>
            <section className="profile">
                <section className="profileCard">
                    <img
                        className="user_img circle"
                        src={img_url}
                        alt={`${first_name} ${last_name}`}
                    />
                    <h2>
                        {first_name} {last_name}
                    </h2>
                    <h3>About me</h3>
                    <EditBio bio={bio} onBioUpdate={onBioUpdate} />
                    {/* {!friends.length == 0 && <h3>Friends</h3>}
                    <ul className="friendPreview">
                        {friends.slice(0, 4).map((friend) => (
                            <li key={friend.user_id}>
                                <Link to={`/users/${friend.user_id}`}>
                                    <img
                                        src={friend.img_url ? friend.img_url : default_img}
                                        alt={friend.first_name}
                                        className="friendPreviewImg"
                                        title={friend.first_name}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {!friends.length == 0 && (
                        <p onClick={moreFriends}>show all Friends</p>
                    )} */}
                </section>
                <section className="messageWall">
                    <WallMessage user_id={user_id} img_url={img_url} />
                </section>
            </section>
            {/* <section>
                <MyFriends
                    default_img={default_img}
                    user_id={user_id}
                    showFriendsPreview={showFriendsPreview}
                />
            </section> */}
        </>
    );
}
