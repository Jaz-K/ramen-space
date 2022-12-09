import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
// import EmojiPicker from "emoji-picker-react";

let socket;

// lazy initialise pattern!
const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

const disconnect = () => {
    socket.disconnect();
    socket = null;
};

export default function Chat() {
    // const [chat, setChat] = useState("");
    const [chatMessage, setChatMessage] = useState([]);
    const listRef = useRef(null);
    // console.log("chat", chat);
    console.log("useeffect chat");

    useEffect(() => {
        socket = connect();

        socket.on("chat", function getMessages(data) {
            // console.log("test messages", data);
            setChatMessage(data);
        });

        socket.on("newMessage", (newMessage) => {
            console.log("newMessage", newMessage);
            setChatMessage((chatMessage) => [...chatMessage, newMessage]);
        });
        return () => {
            console.log("chat cleanup");
            disconnect();
        };
    }, []);

    useEffect(() => {
        // other use effect with scroll
        const recentMessage = listRef.current.lastChild;
        if (recentMessage) {
            recentMessage.scrollIntoView();
        }
        console.log("recentMessage", recentMessage);
    }, [chatMessage]);

    function hitEnter(event) {
        if (event.key === "Enter") {
            // console.log("Enter hits");
            // console.log("textarea iput", event.target.value);
            const newMessage = event.target.value;
            socket.emit("newMessage", { message: newMessage });

            event.target.value = "";
        }
    }

    return (
        <section className="chat">
            <h2>Chat</h2>

            <ul ref={listRef}>
                {chatMessage.map((message) => (
                    <li key={message.id}>
                        <p className="chatSender">
                            {message.first_name} {message.last_name}
                        </p>
                        <div className="chatblock">
                            <img
                                src={message.img_url}
                                className="chatAvatar circle"
                            />
                            <p className="chatMsg">{message.message}</p>
                        </div>
                    </li>
                ))}
            </ul>
            {/* <EmojiPicker /> */}
            <textarea onKeyDown={hitEnter}></textarea>
        </section>
    );
}
