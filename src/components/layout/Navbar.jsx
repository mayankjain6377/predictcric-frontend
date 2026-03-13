import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Bell } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Navbar() {
  const { player, logout } = usePlayer();
  const navigate = useNavigate();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!player) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [player]);

  const fetchNotifications = async () => {
    try {
      const encoded = encodeURIComponent(player.playerId);
      const res = await api.get(`/notifications/player/${encoded}`);
      setNotifCount(res.data.total);
    } catch {
      // silent fail
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "14px 24px",
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      <div style={{
        maxWidth: "1152px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{ fontSize: "22px" }}>🏏</span>
          <span style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            background: "linear-gradient(135deg, #00ff87, #ff6b35)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            PredictCric
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {[
            { to: "/matches",     label: "Matches" },
            { to: "/my-matches",  label: "My Predictions" },
            { to: "/results",     label: "My Challenges" },
            { to: "/leaderboard", label: "Leaderboard" },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color: "#64748b",
                textDecoration: "none",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.target.style.color = "#00ff87"}
              onMouseLeave={e => e.target.style.color = "#64748b"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        {player ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* Notification Bell */}
            <button
              onClick={() => navigate("/results")}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e1e2e",
                borderRadius: "10px",
                padding: "8px",
                cursor: "pointer",
                color: notifCount > 0 ? "#00ff87" : "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Bell size={17} />
              <AnimatePresence>
                {notifCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      background: "#ff6b35",
                      color: "white",
                      fontFamily: "Rajdhani, sans-serif",
                      fontWeight: 700,
                      fontSize: "10px",
                      width: "17px",
                      height: "17px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {notifCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Player chip */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #1e1e2e",
              borderRadius: "99px",
              padding: "6px 14px"
            }}>
              <User size={13} color="#00ff87" />
              <span style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "#00ff87"
              }}>
                {player.playerId}
              </span>
              <span style={{
                fontSize: "12px",
                color: "#eab308"
              }}>
                🪙 {player.coins}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#475569",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "4px"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#ff6b35"}
              onMouseLeave={e => e.currentTarget.style.color = "#475569"}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/" style={{
            background: "#00ff87",
            color: "#0a0a0f",
            padding: "8px 20px",
            borderRadius: "99px",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            textDecoration: "none",
            boxShadow: "0 0 16px rgba(0,255,135,0.2)"
          }}>
            Join Now
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
