import { useEffect, useState } from "react";
import DeclineButton from "./declineButton";
import { socket } from "../socket";

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

export default function FriendButton({ user_id, getFriendshipStatus }) {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        async function getFriendship() {
            const response = await fetch(`/api/friendshipstatus/${user_id}`);
            const friendship = await response.json();
            setStatus(friendship);
            getFriendshipStatus(friendship);
        }
        getFriendship();
    }, [user_id]);

    async function onClick(event) {
        event.preventDefault();
        const response = await fetch(`/api/friendshipstatus/${user_id}`, {
            method: "POST",
        });
        const friendship = await response.json();
        setStatus(friendship);
        // -----------------------SOCKET
        // emit reciver id to server check there with online socket ID
        socket.emit("newFriendRequest", user_id);
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
