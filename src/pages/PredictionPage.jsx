import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function PredictionPage() {
  const { matchId } = useParams();
  const { player } = usePlayer();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!player) { navigate("/"); return; }
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/matches/${matchId}/questions`);
      setQuestions(res.data || []);
    } catch {
      toast.error("Failed to load questions");
      navigate(`/matches/${matchId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    const q = questions[current];
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: option }));
  };

  const handleNext = async () => {
    const q = questions[current];
    if (!q) return;

    const selectedAnswer = answers[q.id];
    if (!selectedAnswer) return toast.error("Select an option first!");

    setSubmitting(true);
    try {
      await api.post(`/predictions/match/${matchId}`, {
        playerId: player.playerId,
        questionId: q.id,
        selectedAnswer,
      });
      if (current < questions.length - 1) {
        setCurrent(prev => prev + 1);
      } else {
        setDone(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const options = (q) => {
    if (!q) return [];
    return [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean);
  };

  // ── Loading ──────────────────────────────────────────────
  if (loading) return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Loader2 size={40} className="animate-spin" style={{ color: "#00ff87" }} />
    </div>
  );

  // ── No questions yet ─────────────────────────────────────
  if (!loading && questions.length === 0) return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid #1e1e2e",
          borderRadius: "24px",
          padding: "48px",
          textAlign: "center",
          maxWidth: "420px",
          width: "100%"
        }}
      >
        <p style={{ fontSize: "56px", marginBottom: "16px" }}>🏏</p>
        <h2 style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "28px",
          fontWeight: 700,
          color: "white",
          marginBottom: "12px"
        }}>
          No Questions Yet
        </h2>
        <p style={{
          color: "#64748b",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "14px",
          marginBottom: "28px"
        }}>
          Admin hasn't set up questions for this match yet. Check back soon!
        </p>
        <button
          onClick={() => navigate("/matches")}
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
            boxShadow: "0 0 20px rgba(0,255,135,0.2)"
          }}
        >
          Back to Matches
        </button>
      </motion.div>
    </div>
  );

  // ── Done screen ──────────────────────────────────────────
  if (done) return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid #1e1e2e",
          borderRadius: "24px",
          padding: "48px",
          textAlign: "center",
          maxWidth: "420px",
          width: "100%"
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: 3, duration: 0.5 }}
          style={{ fontSize: "64px", marginBottom: "24px" }}
        >
          🎯
        </motion.div>
        <h2 style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "32px",
          fontWeight: 700,
          background: "linear-gradient(135deg, #00ff87, #ff6b35)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "12px"
        }}>
          Predictions Locked!
        </h2>
        <p style={{
          color: "#94a3b8",
          fontFamily: "DM Sans, sans-serif",
          marginBottom: "32px"
        }}>
          All {questions.length} predictions submitted. Now challenge a friend!
        </p>

        <button
          onClick={() => navigate(`/challenge/${matchId}`)}
          style={{
            width: "100%",
            background: "#00ff87",
            color: "#0a0a0f",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "17px",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            marginBottom: "12px",
            boxShadow: "0 0 20px rgba(0,255,135,0.2)"
          }}
        >
          Challenge a Friend ⚡
        </button>

        <button
          onClick={() => navigate("/matches")}
          style={{
            width: "100%",
            background: "transparent",
            color: "#64748b",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
            padding: "10px",
            borderRadius: "12px",
            border: "1px solid #1e1e2e",
            cursor: "pointer"
          }}
        >
          Back to Matches
        </button>
      </motion.div>
    </div>
  );

  // ── Guard current question ───────────────────────────────
  const q = questions[current];
  if (!q) return null;

  const progress = (current / questions.length) * 100;

  // ── Main prediction UI ───────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      paddingTop: "96px",
      paddingBottom: "48px",
      paddingLeft: "16px",
      paddingRight: "16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

        {/* Progress bar */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <span style={{
              color: "#64748b",
              fontSize: "13px",
              fontFamily: "DM Sans, sans-serif"
            }}>
              Question {current + 1} of {questions.length}
            </span>
            <span style={{
              color: "#64748b",
              fontSize: "13px",
              fontFamily: "DM Sans, sans-serif"
            }}>
              {Math.round(progress)}% done
            </span>
          </div>
          <div style={{
            width: "100%",
            background: "#1e1e2e",
            borderRadius: "99px",
            height: "4px"
          }}>
            <motion.div
              style={{
                background: "#00ff87",
                height: "4px",
                borderRadius: "99px"
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #1e1e2e",
              borderRadius: "24px",
              padding: "36px"
            }}
          >
            {/* Question label */}
            <p style={{
              color: "#00ff87",
              fontSize: "11px",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "12px"
            }}>
              Question {current + 1}
            </p>

            {/* Question text */}
            <h2 style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "26px",
              fontWeight: 700,
              color: "white",
              marginBottom: "28px",
              lineHeight: 1.3
            }}>
              {q.questionText}
            </h2>

            {/* Options grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "28px"
            }}>
              {options(q).map((opt, idx) => {
                const selected = answers[q.id] === opt;
                return (
                  <motion.button
                    key={`${q.id}-${idx}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(opt)}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      border: selected
                        ? "1px solid rgba(0,255,135,0.5)"
                        : "1px solid #1e1e2e",
                      background: selected
                        ? "rgba(0,255,135,0.12)"
                        : "#0a0a0f",
                      color: selected ? "#00ff87" : "#cbd5e1",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "14px",
                      textAlign: "left",
                      cursor: "pointer",
                      position: "relative",
                      boxShadow: selected
                        ? "0 0 16px rgba(0,255,135,0.15)"
                        : "none",
                      transition: "all 0.2s"
                    }}
                  >
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px"
                        }}
                      >
                        <CheckCircle size={14} color="#00ff87" />
                      </motion.div>
                    )}
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Next / Submit button */}
            <button
              onClick={handleNext}
              disabled={!answers[q.id] || submitting}
              style={{
                width: "100%",
                background: !answers[q.id] ? "#1e1e2e" : "#00ff87",
                color: !answers[q.id] ? "#475569" : "#0a0a0f",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "17px",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                cursor: !answers[q.id] ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
                boxShadow: answers[q.id]
                  ? "0 0 20px rgba(0,255,135,0.2)"
                  : "none"
              }}
            >
              {submitting
                ? <Loader2 size={18} className="animate-spin" />
                : current < questions.length - 1
                  ? "Next Question →"
                  : "Submit All ✓"
              }
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
