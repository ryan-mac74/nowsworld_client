import { Routes, Route } from "react-router-dom";
import "@/App.css";
import NotFound from "@/routes/NotFound";
import Home from "@/routes/Home";
import Login from "@/ui/Dialogs/LoginDialog";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
