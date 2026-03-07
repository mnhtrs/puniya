import { SvFlag } from "./SvFlag";

export function Header({ streak, vocab, onScrollToTop }) {
    return (
        <header className="hdr" onClick={onScrollToTop} style={{ cursor: "pointer" }}>
            <div className="hdr-logo" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                ✿ Puniya <SvFlag size={22} style={{ marginBottom: 1 }} />
            </div>
            <div className="hdr-right">
                <div className="hdr-pill">📚 {vocab.length}</div>
                <div className="hdr-pill">🔥 {streak}</div>
            </div>
        </header>
    );
}
