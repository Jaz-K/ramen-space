import { useEffect, useState } from "react";
import UserView from "./userView";

export default function Friends({ default_avatar }) {
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

    async function onClick(id, action = "reject") {
        if (action === "accept") {
            const response = await fetch(`/api/friendshipstatus/${id}`, {
                method: "POST",
            });
            const friendship = await response.json();
            console.log("friendship", friendship);

            const friends = friendships.map((user) =>
                user.user_id === id
                    ? { ...user, accepted: true, status: friendship }
                    : user
            );
            console.log("Friends", friends);
            const newFriends = [...friends];
            setFriendships(newFriends);
        }

        if (action === "reject") {
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

    function wannabeHeadline(friendships) {
        const status = friendships.map((friendship) => friendship.status);
        console.log("status", status);
        if (status.includes("INCOMING_FRIENDSHIP")) {
            return "Wannabe";
        }
    }
    function friendsHeadline(friendships) {
        const status = friendships.map((friendship) => friendship.status);
        console.log("status", status);

        if (!status.includes("ACCEPTED_FRIENDSHIP")) {
            return "No friends yet";
        }
    }

    return (
        <section>
            <h2>{wannabeHeadline(friendships)}</h2>
            <ul className="userView wannebe">
                {friendships.map((friendship) =>
                    friendship.accepted === false ? (
                        <li key={friendship.user_id}>
                            <UserView
                                {...friendship}
                                onClick={onClick}
                                action="accept"
                                default_avatar={default_avatar}
                            />
                            <button
                                action="delete"
                                onClick={() => onClick(friendship.user_id)}
                            >
                                Reject Friendship
                            </button>
                        </li>
                    ) : null
                )}
            </ul>

            <h2>Friends</h2>
            <p>{friendsHeadline(friendships)}</p>
            <ul className="userView">
                {friendships.map((friendship) =>
                    friendship.accepted === true ? (
                        <li key={friendship.user_id}>
                            <UserView
                                {...friendship}
                                onClick={onClick}
                                action="reject"
                            />
                        </li>
                    ) : null
                )}
            </ul>
        </section>
    );
}
