import { Link } from 'react-router-dom';
export default function Login(){

    async function onSubmit(event){
        event.preventDefault();
        console.log('its submits')

       const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                email: event.target.email.value,
                password: event.target.password.value,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }
        ) 
    }

    return(
        <section onSubmit={onSubmit}>
            <form className="register">
                <label htmlFor="email">Email

                    <input type="text" name="email"/>
                </label>
                <label htmlFor="password">Password
                    <input type="password" name="password" />
                </label>
                <button>Login</button>
            </form>
            <Link to="/">Click here to Register</Link>
        </section>
    )
}