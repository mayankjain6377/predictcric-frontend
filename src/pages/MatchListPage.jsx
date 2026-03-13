import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";
import { formatMatchTime, timeUntilMatch } from "../utils/formatDate";
import toast from "react-hot-toast";

export default function MatchListPage() {
  const { player } = usePlayer();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

const filtered = matches.filter(m =>
  m.teamA.toLowerCase().includes(search.toLowerCase()) ||
  m.teamB.toLowerCase().includes(search.toLowerCase()) ||
  m.matchTitle.toLowerCase().includes(search.toLowerCase())
);

  useEffect(() => {
    if (!player) { navigate("/"); return; }
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await api.get("/matches/upcoming");
      setMatches(res.data);
    } catch {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    UPCOMING: "text-primary border-primary/30 bg-primary/10",
    LIVE: "text-red-400 border-red-400/30 bg-red-400/10",
    COMPLETED: "text-slate-400 border-slate-400/30 bg-slate-400/10",
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Search bar */}
{/* Search bar */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="mb-6"
>
  <input
    type="text"
    placeholder="Search matches... (e.g. IND vs AUS)"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: "100%",
      background: "#13131a",
      border: "1px solid #1e1e2e",
      borderRadius: "12px",
      padding: "12px 16px",
      color: "white",
      fontFamily: "DM Sans, sans-serif",
      outline: "none",
      fontSize: "15px"
    }}
  />
</motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-4xl font-bold text-white">
              Matches 🏏
            </h1>
            <p className="text-slate-400 font-body mt-1">
              Pick a match and start predicting
            </p>
          </div>
          <button
            onClick={fetchMatches}
            className="glass p-3 rounded-xl text-slate-400
                       hover:text-primary transition-colors"
          >
            <RefreshCw size={18} />
          </button>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-primary" />
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🏟️</p>
            <p className="text-slate-400 font-body">No upcoming matches found</p>
          </div>
        )}

        {/* Match List */}
        <div className="space-y-4">
          {filtered.map((match, i) => (
  <motion.div
    key={match.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    onClick={() => navigate(`/matches/${match.id}`)}
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid #1e1e2e",
      borderRadius: "20px",
      padding: "24px",
      cursor: "pointer",
      marginBottom: "16px"
    }}
    whileHover={{ borderColor: "rgba(0,255,135,0.3)", scale: 1.01 }}
  >
    {/* Status badge */}
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
      <span style={{
        fontSize: "11px",
        fontFamily: "Rajdhani, sans-serif",
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: "99px",
        border: match.status === "LIVE"
          ? "1px solid rgba(248,113,113,0.4)"
          : "1px solid rgba(0,255,135,0.3)",
        background: match.status === "LIVE"
          ? "rgba(248,113,113,0.1)"
          : "rgba(0,255,135,0.08)",
        color: match.status === "LIVE" ? "#f87171" : "#00ff87"
      }}>
        {match.status === "LIVE" ? "🔴 LIVE" : match.status}
      </span>
      <span style={{ color: "#64748b", fontSize: "12px", fontFamily: "DM Sans, sans-serif" }}>
        {timeUntilMatch(match.startTime)}
      </span>
    </div>

    {/* Teams */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
        width: "44px",
        height: "44px",
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

    {/* Bottom info */}
    <div style={{
      marginTop: "16px",
      paddingTop: "16px",
      borderTop: "1px solid #1e1e2e",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <p style={{ color: "#64748b", fontSize: "13px", fontFamily: "DM Sans, sans-serif" }}>
        {match.matchTitle}
      </p>
      <p style={{ color: "#475569", fontSize: "12px", fontFamily: "DM Sans, sans-serif" }}>
        {formatMatchTime(match.startTime)}
      </p>
    </div>
  </motion.div>
))}
        </div>
      </div>
    </div>
  );
}