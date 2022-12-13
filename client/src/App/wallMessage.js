import { useEffect, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";

import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function WallMessage({ user_id, img_url }) {
    const [wallMessage, setWallMessage] = useState([]);
    const [toggleEmoji, setToggleEmoji] = useState(false);
    const [messageString, setMessageString] = useState("");

    useEffect(() => {
        async function getWallMessages() {
            const response = await fetch(`/api/wallmessages/${user_id}`);
            const data = await response.json();
            console.log("DATA", data);
            setWallMessage(data);
        }
        getWallMessages();
    }, [user_id]);

    async function handleSubmit(event) {
        const newMessage = messageString;
        if (
            (event.key === "Enter" && !event.shiftKey) ||
            event.type === "submit"
        ) {
            event.preventDefault();
            console.log("NEW MESSAGE", newMessage);

            const response = await fetch(`/api/wallmessages/${user_id}`, {
                method: "POST",
                body: JSON.stringify({ directmessage: newMessage }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            console.log("data handle submit", data);
            setWallMessage((wallMessage) => [data, ...wallMessage]);
            setMessageString("");
        }
    }

    function clickEmojiHandler() {
        setToggleEmoji(!toggleEmoji);
    }
    function onEmojiClick(emojiObject) {
        setMessageString(messageString + emojiObject.emoji);
    }

    function newDate(date) {
        const newDate = format(new Date(date), "dd.MM.yyyy - hh:mm ");
        return newDate;
    }

    return (
        <section className="messageWall">
            <h2>Wallmessage</h2>
            <form onSubmit={handleSubmit} className="wallInsertForm">
                <div>
                    <img src={img_url} alt="" className="wallImg circle" />{" "}
                    <textarea
                        className="wallInsert"
                        onKeyDown={handleSubmit}
                        name="wallEntry"
                        placeholder="write something"
                        value={messageString}
                        onChange={(event) =>
                            setMessageString(event.target.value)
                        }
                        onClick={() => setToggleEmoji(false)}
                    ></textarea>
                </div>
                <button type="submit">Send</button>
                <button
                    onClick={clickEmojiHandler}
                    type="button"
                    className="emojiButton"
                >
                    😊
                </button>
                {toggleEmoji && (
                    <EmojiPicker
                        width={320}
                        onEmojiClick={onEmojiClick}
                        theme={Theme.AUTO}
                    />
                )}
            </form>
            <ul>
                {wallMessage.map((message) => (
                    <li key={message.id} className="wallList">
                        <div>
                            <Link to={`/users/${message.sender_id}`}>
                                <img
                                    src={message.img_url}
                                    className="chatAvatar circle"
                                />
                            </Link>
                            <div className="wallSenderBlock">
                                <p className="">
                                    {message.first_name} {message.last_name}
                                </p>
                                <p className="wallDate">
                                    {newDate(message.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="chatblock chatblockMe">
                            <p className="chatMsg chatMsgMe">
                                {message.directmessage}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}