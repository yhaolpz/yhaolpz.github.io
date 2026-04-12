import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ArticlePage from "@/pages/ArticlePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:ref" element={<ArticlePage />} />
      </Routes>
    </Router>
  );
}
