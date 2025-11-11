const server = "http://localhost:8080";

const uploadFileEndpoint = server + "/api/files/upload";
const getFileEndpoint = server + "/api/files/download"; // api/files/download/{fileName}
const getPresignUrlEndpoint= server + "/api/files/presign";
const postFileMetadataEndpoint= server + "/api/files/metadata";

const webSocket = "ws://localhost:8080/ws-chat/websocket";
const subscribeMessageEndpoint = "/topic/conversation."; // topic/conversation.{conId}
const getMessagesEndpoint = server + "/api/chat"; // api/chat/{conId}
const getConIdEndpoint = server + "/api/chat"; // api/chat/{conId}
const joinConversationEndpoint = "/app/addUser";
const sendMessageEndpoint = "/app/sendMessage";

export default {
    server,
    uploadFileEndpoint,
    getFileEndpoint,
    webSocket,
    subscribeMessageEndpoint,
    getMessagesEndpoint,
    joinConversationEndpoint,
    postFileMetadataEndpoint,
    getConIdEndpoint,
    sendMessageEndpoint,
    getPresignUrlEndpoint
}