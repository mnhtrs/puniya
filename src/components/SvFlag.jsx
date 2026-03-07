// Swedish flag SVG component - Windows doesn't render 🇸🇪 flag emoji
// This renders the actual Swedish flag (blue cross on yellow)
export function SvFlag({ size = 20, style = {} }) {
    return (
        <svg
            width={size}
            height={size * 0.625}
            viewBox="0 0 160 100"
            style={{ display: "inline-block", verticalAlign: "middle", borderRadius: 2, flexShrink: 0, ...style }}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Blue background */}
            <rect width="160" height="100" fill="#006AA7" />
            {/* Yellow cross - horizontal bar */}
            <rect x="0" y="38" width="160" height="24" fill="#FECC02" />
            {/* Yellow cross - vertical bar */}
            <rect x="52" y="0" width="24" height="100" fill="#FECC02" />
        </svg>
    );
}
