import { createRoot } from "react-dom/client";
import Welcome from "./welcome"
// import Login from "./login"

const root = createRoot(document.querySelector("main"));
fetch('/api/register/id.json')
    .then(response => response.json())
    .then(data => {
        if (!data.userId) {
            root.render(<Welcome />);
        } else {(<div>Logged in!</div>);
        }
    });
     
/* root.render(<Welcome />);

function HelloWorld() {
    return <div>Hello, Flauschbook!</div>;
} */
