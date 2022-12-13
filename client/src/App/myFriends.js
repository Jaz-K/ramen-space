import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyFriends({
    default_img,
    user_id,
    showFriendsPreview,
    onClose,
    className,
}) {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        console.log("Effect runs");

        async function getFriendships() {
            const response = await fetch(`/api/friendships/${user_id}`);
            const data = await response.json();
            console.log("data from friendships", data);
            setFriends(data);
            const onlyFriends = data.filter(
                (friend) => friend.accepted === true
            );
            showFriendsPreview(onlyFriends);
        }
        getFriendships();
    }, [user_id]);
    ///////

    return (
        <section className={`modal ${className}`}>
            <button onClick={onClose} className="closeButton">
                ✖
            </button>
            <h2>My friends</h2>

            <ul className="userView">
                {friends.map((user) =>
                    user.accepted === true ? (
                        <li key={user.user_id}>
                            <Link to={`/users/${user.user_id}`}>
                                <img
                                    className="circle "
                                    src={
                                        user.img_url
                                            ? user.img_url
                                            : default_img
                                    }
                                    alt={`${user.first_name} ${user.last_name}`}
                                />
                                <p>{user.first_name}</p>
                                <p>{user.last_name}</p>
                            </Link>
                        </li>
                    ) : null
                )}
            </ul>
        </section>
    );
}
