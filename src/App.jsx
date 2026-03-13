import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import MatchListPage from "./pages/MatchListPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import PredictionPage from "./pages/PredictionPage";
import ChallengePage from "./pages/ChallengePage";
import FaceOffPage from "./pages/FaceOffPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import JoinChallengePage from "./pages/JoinChallengePage";
import MyPredictionsPage from "./pages/MyPredictionsPage";
import ResultsPage from "./pages/ResultsPage";
import MyMatchesPage from "./pages/MyMatchesPage";
import AdminPage from "./pages/AdminPage";



export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/matches" element={<MatchListPage />} />
        <Route path="/matches/:matchId" element={<MatchDetailPage />} />
        <Route path="/predict/:matchId" element={<PredictionPage />} />
        <Route path="/challenge/:matchId" element={<ChallengePage />} />
        <Route path="/faceoff/:challengeId" element={<FaceOffPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/join-challenge/:challengeId" element={<JoinChallengePage />} />
        <Route path="/my-predictions/:matchId" element={<MyPredictionsPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/my-matches" element={<MyMatchesPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}