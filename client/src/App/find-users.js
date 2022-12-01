import { useEffect, useState } from "react";

export default function FIndUser() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/users-search?q=${query}`);
            const userData = await response.json();

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

            {!query && <h3>Our last new Users</h3>}
            {query && <h3>Is it what you searching for</h3>}
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <img
                            className="circle "
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
