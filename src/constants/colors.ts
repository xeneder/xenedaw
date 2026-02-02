// Predefined track colors
export const TRACK_COLORS = [
  '#788CFF', // Accent blue (default)
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#A8E6CF', // Mint green
  '#FF8B94', // Pink
  '#C7CEEA', // Lavender
  '#FFDAC1', // Peach
  '#B4F8C8', // Light green
  '#FBE7C6', // Cream
  '#A0C4FF', // Light blue
  '#FFADAD', // Light red
];

export const getRandomTrackColor = (): string => {
  return TRACK_COLORS[Math.floor(Math.random() * TRACK_COLORS.length)] || TRACK_COLORS[0];
};

export const getTrackColorByIndex = (index: number): string => {
  return TRACK_COLORS[index % TRACK_COLORS.length] || TRACK_COLORS[0];
};
