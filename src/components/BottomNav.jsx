const NAV_ITEMS = [
    { id: "home", ico: "fa-solid fa-house", lbl: "Trang chủ" },
    { id: "vocab", ico: "fa-solid fa-book", lbl: "Từ vựng" },
    { id: "chat", ico: "fa-solid fa-robot", lbl: "AI Chat" },
    { id: "settings", ico: "fa-solid fa-gear", lbl: "Cài đặt" },
];

export function BottomNav({ active, onChange }) {
    return (
        <nav className="bnav">
            {NAV_ITEMS.map((n) => (
                <button
                    key={n.id}
                    className={`ni ${active === n.id ? "active" : ""}`}
                    onClick={() => onChange(n.id)}
                    aria-label={n.lbl}
                >
                    <span className="ni-ico">
                        <i className={n.ico}></i>
                    </span>
                    <span className="ni-lbl">{n.lbl}</span>
                </button>
            ))}
        </nav>
    );
}
