// Vietnamese flag SVG component
export function VnFlag({ size = 20, style = {} }) {
    return (
        <svg
            width={size}
            height={size * 0.66}
            viewBox="0 0 300 200"
            style={{ display: "inline-block", verticalAlign: "middle", borderRadius: 2, flexShrink: 0, ...style }}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Red background */}
            <rect width="300" height="200" fill="#da251d" />
            {/* Yellow star */}
            <polygon
                points="150,35 164,78 210,78 173,105 187,148 150,121 113,148 127,105 90,78 136,78"
                fill="#ffff00"
            />
        </svg>
    );
}
