import { Routes, Route } from "react-router-dom";
import "@/App.css";
import NotFound from "@/routes/NotFound";
import Home from "@/routes/Home";
import Login from "@/components/dialogs/LoginDialog";
import OAuthHandler from "@/components/auth/OAuthHandler";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <OAuthHandler />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
