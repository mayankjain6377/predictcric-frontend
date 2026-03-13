import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Trophy } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";

export default function FaceOffPage() {
  const { challengeId } = useParams();
  const { player } = usePlayer();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!player) { navigate("/"); return; }
    fetchFaceOff();
  }, []);

  const fetchFaceOff = async () => {
    try {
      const res = await api.get(`/results/challenge/${challengeId}/faceoff`);
      setData(res.data);
    } catch {
      navigate("/matches");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-primary" />
    </div>
  );

  const isWinner = data?.winnerId === player?.playerId;
  const isDraw = data?.winnerId === "DRAW";

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-2xl mx-auto">

        {/* Match title */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate-400 font-body text-sm mb-6"
        >
          {data?.matchTitle}
        </motion.p>

        {/* Winner banner */}
        {data?.winnerId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-6 text-center mb-8 ${
              isDraw
                ? "bg-slate-700/30 border border-slate-600"
                : "bg-primary/10 border border-primary/30 glow-green"
            }`}
          >
            <Trophy size={32} className="mx-auto mb-2 text-primary" />
            <h2 className="font-display text-2xl font-bold text-white">
              {isDraw
                ? "It's a Draw! 🤝"
                : `${data.winnerId} Wins! 🏆`
              }
            </h2>
          </motion.div>
        )}

        {/* Players score header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            {/* Player 1 */}
            <div className="text-center flex-1">
              <p className="font-display text-lg font-bold text-primary">
                {data?.player1Id}
              </p>
              <p className="text-slate-400 text-sm font-body">
                {data?.player1Name}
              </p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="font-display text-5xl font-bold text-white mt-2"
              >
                {data?.player1Score}
              </motion.p>
            </div>

            {/* VS */}
            <div className="text-center px-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex
                              items-center justify-center text-accent
                              font-display font-bold text-lg">
                ⚡
              </div>
            </div>

            {/* Player 2 */}
            <div className="text-center flex-1">
              <p className="font-display text-lg font-bold text-accent">
                {data?.player2Id}
              </p>
              <p className="text-slate-400 text-sm font-body">
                {data?.player2Name}
              </p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="font-display text-5xl font-bold text-white mt-2"
              >
                {data?.player2Score}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Question comparisons */}
        <div className="space-y-3">
          {data?.comparisons?.map((comp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4"
            >
              <p className="text-slate-400 text-xs font-body mb-3 text-center">
                {comp.questionText}
              </p>

              <div className="flex items-center justify-between gap-4">
                {/* Player 1 answer */}
                <div className={`flex-1 text-center py-2 px-3 rounded-lg text-sm
                                font-body ${comp.player1Correct
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  <span className="mr-1">
                    {comp.player1Correct ? "✅" : "❌"}
                  </span>
                  {comp.player1Answer}
                </div>

                {/* Correct answer */}
                <div className="text-center flex-shrink-0">
                  {comp.correctAnswer && (
                    <span className="text-xs text-slate-500 font-body">
                      ✓ {comp.correctAnswer}
                    </span>
                  )}
                </div>

                {/* Player 2 answer */}
                <div className={`flex-1 text-center py-2 px-3 rounded-lg text-sm
                                font-body ${comp.player2Correct
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {comp.player2Answer}
                  <span className="ml-1">
                    {comp.player2Correct ? "✅" : "❌"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate("/leaderboard")}
          className="w-full mt-8 border border-primary text-primary
                     font-display font-bold py-3 rounded-xl
                     hover:bg-primary/10 transition-all"
        >
          View Leaderboard 🏆
        </motion.button>
      </div>
    </div>
  );
}