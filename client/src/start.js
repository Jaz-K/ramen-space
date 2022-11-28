import { createRoot } from "react-dom/client";
import Welcome from "./welcome"

const root = createRoot(document.querySelector("main"));
fetch('/user/id.json')
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
