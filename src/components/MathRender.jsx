import { useEffect, useRef } from "react";

export function KaTeXLoader() {
    useEffect(() => {
        if (window.katex) return;
        // CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
        document.head.appendChild(link);
        // JS
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
        script.async = true;
        script.onload = () => {
            // Re-render all math after KaTeX loaded
            document.querySelectorAll("[data-latex]").forEach((el) => {
                try {
                    el.innerHTML = window.katex.renderToString(el.dataset.latex, {
                        throwOnError: false,
                        displayMode: el.dataset.display === "true",
                    });
                } catch { }
            });
        };
        document.head.appendChild(script);
    }, []);
    return null;
}

export function LatexBlock({ src }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current || !src) return;
        if (window.katex) {
            try {
                ref.current.innerHTML = window.katex.renderToString(src, {
                    throwOnError: false,
                    displayMode: true,
                    output: "html",
                    trust: true,
                    strict: false,
                });
                return;
            } catch (err) { }
        }
        ref.current.textContent = src;
    }, [src]);

    return (
        <div
            ref={ref}
            data-latex={src}
            data-display="true"
            style={{
                padding: "10px 14px",
                background: "#f0f4ff",
                borderRadius: 10,
                marginBottom: 8,
                overflowX: "auto",
                lineHeight: 1.8,
                fontSize: 15,
                color: "#1e1b8e",
                fontWeight: 500,
            }}
        >
            {src}
        </div>
    );
}

export function InlineLatex({ src }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current || !src) return;
        if (window.katex) {
            try {
                ref.current.innerHTML = window.katex.renderToString(src, {
                    throwOnError: false,
                    displayMode: false,
                    output: "html",
                    trust: true,
                    strict: false,
                });
                return;
            } catch (err) { }
        }
        ref.current.textContent = src;
    }, [src]);

    return (
        <span ref={ref} data-latex={src} data-display="false">
            {src}
        </span>
    );
}
