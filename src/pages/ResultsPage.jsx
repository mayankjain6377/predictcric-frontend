import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";
import { formatMatchTime } from "../utils/formatDate";

export default function ResultsPage() {
  const { player, refreshPlayer } = usePlayer();
  const navigate = useNavigate();
  const MotionDiv = motion.div;
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

   const fetchChallenges = async () => {
    try {
      const encoded = encodeURIComponent(player.playerId);
      const res = await api.get(`/challenges/player/${encoded}`);
      setChallenges(Array.isArray(res.data) ? res.data : []);
    } catch {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!player?.playerId) {
      navigate("/");
      return;
    }
    fetchChallenges();
    refreshPlayer();
  }, []);


  const statusStyle = {
    PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    ACCEPTED: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    COMPLETED: "text-primary bg-primary/10 border-primary/30",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold text-white">My Challenges 🔥</h1>
          <p className="text-slate-400 font-body mt-1">All your challenges and results</p>
        </MotionDiv>

        {challenges.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">⚡</p>
            <p className="text-slate-400 font-body">No challenges yet. Challenge a friend!</p>
            <button
              onClick={() => navigate("/matches")}
              className="mt-4 bg-primary text-dark font-display font-bold px-6 py-2 rounded-xl hover:glow-green transition-all"
            >
              Find a Match
            </button>
          </div>
        )}

        <div className="space-y-4">
          {challenges.map((ch) => (
            <MotionDiv
              key={ch.challengeId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white font-display font-bold text-lg">{ch.matchTitle || "Match"}</p>
                  <p className="text-slate-400 text-sm font-body mt-1">
                    {ch.matchTime ? formatMatchTime(ch.matchTime) : "Time not available"}
                  </p>
                  <p className="text-slate-500 text-sm mt-2">{ch.challengerId} ⚡ {ch.opponentId}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${statusStyle[ch.status] || "text-slate-300 bg-slate-700/20 border-slate-600"}`}
                >
                  {ch.status || "UNKNOWN"}
                </span>
              </div>

              {ch.status === "PENDING" && ch.challengerId === player.playerId && (
                <button
                  onClick={() => {
                    const msg = `⚡ ${player.playerId} challenged you on PredictCric!\n\nMatch: ${ch.matchTitle}\n\nClick to accept & predict:\n${ch.shareLink}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  className="mt-4 w-full bg-green-600 text-white font-display font-bold py-3 rounded-xl hover:bg-green-500 transition-all"
                >
                  📱 Send via WhatsApp
                </button>
              )}

              {ch.status === "PENDING" && ch.opponentId === player.playerId && (
                <button
                  onClick={() => navigate(`/join-challenge/${ch.challengeId}`)}
                  className="mt-4 w-full bg-primary text-dark font-display font-bold py-3 rounded-xl hover:glow-green transition-all"
                >
                  ⚡ Accept & Predict
                </button>
              )}

              {ch.status === "COMPLETED" && (
                <button
                  onClick={() => navigate(`/faceoff/${ch.challengeId}`)}
                  className="mt-4 w-full border border-accent text-accent font-display font-bold py-3 rounded-xl hover:bg-accent/10 transition-all"
                >
                  View Face-Off Result
                </button>
              )}
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
}