import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from "./register"
import Login from "./login"

export default function Welcome(){
    return(
    <div>
        <h1>Welcome to my Flauschnet</h1>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />}/>  
                <Route path="/login" element={<Login />}/>  
            </Routes>
        </BrowserRouter>
    </div>)
}