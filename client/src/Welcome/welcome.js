import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from "./register"
import Login from "./login"

export default function Welcome(){
    return(
    <section className='welcome'>
        <h1>Welcome to my Flauschnet</h1>
        <img className="logo" src="/logo.svg" alt="logo" />
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />}/>  
                <Route path="/login" element={<Login />}/>  
            </Routes>
        </BrowserRouter>
    </section>)
}