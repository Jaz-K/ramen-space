import { Link } from 'react-router-dom';
export default function Register(){

    async function onSubmit(event){
        event.preventDefault();
        console.log('its submits')


       const response = await fetch("/api/users", {
           method: "POST",
            body: JSON.stringify({
                firs_name: event.target.first_name.value,
                last_name: event.target.last_name.value,
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
        <section>
            <form onSubmit={onSubmit} className="register">
                <label htmlFor="fname">First Name
                    <input type="text" name="first_name" id="fname"></input>
                </label>
                <label htmlFor="lname">Last Name
                    <input type="text" name="last_name" id="lname"></input>
                </label>
                <label htmlFor="email">Email
                    <input type="email" name="email" id="email"></input>
                </label>
                <label htmlFor="password">Password
                    <input type="password" name="password" id="password"></input>
                </label>
                <button type="Submit">Register</button>
            </form>
            <Link to="/login">Click here to Login</Link>
    </section>
)
}