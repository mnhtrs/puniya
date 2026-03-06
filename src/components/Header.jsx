export function Header({ streak, vocab }) {
    return (
        <header className="hdr">
            <div className="hdr-logo">✿ Puniya 🇸🇪</div>
            <div className="hdr-right">
                <div className="hdr-pill">📚 {vocab.length}</div>
                <div className="hdr-pill">🔥 {streak}</div>
            </div>
        </header>
    );
}
