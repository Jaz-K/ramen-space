import { useEffect, useState } from "react";

export default function FIndUser() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        // console.log("useEffect runs");
        (async () => {
            // console.log("query", query);
            console.log("inside iffy");
            const response = await fetch(`/api/users-search?q=${query}`);
            const userData = await response.json();
            // console.log("userData", userData);
            setUsers(userData);
        })();
    }, [query]);

    console.log("Users", users);

    function onChange(event) {
        setQuery(event.target.value);
    }
    return (
        <>
            <h1>Find users</h1>
            <input type="text" placeholder="search user" onChange={onChange} />
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <img
                            src={user.img_url}
                            alt={`${user.first_name} ${user.last_name}`}
                        />
                        {user.first_name} {user.last_name}
                    </li>
                ))}
            </ul>
        </>
    );
}
// last 3 users
// found users with name and image
