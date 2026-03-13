import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";
import { formatMatchTime } from "../utils/formatDate";

export default function MatchDetailPage() {
  const { matchId } = useParams();
  const { player } = usePlayer();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!player) { navigate("/"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchRes, questionsRes] = await Promise.all([
        api.get(`/matches/${matchId}`),
        api.get(`/matches/${matchId}/questions`),
      ]);
      setMatch(matchRes.data);
      setQuestions(questionsRes.data);
    } catch {
      navigate("/matches");
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

        {/* Match Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #1e1e2e",
            borderRadius: "20px",
            padding: "36px",
            textAlign: "center",
            marginBottom: "32px"
          }}
        >
          <span style={{
            fontSize: "11px",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            padding: "4px 14px",
            borderRadius: "99px",
            border: "1px solid rgba(0,255,135,0.3)",
            background: "rgba(0,255,135,0.08)",
            color: "#00ff87"
          }}>
            {match?.status}
          </span>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            margin: "24px 0"
          }}>
            <h2 style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "40px",
              fontWeight: 700,
              color: "white"
            }}>
              {match?.teamA}
            </h2>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "rgba(255,107,53,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ff6b35",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "16px"
            }}>
              VS
            </div>
            <h2 style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "40px",
              fontWeight: 700,
              color: "white"
            }}>
              {match?.teamB}
            </h2>
          </div>

          <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif", fontSize: "14px" }}>
            {match && formatMatchTime(match.startTime)}
          </p>
        </motion.div>

        {/* Questions Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: "32px" }}
        >
          <h3 style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            color: "white",
            marginBottom: "16px"
          }}>
            📋 {questions.length} Questions to Predict
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {questions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid #1e1e2e",
                  borderRadius: "12px",
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px"
                }}
              >
                <span style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "rgba(0,255,135,0.1)",
                  color: "#00ff87",
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  {i + 1}
                </span>
                <p style={{ color: "white", fontFamily: "DM Sans, sans-serif", fontSize: "14px" }}>
                  {q.questionText}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/predict/${matchId}`)}
          disabled={match?.status !== "UPCOMING"}
          style={{
            width: "100%",
            background: match?.status !== "UPCOMING" ? "#1e1e2e" : "#00ff87",
            color: match?.status !== "UPCOMING" ? "#475569" : "#0a0a0f",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "18px",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            cursor: match?.status !== "UPCOMING" ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: match?.status === "UPCOMING" ? "0 0 20px rgba(0,255,135,0.2)" : "none"
          }}
        >
          Start Predicting <ArrowRight size={20} />
        </motion.button>

        {match?.status !== "UPCOMING" && (
          <p style={{
            textAlign: "center",
            color: "#475569",
            fontSize: "13px",
            marginTop: "12px",
            fontFamily: "DM Sans, sans-serif"
          }}>
            Predictions are locked for this match
          </p>
        )}
      </div>
    </div>
  );
}