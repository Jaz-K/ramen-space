import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./register";
import Login from "./login";

export default function Welcome() {
    return (
        <section className="welcome">
            <img className="welcomeLogo" src="/logo_ramen.svg" alt="logo" />
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
