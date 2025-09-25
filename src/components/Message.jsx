import { User } from "lucide-react";

export default function Message({ message, isOwn, needSender = true, sending = false }) {
    return (
        <div
            className={`flex flex-col ${isOwn ? "items-end" : "items-start"}
                ${needSender ? "my-2" : "my-0.5"} max-w-lg`}
        >
            {!isOwn && needSender && (
                <div className="flex items-center gap-1 mb-1 text-sm text-gray-500">
                    <User size={14} className="text-gray-400" />
                    <span>{message.sender || "Người dùng"}</span>
                </div>
            )}

            <div
                className={`px-3 py-2 shadow-sm break-words transition-all
                    ${isOwn
                        ? needSender
                            ? `${sending?'bg-gray-200':'bg-blue-500'} text-white rounded-2xl rounded-br-none`
                            : `${sending?'bg-gray-200':'bg-blue-500'} text-white rounded-xl`
                        : needSender
                            ? "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none"
                            : "bg-gray-100 text-gray-800 rounded-xl"
                    }`}
            >
                {message.type === "image" ? (
                    <img
                        src={message.content}
                        alt="img"
                        className="rounded-lg max-w-[250px] max-h-[250px] object-cover"
                    />
                ) : (
                    <p>{message.content}</p>
                )}
            </div>
        </div>
    );
}
