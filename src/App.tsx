import { Routes, Route } from "react-router-dom";
import "@/App.css";
import OAuthHandler from "@/components/auth/OAuthHandler";
import MainLayout from "@/components/layout/MainLayout";
import NotFound from "@/routes/NotFound";
import Home from "@/routes/Home";
import Chat from "@/routes/Chat";
import Search from "@/routes/Search";
import Notification from "@/routes/Notification";
import Profile from "@/routes/Profile";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <OAuthHandler />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}
