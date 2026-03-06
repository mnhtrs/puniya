export const T = {
    pink: "#FF6B9D", pinkL: "#FFB3CE", pinkP: "#FFF0F6",
    purple: "#C084FC", purpleL: "#EDE9FE",
    mint: "#6EE7B7", mintL: "#D1FAE5",
    yellow: "#FDE68A", coral: "#FF8B6A",
    bg: "#FFF8FC", white: "#FFFFFF",
    text: "#3D1A35", textL: "#9B6B8A",
    border: "#F9C0D9", shadow: "rgba(255,107,157,0.15)",
    blue: "#60A5FA", blueL: "#DBEAFE",
};

export const catColors = [
    { bg: "#FFE4F3", text: "#FF6B9D", border: "#FFB3CE" },
    { bg: "#EDE9FE", text: "#7C3AED", border: "#C4B5FD" },
    { bg: "#D1FAE5", text: "#059669", border: "#6EE7B7" },
    { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" },
    { bg: "#DBEAFE", text: "#2563EB", border: "#93C5FD" },
    { bg: "#FCE7F3", text: "#DB2777", border: "#F9A8D4" },
];

export function getCatColor(cat) {
    if (!cat) return catColors[0];
    let h = 0;
    for (let c of cat) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
    return catColors[Math.abs(h) % catColors.length];
}
