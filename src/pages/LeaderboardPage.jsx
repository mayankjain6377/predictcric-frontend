import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";

export default function LeaderboardPage() {
  const { player } = usePlayer();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLeaderboard(); }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard");
      setLeaderboard(res.data);
    } finally {
      setLoading(false);
    }
  };

  const rankEmoji = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div style={{
      minHeight: "100vh",
      paddingTop: "96px",
      paddingBottom: "48px",
      paddingLeft: "16px",
      paddingRight: "16px"
    }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <h1 style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "48px",
            fontWeight: 700,
            background: "linear-gradient(135deg, #00ff87, #ff6b35)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "8px"
          }}>
            Leaderboard
          </h1>
          <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif" }}>
            Top predictors ranked by coins 🪙
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
            <Loader2 size={40} className="animate-spin" style={{ color: "#00ff87" }} />
          </div>
        )}

        {/* Empty */}
        {!loading && leaderboard.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <p style={{ fontSize: "64px", marginBottom: "16px" }}>🏆</p>
            <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif" }}>
              No players yet. Be the first!
            </p>
          </div>
        )}

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {leaderboard.map((entry, i) => {
            const isMe = entry.playerId === player?.playerId;

            return (
              <motion.div
                key={entry.playerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: isMe
                    ? "rgba(0,255,135,0.05)"
                    : "rgba(255,255,255,0.03)",
                  border: isMe
                    ? "1px solid rgba(0,255,135,0.3)"
                    : "1px solid #1e1e2e",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: isMe ? "0 0 20px rgba(0,255,135,0.08)" : "none"
                }}
              >
                {/* Rank */}
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: entry.rank <= 3
                    ? "rgba(0,255,135,0.1)"
                    : "rgba(255,255,255,0.04)",
                  border: entry.rank <= 3
                    ? "1px solid rgba(0,255,135,0.3)"
                    : "1px solid #1e1e2e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: entry.rank <= 3 ? "18px" : "14px",
                  color: "#00ff87",
                  flexShrink: 0
                }}>
                  {rankEmoji[entry.rank] || `#${entry.rank}`}
                </div>

                {/* Player info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px"
                  }}>
                    <p style={{
                      fontFamily: "Rajdhani, sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "white"
                    }}>
                      {entry.playerId}
                    </p>
                    {isMe && (
                      <span style={{
                        fontSize: "11px",
                        background: "rgba(0,255,135,0.1)",
                        color: "#00ff87",
                        border: "1px solid rgba(0,255,135,0.3)",
                        padding: "2px 8px",
                        borderRadius: "99px",
                        fontFamily: "DM Sans, sans-serif"
                      }}>
                        You
                      </span>
                    )}
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    <span style={{
                      color: "#64748b",
                      fontSize: "12px",
                      fontFamily: "DM Sans, sans-serif"
                    }}>
                      ✅ {entry.totalCorrect} correct
                    </span>
                    <span style={{
                      color: "#64748b",
                      fontSize: "12px",
                      fontFamily: "DM Sans, sans-serif"
                    }}>
                      🏆 {entry.challengesWon} wins
                    </span>
                    <span style={{
                      color: "#64748b",
                      fontSize: "12px",
                      fontFamily: "DM Sans, sans-serif"
                    }}>
                      🎯 {entry.totalCorrect * 20} prediction coins
                    </span>
                    {entry.challengesWon > 0 && (
                      <span style={{
                        color: "#ff6b35",
                        fontSize: "12px",
                        fontFamily: "DM Sans, sans-serif"
                      }}>
                        +{entry.challengesWon * 50} bonus
                      </span>
                    )}
                  </div>
                </div>

                {/* Total coins */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    fontSize: "28px",
                    color: "#eab308"
                  }}>
                    {entry.coins}
                  </p>
                  <p style={{
                    color: "#475569",
                    fontSize: "11px",
                    fontFamily: "DM Sans, sans-serif"
                  }}>
                    total coins
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}