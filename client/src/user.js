import { Link } from 'react-router-dom';

export default function User(event){
    function onSubmit(){
        event.preventDefault()
        console.log("It submits")
        req.session = null
    }
    return(
        <section>
            <h1>Welcome to Flauschnet</h1>
            <form onSubmit={onSubmit} className="register">
                <button>Logout</button>
            </form>
        </section>
    )
}