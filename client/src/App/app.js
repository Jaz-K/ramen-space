import { BrowserRouter, Routes, Route } from 'react-router-dom';
import User from "./modal"
import ProfileImage from "./profileImage"
export default function App(){

   return(
        <section>
            <header>
                <img className="logo" src="/logo.svg" alt="logo" />
                <ProfileImage />
            </header>
        </section>
    )
}