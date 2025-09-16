import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Post from "./components/Post";
import NewPost from "./components/NewPost";

export default function App() {
  return (
    <Router>
      <div className="h-screen flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/new_post" element={<NewPost />} />
        </Routes>
      </div>
    </Router>
  );
}
