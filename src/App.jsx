import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Post from "./screens/Post";
import NewPost from "./screens/NewPost";
import Chat from "./screens/Chat";
import GroupChat from "./screens/GroupChar";

export default function App() {
  return (
    <Router>
      <div className="h-screen flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/new_post" element={<NewPost />} />
          <Route path="/chat/:userId_1/:userId_2" element={<Chat />} />
          <Route path="/chat/group/:conId/:userId" element={<GroupChat />} />
        </Routes>
      </div>
    </Router>
  );
}
