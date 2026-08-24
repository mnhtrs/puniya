export function FlowerIcon({ size = 26, style = {} }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.18))",
                flexShrink: 0,
                display: "inline-block",
                verticalAlign: "middle",
                ...style,
            }}
            aria-label="Flower Icon"
        >
            {/* 5 soft pure white petals */}
            <circle cx="12.00" cy="7.20" r="4.6" fill="#FFFFFF" />
            <circle cx="16.57" cy="10.52" r="4.6" fill="#FFFFFF" />
            <circle cx="14.82" cy="15.88" r="4.6" fill="#FFFFFF" />
            <circle cx="9.18" cy="15.88" r="4.6" fill="#FFFFFF" />
            <circle cx="7.43" cy="10.52" r="4.6" fill="#FFFFFF" />

            {/* Inner soft petal highlights */}
            <circle cx="12.00" cy="7.80" r="3.2" fill="#FFFDF8" opacity="0.9" />
            <circle cx="15.80" cy="10.80" r="3.2" fill="#FFFDF8" opacity="0.9" />
            <circle cx="14.20" cy="15.00" r="3.2" fill="#FFFDF8" opacity="0.9" />
            <circle cx="9.80" cy="15.00" r="3.2" fill="#FFFDF8" opacity="0.9" />
            <circle cx="8.20" cy="10.80" r="3.2" fill="#FFFDF8" opacity="0.9" />

            {/* Center pistil with warm sunny golden core */}
            <circle cx="12" cy="12" r="3.5" fill="#FFD166" />
            <circle cx="12" cy="12" r="2.2" fill="#FFA726" />
            <circle cx="11.2" cy="11.2" r="0.9" fill="#FFF9C4" opacity="0.8" />
        </svg>
    );
}
