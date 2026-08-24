import { SvFlag } from "./SvFlag";
import { FlowerIcon } from "./FlowerIcon";

export function Header({ streak, vocab, onScrollToTop, onGoHome }) {
    return (
        <header className="hdr" onClick={onScrollToTop} style={{ cursor: "pointer" }}>
            <div
                className="hdr-logo"
                onClick={(e) => {
                    e.stopPropagation();
                    if (onGoHome) onGoHome();
                }}
                style={{ display: "flex", alignItems: "center", gap: 9, userSelect: "none" }}
            >
                {/* Pure flower icon with high contrast white & gold petals against pink header */}
                <FlowerIcon size={27} />

                <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.5px", color: "#FFFFFF", textShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
                    Puniya
                </span>
                <SvFlag size={21} style={{ marginBottom: 1 }} />
            </div>

            <div className="hdr-right">
                <div className="hdr-pill" title="Tổng số từ vựng đã lưu trong sổ tay">
                    <i className="fa-solid fa-book-bookmark" style={{ fontSize: 12, color: "#FFF" }}></i>
                    <span>{vocab.length}</span>
                </div>
                <div className="hdr-pill" title="Chuỗi ngày học liên tiếp (Streak)">
                    <i className="fa-solid fa-fire" style={{ fontSize: 13, color: "#FFD166" }}></i>
                    <span>{streak}</span>
                </div>
            </div>
        </header>
    );
}
