export const MATEMATIK = [
    // ─── ÅK 7 ──────────────────────────────────────────
    {
        id: 1, klass: "Åk 7", area: "Taluppfattning", emoji: "🔢",
        title: "Tal och räknesätt",
        content: "Grundläggande aritmetik med hela tal, bråk, decimaltal och negativa tal. Prioriteringsregler (PEMDAS) styr beräkningsordning.",
        formulas: [
            "\\text{Prioritet: } (\\;) \\to \\text{pot.} \\to \\times\\div \\to +\\!-",
            "\\dfrac{a}{b}\\cdot\\dfrac{c}{d}=\\dfrac{ac}{bd}",
            "\\dfrac{a}{b}\\div\\dfrac{c}{d}=\\dfrac{a}{b}\\cdot\\dfrac{d}{c}",
            "\\dfrac{a}{b}+\\dfrac{c}{b}=\\dfrac{a+c}{b}",
            "|a| = \\begin{cases}a & a\\ge0\\\\-a & a<0\\end{cases}",
        ],
        examples: [
            { problem: "Beräkna: 3+4·2−(6÷3)", solution: "3+8−2=9" },
            { problem: "\\dfrac{2}{3}+\\dfrac{3}{4}", solution: "\\dfrac{8}{12}+\\dfrac{9}{12}=\\dfrac{17}{12}=1\\tfrac{5}{12}" },
        ],
        exercises: [
            { q: "Beräkna: 12−3·(2+1)", a: "12−9=3" },
            { q: "\\dfrac{5}{6}-\\dfrac{1}{4}", a: "\\dfrac{10}{12}-\\dfrac{3}{12}=\\dfrac{7}{12}" },
            { q: "(−3)·(−4)+2", a: "12+2=14" },
            { q: "Beräkna: 10−(2−5)", a: "10−(−3)=13" },
            { q: "Skriv 0,75 som bråk i enklaste form", a: "3/4" },
            { q: "4 + 5 × 2 = ?", a: "14 (multiplikation först)" }
        ]
    },

    {
        id: 2, klass: "Åk 7", area: "Procent", emoji: "📊",
        title: "Procent och proportioner",
        content: "Procent betyder 'av hundra'. Förändringsfaktor förenklar att räkna på- och avslagsprocent. Proportionalitet: lika kvoter.",
        formulas: [
            "p\\% = \\dfrac{p}{100}",
            "\\text{Nytt värde} = \\text{gammalt}\\times\\left(1\\pm\\dfrac{p}{100}\\right)",
            "\\dfrac{a}{b}=\\dfrac{c}{d}\\;\\Longrightarrow\\; ad=bc",
            "\\text{Förändring\\%} = \\dfrac{\\text{ny}-\\text{gammal}}{\\text{gammal}}\\times100",
        ],
        examples: [
            { problem: "Pris 800 kr, 15% rabatt.", solution: "800·0{,}85=680\\text{ kr}" },
            { problem: "Med hur mycket ökar 40→52?", solution: "\\dfrac{12}{40}\\cdot100=30\\%" },
        ],
        exercises: [
            { q: "250 kr ökar med 20%. Nytt pris?", a: "250·1,2=300 kr" },
            { q: "Vad är 35% av 2400?", a: "2400·0,35=840" },
            { q: "Pris sjunker från 40 till 28. Hur många %?", a: "(28−40)/40 = −12/40 = −30%" },
            { q: "Förändringsfaktor vid 15% rabatt?", a: "0,85" },
            { q: "20% av ett tal är 40. Vilket är talet?", a: "40 / 0,20 = 200" },
            { q: "En tröja för 500 kr höjs med 10%, därefter sänks priset med 10%. Nytt pris?", a: "500 × 1,1 × 0,9 = 495 kr (Minskar med 1%)" }
        ]
    },

    {
        id: 3, klass: "Åk 7", area: "Geometri", emoji: "📐",
        title: "Area, Omkrets & Volym",
        content: "Geometriska begrepp i planet och rummet. Rektanglar, trianglar, cirklar.",
        formulas: [
            "\\text{Rektangel: } A = b\\cdot h, O = 2(b+h)",
            "\\text{Triangel: } A = \\dfrac{b\\cdot h}{2}",
            "\\text{Cirkel: } A = \\pi r^2, O = 2\\pi r",
            "\\text{Rätblock: } V = B\\cdot h",
        ],
        examples: [
            { problem: "En cirkel har diametern 10. Omkrets?", solution: "O = 10\\pi \\approx 31,4" },
            { problem: "Rätblock med sidorna 3, 4, 5. Volym?", solution: "V = 3 \\cdot 4 \\cdot 5 = 60" },
        ],
        exercises: [
            { q: "Area för en rektangel med sidor 6 och 8?", a: "A = 6 × 8 = 48" },
            { q: "Triangel med bas 10 och höjd 5. Area?", a: "(10 × 5)/2 = 25" },
            { q: "Hur många grader är vinkelsumman i en triangel?", a: "180°" },
            { q: "Vad kallas 3.14 inom matematiken (vanligtvis)?", a: "Pi (π)" },
            { q: "Omkretsen på en kvadrat är 20. Vad är arean?", a: "Sidans längd: 20/4 = 5. Area: 5×5 = 25" },
            { q: "Volym för en kub med sidan 3?", a: "3³ = 27" }
        ]
    },

    // ─── ÅK 8 ──────────────────────────────────────────
    {
        id: 4, klass: "Åk 8", area: "Algebra", emoji: "🔣",
        title: "Algebraiska uttryck & Ekvationer",
        content: "Bokstäver för okända värden. Förenkla uttryck och lös linjära ekvationer. Balansmetoden.",
        formulas: [
            "a(b+c) = ab + ac",
            "x+a = b \\Rightarrow x = b - a",
            "ax = b \\Rightarrow x = b / a",
            "-(a - b) = -a + b"
        ],
        examples: [
            { problem: "Lös ekvationen: 3x - 5 = 10", solution: "3x = 15 \\Rightarrow x = 5" },
            { problem: "Förenkla: 2(x+3) - 2x", solution: "2x + 6 - 2x = 6" },
        ],
        exercises: [
            { q: "Förenkla: 4x + 3 - 2x + 1", a: "2x + 4" },
            { q: "Lös ekvationen: x/4 = 8", a: "x = 32" },
            { q: "Lös: 5x + 7 = 3x + 15", a: "2x = 8 → x = 4" },
            { q: "Skriv ett uttryck för 'Tre mindre än dubbla x'", a: "2x - 3" },
            { q: "Beräkna uttrycket 3x + 5 då x = 2", a: "3(2) + 5 = 11" },
            { q: "Lös parentesen: -(x - 5)", a: "-x + 5" }
        ]
    },

    {
        id: 5, klass: "Åk 8", area: "Geometri", emoji: "📏",
        title: "Pythagoras sats & Roten ur",
        content: "I rätvinkliga trianglar gäller a² + b² = c². Förhållandet studeras via kvadratrötter.",
        formulas: [
            "a^2 + b^2 = c^2 \\text{ (där c är hypotenusan)}",
            "c = \\sqrt{a^2 + b^2}",
            "\\sqrt{x^2} = x \\text{ (om x är positivt)}",
        ],
        examples: [
            { problem: "Kateterna är 3 cm och 4 cm. Beräkna hypotenusan.", solution: "c^2 = 3^2 + 4^2 = 9 + 16 = 25 \\Rightarrow c = 5" },
            { problem: "Vad är √64?", solution: "8, eftersom 8 \\cdot 8 = 64" },
        ],
        exercises: [
            { q: "Långa sidan i triangel med vinkel 90° kallas...?", a: "Hypotenusan" },
            { q: "Beräkna hypotenusan om kateterna är 5 och 12", a: "√(5² + 12²) = √(25 + 144) = √169 = 13" },
            { q: "Katet 6, hypotenusa 10. Andra kateten?", a: "b = √(10² - 6²) = √(100 - 36) = √64 = 8" },
            { q: "Stämmer 7, 24, 25 för Pythagoras?", a: "Ja, 49 + 576 = 625 as 25²" },
            { q: "Mellan vilka två heltal ligger roten ur 30?", a: "Mellan 5 (25) och 6 (36)" },
            { q: "Vad är x om x² = 81?", a: "x = 9 eller x = -9 (men i geometri, positiv längd: 9)" }
        ]
    },

    {
        id: 6, klass: "Åk 8", area: "Sannolikhet", emoji: "🎲",
        title: "Sannolikhet & Statistik",
        content: "Andelen gynnsamma av totala. Träddiagram, oberoende händelser och lägesmått.",
        formulas: [
            "P(\\text{A}) = \\frac{\\text{Gynnsamma utfall}}{\\text{Möjliga utfall}}",
            "P(\\text{Båda}) = P(A) \\cdot P(B) \\text{ (oberoende)}",
            "\\text{Medelvärde } = \\frac{\\text{Summan av värdena}}{\\text{Antalet värden}}"
        ],
        examples: [
            { problem: "Sannolikhet att rulla en 5:a eller 6:a med tärning?", solution: "2 gynnsamma av 6 möjliga = 2/6 = 1/3" },
            { problem: "Medelvärdet av 4, 8, 6, 2", solution: "(4+8+6+2)/4 = 20/4 = 5" },
        ],
        exercises: [
            { q: "Vad är komplementhändelsen till att dra spader i kortlek?", a: "Att dra hjärter, ruter eller klöver (P = 3/4)" },
            { q: "P(krona) på ett mynt och P(sexa) på en tärning?", a: "1/2 × 1/6 = 1/12" },
            { q: "Hitta medianen: 1, 5, 2, 9, 3", a: "Sortera: 1, 2, 3, 5, 9. Median = 3" },
            { q: "Vad kallas värdet som finns flest gånger i statistiken?", a: "Typvärde" },
            { q: "Du drar 2 kort ur en kortlek (utan återläggning). P(2 ess)?", a: "(4/52) × (3/51)" },
            { q: "Variationsbredden ifall datan är 10, 3, 5, 8?", a: "Största - minsta = 10 - 3 = 7" }
        ]
    },

    // ─── ÅK 9 ──────────────────────────────────────────
    {
        id: 7, klass: "Åk 9", area: "Funktioner", emoji: "📉",
        title: "Linjära Funktioner",
        content: "Matematiska samband kan ritas grafiskt. Räta linjens ekvation y = kx + m.",
        formulas: [
            "y = kx + m",
            "k = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{y_2 - y_1}{x_2 - x_1}",
            "m = y\\text{-värdet när } x=0"
        ],
        examples: [
            { problem: "Funktionen y = 2x - 1. Var korsar y-axeln?", solution: "M-värdet är -1, alltså i y = -1 (punkten (0,-1))" },
            { problem: "Bestäm k mellan (1,2) och (3,8).", solution: "k = (8-2) / (3-1) = 6 / 2 = 3" },
        ],
        exercises: [
            { q: "Vilket m-värde har funktionen y = -3x + 5?", a: "5" },
            { q: "Är linjen y = -2x stigande eller fallande?", a: "Fallande (negativt k-värde)" },
            { q: "Bestäm funktion som startar på 50 kr och kostar 10 kr/km", a: "y = 10x + 50" },
            { q: "Skärningspunkt med x-axeln för y = x - 4?", a: "x=4 (sätt y=0)" },
            { q: "K-värde om linjen är horisontell?", a: "0" },
            { q: "Hitta ekvation för linjen som går genom (0,3) och har k=2", a: "y = 2x + 3" }
        ]
    },

    {
        id: 8, klass: "Åk 9", area: "Algebra", emoji: "⚡",
        title: "Ekvationer, Olikheter & Proportioner",
        content: "Hantera flera uttryck och olikheter (>, <, >=). Förhållanden och skalor.",
        formulas: [
            "x < y \\implies -x > -y \\text{ (vänd tecknet vid mult / div med minus)}",
            "\\text{Skala} = \\frac{\\text{Bild}}{\\text{Verklighet}}"
        ],
        examples: [
            { problem: "Lös olikheten -2x > 6", solution: "x < -3 (dela med -2, vänd tecknet)" },
            { problem: "På karta skala 1:10000. 5 cm på kartan?", solution: "5 × 10000 = 50000 cm = 500 meter" },
        ],
        exercises: [
            { q: "Är x=4 en lösning till 3x - 2 > 15?", a: "Nej, 3(4)-2 = 10, och 10 är inte > 15." },
            { q: "Lös olikheten 5x + 10 < 30.", a: "5x < 20 → x < 4" },
            { q: "Skalan är 1:50 000. 2 cm på kartan är hur många km?", a: "100 000 cm = 1 km" },
            { q: "Areaskala förhållande mot längdskala?", a: "Areaskala = (Längdskala)²" },
            { q: "En ruta är 20 cm i verkligheten, ritad som 2 cm. Skala?", a: "2 / 20 = 1:10" },
            { q: "Lös: (x+4)/3 = x/2", a: "2(x+4) = 3x → 2x + 8 = 3x → x = 8" }
        ]
    },

    // ─── GYMNASIUM — Matte 1 ──────────────────────────
    {
        id: 9, klass: "Matte 1", area: "Potenser", emoji: "🔋",
        title: "Potenslagar & Grundpotensform",
        content: "Lagarna kring stora och små tal. Ett tal i grundpotensform är faktor melllan 1-9 multiplicerat med tiopotens.",
        formulas: [
            "a^x \\cdot a^y = a^{x+y}",
            "\\frac{a^x}{a^y} = a^{x-y}",
            "(a^x)^y = a^{xy}",
            "a^0 = 1 \text{ (a ≠ 0)}",
            "a^{-x} = \\frac{1}{a^x}",
        ],
        examples: [
            { problem: "Skriv 450 000 i grundpotensform.", solution: "4,5 \\cdot 10^5" },
            { problem: "Förenkla 3^5 \\cdot 3^{-2}", solution: "3^{5 + (-2)} = 3^3 = 27" },
        ],
        exercises: [
            { q: "Vad är x om 10^x = 10 000?", a: "4" },
            { q: "Skriv 0,00021 i grundpotensform.", a: "2,1 × 10⁻⁴" },
            { q: "Förenkla (2³)²", a: "2⁶ = 64" },
            { q: "Beräkna 5⁰", a: "1" },
            { q: "Skriv som en bråkdel: 4⁻²", a: "1 / 4² = 1/16" },
            { q: "Beräkna: 10⁵ / 10²", a: "10³ = 1000" }
        ]
    },

    {
        id: 10, klass: "Matte 1", area: "Geometri", emoji: "⭕",
        title: "Trigonometri i rätvinkliga",
        content: "Sinus, Cosinus och Tangens för att hitta vinklar och sidor.",
        formulas: [
            "\\sin(v) = \\frac{\\text{motstående}}{\\text{hypotenusa}}",
            "\\cos(v) = \\frac{\\text{närliggande}}{\\text{hypotenusa}}",
            "\\tan(v) = \\frac{\\text{motstående}}{\\text{närliggande}}"
        ],
        examples: [
            { problem: "Vinkel v = 30°, hyp = 10. Motstående katet (m)?", solution: "\\sin(30°) = \\frac{m}{10} \\Rightarrow m = 10 \\cdot 0,5 = 5" },
        ],
        exercises: [
            { q: "Tangens för en vinkel mäts med...?", a: "Motstående katet / Närliggande katet" },
            { q: "Vilket värde har sin(90°)?", a: "1" },
            { q: "En stege på 5 m lutar mot väggen. Vinkeln mot marken är 60°. Höjd?", a: "h = 5 × sin(60°) ≈ 4,33 m" },
            { q: "Man ska bestämma en vinkel. Vilken funktionsknapp på grafräknaren?", a: "Invers (sin⁻¹, cos⁻¹, tan⁻¹ / arcsin osv)" },
            { q: "Närliggande = 4, motstående = 3. Vinkel?", a: "v = tan⁻¹(3/4) ≈ 36,9°" },
            { q: "Vad är cos(60°)?", a: "0,5" }
        ]
    },

    // ─── GYMNASIUM — Matte 2 ──────────────────────────
    {
        id: 11, klass: "Matte 2", area: "Andragrads", emoji: "🎢",
        title: "PQ-formeln & Parabeln",
        content: "Andragradsekvationer och funktioner. Extrempunkter kallade vertex, symmetrilinje och algebraisk lösning.",
        formulas: [
            "x^2 + px + q = 0",
            "x = -\\frac{p}{2} \\pm \\sqrt{\\left(\\frac{p}{2}\\right)^2 - q} \\text{ (PQ-formeln)}",
            "Symmetrilinje: x = -\\frac{p}{2}",
            "\\text{Diskriminant: } D = \\left(\\frac{p}{2}\\right)^2 - q",
        ],
        examples: [
            { problem: "Lös: x² - 6x + 5 = 0", solution: "x = 3 \\pm \\sqrt{9-5} = 3 \\pm 2 \\Rightarrow x_1=5, x_2=1" },
            { problem: "Hitta symmetrilinjen till f(x) = x² + 4x - 2", solution: "x = -4/2 = -2" },
        ],
        exercises: [
            { q: "Lös ekvationen x² - 9 = 0", a: "x = ±3 (Behövs ej PQ, direkt rot-lösning)" },
            { q: "Symmetrilinjen för x² - 8x + 10?", a: "x = 4" },
            { q: "En parabel är f(x) = -x² + ... Har den max eller min?", a: "Maxpunkt ('ledsen mun' pga negativt x²)" },
            { q: "När finns det INGA reella lösningar (komplexa)?", a: "När talet under rottecknet (diskriminanten) i PQ är negativt" },
            { q: "Använd PQ: x² + 2x - 8 = 0", a: "x = -1 ± √(1+8) = -1 ± 3 → x₁=2, x₂=-4" },
            { q: "Vad representerar lösningarna i ett koordinatsystem?", a: "På vilka x-koordinater grafen (parabeln) skär x-axeln." }
        ]
    },

    {
        id: 12, klass: "Matte 2", area: "Logaritmer", emoji: "🧮",
        title: "Logaritmer & Exponentialekvationer",
        content: "Logaritmer, specifikt tiologaritmen (lg). Lösning av tillväxt när exponenten 'x' är okänd.",
        formulas: [
            "10^{\\lg x} = x \\text{ för } x > 0",
            "\\lg(10^x) = x",
            "\\lg(ab) = \\lg(a) + \\lg(b)",
            "\\lg(a^y) = y \\cdot \\lg(a)",
        ],
        examples: [
            { problem: "Lös 10^x = 50", solution: "x = \\lg(50) \\approx 1,7" },
            { problem: "Lös 5^x = 20", solution: "x\\cdot\\lg(5) = \\lg(20) \\Rightarrow x = \\frac{\\lg 20}{\\lg 5} \\approx 1,86" },
        ],
        exercises: [
            { q: "Vad är lg(1000)?", a: "3 (eftersom 10³ = 1000)" },
            { q: "Förenkla: lg(10)+lg(100)", a: "1 + 2 = 3" },
            { q: "Skriv med basen 10: 25", a: "10^(lg 25)" },
            { q: "Lös ekvationen: 3 × 1,5^x = 12", a: "1,5^x = 4 → x × lg(1,5) = lg(4) → x = lg(4)/lg(1,5) ≈ 3,42" },
            { q: "Ränta 4% om året, när fördubblas pengarna?", a: "1,04^x = 2 → x = lg(2)/lg(1.04) ≈ 17,6 år" },
            { q: "Ge formeln för minskning med 10% över tid t", a: "y = C × 0,90^t" }
        ]
    },

    // ─── GYMNASIUM — Matte 3 ──────────────────────────
    {
        id: 13, klass: "Matte 3", area: "Derivata 1", emoji: "∂",
        title: "Derivata och förändringshastighet",
        content: "Derivatan är funktionen för hur lutningen (tangenten) förändras i varje momentan punkt = y'. Polynom derivering.",
        formulas: [
            "\\text{Lutning sekant} = \\dfrac{f(x_2) - f(x_1)}{x_2 - x_1}",
            "f'(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}",
            "f(x) = kx^n \\implies f'(x) = kn \\cdot x^{n-1}",
            "f(x) = C \\implies f'(x) = 0"
        ],
        examples: [
            { problem: "Derivera f(x) = 3x^4 - 2x^2 + 5", solution: "f'(x) = 12x^3 - 4x + 0" },
            { problem: "Tangentens ekvation om f(x)=x² i x=2", solution: "f(2)=4, f'(2)=4. y = kx+m \\Rightarrow 4 = 4(2)+m \\Rightarrow m=-4. Svar: y=4x-4" },
        ],
        exercises: [
            { q: "Derivera f(x) = 5x³ - x", a: "f'(x) = 15x² - 1" },
            { q: "Vilken enhet har derivatan om y(t) beskriver sträcka (i meter) över tid t (sek)?", a: "Meter per sekund (hastighet), m/s" },
            { q: "Vad innebär det geometriskt om f'(3) = 0?", a: "Tangenten i x=3 är horisontell (möjlig extrempunkt)" },
            { q: "Hitta x där y' = 0 för y = x² - 6x", a: "y' = 2x - 6 = 0 → x = 3" },
            { q: "Derivera f(x) = 7/x", a: "f(x)=7x⁻¹. f'(x)=-7x⁻² = -7/x²" },
            { q: "När f'(x) > 0, vad gör funktionen?", a: "Den är växande" }
        ]
    },

    {
        id: 14, klass: "Matte 3", area: "Integraler", emoji: "∫",
        title: "Primitiva funktioner & Integraler",
        content: "Integralen beräknar ytan mellan funktionen och x-axeln. Definition bygger på den primitiva funktionen F(x).",
        formulas: [
            "F'(x) = f(x)",
            "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C",
            "\\int_a^b f(x) dx = F(b) - F(a) \\text{ (Fundamentalsatsen)}",
            "\\text{Area} = \\int_{a}^{b} (\\text{Övre funktion} - \\text{Undre funktion}) dx",
        ],
        examples: [
            { problem: "Primitiv funktion till f(x) = 2x + 4", solution: "F(x) = x^2 + 4x + C" },
            { problem: "Bestämd integral från 0 till 2 för 3x²", solution: "\\int_0^2 3x^2 = [x^3] = 2^3 - 0^3 = 8" },
        ],
        exercises: [
            { q: "Ge ALLA primitiva funktioner till f(x) = 6x²", a: "F(x) = 2x³ + C" },
            { q: "Vilken area beräknas med integralen ∫ (x) dx från 0 till 4?", a: "En rätvinklig triangel med bas 4 och höjd 4. Area: (4×4)/2 = 8. (F(x) = [x²/2] = 16/2 = 8)" },
            { q: "Lös integralen av e^x", a: "e^x + C" },
            { q: "Primitiv till f(x) = 1/x (x>0)?", a: "F(x) = ln(x) + C" },
            { q: "I ett y-t-diagram visas hastighet under tid. Vad ger integralen av funktionen?", a: "Den totala sträckan" },
            { q: "Om upper gräns är samma som lower gräns på integralen?", a: "Resultatet blir 0" }
        ]
    },

    // ─── GYMNASIUM — Matte 4 ──────────────────────────
    {
        id: 15, klass: "Matte 4", area: "Trigonometri II", emoji: "🌊",
        title: "Avancerad Trigonometri",
        content: "De trigonometriska funktionerna, vinkelmätning med radianer, ekvationer, enhetscirkelns svårare identiteter.",
        formulas: [
            "1 \\text{ varv} = 360^\\circ = 2\\pi \\text{ radianer}",
            "\\sin(x) = \\sin(\\pi - x) \\text{ (Symmetri sinus)}",
            "\\cos(x) = \\cos(-x) \\text{ (Symmetri cosinus)}",
            "\\sin^2 x + \\cos^2 x = 1 \\text{ (Trigonometriska ettan)}",
            "y = A \\sin(kx + v) + d \\implies \\text{Amplitud är A, period är 2π/k, m.v. är d}",
        ],
        examples: [
            { problem: "Lös sin(x) = 0,5 (i första varvet grader)", solution: "x_1 = 30^\\circ, x_2 = 180^\\circ - 30^\\circ = 150^\\circ" },
            { problem: "Gör om 90 grader till radianer.", solution: "90 \\cdot \\dfrac{\\pi}{180} = \\dfrac{\\pi}{2}" },
        ],
        exercises: [
            { q: "Vad är x om cos(x) = 1, och 0 ≤ x < 360°", a: "x = 0°" },
            { q: "Lös i radianer: sin(x) = 0", a: "x = n×π" },
            { q: "Derivera y = cos(3x)", a: "y' = -3·sin(3x) (Kedjeregeln)" },
            { q: "Bestäm max och min för: y = 2·sin(x) + 5", a: "Max = 5+2 = 7, Min = 5-2 = 3" },
            { q: "Vad gör addition och subtraktionformlerna?", a: "Bryter ut ex: sin(a+b) = sin(a)cos(b)+cos(a)sin(b)" },
            { q: "Derivatan av tan(x)?", a: "1 / cos²(x)" }
        ]
    },

    {
        id: 16, klass: "Matte 4", area: "Komplexa", emoji: "🌀",
        title: "Komplexa tal och rötter",
        content: "När det är minus under roten ur går vi över till planet för komplexa tal genom att införa i (den imaginära enheten).",
        formulas: [
            "i^2 = -1",
            "z = a + bi",
            "\\text{Polär form: } z = r( \\cos(v) + i \\cdot \\sin(v) ) \\text{ eller } re^{iv}",
            "\\text{de Moivres formel: } z^n = r^n( \\cos(nv) + i \\cdot \\sin(nv) )"
        ],
        examples: [
            { problem: "Beräkna i^4", solution: "i^4 = (i^2)^2 = (-1)^2 = 1" },
            { problem: "Roten ur i en ekvation x² = -9", solution: "x = \\pm \\sqrt{-9} = \\pm 3i" },
        ],
        exercises: [
            { q: "Skriv det komplexa talet z = 3 + 4i absolutbelopp |z|", a: "√(3² + 4²) = √25 = 5" },
            { q: "Om z = 2 + 5i, vad är dess konjugat z̄?", a: "2 - 5i" },
            { q: "Multiplicera (1 + i)(1 - i)", a: "1² - i² = 1 - (-1) = 2" },
            { q: "Var ligger z = 5i i det komplexa talplanet?", a: "På positiva imaginära y-axeln vid värde 5" },
            { q: "Med de Moivre: räkna ut (1(cos(90°) + i sin(90°)))²", a: "1²(cos(180) + i sin(180)) = -1" },
            { q: "Den reella delen av 7 - 2i?", a: "7" }
        ]
    }
];
