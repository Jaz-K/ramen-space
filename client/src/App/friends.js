import { useEffect, useState } from "react";
import UserView from "./userView";

export default function Friends({ default_avatar }) {
    const [friendships, setFriendships] = useState([]);
    const [wannabe, setWannabe] = useState(false);
    const [friends, setFriends] = useState(false);

    useEffect(() => {
        async function getFriendships() {
            const response = await fetch("/api/friendships");
            const data = await response.json();
            console.log("data from friendships", data);
            setFriendships(data);
        }
        getFriendships();
    }, []);

    useEffect(() => {
        const status = friendships.map((friendship) => friendship.status);
        console.log("status", status);
        if (!status.includes("ACCEPTED_FRIENDSHIP")) {
            setFriends(true);
            return;
        }

        const statusWannabe = friendships.map(
            (friendship) => friendship.status
        );
        console.log("status", statusWannabe);
        if (!status.includes("INCOMING_FRIENDSHIP")) {
            setWannabe(true);
            return;
        }
    }, [friendships]);

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

            function friendsHeadline(friendships) {
                const status = friendships.map(
                    (friendship) => friendship.status
                );
                console.log("status", status);

                if (!status.includes("ACCEPTED_FRIENDSHIP")) {
                    return "No friends yet";
                }
            }
            friendsHeadline(friendships);
        }
    }

    return (
        <section className="friendsOverview">
            {!wannabe && <h2>Wannabe</h2>}
            {!wannabe && <hr />}

            {!wannabe && (
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
                                    className="classic"
                                    action="delete"
                                    onClick={() => onClick(friendship.user_id)}
                                >
                                    reject
                                </button>
                            </li>
                        ) : null
                    )}
                </ul>
            )}
            <h2>Friends</h2>
            <hr />
            {!friends && <h3>No friends yet</h3>}
            <ul className="userView friends">
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
