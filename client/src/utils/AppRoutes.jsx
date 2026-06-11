import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Landing from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import TeamProfile from "../pages/TeamProfile";
import MemberProfile from "../pages/MemberProfile";
import HackathonList from "../pages/HackathonList";
import HackathonPage from "../pages/Hackathon";
import Notification from "../pages/Notification";

import ProtectedRoute from "./ProtectedRoute";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

function AppRoutes() {
  return (
    <> 
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#12121a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: 'Gotham, Montserrat, sans-serif',
          },
        }}
      />    
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* PRIVATE ROUTES */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<TeamProfile />} />
          <Route path="/members/:id" element={<MemberProfile />} />
          <Route path="/hackathons" element={<HackathonList />} />
          <Route path="/hackathon/:id" element={<HackathonPage />} />
          <Route path="/notification" element={<Notification />} />
        </Route>

      </Routes>
    </>
  );
}

export default AppRoutes;