export default function ProfileImage({
    first_name,
    last_name,
    avatar,
    onClick,
}) {
    return (
        <img
            onClick={onClick}
            className="logo circle"
            src={avatar}
            alt={`${first_name} ${last_name}`}
        />
    );
}
