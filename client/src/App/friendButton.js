import { useEffect, useState } from "react";
import DeclineButton from "./declineButton";

function getButtonLabel(status) {
    if (status === "NO_FRIENDSHIP") {
        return "Send friendrequest";
    }
    if (status === "OUTGOING_FRIENDSHIP") {
        return "Request pending";
    }
    if (status === "INCOMING_FRIENDSHIP") {
        return "Accept request ";
    }
    if (status === "ACCEPTED_FRIENDSHIP") {
        return "Delete friend";
    }
    return "...";
}

export default function FriendButton({ user_id }) {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        async function getFriendship() {
            const response = await fetch(`/api/friendships/${user_id}`);
            const friendship = await response.json();
            // console.log("friendship", friendship);
            setStatus(friendship);
        }
        getFriendship();
    }, [user_id]);

    async function onClick(event) {
        event.preventDefault();
        console.log("userid", user_id);
        console.log("it clicks on friendship", status);
        const response = await fetch(`/api/friendships/${user_id}`, {
            method: "POST",
        });
        const friendship = await response.json();
        setStatus(friendship);
    }
    //add a post request

    return (
        <>
            <button
                className="friendshipButton classic"
                onClick={onClick}
                disabled={status === "OUTGOING_FRIENDSHIP"}
            >
                {getButtonLabel(status)}
            </button>
            {(status === "INCOMING_FRIENDSHIP" ||
                status === "OUTGOING_FRIENDSHIP") && (
                <DeclineButton setStatus={setStatus} user_id={user_id} />
            )}
        </>
    );
}
