export default function DeclineButton({ setStatus, user_id }) {
    async function onClick(event) {
        event.preventDefault();
        const response = await fetch(`/api/rejectfriendships/${user_id}`, {
            method: "POST",
        });
        const friendship = await response.json();
        setStatus(friendship);
    }

    return (
        <button className="classic" onClick={onClick}>
            Decline Request
        </button>
    );
}
