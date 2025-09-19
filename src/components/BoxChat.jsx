import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import Message from "./Message";
import { uploadFile } from "../utils/uploadFile";
import { Client } from "@stomp/stompjs";
import contants from '../core/contants'

export default function BoxChat({
    conId,
    userId,
}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);
    const stompClientRef = useRef(null);

    useEffect(() => {
        const client = new Client({
            brokerURL: contants.webSocket,
            connectHeaders: {
                login: "guest",
                passcode: "guest",
            },
            // debug: (str) => console.log("[STOMP]", str),
            onConnect: () => {
                console.log("Connected to STOMP", contants.subscribeMessageEndpoint + `${conId}`);

                client.subscribe(contants.subscribeMessageEndpoint + `${conId}`, (msg) => {
                    const body = JSON.parse(msg.body);
                    if (body["type"] == "JOIN") return;
                    console.log("received: ", body, userId);
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: body.type === "CHAT" ? "text" : body.type.toLowerCase(),
                            content: body.content,
                            sender: body.sender,
                            isOwn: body.sender === userId,
                        },
                    ]);
                });

                // Gửi event join
                client.publish({
                    destination: contants.joinConversationEndpoint,
                    body: JSON.stringify({
                        sender: userId,
                        conversationId: conId,
                        type: "JOIN",
                    }),
                });
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [conId, userId]);

    useEffect(() => {
        const fetchMessages = async () => {
            const res = await fetch(contants.getMessagesEndpoint + "/" + conId, {
                method: "GET",
            });

            if (!res.ok) return;
            const data = await res.json();

            setMessages(data.data.map((message) => {
                return {
                    type: message.type === "CHAT" ? "text" : message.type.toLowerCase(),
                    content: message.content,
                    sender: message.sender,
                    isOwn: message.sender === userId,
                }
            }));
        }

        fetchMessages();
    }, [conId, userId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !stompClientRef.current?.connected) return;

        stompClientRef.current.publish({
            destination: contants.sendMessageEndpoint,
            body: JSON.stringify({
                sender: userId,
                content: input,
                type: "CHAT",
                conversationId: conId,
            }),
        });

        setInput("");
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const url = await uploadFile(file);

            stompClientRef.current.publish({
                destination: contants.sendMessageEndpoint,
                body: JSON.stringify({
                    sender: userId,
                    content: url,
                    type: "IMAGE",
                    conversationId: conId,
                }),
            });
        } catch (err) {
            console.error("Upload error:", err);
        }
        fileInputRef.current.value = "";
    };

    const handlePaste = async (e) => {
        const items = e.clipboardData?.items || [];
        for (const item of items) {
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) {
                    try {
                        const url = await uploadFile(file);
                        stompClientRef.current.publish({
                            destination: contants.sendMessageEndpoint,
                            body: JSON.stringify({
                                sender: userId,
                                content: url,
                                type: "IMAGE",
                                conversationId: conId,
                            }),
                        });
                    } catch (err) {
                        console.error("Paste upload error:", err);
                    }
                }
            }
        }
    };

    return (
        <div className="flex flex-col h-[80vh] max-w-2xl border rounded-lg shadow-md">
            <div
                className="flex-1 overflow-y-auto p-4 bg-gray-50"
                onPaste={handlePaste}
            >
                {messages.map((msg, idx) => {
                    const prev = messages[idx - 1];
                    const needSender =
                        !msg.isOwn && (!prev || prev.sender !== msg.sender);

                    return (
                        <Message
                            key={idx}
                            message={msg}
                            isOwn={msg.isOwn}
                            needSender={needSender}
                        />
                    );
                })}

                <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t flex items-center gap-2">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full hover:bg-gray-200"
                >
                    <ImageIcon size={20} />
                </button>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border rounded-full px-3 py-2 focus:outline-none"
                />

                <button
                    type="button"
                    onClick={sendMessage}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
