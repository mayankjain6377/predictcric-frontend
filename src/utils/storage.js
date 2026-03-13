// Save player to localStorage
export const savePlayer = (player) => {
  localStorage.setItem("player", JSON.stringify(player));
};

// Get player from localStorage
export const getPlayer = () => {
  const player = localStorage.getItem("player");
  return player ? JSON.parse(player) : null;
};

// Clear player
export const clearPlayer = () => {
  localStorage.removeItem("player");
};