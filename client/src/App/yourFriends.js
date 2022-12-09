import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import UserView from "./userView";

export default function MyFriends({ default_img, user_id }) {
    const [friends, setFriends] = useState([]);

    // const navigate = useNavigate();

    useEffect(() => {
        console.log("Effect runs");

        async function getFriendships() {
            const response = await fetch(`/api/otherfriendships/${user_id}`);
            const data = await response.json();
            console.log("data from friendships", data);
            setFriends(data);
        }
        getFriendships();
    }, [user_id]);
    return (
        <>
            <h2>My friends</h2>

            <ul className="userView">
                {friends.map((user) =>
                    user.accepted === true ? (
                        <li key={user.user_id}>
                            {/* <UserView {...user} /> */}
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
                                {user.first_name} {user.last_name}
                            </Link>
                        </li>
                    ) : null
                )}
            </ul>
        </>
    );
}
