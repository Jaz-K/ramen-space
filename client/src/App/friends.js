import { useEffect, useState } from "react";
import UserView from "./userView";

export default function Friends() {
    const [friendships, setFriendships] = useState([]);

    useEffect(() => {
        async function getFriendships() {
            const response = await fetch("/api/friendships");
            const data = await response.json();
            console.log("data from friendships", data);
            setFriendships(data);
        }
        getFriendships();
    }, []);

    async function onClick(id, action) {
        if (action === "accept") {
            const response = await fetch(`/api/friendships/${id}`, {
                method: "POST",
            });
            const friendship = await response.json();
            console.log("friendship", friendship);

            const newFriends = friendships.map((user) =>
                user.accepted === true ? user : {}
            );
            console.log("new Friends", newFriends);

            setFriendships(newFriends);
        }

        if (action === "delete") {
            const response = await fetch(`/api/rejectfriendships/${id}`, {
                method: "POST",
            });
            const friendship = await response.json();
            console.log("friendship", friendship);
            const newFriends = friendships.filter(
                (user) => user.user_id !== id
            );
            setFriendships(newFriends);
        }
    }

    return (
        <section>
            <h2>Friends</h2>
            <ul>
                {friendships.map((friendship) =>
                    friendship.status === "ACCEPTED_FRIENDSHIP" ? (
                        <li key={friendship.user_id}>
                            <UserView
                                {...friendship}
                                onClick={onClick}
                                action="delete"
                            />
                        </li>
                    ) : null
                )}
            </ul>

            <h2>Wannabes</h2>
            <ul>
                {friendships.map((friendship) =>
                    friendship.status === "INCOMING_FRIENDSHIP" ? (
                        <li key={friendship.user_id}>
                            <UserView
                                {...friendship}
                                onClick={onClick}
                                action="accept"
                            />
                        </li>
                    ) : null
                )}
            </ul>
        </section>
    );
}
