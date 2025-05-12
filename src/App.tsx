import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import DashboardPage from "./components/dashboard/DashboardPage";
import StudyRoomsList from "./components/study/StudyRoomsList";
import StudyRoom from "./components/study/StudyRoom";
import StudyPlanner from "./components/study/StudyPlanner";
import FocusChallenge from "./components/study/FocusChallenge";
import CommunityPage from "./components/community/CommunityPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import routes from "tempo-routes";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "./components/ui/toaster";

function App() {
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <AuthProvider>
      <Suspense
        fallback={
          <p className="gap-x-16 gap-[16] justify-center items-center">
            Loading...
          </p>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/study-rooms"
            element={
              <DashboardLayout>
                <StudyRoomsList />
              </DashboardLayout>
            }
          />
          <Route
            path="/study-planner"
            element={
              <DashboardLayout>
                <StudyPlanner />
              </DashboardLayout>
            }
          />
          <Route
            path="/study-room/:roomId"
            element={
              <DashboardLayout>
                <StudyRoom
                  roomId={window.location.pathname.split("/").pop() || ""}
                />
              </DashboardLayout>
            }
          />
          <Route
            path="/focus-challenge"
            element={
              <DashboardLayout>
                <FocusChallenge />
              </DashboardLayout>
            }
          />
          <Route
            path="/community"
            element={
              <DashboardLayout>
                <CommunityPage />
              </DashboardLayout>
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {tempoRoutes}
        <Toaster />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
