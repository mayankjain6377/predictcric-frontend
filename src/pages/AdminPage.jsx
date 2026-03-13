import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const ADMIN_SECRET = "adminpass";
const headers = { "X-Admin-Secret": ADMIN_SECRET };

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("matches");

  const handleUnlock = () => {
    if (password === ADMIN_SECRET) {
      setUnlocked(true);
      toast.success("Welcome, Admin! 🔐");
    } else {
      toast.error("Wrong password!");
    }
  };

  if (!unlocked) return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "16px"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid #1e1e2e",
          borderRadius: "24px",
          padding: "48px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center"
        }}
      >
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</p>
        <h2 style={{
          fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
          fontSize: "28px", color: "white", marginBottom: "24px"
        }}>
          Admin Access
        </h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleUnlock()}
          style={{
            width: "100%", background: "#0a0a0f",
            border: "1px solid #1e1e2e", borderRadius: "10px",
            padding: "12px 16px", color: "white",
            fontFamily: "DM Sans, sans-serif", fontSize: "14px",
            marginBottom: "16px", outline: "none", boxSizing: "border-box"
          }}
        />
        <button onClick={handleUnlock} style={{
          width: "100%", background: "#00ff87", color: "#0a0a0f",
          fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
          fontSize: "16px", padding: "13px", borderRadius: "12px",
          border: "none", cursor: "pointer"
        }}>
          Unlock
        </button>
      </motion.div>
    </div>
  );

  const tabs = [
    { id: "matches", label: "🏏 Matches" },
    { id: "players", label: "👤 Players" },
    { id: "predictions", label: "🎯 Predictions" },
    { id: "challenges", label: "⚡ Challenges" },
  ];

  return (
    <div style={{
      minHeight: "100vh", paddingTop: "96px",
      paddingBottom: "48px", paddingLeft: "16px", paddingRight: "16px"
    }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
            fontSize: "40px", color: "white"
          }}>
            Admin Panel ⚙️
          </h1>
          <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif" }}>
            Manage matches, players, predictions and challenges
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "8px", marginBottom: "32px",
          flexWrap: "wrap"
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: activeTab === tab.id
                  ? "1px solid rgba(0,255,135,0.4)"
                  : "1px solid #1e1e2e",
                background: activeTab === tab.id
                  ? "rgba(0,255,135,0.1)"
                  : "rgba(255,255,255,0.03)",
                color: activeTab === tab.id ? "#00ff87" : "#64748b",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "matches"    && <MatchesTab headers={headers} />}
            {activeTab === "players"    && <PlayersTab headers={headers} />}
            {activeTab === "predictions"&& <PredictionsTab headers={headers} />}
            {activeTab === "challenges" && <ChallengesTab headers={headers} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MATCHES TAB (your existing match management)
// ─────────────────────────────────────────────────────────
function MatchesTab({ headers }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => { fetchMatches(); }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get("/admin/matches", { headers });
      setMatches(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await api.post("/admin/sync-matches", {}, { headers });
      toast.success(res.data);
      fetchMatches();
    } catch {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleScore = async (matchId) => {
    try {
      await api.post(`/admin/score-match/${matchId}`, {}, { headers });
      toast.success("Match scored! 🏆");
      fetchMatches();
    } catch {
      toast.error("Scoring failed");
    }
  };

  const handleFillFromApi = async (matchId) => {
    try {
      const res = await api.post(`/admin/fill-results/${matchId}`, {}, { headers });
      toast.success(res.data);
    } catch {
      toast.error("API fill failed");
    }
  };

  const statusColor = { UPCOMING: "#00ff87", LIVE: "#ff6b35", COMPLETED: "#64748b" };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
    <Loader2 size={32} className="animate-spin" style={{ color: "#00ff87" }} />
  </div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button onClick={handleSync} disabled={syncing} style={{
          background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.3)",
          borderRadius: "10px", padding: "10px 20px", color: "#00ff87",
          fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
          fontSize: "14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Sync Matches from API
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {matches.map(match => (
          <div key={match.id} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #1e1e2e",
            borderRadius: "16px", padding: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{
                    fontSize: "11px", padding: "3px 10px", borderRadius: "99px",
                    border: `1px solid ${statusColor[match.status]}`,
                    color: statusColor[match.status],
                    fontFamily: "Rajdhani, sans-serif", fontWeight: 700
                  }}>{match.status}</span>
                  <span style={{ color: "#475569", fontSize: "12px", fontFamily: "DM Sans, sans-serif" }}>ID: {match.id}</span>
                </div>
                <h3 style={{
                  fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                  fontSize: "22px", color: "white"
                }}>
                  <span style={{ color: "#00ff87" }}>{match.teamA}</span>
                  <span style={{ color: "#475569", margin: "0 8px" }}>vs</span>
                  <span style={{ color: "#ff6b35" }}>{match.teamB}</span>
                </h3>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => handleFillFromApi(match.id)} style={{
                  background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)",
                  borderRadius: "8px", padding: "8px 14px", color: "#ff6b35",
                  fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", cursor: "pointer"
                }}>Fill from API</button>
                <button onClick={() => handleScore(match.id)} style={{
                  background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.3)",
                  borderRadius: "8px", padding: "8px 14px", color: "#00ff87",
                  fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", cursor: "pointer"
                }}>Score Match</button>
                <button onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)} style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid #1e1e2e",
                  borderRadius: "8px", padding: "8px 14px", color: "#94a3b8",
                  fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", cursor: "pointer"
                }}>
                  {expandedMatch === match.id ? "Hide Questions" : "Show Questions"}
                </button>
              </div>
            </div>
            {expandedMatch === match.id && (
              <QuestionsPanel matchId={match.id} headers={headers} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PLAYERS TAB
// ─────────────────────────────────────────────────────────
function PlayersTab({ headers }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPlayers(); }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/players", { headers });
      setPlayers(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (playerId) => {
    if (!window.confirm(`Delete player ${playerId}? This cannot be undone!`)) return;
    try {
      await api.delete(`/admin/player/${playerId}`, { headers });
      toast.success("Player deleted!");
      fetchPlayers();
    } catch {
      toast.error("Failed to delete player");
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
    <Loader2 size={32} className="animate-spin" style={{ color: "#00ff87" }} />
  </div>;

  return (
    <div>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "20px"
      }}>
        <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif", fontSize: "14px" }}>
          {players.length} total players
        </p>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #1e1e2e",
        borderRadius: "16px",
        overflow: "hidden"
      }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 80px 80px",
          padding: "12px 20px",
          borderBottom: "1px solid #1e1e2e",
          background: "rgba(255,255,255,0.02)"
        }}>
          {["Player ID", "Name", "Coins", "Action"].map(h => (
            <p key={h} style={{
              color: "#475569", fontSize: "11px",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700, letterSpacing: "1px",
              textTransform: "uppercase"
            }}>{h}</p>
          ))}
        </div>

        {/* Rows */}
        {players.map((p, i) => (
          <div key={p.playerId} style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 80px 80px",
            padding: "14px 20px",
            borderBottom: i < players.length - 1 ? "1px solid #1e1e2e" : "none",
            alignItems: "center"
          }}>
            <p style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700, color: "#00ff87", fontSize: "15px"
            }}>
              {p.playerId}
            </p>
            <p style={{
              fontFamily: "DM Sans, sans-serif",
              color: "#94a3b8", fontSize: "14px"
            }}>
              {p.name || "—"}
            </p>
            <p style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700, color: "#eab308", fontSize: "16px"
            }}>
              🪙 {p.coins}
            </p>
            <button
              onClick={() => handleDelete(p.playerId)}
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: "8px", padding: "5px 10px",
                color: "#f87171", fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700, fontSize: "12px", cursor: "pointer"
              }}
            >
              🗑️ Delete
            </button>
          </div>
        ))}

        {players.length === 0 && (
          <p style={{
            textAlign: "center", padding: "40px",
            color: "#475569", fontFamily: "DM Sans, sans-serif"
          }}>
            No players yet
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PREDICTIONS TAB
// ─────────────────────────────────────────────────────────
function PredictionsTab({ headers }) {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/admin/matches", { headers }).then(r => setMatches(r.data));
  }, []);

  const fetchByMatch = async () => {
    if (!selectedMatch) return toast.error("Select a match!");
    setLoading(true);
    try {
      const res = await api.get(`/admin/predictions/match/${selectedMatch}`, { headers });
      setPredictions(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchByPlayer = async () => {
    if (!selectedPlayer.trim()) return toast.error("Enter a player ID!");
    setLoading(true);
    try {
      const res = await api.get(`/admin/predictions/player/${selectedPlayer}`, { headers });
      setPredictions(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (predictionId) => {
    if (!window.confirm("Delete this prediction?")) return;
    try {
      await api.delete(`/admin/predictions/${predictionId}`, { headers });
      toast.success("Prediction deleted!");
      setPredictions(prev => prev.filter(p => p.id !== predictionId));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const inputStyle = {
    background: "#0a0a0f", border: "1px solid #1e1e2e",
    borderRadius: "8px", padding: "10px 14px",
    color: "white", fontFamily: "DM Sans, sans-serif",
    fontSize: "13px", outline: "none"
  };

  return (
    <div>
      {/* Filters */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #1e1e2e",
        borderRadius: "16px", padding: "20px",
        marginBottom: "20px",
        display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end"
      }}>
        {/* Filter by match */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: "#64748b", fontSize: "11px", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, letterSpacing: "1px" }}>
            FILTER BY MATCH
          </label>
          <select
            value={selectedMatch}
            onChange={e => setSelectedMatch(e.target.value)}
            style={{ ...inputStyle, minWidth: "200px" }}
          >
            <option value="">Select match...</option>
            {matches.map(m => (
              <option key={m.id} value={m.id}>
                {m.teamA} vs {m.teamB}
              </option>
            ))}
          </select>
        </div>
        <button onClick={fetchByMatch} style={{
          background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.3)",
          borderRadius: "8px", padding: "10px 18px", color: "#00ff87",
          fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
          fontSize: "13px", cursor: "pointer"
        }}>
          Search
        </button>

        <div style={{ width: "1px", background: "#1e1e2e", alignSelf: "stretch" }} />

        {/* Filter by player */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: "#64748b", fontSize: "11px", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, letterSpacing: "1px" }}>
            FILTER BY PLAYER
          </label>
          <input
            placeholder="Player ID e.g. CHIKA3027"
            value={selectedPlayer}
            onChange={e => setSelectedPlayer(e.target.value)}
            style={{ ...inputStyle, minWidth: "200px" }}
          />
        </div>
        <button onClick={fetchByPlayer} style={{
          background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)",
          borderRadius: "8px", padding: "10px 18px", color: "#ff6b35",
          fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
          fontSize: "13px", cursor: "pointer"
        }}>
          Search
        </button>
      </div>

      {/* Results */}
      {loading && <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "#00ff87" }} />
      </div>}

      {!loading && predictions.length > 0 && (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid #1e1e2e",
          borderRadius: "16px", overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 80px 80px",
            padding: "12px 20px",
            borderBottom: "1px solid #1e1e2e",
            background: "rgba(255,255,255,0.02)"
          }}>
            {["Player", "Question", "Answer", "Result", "Action"].map(h => (
              <p key={h} style={{
                color: "#475569", fontSize: "11px",
                fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                letterSpacing: "1px", textTransform: "uppercase"
              }}>{h}</p>
            ))}
          </div>

          {predictions.map((pred, i) => (
            <div key={pred.id} style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 80px 80px",
              padding: "12px 20px",
              borderBottom: i < predictions.length - 1 ? "1px solid #1e1e2e" : "none",
              alignItems: "center"
            }}>
              <p style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#00ff87", fontSize: "14px" }}>
                {pred.playerId}
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: "#94a3b8", fontSize: "13px" }}>
                {pred.questionText || `Q#${pred.questionId}`}
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: "white", fontSize: "13px" }}>
                {pred.selectedAnswer}
              </p>
              <p style={{ fontSize: "18px" }}>
                {pred.isCorrect === true ? "✅" : pred.isCorrect === false ? "❌" : "⏳"}
              </p>
              <button
                onClick={() => handleDelete(pred.id)}
                style={{
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  borderRadius: "8px", padding: "5px 10px",
                  color: "#f87171", fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700, fontSize: "12px", cursor: "pointer"
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && predictions.length === 0 && (
        <p style={{
          textAlign: "center", padding: "40px",
          color: "#475569", fontFamily: "DM Sans, sans-serif"
        }}>
          Search by match or player to see predictions
        </p>
      )}
    </div>
  );
}



// ─────────────────────────────────────────────────────────
// QUESTIONS PANEL
// ─────────────────────────────────────────────────────────
function QuestionsPanel({ matchId, headers }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = { questionText: "", optionA: "", optionB: "", optionC: "", optionD: "" };
  const [newQuestion, setNewQuestion] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => { fetchQuestions(); }, [matchId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/matches/${matchId}/questions`);
      setQuestions(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newQuestion.questionText.trim()) return toast.error("Enter question text!");
    if (!newQuestion.optionA.trim() || !newQuestion.optionB.trim())
      return toast.error("At least Option A and B required!");
    try {
      await api.post(`/admin/matches/${matchId}/questions`, newQuestion, { headers });
      toast.success("Question added! ✅");
      setNewQuestion(emptyForm);
      setShowAddForm(false);
      fetchQuestions();
    } catch {
      toast.error("Failed to add question");
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/admin/questions/${questionId}`, { headers });
      toast.success("Question deleted!");
      fetchQuestions();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleEditSave = async (questionId) => {
    try {
      await api.put(`/admin/questions/${questionId}`, editForm, { headers });
      toast.success("Question updated! ✅");
      setEditingId(null);
      fetchQuestions();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleSetAnswer = async (questionId) => {
    const answer = answers[questionId];
    if (!answer?.trim()) return toast.error("Select correct answer!");
    try {
      await api.post("/admin/set-answer",
        { questionId: String(questionId), correctAnswer: answer },
        { headers });
      toast.success("Answer saved! ✅");
      fetchQuestions();
    } catch {
      toast.error("Failed to set answer");
    }
  };

  const inputStyle = {
    width: "100%", background: "#0a0a0f",
    border: "1px solid #1e1e2e", borderRadius: "8px",
    padding: "8px 12px", color: "#ffffff",
    fontFamily: "DM Sans, sans-serif", fontSize: "13px",
    outline: "none", boxSizing: "border-box"
  };

  if (loading) return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Loader2 size={20} className="animate-spin" style={{ color: "#00ff87" }} />
    </div>
  );

  return (
    <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #1e1e2e" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{
          fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
          color: "#94a3b8", fontSize: "13px",
          letterSpacing: "1px", textTransform: "uppercase"
        }}>
          Questions ({questions.length})
        </p>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm ? "rgba(248,113,113,0.1)" : "rgba(0,255,135,0.1)",
            border: showAddForm ? "1px solid rgba(248,113,113,0.3)" : "1px solid rgba(0,255,135,0.3)",
            borderRadius: "8px", padding: "6px 14px",
            color: showAddForm ? "#f87171" : "#00ff87",
            fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
            fontSize: "13px", cursor: "pointer"
          }}
        >
          {showAddForm ? "✕ Cancel" : "+ Add Question"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div style={{
          background: "rgba(0,255,135,0.03)",
          border: "1px solid rgba(0,255,135,0.15)",
          borderRadius: "14px", padding: "20px",
          marginBottom: "16px",
          display: "flex", flexDirection: "column", gap: "10px"
        }}>
          <p style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#00ff87", fontSize: "14px" }}>
            ➕ New Question
          </p>
          <input
            placeholder="Question text"
            value={newQuestion.questionText}
            onChange={e => setNewQuestion(p => ({ ...p, questionText: e.target.value }))}
            style={inputStyle}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {["optionA", "optionB", "optionC", "optionD"].map((opt, i) => (
              <input
                key={opt}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={newQuestion[opt]}
                onChange={e => setNewQuestion(p => ({ ...p, [opt]: e.target.value }))}
                style={inputStyle}
              />
            ))}
          </div>
          <button onClick={handleAdd} style={{
            background: "#00ff87", color: "#0a0a0f",
            fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
            fontSize: "14px", padding: "10px", borderRadius: "10px",
            border: "none", cursor: "pointer"
          }}>
            Save Question ✓
          </button>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {questions.length === 0 && (
          <p style={{ color: "#475569", fontFamily: "DM Sans, sans-serif", fontSize: "13px", textAlign: "center", padding: "20px" }}>
            No questions yet. Add one above!
          </p>
        )}

        {questions.map((q, i) => (
          <div key={q.id} style={{
            background: "#0a0a0f", border: "1px solid #1e1e2e",
            borderRadius: "12px", padding: "14px 16px"
          }}>
            {/* Question header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <p style={{ color: "white", fontFamily: "DM Sans, sans-serif", fontSize: "13px", flex: 1, marginRight: "12px" }}>
                <span style={{ color: "#00ff87", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>
                  Q{i + 1}.{" "}
                </span>
                {q.questionText}
              </p>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => {
                    if (editingId === q.id) { setEditingId(null); return; }
                    setEditingId(q.id);
                    setEditForm({
                      questionText: q.questionText || "",
                      optionA: q.optionA || "",
                      optionB: q.optionB || "",
                      optionC: q.optionC || "",
                      optionD: q.optionD || ""
                    });
                  }}
                  style={{
                    background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)",
                    borderRadius: "8px", padding: "5px 12px", color: "#ff6b35",
                    fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "12px", cursor: "pointer"
                  }}
                >
                  {editingId === q.id ? "Cancel" : "✏️ Edit"}
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  style={{
                    background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                    borderRadius: "8px", padding: "5px 12px", color: "#f87171",
                    fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "12px", cursor: "pointer"
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Edit form */}
            {editingId === q.id && (
              <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <input placeholder="Question text" value={editForm.questionText}
                  onChange={e => setEditForm(p => ({ ...p, questionText: e.target.value }))} style={inputStyle} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {["optionA", "optionB", "optionC", "optionD"].map((opt, idx) => (
                    <input key={opt}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      value={editForm[opt]}
                      onChange={e => setEditForm(p => ({ ...p, [opt]: e.target.value }))}
                      style={inputStyle} />
                  ))}
                </div>
                <button onClick={() => handleEditSave(q.id)} style={{
                  background: "#ff6b35", color: "white",
                  fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                  fontSize: "13px", padding: "8px", borderRadius: "8px",
                  border: "none", cursor: "pointer"
                }}>
                  Update Question ✓
                </button>
              </div>
            )}

            {/* Options display */}
            {editingId !== q.id && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                {[q.optionA, q.optionB, q.optionC, q.optionD]
                  .filter(opt => opt != null && opt.trim() !== "")
                  .map((opt, idx) => (
                    <span key={`opt-${q.id}-${idx}`} style={{
                      padding: "3px 10px", borderRadius: "6px",
                      fontSize: "12px", fontFamily: "DM Sans, sans-serif",
                      background: q.correctAnswer === opt ? "rgba(0,255,135,0.12)" : "rgba(255,255,255,0.05)",
                      border: q.correctAnswer === opt ? "1px solid rgba(0,255,135,0.3)" : "1px solid #1e1e2e",
                      color: q.correctAnswer === opt ? "#00ff87" : "#94a3b8"
                    }}>
                      {q.correctAnswer === opt ? "✅ " : ""}{opt}
                    </span>
                  ))}
              </div>
            )}

            {/* Set correct answer */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <p style={{ color: "#475569", fontSize: "11px", fontFamily: "DM Sans, sans-serif" }}>Set answer:</p>
              {[q.optionA, q.optionB, q.optionC, q.optionD]
                .filter(opt => opt != null && opt.trim() !== "")
                .map((opt, idx) => (
                  <button key={`ans-${q.id}-${idx}`}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    style={{
                      padding: "4px 10px", borderRadius: "6px",
                      border: answers[q.id] === opt ? "1px solid rgba(0,255,135,0.5)" : "1px solid #1e1e2e",
                      background: answers[q.id] === opt ? "rgba(0,255,135,0.12)" : "rgba(255,255,255,0.03)",
                      color: answers[q.id] === opt ? "#00ff87" : "#64748b",
                      fontFamily: "DM Sans, sans-serif", fontSize: "12px", cursor: "pointer"
                    }}
                  >
                    {opt}
                  </button>
                ))}
              <button onClick={() => handleSetAnswer(q.id)} disabled={!answers[q.id]} style={{
                background: answers[q.id] ? "#00ff87" : "#1e1e2e",
                color: answers[q.id] ? "#0a0a0f" : "#475569",
                fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                fontSize: "12px", padding: "5px 14px", borderRadius: "8px",
                border: "none", cursor: answers[q.id] ? "pointer" : "not-allowed"
              }}>
                Save ✓
              </button>
            </div>

            {q.correctAnswer && (
              <p style={{ color: "#00ff87", fontSize: "11px", fontFamily: "DM Sans, sans-serif", marginTop: "8px" }}>
                ✅ Correct Answer: {q.correctAnswer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



// ─────────────────────────────────────────────────────────
// CHALLENGES TAB
// ─────────────────────────────────────────────────────────
function ChallengesTab({ headers }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winnerInputs, setWinnerInputs] = useState({});

  useEffect(() => { fetchChallenges(); }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/challenges", { headers });
      setChallenges(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this challenge?")) return;
    try {
      await api.delete(`/admin/challenges/${id}`, { headers });
      toast.success("Challenge deleted!");
      fetchChallenges();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleReset = async (id) => {
    try {
      await api.put(`/admin/challenges/${id}/reset`, {}, { headers });
      toast.success("Challenge reset to ACCEPTED!");
      fetchChallenges();
    } catch {
      toast.error("Failed to reset");
    }
  };

  const handleSetWinner = async (id) => {
    const winnerId = winnerInputs[id]?.trim();
    if (!winnerId) return toast.error("Enter winner player ID!");
    try {
      await api.put(`/admin/challenges/${id}/set-winner?winnerId=${winnerId}`, {}, { headers });
      toast.success(`Winner set to ${winnerId}!`);
      fetchChallenges();
    } catch {
      toast.error("Failed to set winner");
    }
  };

  const statusColor = {
    PENDING: "#64748b",
    ACCEPTED: "#ff6b35",
    COMPLETED: "#00ff87"
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
    <Loader2 size={32} className="animate-spin" style={{ color: "#00ff87" }} />
  </div>;

  return (
    <div>
      <p style={{
        color: "#64748b", fontFamily: "DM Sans, sans-serif",
        fontSize: "14px", marginBottom: "20px"
      }}>
        {challenges.length} total challenges
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {challenges.map(c => (
          <div key={c.id} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #1e1e2e",
            borderRadius: "16px", padding: "18px 20px"
          }}>
            {/* Top row */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", flexWrap: "wrap", gap: "12px",
              marginBottom: "14px"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{
                    fontSize: "11px", padding: "3px 10px", borderRadius: "99px",
                    border: `1px solid ${statusColor[c.status]}`,
                    color: statusColor[c.status],
                    fontFamily: "Rajdhani, sans-serif", fontWeight: 700
                  }}>{c.status}</span>
                  <span style={{ color: "#475569", fontSize: "12px", fontFamily: "DM Sans, sans-serif" }}>
                    ID: {c.id}
                  </span>
                </div>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: "white", fontSize: "14px" }}>
                  <span style={{ color: "#00ff87", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>
                    {c.challengerId}
                  </span>
                  <span style={{ color: "#475569", margin: "0 8px" }}>challenged</span>
                  <span style={{ color: "#ff6b35", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>
                    {c.opponentId}
                  </span>
                </p>
                {c.winnerId && (
                  <p style={{ color: "#eab308", fontSize: "13px", fontFamily: "DM Sans, sans-serif", marginTop: "4px" }}>
                    🏆 Winner: {c.winnerId}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => handleReset(c.id)} style={{
                  background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)",
                  borderRadius: "8px", padding: "6px 12px", color: "#ff6b35",
                  fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                  fontSize: "12px", cursor: "pointer"
                }}>
                  🔄 Reset
                </button>
                <button onClick={() => handleDelete(c.id)} style={{
                  background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                  borderRadius: "8px", padding: "6px 12px", color: "#f87171",
                  fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                  fontSize: "12px", cursor: "pointer"
                }}>
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Set winner row */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                placeholder="Set winner ID e.g. CHIKA3027"
                value={winnerInputs[c.id] || ""}
                onChange={e => setWinnerInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                style={{
                  flex: 1, background: "#0a0a0f",
                  border: "1px solid #1e1e2e", borderRadius: "8px",
                  padding: "8px 12px", color: "white",
                  fontFamily: "DM Sans, sans-serif", fontSize: "13px",
                  outline: "none", maxWidth: "260px"
                }}
              />
              <button onClick={() => handleSetWinner(c.id)} style={{
                background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)",
                borderRadius: "8px", padding: "8px 14px", color: "#eab308",
                fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                fontSize: "12px", cursor: "pointer"
              }}>
                🏆 Set Winner
              </button>
            </div>
          </div>
        ))}

        {challenges.length === 0 && (
          <p style={{
            textAlign: "center", padding: "40px",
            color: "#475569", fontFamily: "DM Sans, sans-serif"
          }}>
            No challenges yet
          </p>
        )}
      </div>
    </div>
  );
}