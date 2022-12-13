// import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
// import { socket } from "../socket";

export default function UserView({
    img_url,
    first_name,
    last_name,
    user_id,
    onClick,
    action,
    default_avatar,
}) {
    // useEffect(() => {
    //     socket.on("onlineUser", (data) => {
    //         console.log("onlineUser", data);
    //     });
    // }, []);
    return (
        <>
            <Link to={`/users/${user_id}`}>
                <img
                    className="circle"
                    src={img_url ? img_url : default_avatar}
                    alt={`${first_name} ${last_name}`}
                />
            </Link>
            <p>{first_name}</p>
            <p>{last_name}</p>
            <button onClick={() => onClick(user_id, action)}>{action}</button>
        </>
    );
}
