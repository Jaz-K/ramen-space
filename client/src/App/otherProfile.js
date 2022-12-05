import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FriendButton from "./friendButton";

export default function OtherProfile() {
    const [otherUser, setOtherUser] = useState({});
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
    }, []);
    return (
        <section className="profile">
            <section>
                <img
                    className="user_img circle"
                    src={otherUser.img_url}
                    alt={`${otherUser.first_name} ${otherUser.last_name}`}
                />
                <FriendButton user_id={otherUserId} />
            </section>

            <section>
                <h2>
                    {otherUser.first_name} {otherUser.last_name}
                </h2>
                <h3>About me</h3>
                <p>{otherUser.bio}</p>
            </section>
        </section>
    );
}
