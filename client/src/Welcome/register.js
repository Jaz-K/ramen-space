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
            <form onSubmit={onSubmit} className="register formStyle">
                <div className="form-input">
                    <input type="text" name="first_name" id="fname" required />
                    <label htmlFor="fname">First Name</label>
                </div>
                <div className="form-input">
                    <input type="text" name="last_name" id="lname" required />
                    <label htmlFor="lname">Last Name</label>
                </div>
                <div className="form-input">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        autoComplete="do-not-autofill"
                    />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="form-input">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        autoComplete="do-not-autofill"
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <button type="Submit" className="classic">
                    Register
                </button>
                <Link to="/login">Click here to Login</Link>
                {error && <p className="error">{error}</p>}
            </form>
        </section>
    );
}
