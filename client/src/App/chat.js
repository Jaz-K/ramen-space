import { io } from "socket.io-client";

export default function Chat() {
    const socket = io();

    socket.on("welcome", function (data) {
        console.log(data);
        socket.emit("thanks", {
            message: "Thank you. It is great to be here.",
        });
    });

    return (
        <section>
            <h2>Test</h2>
        </section>
    );
}
