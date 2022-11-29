import { createRoot } from "react-dom/client";
import Welcome from "./Welcome/welcome"
import App from "./App/app"

const root = createRoot(document.querySelector("main"));
fetch('/api/user/me')
    .then(response => response.json())
    .then(data =>{
        if (!data) {
             console.log("Data", data)
            root.render(<Welcome />);
        } else {
            root.render(<App/>);
        }
    });
     

//<img className="logo" src="/logo.svg" alt="logo" />

/*  .then(data => 
       {
        if (!data.user_id) {
             console.log("Data", data)
            root.render(<Welcome />);
        } else {
            root.render(<App/>);
        } */