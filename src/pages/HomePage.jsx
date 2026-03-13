import { useState,useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function HomePage() {
  const { player, login } = usePlayer();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [suggestedId, setSuggestedId] = useState("");
  const [customId, setCustomId] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (player) {
    navigate("/matches");
  }
}, [player]);

  const handleSuggest = async () => {
    if (!name.trim()) return toast.error("Enter your name first!");
    setLoading(true);
    try {
      const res = await api.get(`/player/suggest-id?name=${name}`);
      setSuggestedId(res.data);
      setCustomId(res.data);
      setStep(2);
    } catch { toast.error("Something went wrong!"); }
    finally { setLoading(false); }
  };

  const handleJoin = async () => {
    if (!customId.trim()) return toast.error("Player ID cannot be empty!");
    setLoading(true);
    try {
      const res = await api.post("/player/join", {
        name,
        preferredId: customId.toUpperCase(),
      });
      login(res.data);
      toast.success(`Welcome ${res.data.name}! 🏏`);
      navigate("/matches");
    } catch (err) {
      toast.error(err.response?.data?.message || "ID already taken!");
    } finally { setLoading(false); }
  };

  const handleReturn = async () => {
    if (!customId.trim()) return toast.error("Enter your Player ID!");
    setLoading(true);
    try {
      const encoded = encodeURIComponent(customId.toUpperCase());
      const res = await api.get(`/player/${encoded}`);
      login(res.data);
      toast.success(`Welcome back ${res.data.name}! 🏏`);
      navigate("/matches");
    } catch { toast.error("Player ID not found!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
           style={{ background: "rgba(0,255,135,0.06)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
           style={{ background: "rgba(255,107,53,0.06)" }} />


      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16
                      items-center pt-20">

        {/* LEFT — Hero */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                       border mb-8"
            style={{
              border: "1px solid rgba(0,255,135,0.3)",
              background: "rgba(0,255,135,0.08)"
            }}
          >
            <span className="text-xs" style={{ color: "#00ff87" }}>
              🏏 Cricket Prediction Platform
            </span>
          </motion.div>

          {/* Main heading */}
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", lineHeight: 1.05 }}
              className="font-bold mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="block text-white"
              style={{ fontSize: "clamp(52px, 7vw, 88px)" }}
            >
              Predict.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="block"
              style={{
                fontSize: "clamp(52px, 7vw, 88px)",
                background: "linear-gradient(135deg, #00ff87, #00cc6a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Challenge.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="block"
              style={{
                fontSize: "clamp(52px, 7vw, 88px)",
                color: "#ff6b35"
              }}
            >
              Win. 🏆
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg mb-10 max-w-md"
            style={{ color: "#94a3b8", fontFamily: "DM Sans, sans-serif" }}
          >
            Predict match events, challenge your friends,
            and climb the leaderboard. The best predictor wins! 🎯
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-8"
          >
            {[
              { value: "4", label: "Questions/Match" },
              { value: "10🪙", label: "Per Correct" },
              { value: "∞", label: "Challenges" },
            ].map((stat) => (
              <div key={stat.label}>
                <p style={{
                  fontFamily: "DM Sans, sans-serif", 
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#00ff87"
                }}>
                  {stat.value}
                </p>
                <p style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontFamily: "DM Sans, sans-serif"
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — Join Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "40px"
          }}
        >
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* New Player */}
              <div>
                <h2 style={{
                  fontFamily: "DM Sans, sans-serif", 
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: "16px"
                }}>
                  New Player 🎮
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
                    color: "white",
                    fontFamily: "DM Sans, sans-serif",
                    outline: "none",
                    marginBottom: "12px",
                    fontSize: "15px"
                  }}
                />

                <button
                  onClick={handleSuggest}
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: "#00ff87",
                    color: "#0a0a0f",
                    fontFamily: "DM Sans, sans-serif", 
                    fontWeight: 700,
                    fontSize: "16px",
                    padding: "13px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  Get My Player ID →
                </button>
              </div>

              {/* Divider */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "8px 0"
              }}>
                <div style={{ flex: 1, height: "1px", background: "#1e1e2e" }} />
                <span style={{ color: "#475569", fontSize: "13px" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "#1e1e2e" }} />
              </div>

              {/* Returning Player */}
              <div>
                <h2 style={{
                  fontFamily: "DM Sans, sans-serif", 
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: "16px"
                }}>
                  Returning Player 🔄
                </h2>

                <input
                  type="text"
                  placeholder="Your Player ID (e.g. CHIKA2047)"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#0a0a0f",
                    border: "1px solid #1e1e2e",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    color: "white",
                    fontFamily: "DM Sans, sans-serif", 
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    outline: "none",
                    marginBottom: "12px",
                    fontSize: "15px"
                  }}
                />

                <button
                  onClick={handleReturn}
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: "transparent",
                    color: "#ff6b35",
                    fontFamily: "DM Sans, sans-serif", 
                    fontWeight: 700,
                    fontSize: "16px",
                    padding: "13px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,107,53,0.4)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  Login with ID →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 style={{
                fontFamily: "DM Sans, sans-serif", 
                fontSize: "26px",
                fontWeight: 600,
                color: "white"
              }}>
                Your Player ID 🎯
              </h2>

              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                We suggested this for you. Feel free to edit!
              </p>

              {/* Suggested ID */}
              <div style={{
                background: "#0a0a0f",
                border: "1px solid rgba(0,255,135,0.3)",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
                boxShadow: "0 0 20px rgba(0,255,135,0.1)"
              }}>
                <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>
                  Suggested ID
                </p>
                <p style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#00ff87",
                  textShadow: "0 0 20px rgba(0,255,135,0.5)",
                  letterSpacing: "3px"
                }}>
                  {suggestedId}
                </p>
              </div>

              {/* Editable input */}
              <div style={{ display: "flex", gap: "8px" }}>
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
                    color: "white",
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    outline: "none",
                    fontSize: "15px"
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
                onClick={handleJoin}
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
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Confirm & Join 🚀
              </button>

              <button
                onClick={() => { setStep(1); setCustomId(""); }}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#475569",
                  fontSize: "14px",
                  cursor: "pointer",
                  padding: "8px"
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
