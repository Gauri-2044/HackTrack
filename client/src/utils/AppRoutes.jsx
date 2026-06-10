import { Routes, Route } from "react-router-dom";

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

function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* PRIVATE ROUTES */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <TeamProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/members/:id"
        element={
          <ProtectedRoute>
            <MemberProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hackathons"
        element={
          <ProtectedRoute>
            <HackathonList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hackathon/:id"
        element={
          <ProtectedRoute>
            <HackathonPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notification"
        element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;