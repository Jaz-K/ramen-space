import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
    const [error, setError] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        console.log("its submits");

        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({
                first_name: event.target.first_name.value,
                last_name: event.target.last_name.value,
                email: event.target.email.value,
                password: event.target.password.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            window.location.href = "/";
            return;
        }

        try {
            const data = await response.json();
            setError(data.error);
        } catch (error) {
            console.log("Something is really broken");
        }
    }
    return (
        <section>
            <form onSubmit={onSubmit} className="register">
                <label htmlFor="fname">
                    First Name
                    <input type="text" name="first_name" id="fname" required />
                </label>
                <label htmlFor="lname">
                    Last Name
                    <input type="text" name="last_name" id="lname" required />
                </label>
                <label htmlFor="email">
                    Email
                    <input type="email" name="email" id="email" required />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                    />
                </label>
                <button type="Submit">Register</button>
                {error && <p className="error">{error}</p>}
            </form>
            <Link to="/login">Click here to Login</Link>
        </section>
    );
}
