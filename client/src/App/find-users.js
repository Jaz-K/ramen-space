import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FindUser({ default_avatar }) {
    const [users, setUsers] = useState([]);

    const [query, setQuery] = useState("");

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/users-search?q=${query}`);
            const userData = await response.json();

            setUsers(userData);
        })();
    }, [query]);

    function onChange(event) {
        setQuery(event.target.value);
    }
    return (
        <section className="findUser">
            <h1>Find users</h1>
            <hr></hr>
            <input type="text" placeholder="search user" onChange={onChange} />

            {!query && <h3>New members</h3>}
            {query && <h3>Search results</h3>}
            <ul className="userView friends">
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to={`/users/${user.id}`}>
                            <img
                                className="circle "
                                src={
                                    user.img_url ? user.img_url : default_avatar
                                }
                                alt={`${user.first_name} ${user.last_name}`}
                            />
                            <p>{user.first_name}</p> <p>{user.last_name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
