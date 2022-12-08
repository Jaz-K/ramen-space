import { Link } from "react-router-dom";

export default function UserView({
    img_url,
    first_name,
    last_name,
    user_id,
    onClick,
    action,
}) {
    // const { img_url, first_name, last_name, user_id, onClick } = friendship;
    return (
        <>
            <Link to={`/users/${user_id}`}>
                <img
                    className="circle"
                    src={img_url}
                    alt={`${first_name} ${last_name}`}
                />
            </Link>
            {first_name} {last_name}
            <button onClick={() => onClick(user_id, action)}>{action}</button>
        </>
    );
}
