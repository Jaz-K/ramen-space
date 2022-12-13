import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./register";
import Login from "./login";

export default function Welcome() {
    return (
        <section className="welcome">
            <h1>Ramen Society</h1>
            <img className="logo" src="/logo_ramen.svg" alt="logo" />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </section>
    );
}
