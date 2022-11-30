import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
    const [error, setError] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        console.log("its submits");

        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
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
        <section onSubmit={onSubmit}>
            <form className="register">
                <label htmlFor="email">
                    Email
                    <input type="text" name="email" required />
                </label>
                <label htmlFor="password">
                    Password
                    <input type="password" name="password" required />
                </label>
                <button>Login</button>
                {error && <p className="error">{error}</p>}
            </form>
            <Link to="/">Click here to Register</Link>
        </section>
    );
}
