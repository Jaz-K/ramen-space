import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function WallMessage({ user_id, img_url, default_img }) {
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
        <div className="messageWall">
            <h2>Feed</h2>
            <hr />
            <form onSubmit={handleSubmit} className="wallInsertForm">
                <div className="wallInsertDiv">
                    <img
                        src={img_url ? img_url : default_img}
                        alt=""
                        className="wallImg circle"
                    />{" "}
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
                        width="100%"
                        height="15rem"
                        onEmojiClick={onEmojiClick}
                        previewConfig={{ showPreview: false }}
                    />
                )}
            </form>
            <ul>
                {wallMessage.map((message) => (
                    <li key={message.id} className="wallList">
                        <div className="wallSenderBlock">
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
                            <div className="wallSender">
                                <p className="">
                                    {message.first_name} {message.last_name}
                                </p>
                                <p className="wallDate">
                                    {newDate(message.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="wallMessageBox">
                            <p className="wallMessage">
                                {message.directmessage}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
