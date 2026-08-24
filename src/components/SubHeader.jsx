import { T } from "../constants/theme";

export function SubHeader({ title, icon, iconColor, iconBg, onBack, rightElement }) {
    return (
        <div className="subpage-header">
            {onBack && (
                <button
                    type="button"
                    className="back-btn-special"
                    onClick={onBack}
                    title="Quay lại Trang chủ"
                >
                    <span className="back-btn-circle">
                        <i className="fa-solid fa-arrow-left"></i>
                    </span>
                    <span className="back-btn-label">Trang chủ</span>
                </button>
            )}

            <div className="subpage-title-wrap">
                {icon && (
                    <div
                        className="subpage-title-icon"
                        style={{
                            background: iconBg || "rgba(255, 107, 157, 0.12)",
                            color: iconColor || (T && T.pink) || "#FF6B9D",
                        }}
                    >
                        <i className={icon}></i>
                    </div>
                )}
                <span className="subpage-title-text">{title}</span>
            </div>

            {rightElement && (
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                    {rightElement}
                </div>
            )}
        </div>
    );
}
