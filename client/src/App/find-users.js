import { useEffect, useState } from "react";

export default function FIndUser() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        // console.log("useEffect runs");
        (async () => {
            // console.log("inside iffy");
            const response = await fetch(`/api/users-search?q=${query}`);
            console.log("response", response);
            // const userData = await response.json();
            // console.log("userData", userData);
            // setUsers(response);
        })();
    }, [query]);

    function onChange(event) {
        setQuery(event.target.value);
    }
    return (
        <>
            <h1>Find users</h1>;
            <input type="text" placeholder="search user" onChange={onChange} />
            {users.map((user) => (
                <div key={user.url}>{user.name}</div>
            ))}
        </>
    );
}
// last 3 users
// found users with name and image
