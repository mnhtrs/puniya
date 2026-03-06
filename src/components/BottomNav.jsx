const NAV_ITEMS = [
    { id: "home", ico: "🏠", lbl: "Trang chủ" },
    { id: "vocab", ico: "📚", lbl: "Từ vựng" },
    { id: "settings", ico: "⚙️", lbl: "Cài đặt" },
];

export function BottomNav({ active, onChange }) {
    return (
        <nav className="bnav">
            {NAV_ITEMS.map((n) => (
                <button
                    key={n.id}
                    className={`ni ${active === n.id ? "active" : ""}`}
                    onClick={() => onChange(n.id)}
                >
                    <span className="ni-ico">{n.ico}</span>
                    <span className="ni-lbl">{n.lbl}</span>
                </button>
            ))}
        </nav>
    );
}
