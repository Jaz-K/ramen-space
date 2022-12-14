import { useEffect, useState, useRef } from "react";

import EmojiPicker from "emoji-picker-react";

import { socket } from "../socket";

import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";

export default function Chat({ user_id, default_img }) {
    const [chatMessage, setChatMessage] = useState([]);
    const [toggleEmoji, setToggleEmoji] = useState(false);
    const [messageString, setMessageString] = useState("");
    const listRef = useRef(null);

    useEffect(() => {
        socket.emit("openChat", "ping");
        socket.on("chat", function getMessages(data) {
            console.log("data", data);
            const revdData = [...data];
            setChatMessage(revdData.reverse());
        });

        socket.on("newMessage", (newMessage) => {
            setChatMessage((chatMessage) => [...chatMessage, newMessage]);
        });
        return () => {
            console.log("chat cleanup");
            socket.off("chat");
        };
    }, []);

    // useEffect(() => {
    //     socket.on("onlineUser", (data) => {
    //         console.log("onlineUser", data);
    //     });
    // }, []);

    useEffect(() => {
        const recentMessage = listRef.current.lastChild;
        if (recentMessage) {
            recentMessage.scrollIntoView();
        }
    }, [chatMessage]);

    function handleSubmit(event) {
        if (
            (event.key === "Enter" && !event.shiftKey) ||
            event.type === "submit"
        ) {
            const newMessage = messageString;
            event.preventDefault();
            socket.emit("newMessage", { message: newMessage });
            setMessageString("");
            setToggleEmoji(false);
        }
    }

    function clickEmojiHandler() {
        setToggleEmoji(!toggleEmoji);
    }
    function onEmojiClick(emojiObject) {
        setMessageString(messageString + emojiObject.emoji);
    }

    function newDate(date) {
        const newDate = formatDistance(new Date(date), new Date(), {
            addSuffix: true,
        });
        return newDate;
    }

    //------------------------------------
    return (
        <section>
            <div className="chat">
                <h2>Chat</h2>
                <hr />

                <ul ref={listRef}>
                    {chatMessage.map((message) =>
                        message.sender_id === user_id ? (
                            <li key={message.id} className="chatList">
                                <div className="chatblock chatblockMe">
                                    <p className="chatMsg chatMsgMe">
                                        {message.message}
                                    </p>
                                </div>
                                <p className="chatDateMe">
                                    {newDate(message.created_at)}
                                </p>
                            </li>
                        ) : (
                            <li key={message.id} className="chatList">
                                <p className="chatSender">
                                    {message.first_name} {message.last_name}
                                </p>
                                <div className="chatblock">
                                    <Link to={`/users/${message.sender_id}`}>
                                        <img
                                            src={
                                                message.img_url
                                                    ? message.img_url
                                                    : default_img
                                            }
                                            className="chatAvatar circle"
                                        />
                                    </Link>
                                    <p className="chatMsg chatMsgYou">
                                        {message.message}
                                    </p>
                                </div>
                                <p className="chatDate">
                                    {newDate(message.created_at)}
                                </p>
                            </li>
                        )
                    )}
                </ul>

                <form onSubmit={handleSubmit} className="chatInsertForm">
                    <textarea
                        className="chatInsert"
                        onKeyDown={handleSubmit}
                        name="chatEntry"
                        placeholder="write something"
                        value={messageString}
                        onChange={(event) =>
                            setMessageString(event.target.value)
                        }
                        onClick={() => setToggleEmoji(false)}
                    ></textarea>
                    <button type="submit" className="classic">
                        Send
                    </button>
                    <button
                        onClick={clickEmojiHandler}
                        type="button"
                        className="emojiButton"
                    >
                        😊
                    </button>
                    {toggleEmoji && (
                        <EmojiPicker
                            className="emojiPickerWall"
                            width="20rem"
                            onEmojiClick={onEmojiClick}
                            previewConfig={{ showPreview: false }}
                        />
                    )}
                </form>
            </div>
        </section>
    );
}
