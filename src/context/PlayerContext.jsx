import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    const stored = localStorage.getItem("player");
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ Auto-refresh coins every 30 seconds
  useEffect(() => {
    if (!player) return;
    refreshPlayer();
    const interval = setInterval(refreshPlayer, 30000);
    return () => clearInterval(interval);
  }, [player?.playerId]);

  const refreshPlayer = async () => {
    const stored = localStorage.getItem("player");
    if (!stored) return;
    const storedPlayer = JSON.parse(stored);
    try {
      const res = await api.get(`/players/${storedPlayer.playerId}`);
      const updated = res.data;
      setPlayer(updated);
      localStorage.setItem("player", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to refresh player", err);
    }
  };

  const login = (playerData) => {
    setPlayer(playerData);
    localStorage.setItem("player", JSON.stringify(playerData));
  };

  const logout = () => {
    setPlayer(null);
    localStorage.removeItem("player");
  };

  return (
    <PlayerContext.Provider value={{ player, login, logout, refreshPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);