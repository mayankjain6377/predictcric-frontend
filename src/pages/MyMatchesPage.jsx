import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";
import { formatMatchTime } from "../utils/formatDate";

export default function MyMatchesPage() {
  const { player } = usePlayer();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!player) { navigate("/"); return; }
    fetchMyMatches();
  }, []);

  const fetchMyMatches = async () => {
    try {
      // Fetch all matches first
      const res = await api.get("/matches/upcoming");
      const allMatches = res.data;

      // For each match check if player has predictions
      const encoded = encodeURIComponent(player.playerId);
      const results = await Promise.all(
        allMatches.map(async (match) => {
          try {
            const predRes = await api.get(
              `/predictions/match/${match.id}/player/${encoded}`
            );
            return predRes.data.length > 0 ? { ...match, predictions: predRes.data } : null;
          } catch {
            return null;
          }
        })
      );

      // Filter only matches where player predicted
      setMatches(results.filter(Boolean));
    } catch {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={40} className="animate-spin" style={{ color: "#00ff87" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", paddingTop: "96px", paddingBottom: "48px", paddingLeft: "16px", paddingRight: "16px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px" }}
        >
          <h1 style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "42px",
            fontWeight: 700,
            color: "white"
          }}>
            My Predictions 🎯
          </h1>
          <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif", marginTop: "4px" }}>
            Matches where you've predicted
          </p>
        </motion.div>

        {/* Empty */}
        {matches.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <p style={{ fontSize: "64px", marginBottom: "16px" }}>🏏</p>
            <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif" }}>
              You haven't predicted in any match yet
            </p>
            <button
              onClick={() => navigate("/matches")}
              style={{
                marginTop: "16px",
                background: "#00ff87",
                color: "#0a0a0f",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                padding: "10px 24px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Find a Match
            </button>
          </div>
        )}

        {/* Match cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {matches.map((match, i) => {
            const correct = match.predictions.filter(p => p.isCorrect === true).length;
            const total = match.predictions.length;
            const pending = match.predictions.every(p => p.isCorrect === null);

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid #1e1e2e",
                  borderRadius: "20px",
                  padding: "24px"
                }}
              >
                {/* Status + score */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "99px",
                    border: match.status === "COMPLETED"
                      ? "1px solid rgba(0,255,135,0.3)"
                      : match.status === "LIVE"
                        ? "1px solid rgba(248,113,113,0.4)"
                        : "1px solid #1e1e2e",
                    background: match.status === "COMPLETED"
                      ? "rgba(0,255,135,0.08)"
                      : match.status === "LIVE"
                        ? "rgba(248,113,113,0.1)"
                        : "rgba(255,255,255,0.05)",
                    color: match.status === "COMPLETED"
                      ? "#00ff87"
                      : match.status === "LIVE"
                        ? "#f87171"
                        : "#94a3b8"
                  }}>
                    {match.status === "LIVE" ? "🔴 LIVE" : match.status}
                  </span>

                  {/* Score pill */}
                  {!pending ? (
                    <span style={{
                      fontFamily: "Rajdhani, sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: correct > 0 ? "#00ff87" : "#f87171"
                    }}>
                      {correct}/{total} correct · 🪙 {correct * 10}
                    </span>
                  ) : (
                    <span style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontFamily: "DM Sans, sans-serif"
                    }}>
                      ⏳ Awaiting results
                    </span>
                  )}
                </div>

                {/* Teams */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px"
                }}>
                  <p style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "white",
                    flex: 1,
                    textAlign: "center"
                  }}>
                    {match.teamA}
                  </p>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255,107,53,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ff6b35",
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    fontSize: "13px"
                  }}>
                    VS
                  </div>
                  <p style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "white",
                    flex: 1,
                    textAlign: "center"
                  }}>
                    {match.teamB}
                  </p>
                </div>

                {/* Prediction answers preview */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px"
                }}>
                  {match.predictions.map((pred, j) => (
                    <span key={j} style={{
                      fontSize: "12px",
                      fontFamily: "DM Sans, sans-serif",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background: pred.isCorrect === true
                        ? "rgba(0,255,135,0.1)"
                        : pred.isCorrect === false
                          ? "rgba(248,113,113,0.1)"
                          : "rgba(255,255,255,0.05)",
                      border: pred.isCorrect === true
                        ? "1px solid rgba(0,255,135,0.3)"
                        : pred.isCorrect === false
                          ? "1px solid rgba(248,113,113,0.3)"
                          : "1px solid #1e1e2e",
                      color: pred.isCorrect === true
                        ? "#00ff87"
                        : pred.isCorrect === false
                          ? "#f87171"
                          : "#94a3b8"
                    }}>
                      {pred.isCorrect === true ? "✅" : pred.isCorrect === false ? "❌" : "⏳"} {pred.selectedAnswer}
                    </span>
                  ))}
                </div>

                {/* Bottom row */}
                <div style={{
                  borderTop: "1px solid #1e1e2e",
                  paddingTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <p style={{ color: "#475569", fontSize: "12px", fontFamily: "DM Sans, sans-serif" }}>
                    {formatMatchTime(match.startTime)}
                  </p>
                  <button
                    onClick={() => navigate(`/my-predictions/${match.id}`)}
                    style={{
                      background: "transparent",
                      border: "1px solid #1e1e2e",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      color: "#94a3b8",
                      fontFamily: "Rajdhani, sans-serif",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}