import { useEffect, useState } from "react";

function getButtonLabel(status) {
    if (status === "NO_FRIENDSHIP") {
        return "Send friendrequest";
    }
    if (status === "OUTGOING_FRIENDSHIP") {
        return "Request pending";
    }
    if (status === "INCOMING_FRIENDSHIP") {
        return "Friend request ";
    }
    if (status === "ACCEPTED_FRIENDSHIP") {
        return "Delete friend";
    }
    return "...";
}

export default function FriendButton({ user_id }) {
    console.log("user_id friend button", user_id);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        async function getFriendship() {
            const response = await fetch(`/api/friendships/${user_id}`);
            const friendship = await response.json();
            console.log("friendship", friendship);
            setStatus(friendship);
        }
        getFriendship();
    }, [user_id]);

    function onClick(event) {
        event.preventDefault();
        // console.log("it clicks");
    }
    //add a post request

    return (
        <>
            <button
                className="friendshipButton"
                onClick={onClick}
                disabled={status === "OUTGOING_FRIENDSHIP"}
            >
                {getButtonLabel(status)}
            </button>
        </>
    );
}
