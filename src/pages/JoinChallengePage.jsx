import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function JoinChallengePage() {
  const { challengeId } = useParams();
  const { player, login } = usePlayer();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [name, setName] = useState("");
  const [customId, setCustomId] = useState("");
  const [suggestedId, setSuggestedId] = useState("");
  const [step, setStep] = useState(1); // 1=login/join, 2=confirm new ID
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchChallenge();
  }, []);

  // ── Fetch challenge details ──────────────────────────────
  const fetchChallenge = async () => {
    try {
      const res = await api.get(`/challenges/${challengeId}`);
      setChallenge(res.data);

      // Already logged in as the correct opponent → accept directly
      if (player && player.playerId === res.data.opponentId) {
        await doAccept(res.data);
      }
    } catch {
      toast.error("Challenge not found!");
      navigate("/");
    } finally {
      setPageLoading(false);
    }
  };

  // ── Accept challenge then go predict ────────────────────
  const doAccept = async (ch) => {
    try {
      const encoded = encodeURIComponent(ch.opponentId);
      await api.put(`/challenges/${challengeId}/accept?opponentId=${encoded}`);
    } catch {
      // Already accepted — ignore error, still proceed
    }
    navigate(`/predict/${ch.matchId}`);
  };

  // ── Validate that the entered ID matches the opponent ───
  const validateOpponent = (enteredId) => {
    if (enteredId.toUpperCase() !== challenge.opponentId) {
      toast.error(`This challenge is for ${challenge.opponentId} only!`);
      return false;
    }
    return true;
  };

  // ── Returning player: login then accept ─────────────────
  const handleReturnAndAccept = async () => {
    if (!customId.trim()) return toast.error("Enter your Player ID!");
    if (!validateOpponent(customId)) return;

    setLoading(true);
    try {
      const encoded = encodeURIComponent(customId.toUpperCase());
      const res = await api.get(`/player/${encoded}`);
      login(res.data);
      toast.success(`Welcome back ${res.data.name}! 🏏`);
      await doAccept(challenge);
    } catch {
      toast.error("Player ID not found!");
    } finally {
      setLoading(false);
    }
  };

  // ── New player: get suggested ID ────────────────────────
  const handleSuggest = async () => {
    if (!name.trim()) return toast.error("Enter your name!");
    setLoading(true);
    try {
      const res = await api.get(`/player/suggest-id?name=${name}`);
      setSuggestedId(res.data);
      setCustomId(res.data);
      setStep(2);
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // ── New player: confirm ID then join then accept ─────────
  const handleJoinAndAccept = async () => {
    if (!customId.trim()) return toast.error("Player ID cannot be empty!");
    if (!validateOpponent(customId)) return;

    setLoading(true);
    try {
      const res = await api.post("/player/join", {
        name,
        preferredId: customId.toUpperCase(),
      });
      login(res.data);
      toast.success(`Welcome ${res.data.name}! Let's predict! 🏏`);
      await doAccept(challenge);
    } catch (err) {
      toast.error(err.response?.data?.message || "ID already taken, try another!");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading screen ───────────────────────────────────────
  if (pageLoading) return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Loader2 size={40} className="animate-spin" style={{ color: "#00ff87" }} />
    </div>
  );

  // ── Main render ──────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>

        {/* Challenge banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #1e1e2e",
            borderRadius: "20px",
            padding: "28px",
            textAlign: "center",
            marginBottom: "20px"
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: "48px", marginBottom: "12px" }}
          >
            ⚡
          </motion.div>
          <p style={{
            color: "#64748b",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
            marginBottom: "6px"
          }}>
            You've been challenged by
          </p>
          <p style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "32px",
            fontWeight: 700,
            color: "#ff6b35",
            marginBottom: "8px"
          }}>
            {challenge?.challengerId}
          </p>
          <p style={{
            color: "#475569",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "13px"
          }}>
            {challenge?.matchTitle}
          </p>

          {/* Opponent hint */}
          <div style={{
            marginTop: "16px",
            background: "rgba(0,255,135,0.06)",
            border: "1px solid rgba(0,255,135,0.2)",
            borderRadius: "10px",
            padding: "10px 16px"
          }}>
            <p style={{
              color: "#00ff87",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "14px"
            }}>
              🎯 This challenge is for:{" "}
              <span style={{ letterSpacing: "1px" }}>
                {challenge?.opponentId}
              </span>
            </p>
          </div>
        </motion.div>

        {/* Join / Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #1e1e2e",
            borderRadius: "20px",
            padding: "32px"
          }}
        >

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* Returning player */}
              <h2 style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "white",
                marginBottom: "16px"
              }}>
                Already have an ID? 🔄
              </h2>

              <input
                type="text"
                placeholder={`Enter ${challenge?.opponentId}`}
                value={customId}
                onChange={(e) => setCustomId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleReturnAndAccept()}
                style={{
                  width: "100%",
                  background: "#0a0a0f",
                  border: "1px solid #1e1e2e",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  caretColor: "#00ff87",
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  outline: "none",
                  marginBottom: "12px",
                  letterSpacing: "1px"
                }}
              />

              <button
                onClick={handleReturnAndAccept}
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#00ff87",
                  color: "#0a0a0f",
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: loading ? 0.6 : 1,
                  boxShadow: "0 0 20px rgba(0,255,135,0.2)"
                }}
              >
                {loading
                  ? <Loader2 size={18} className="animate-spin" />
                  : "Login & Accept ⚡"
                }
              </button>

              {/* Divider */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "20px 0"
              }}>
                <div style={{ flex: 1, height: "1px", background: "#1e1e2e" }} />
                <span style={{ color: "#475569", fontSize: "13px" }}>
                  new here?
                </span>
                <div style={{ flex: 1, height: "1px", background: "#1e1e2e" }} />
              </div>

              {/* New player */}
              <h2 style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "white",
                marginBottom: "16px"
              }}>
                Create your ID 🎮
              </h2>

              <input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSuggest()}
                style={{
                  width: "100%",
                  background: "#0a0a0f",
                  border: "1px solid #1e1e2e",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  caretColor: "#00ff87",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "15px",
                  outline: "none",
                  marginBottom: "12px"
                }}
              />

              <button
                onClick={handleSuggest}
                disabled={loading}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "#ff6b35",
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,107,53,0.4)",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading
                  ? <Loader2 size={18} className="animate-spin" />
                  : "Get My Player ID →"
                }
              </button>
            </motion.div>
          )}

          {/* ── STEP 2 — Confirm new ID ── */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "white",
                marginBottom: "8px"
              }}>
                Your Player ID 🎯
              </h2>

              <p style={{
                color: "#64748b",
                fontSize: "13px",
                fontFamily: "DM Sans, sans-serif",
                marginBottom: "20px"
              }}>
                ⚠️ Must match{" "}
                <span style={{ color: "#00ff87", fontWeight: 700 }}>
                  {challenge?.opponentId}
                </span>
                {" "}to accept this challenge
              </p>

              {/* Suggested ID display */}
              <div style={{
                background: "#0a0a0f",
                border: "1px solid rgba(0,255,135,0.3)",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
                marginBottom: "16px",
                boxShadow: "0 0 20px rgba(0,255,135,0.08)"
              }}>
                <p style={{ color: "#475569", fontSize: "11px", marginBottom: "4px" }}>
                  Suggested ID
                </p>
                <p style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#00ff87",
                  letterSpacing: "2px",
                  textShadow: "0 0 20px rgba(0,255,135,0.4)"
                }}>
                  {suggestedId}
                </p>
              </div>

              {/* Editable ID */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    background: "#0a0a0f",
                    border: "1px solid #1e1e2e",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    caretColor: "#00ff87",
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "1px",
                    outline: "none"
                  }}
                />
                <button
                  onClick={handleSuggest}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid #1e1e2e",
                    borderRadius: "12px",
                    padding: "12px",
                    color: "#64748b",
                    cursor: "pointer"
                  }}
                  title="Regenerate"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              <button
                onClick={handleJoinAndAccept}
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#00ff87",
                  color: "#0a0a0f",
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: loading ? 0.6 : 1,
                  marginBottom: "12px",
                  boxShadow: "0 0 20px rgba(0,255,135,0.2)"
                }}
              >
                {loading
                  ? <Loader2 size={18} className="animate-spin" />
                  : "Confirm & Accept Challenge ⚡"
                }
              </button>

              <button
                onClick={() => { setStep(1); setCustomId(""); }}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#475569",
                  fontSize: "13px",
                  cursor: "pointer",
                  padding: "8px",
                  fontFamily: "DM Sans, sans-serif"
                }}
              >
                ← Go back
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
