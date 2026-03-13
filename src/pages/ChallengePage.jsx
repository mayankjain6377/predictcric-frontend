import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Check, Loader2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ChallengePage() {
  const { matchId } = useParams();
  const { player } = usePlayer();
  const navigate = useNavigate();

  const [opponentId, setOpponentId] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!player) navigate("/");
  }, []);

  const handleChallenge = async () => {
    if (!opponentId.trim()) return toast.error("Enter opponent Player ID!");
    setLoading(true);
    try {
      const res = await api.post("/challenges", {
        challengerId: player.playerId,
        opponentId: opponentId.toUpperCase(),
        matchId: parseInt(matchId),
      });
      setChallenge(res.data);
      toast.success("Challenge sent! 🔥");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create challenge");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(challenge.shareLink);
    setCopied(true);
    toast.success("Link copied! Share with your friend 📤");
    setTimeout(() => setCopied(false), 2000);
  };
  

  return (
    
    <div className="min-h-screen pt-24 px-4 pb-12 flex items-center justify-center">
      <div className="w-full max-w-md">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8"
        >
          {!challenge ? (
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">⚡</div>
                <h1 className="font-display text-3xl font-bold text-white">
                  Challenge a Friend
                </h1>
                <p className="text-slate-400 font-body text-sm mt-2">
                  Enter your friend's Player ID to challenge them
                </p>
              </div>

              {/* Your ID */}
              <div className="bg-dark rounded-xl p-4 mb-6">
                <p className="text-slate-500 text-xs mb-1 font-body">You</p>
                <p className="font-display text-xl font-bold text-primary">
                  {player?.playerId}
                </p>
              </div>

              <div className="text-center text-2xl mb-6">⚡</div>

              {/* Opponent ID input */}
              <input
  type="text"
  placeholder="Friend's Player ID (e.g. SHIKH8840)"
  value={opponentId}
  onChange={(e) => setOpponentId(e.target.value.toUpperCase())}
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
    marginBottom: "16px"
  }}
/>

              <button
                onClick={handleChallenge}
                disabled={loading}
                className="w-full bg-dark text-white font-display font-bold
                           py-3 rounded-xl hover:glow-orange transition-all
                           disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <Loader2 size={18} className="animate-spin" />
                  : "Send Challenge 🔥"
                }
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">🔥</div>
              <h2 className="font-display text-2xl font-bold gradient-text mb-2">
                Challenge Created!
              </h2>
              <p className="text-slate-400 font-body text-sm mb-8">
                Share this link with{" "}
                <span className="text-accent font-bold">
                  {challenge.opponentId}
                </span>
              </p>

              {/* Share link */}
              <div className="bg-dark rounded-xl p-4 mb-4 text-left">
                <p className="text-slate-500 text-xs mb-2 font-body">
                  Share Link
                </p>
                <p className="text-primary text-sm font-body break-all">
                  {challenge.shareLink}
                </p>
              </div>

              <button
                onClick={copyLink}
                className="w-full border border-primary text-primary font-display
                           font-bold py-3 rounded-xl hover:bg-primary/10
                           transition-all flex items-center justify-center gap-2 mb-4"
              >
                {copied
                  ? <><Check size={18} /> Copied!</>
                  : <><Copy size={18} /> Copy Link</>
                }
              </button>

              <button
                onClick={() => navigate(`/faceoff/${challenge.challengeId}`)}
                className="w-full bg-primary text-dark font-display font-bold
                           py-3 rounded-xl hover:glow-green transition-all"
              >
                View Face-Off 👀
              </button>
              <button
  onClick={() => {
    const msg = `⚡ ${player.playerId} challenged you on PredictCric!\n\nMatch: ${challenge.matchTitle}\n\nClick to accept & predict:\n${challenge.shareLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }}
  className="w-full bg-green-600 text-white font-display font-bold
             py-3 rounded-xl hover:bg-green-500 transition-all
             flex items-center justify-center gap-2 mb-4"
>
  📱 Share on WhatsApp
</button>

<button
  onClick={copyLink}
  className="w-full border border-slate-600 text-slate-400 font-display
             font-bold py-3 rounded-xl hover:bg-slate-800 transition-all
             flex items-center justify-center gap-2 mb-4"
>
  {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy Link</>}
</button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}