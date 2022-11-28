export default function Register(){

    async function handleSubmit(){
        console.log('its submits')
        //  const response = await fetch("/api/register")
        // const formData = new FormData()

       const response = await fetch("/api/register", {
            method: "POST",
            body: formData,
           /*  headers: {
                "Content-Type": "application/json",
            } */
        }
        ) 
    }
    return(
    <form className="register">
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
        <button onClick={handleSubmit} type="Submit">Register</button>
        <p>Member <a href="#">Login</a></p>
    </form>
)
}