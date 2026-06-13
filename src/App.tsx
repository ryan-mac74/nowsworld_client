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
import TermsOfService from "@/routes/TermsOfService";
import PrivacyPolicy from "@/routes/PrivacyPolicy";
import DataDeletion from "@/routes/DataDeletion";
import { Toaster } from "sonner";
import usePWA from "@/hooks/usePWA";

export default function App() {
  usePWA();

  return (
    <>
      <Toaster richColors position="top-right" />
      <OAuthHandler />

      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
      </Routes>
    </>
  )
}
