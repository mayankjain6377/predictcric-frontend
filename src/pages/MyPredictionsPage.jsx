import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";

export default function MyPredictionsPage() {
  const { matchId } = useParams();
  const { player } = usePlayer();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!player) { navigate("/"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const encoded = encodeURIComponent(player.playerId);
      const [predRes, matchRes] = await Promise.all([
        api.get(`/predictions/match/${matchId}/player/${encoded}`),
        api.get(`/matches/${matchId}`),
      ]);
      setPredictions(predRes.data);
      setMatch(matchRes.data);
    } catch {
      navigate("/matches");
    } finally {
      setLoading(false);
    }
  };

  const correctCount = predictions.filter(p => p.isCorrect === true).length;
  const totalCoins = correctCount * 10;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold text-white">
            My Predictions 🎯
          </h1>
          <p className="text-slate-400 font-body mt-1">
            {match?.matchTitle}
          </p>
        </motion.div>

        {/* Score summary */}
        {match?.status === "COMPLETED" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 mb-6 flex items-center
                       justify-between"
          >
            <div>
              <p className="text-slate-400 font-body text-sm">Your Score</p>
              <p className="font-display text-4xl font-bold text-primary">
                {correctCount}/{predictions.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 font-body text-sm">Coins Earned</p>
              <p className="font-display text-4xl font-bold text-yellow-400">
                🪙 {totalCoins}
              </p>
            </div>
          </motion.div>
        )}

        {/* Predictions list */}
        <div className="space-y-4">
          {predictions.map((pred, i) => (
            <motion.div
              key={pred.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5"
            >
              <p className="text-slate-400 font-body text-sm mb-3">
                {pred.questionText}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 border border-primary/30
                                  rounded-lg px-4 py-2">
                    <p className="font-display font-bold text-primary">
                      {pred.selectedAnswer}
                    </p>
                  </div>
                  <p className="text-slate-500 text-xs font-body">
                    Your pick
                  </p>
                </div>

                {/* Result indicator */}
                {pred.isCorrect === null ? (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock size={16} />
                    <span className="text-xs font-body">Pending</span>
                  </div>
                ) : pred.isCorrect ? (
                  <div className="flex items-center gap-1 text-primary">
                    <CheckCircle size={18} />
                    <span className="text-sm font-display font-bold">
                      +10 🪙
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-400">
                    <XCircle size={18} />
                    <span className="text-sm font-body">Wrong</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {predictions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎯</p>
            <p className="text-slate-400 font-body">
              No predictions yet for this match
            </p>
            <button
              onClick={() => navigate(`/predict/${matchId}`)}
              className="mt-4 bg-primary text-dark font-display font-bold
                         px-6 py-2 rounded-xl hover:glow-green transition-all"
            >
              Start Predicting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}