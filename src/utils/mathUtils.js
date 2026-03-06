const MATH_SUBS = [
    // Nested fracs first (up to 2 levels)
    [/\\dfrac\{([^{}]+)\}\{([^{}]+)\}/g, (_, a, b) => `(${a})∕(${b})`],
    [/\\tfrac\{([^{}]+)\}\{([^{}]+)\}/g, (_, a, b) => `(${a})∕(${b})`],
    [/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_, a, b) => `(${a})∕(${b})`],
    // Roots
    [/\\sqrt\[([^\]]+)\]\{([^{}]+)\}/g, (_, n, x) => `${n}√(${x})`],
    [/\\sqrt\{([^{}]+)\}/g, (_, x) => `√(${x})`],
    [/\\sqrt\s+/g, '√'],
    // Superscripts (must come before subscripts)
    [/\^\{([^{}]{1,20})\}/g, (_, e) => [...e].map(ch => ({ '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', 'n': 'ⁿ', '+': '⁺', '-': '⁻', 'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'm': 'ᵐ', 'k': 'ᵏ', 'x': 'ˣ', 'T': 'ᵀ', 'i': 'ⁱ', 'p': 'ᵖ', 'r': 'ʳ', 't': 'ᵗ', '*': '*' }[ch] || ch)).join('')],
    [/\^(\w)/g, (_, d) => ({ '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', 'n': 'ⁿ', 'x': 'ˣ', 'a': 'ᵃ', 'b': 'ᵇ' }[d] || d)],
    // Subscripts
    [/_\{([^{}]{1,20})\}/g, (_, e) => [...e].map(ch => ({ '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', 'n': 'ₙ', 'i': 'ᵢ', 'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ', 'k': 'ₖ', 'j': 'ⱼ' }[ch] || ch)).join('')],
    [/_(\d)/g, (_, d) => ({ '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' }[d] || d)],
    // Greek letters
    [/\\alpha\b/g, 'α'], [/\\beta\b/g, 'β'], [/\\gamma\b/g, 'γ'], [/\\delta\b/g, 'δ'],
    [/\\epsilon\b/g, 'ε'], [/\\varepsilon\b/g, 'ε'], [/\\theta\b/g, 'θ'], [/\\lambda\b/g, 'λ'], [/\\mu\b/g, 'μ'],
    [/\\nu\b/g, 'ν'], [/\\pi\b/g, 'π'], [/\\rho\b/g, 'ρ'], [/\\sigma\b/g, 'σ'], [/\\tau\b/g, 'τ'], [/\\phi\b/g, 'φ'],
    [/\\varphi\b/g, 'φ'], [/\\chi\b/g, 'χ'], [/\\psi\b/g, 'ψ'], [/\\omega\b/g, 'ω'],
    [/\\Omega\b/g, 'Ω'], [/\\Delta\b/g, 'Δ'], [/\\Sigma\b/g, 'Σ'], [/\\Lambda\b/g, 'Λ'],
    [/\\Gamma\b/g, 'Γ'], [/\\Phi\b/g, 'Φ'], [/\\Pi\b/g, 'Π'], [/\\Theta\b/g, 'Θ'],
    // Math symbols
    [/\\infty\b/g, '∞'], [/\\partial\b/g, '∂'], [/\\nabla\b/g, '∇'],
    [/\\times\b/g, '×'], [/\\div\b/g, '÷'], [/\\pm\b/g, '±'], [/\\mp\b/g, '∓'],
    [/\\le\b/g, '≤'], [/\\leq\b/g, '≤'], [/\\ge\b/g, '≥'], [/\\geq\b/g, '≥'],
    [/\\neq\b/g, '≠'], [/\\ne\b/g, '≠'], [/\\approx\b/g, '≈'], [/\\sim\b/g, '~'],
    [/\\equiv\b/g, '≡'], [/\\cong\b/g, '≅'], [/\\propto\b/g, '∝'],
    [/\\Rightarrow\b/g, '⇒'], [/\\Longrightarrow\b/g, '⟹'], [/\\Leftrightarrow\b/g, '⟺'], [/\\leftrightarrow\b/g, '↔'],
    [/\\uparrow\b/g, '↑'], [/\\downarrow\b/g, '↓'],
    [/\\forall\b/g, '∀'], [/\\exists\b/g, '∃'], [/\\perp\b/g, '⊥'], [/\\parallel\b/g, '∥'],
    [/\\angle\b/g, '∠'], [/\\triangle\b/g, '△'],
    // Integrals and big operators
    [/\\int_\{([^{}]+)\}\^\{([^{}]+)\}/g, (_, a, b) => `∫[${a}→${b}]`],
    [/\\int\b/g, '∫'],
    [/\\sum_\{([^{}]+)\}\^\{([^{}]+)\}/g, (_, a, b) => `∑[${a}→${b}]`],
    [/\\sum\b/g, '∑'], [/\\prod\b/g, '∏'],
    [/\\lim_\{([^{}]+)\}/g, (_, x) => `lim[${x}]`], [/\\lim\b/g, 'lim'],
    // Functions
    [/\\log_\{([^{}]+)\}/g, (_, b) => `log₍${b}₎`],
    [/\\log\b/g, 'log'], [/\\ln\b/g, 'ln'], [/\\exp\b/g, 'exp'],
    [/\\sin\b/g, 'sin'], [/\\cos\b/g, 'cos'], [/\\tan\b/g, 'tan'],
    [/\\arcsin\b/g, 'arcsin'], [/\\arccos\b/g, 'arccos'], [/\\arctan\b/g, 'arctan'],
    [/\\max\b/g, 'max'], [/\\min\b/g, 'min'], [/\\det\b/g, 'det'], [/\\dim\b/g, 'dim'],
    [/\\gcd\b/g, 'gcd'], [/\\lcm\b/g, 'lcm'],
    // Decorations
    [/\\overline\{([^{}]+)\}/g, '$1̄'], [/\\bar\{([^{}]+)\}/g, '$1̄'],
    [/\\vec\{([^{}]+)\}/g, '$1⃗'], [/\\hat\{([^{}]+)\}/g, '$1̂'],
    [/\\overrightarrow\{([^{}]+)\}/g, '$1→'],
    [/\\tilde\{([^{}]+)\}/g, '$1̃'], [/\\dot\{([^{}]+)\}/g, '$1̇'],
    // Text and math fonts
    [/\\text\{([^{}]+)\}/g, '$1'], [/\\mathbb\{([^{}]+)\}/g, '$1'],
    [/\\mathbf\{([^{}]+)\}/g, '$1'], [/\\mathrm\{([^{}]+)\}/g, '$1'],
    [/\\mathcal\{([^{}]+)\}/g, '$1'], [/\\boldsymbol\{([^{}]+)\}/g, '$1'],
    [/\\textbf\{([^{}]+)\}/g, '$1'], [/\\textit\{([^{}]+)\}/g, '$1'],
    // Environments
    [/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g,
        (_, inner) => '[' + inner.replace(/\\\\/g, ' | ').replace(/&/g, ', ').replace(/\s+/g, ' ').trim() + ']'],
    [/\\begin\{bmatrix\}([\s\S]*?)\\end\{bmatrix\}/g,
        (_, inner) => '[' + inner.replace(/\\\\/g, ' | ').replace(/&/g, ', ').replace(/\s+/g, ' ').trim() + ']'],
    [/\\begin\{vmatrix\}([\s\S]*?)\\end\{vmatrix\}/g,
        (_, inner) => `|${inner.replace(/\\\\/g, ' | ').replace(/&/g, ', ').replace(/\s+/g, ' ').trim()}|`],
    [/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g,
        (_, inner) => inner.split('\\\\').map(r => r.trim().replace(/&/g, ' ')).filter(Boolean).join(' | ')],
    [/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, '$1'],
    [/\\begin\{[a-z*]+\}([\s\S]*?)\\end\{[a-z*]+\}/g, '$1'],
    // Spacing & misc
    [/\\[,;!: ]/g, ' '], [/\\quad\b/g, '  '], [/\\qquad\b/g, '   '],
    [/\\left[\|()\[\]{}\.]/g, ''], [/\\right[\|()\[\]{}\.]/g, ''],
    [/\\Big[()[\]|]/g, ''], [/\\big[()[\]|]/g, ''],
    [/\\\\/g, ' '],
    // Chemical formulas cleanup
    [/([A-Z][a-z]?)(\d+)/g, (_, el, n) => el + [...(n)].map(d => ('₀₁₂₃₄₅₆₇₈₉')[+d]).join('')],
];

export function renderMath(src) {
    if (!src) return src;
    let s = src;
    // Apply 3 passes to handle nested expressions
    for (let pass = 0; pass < 3; pass++) {
        for (const [re, sub] of MATH_SUBS) s = s.replace(re, sub);
    }
    // Remove leftover braces
    s = s.replace(/\{([^{}]*)\}/g, '$1');
    s = s.replace(/[{}]/g, '');
    // Remove leftover backslash commands
    s = s.replace(/\\([a-zA-Z]+)/g, '$1');
    return s.trim();
}
