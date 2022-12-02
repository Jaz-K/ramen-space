import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OtherProfile() {
    const [otherUser, setOtherUser] = useState({});
    const { otherUserId } = useParams();
    useEffect(() => {
        console.log("useEffect is running");
        async function getUser() {
            const response = await fetch(`/api/users/${otherUserId}`);
            console.log("response", response);
            const data = await response.json();
            setOtherUser(data);
            console.log("data", data);
        }
        getUser();
    }, []);
    return (
        <section className="profile">
            <img
                className="user_img circle"
                src={otherUser.img_url}
                alt={`${otherUser.first_name} $otherUser.last_name}`}
            />
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
