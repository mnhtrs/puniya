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
            { problem: "Med hur nhiều % ökar 40→52?", solution: "\\dfrac{12}{40}\\cdot100=30\\%" },
        ],
        exercises: [
            { q: "250 kr ökar med 20%. Nytt pris?", a: "250·1,2=300 kr" },
            { q: "Vad là 35% av 2400?", a: "2400·0,35=840" },
            { q: "Pris sjunker 40→28. Hur nhiều %?", a: "(28−40)/40·100=−30%" },
        ]
    },

    {
        id: 3, klass: "Åk 7", area: "Algebra", emoji: "📐",
        title: "Algebra: uttryck och ekvationer",
        content: "Bokstavsbeteckningar representerar okända tal. Likhetstecknet innebär balans. Ekvationer löses med ekvivalenta operationer på båda sidor.",
        formulas: [
            "a(b+c)=ab+ac\\quad\\text{(distributiv lag)}",
            "(a+b)^2=a^2+2ab+b^2",
            "(a-b)^2=a^2-2ab+b^2",
            "(a+b)(a-b)=a^2-b^2\\quad\\text{(konj.regeln)}",
            "ax+b=c\\;\\Rightarrow\\; x=\\dfrac{c-b}{a}",
        ],
        examples: [
            { problem: "Lös: 3x−7=11", solution: "3x=18\\;\\Rightarrow\\; x=6" },
            { problem: "Förenkla: (x+3)^2−9", solution: "x^2+6x+9-9=x^2+6x" },
        ],
        exercises: [
            { q: "Lös: 5x+4=29", a: "x=5" },
            { q: "Expandera: (2x−3)^2", a: "4x²−12x+9" },
            { q: "Faktorisera: x²−16", a: "(x+4)(x−4)" },
        ]
    },

    // ─── ÅK 8 ──────────────────────────────────────────
    {
        id: 4, klass: "Åk 8", area: "Taluppfattning", emoji: "∞",
        title: "Rationella och irrationella tal",
        content: "Rationella tal skrivs p/q (q≠0) med periodisk decimal. Irrationella tal som √2 och π har icke-periodisk, icke-ändlig decimalutveckling. Tillsammans bildar de ℝ.",
        formulas: [
            "\\mathbb{Q}=\\left\\{\\dfrac{p}{q}\\mid p,q\\in\\mathbb{Z},\\,q\\ne0\\right\\}",
            "\\mathbb{R}=\\mathbb{Q}\\cup(\\mathbb{R}\\setminus\\mathbb{Q})",
            "\\sqrt{a\\cdot b}=\\sqrt{a}\\cdot\\sqrt{b},\\quad a,b\\ge0",
            "\\sqrt{\\dfrac{a}{b}}=\\dfrac{\\sqrt{a}}{\\sqrt{b}}",
        ],
        examples: [
            { problem: "Klassificera 0{,}142857\\overline{142857}", solution: "Rationellt – det là \\tfrac{1}{7}" },
            { problem: "Förenkla \\sqrt{72}", solution: "\\sqrt{36\\cdot2}=6\\sqrt{2}\\text{ (irrationellt)}" },
        ],
        exercises: [
            { q: "Skriv 0,\\overline{6} som bråk", a: "2/3" },
            { q: "Förenkla √200", a: "10√2" },
            { q: "Är √4 rationellt?", a: "Ja, √4=2" },
        ]
    },

    {
        id: 5, klass: "Åk 8", area: "Geometri", emoji: "📏",
        title: "Pythagoras sats & avstånd",
        content: "I en rätvinklig triangel là summan av katetkvadraten lika med hypotenusans kvadrat. Används för avstånd i koordinatsystemet.",
        formulas: [
            "a^2+b^2=c^2\\quad(c=\\text{hypotenusa})",
            "c=\\sqrt{a^2+b^2}",
            "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}",
            "\\text{Area triangel}=\\tfrac{1}{2}bh",
            "\\text{Area trapets}=\\tfrac{1}{2}(a+b)h",
        ],
        examples: [
            { problem: "Kateterna 5 och 12. Hypotenusa?", solution: "c=\\sqrt{25+144}=\\sqrt{169}=13" },
            { problem: "Avstånd (1,2)→(4,6)", solution: "d=\\sqrt{9+16}=5" },
        ],
        exercises: [
            { q: "Kateterna 8 och 15. Hypotenusa?", a: "17" },
            { q: "Avstånd (0,0)→(3,4)", a: "5" },
            { q: "Kontrollera: 7,24,25 rätvinkliga?", a: "7²+24²=49+576=625=25² ✓" },
        ]
    },

    {
        id: 6, klass: "Åk 8", area: "Statistik", emoji: "📊",
        title: "Statistik & lägesmått",
        content: "Lägesmått beskriver datamaterialets centrum. Spridningsmått visar variationen. Stapeldiagram, histogram och lådagram används för visualisering.",
        formulas: [
            "\\bar{x}=\\dfrac{\\sum_{i=1}^n x_i}{n}",
            "s=\\sqrt{\\dfrac{\\sum(x_i-\\bar{x})^2}{n-1}}",
            "\\text{Variationsbredd}=x_{\\max}-x_{\\min}",
            "Q_1=\\text{25:e percentilen},\\quad Q_3=\\text{75:e percentilen}",
            "\\text{IQR}=Q_3-Q_1",
        ],
        examples: [
            { problem: "Data: 2,5,5,7,8,9,11", solution: "\\bar{x}=47/7\\approx6{,}71\\;|\\;\\text{Median}=7\\;|\\;\\text{Typvärde}=5" },
        ],
        exercises: [
            { q: "Medelvärde av 4,8,6,2,10", a: "30/5=6" },
            { q: "Median av 3,1,4,1,5,9,2,6", a: "Sorterat: 1,1,2,3,4,5,6,9 → (3+4)/2=3,5" },
            { q: "Variationsbredd av 12,7,15,3,9", a: "15−3=12" },
        ]
    },

    {
        id: 7, klass: "Åk 8", area: "Sannolikhet", emoji: "🎲",
        title: "Sannolikhet & kombinatorik",
        content: "Sannolikhet P(A) = gynnsamma/möjliga utfall. Multiplikationsprincipen räknar antal sätt. Permutationer ordnar, kombinationer väljer.",
        formulas: [
            "P(A)=\\dfrac{g}{m},\\quad 0\\le P(A)\\le1",
            "P(A')=1-P(A)",
            "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)",
            "P(A\\cap B)=P(A)\\cdot P(B)\\quad(\\text{oberoende})",
            "P_n=n!\\quad C(n,k)=\\dfrac{n!}{k!(n-k)!}",
        ],
        examples: [
            { problem: "Två tärningar. P(summa=7)?", solution: "6 gynnsamma av 36\\;\\Rightarrow\\; P=\\tfrac{1}{6}" },
            { problem: "C(5,2)", solution: "\\dfrac{5!}{2!3!}=10" },
        ],
        exercises: [
            { q: "P(hjärter ur vanlig kortlek)", a: "13/52=1/4" },
            { q: "P(minst 1 krona vid 2 myntkast)", a: "1−(1/2)²=3/4" },
            { q: "Hur nhiều sätt ordna 5 böcker?", a: "5!=120" },
        ]
    },

    // ─── ÅK 9 ──────────────────────────────────────────
    {
        id: 8, klass: "Åk 9", area: "Algebra", emoji: "⚡",
        title: "Andragradsekvationer",
        content: "Andragradsekvationer ax²+bx+c=0 löses med lösningsformeln, pq-formeln, kvadratkomplettering eller faktorisering. Diskriminanten D avgör lösningarnas antal.",
        formulas: [
            "x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a},\\quad D=b^2-4ac",
            "D>0:\\;2\\;\\text{lösn}\\quad D=0:\\;1\\;\\text{(dubbelrot)}\\quad D<0:\\;\\text{inga reella}",
            "\\text{pq-formel}:\\; x^2+px+q=0\\;\\Rightarrow\\; x=-\\tfrac{p}{2}\\pm\\sqrt{\\left(\\tfrac{p}{2}\\right)^2-q}",
            "\\text{Vieta: }x_1+x_2=-\\tfrac{b}{a},\\quad x_1x_2=\\tfrac{c}{a}",
            "\\text{Komplettera: }x^2+px=\\left(x+\\tfrac{p}{2}\\right)^2-\\left(\\tfrac{p}{2}\\right)^2",
        ],
        examples: [
            { problem: "Lös 2x^2-4x-6=0", solution: "x^2-2x-3=0\\;\\Rightarrow\\;D=4+12=16\\;\\Rightarrow\\;x=\\tfrac{2\\pm4}{2}\\;\\Rightarrow\\; x=3\\text{ eller }-1" },
            { problem: "Vieta: x_1+x_2=5,\\;x_1x_2=6", solution: "x^2-5x+6=0\\;\\Rightarrow\\;(x-2)(x-3)=0" },
        ],
        exercises: [
            { q: "Lös: x²−7x+12=0", a: "x=3 eller x=4" },
            { q: "Lös: x²+4x+5=0", a: "D=−4<0, inga reella lösningar" },
            { q: "Lös: 3x²−12=0", a: "x=±2" },
        ]
    },

    {
        id: 9, klass: "Åk 9", area: "Geometri", emoji: "🔵",
        title: "Cirkelgeometri",
        content: "Cirkelns geometri styrs av π. Inskrivna vinkelsatsen, tangenter och sekanter là centrala begrepp i Åk 9-geometrin.",
        formulas: [
            "C=2\\pi r,\\quad A=\\pi r^2",
            "\\text{Sektorarea}=\\dfrac{v}{360^\\circ}\\cdot\\pi r^2",
            "\\text{Båglängd}=\\dfrac{v}{360^\\circ}\\cdot2\\pi r",
            "\\text{Inskrivna vinkel}=\\tfrac{1}{2}\\cdot\\text{mittpunktsvinkel}",
            "\\text{Tangent}\\perp\\text{radius i tangentpunkten}",
        ],
        examples: [
            { problem: "r=8, v=135°. Sektorarea?", solution: "\\tfrac{135}{360}\\cdot\\pi\\cdot64=24\\pi\\approx75{,}4" },
            { problem: "Inskrivna vinkel=40°. Mittpunktsvinkel?", solution: "80°" },
        ],
        exercises: [
            { q: "Omkrets av cirkel d=14", a: "14π≈44,0" },
            { q: "Sektor r=6, v=60°. Båglängd?", a: "2π≈6,28" },
            { q: "A=100π. Radie?", a: "r=10" },
        ]
    },

    {
        id: 10, klass: "Åk 9", area: "Funktioner", emoji: "📈",
        title: "Kvadratiska funktioner & parablar",
        content: "f(x)=ax²+bx+c là en parabel. Vertex là extrempunkten. Symmetriaxeln skär vertex lodrätt. Nollställen ges av andragradsekvationen.",
        formulas: [
            "f(x)=ax^2+bx+c,\\quad a\\ne0",
            "x_v=-\\dfrac{b}{2a},\\quad y_v=f(x_v)",
            "\\text{Symmetriaxel: }x=-\\dfrac{b}{2a}",
            "\\text{Standardform: }f(x)=a(x-h)^2+k\\;\\text{(vertex }(h,k)\\text{)}",
            "a>0:\\;\\text{parabel uppåt (min)}\\quad a<0:\\;\\text{nedåt (max)}",
        ],
        examples: [
            { problem: "f(x)=x^2-4x+3. Vertex?", solution: "x_v=2,\\;y_v=4-8+3=-1\\;\\Rightarrow\\;(2,-1)" },
            { problem: "Standardform för x^2-6x+5", solution: "(x-3)^2-4,\\;\\text{vertex }(3,-4)" },
        ],
        exercises: [
            { q: "Vertex: f(x)=−x²+4x−1", a: "x=2, y=3 → (2,3)" },
            { q: "Nollst. f(x)=x²−5x+6", a: "x=2 eller x=3" },
            { q: "Skär y-axeln: f(x)=3x²−2x+7", a: "(0,7)" },
        ]
    },

    {
        id: 11, klass: "Åk 9", area: "Samband", emoji: "🔗",
        title: "Proportionalitet & ränta",
        content: "Direkt proportionalitet: y=kx. Invers: y=k/x. Ränta-på-ränta là exponentiell tillväxt med förändringsfaktor.",
        formulas: [
            "y=kx\\;\\Leftrightarrow\\;\\dfrac{y}{x}=k\\;(\\text{direkt})",
            "xy=k\\;(\\text{invers})",
            "K_n=K_0\\cdot\\left(1+\\dfrac{r}{100}\\right)^n",
            "\\text{Ökning }p\\%:\\;\\times(1+\\tfrac{p}{100})\\quad\\text{Minskning: }\\times(1-\\tfrac{p}{100})",
        ],
        examples: [
            { problem: "5000\\text{ kr, }4\\%\\text{ i 3 år}", solution: "K_3=5000\\cdot1{,}04^3\\approx5624\\text{ kr}" },
        ],
        exercises: [
            { q: "Minska 2000 kr med 30%", a: "2000·0,70=1400 kr" },
            { q: "8000 kr, 5% ränta, 2 år, ränta-på-ränta", a: "8000·1,05²=8820 kr" },
            { q: "Med hur nhiều % ökar 40→52?", a: "30%" },
        ]
    },

    // ─── GYMNASIUM — Matte 1c ──────────────────────────
    {
        id: 12, klass: "Matte 1", area: "Potenser & log", emoji: "🔣",
        title: "Potenser, logaritmer & exponentialfunktioner",
        content: "Potensregler och logaritmregler là inverser. Exponentialfunktioner modellerar tillväxt och sönderfall. Naturliga logaritmen ln och e≈2,718 là centrala.",
        formulas: [
            "a^m\\cdot a^n=a^{m+n},\\quad\\dfrac{a^m}{a^n}=a^{m-n},\\quad(a^m)^n=a^{mn}",
            "a^0=1,\\quad a^{-n}=\\dfrac{1}{a^n},\\quad a^{1/n}=\\sqrt[n]{a}",
            "\\log(ab)=\\log a+\\log b,\\quad\\log(a^n)=n\\log a",
            "\\log_a b=\\dfrac{\\lg b}{\\lg a}\\;(\\text{basbyte})",
            "e^{\\ln x}=x,\\quad\\ln(e^x)=x",
        ],
        examples: [
            { problem: "Lös:\\; 3^{2x-1}=27", solution: "3^{2x-1}=3^3\\;\\Rightarrow\\;2x-1=3\\;\\Rightarrow\\; x=2" },
            { problem: "Lös:\\;\\ln(x+2)=3", solution: "x+2=e^3\\approx20{,}1\\;\\Rightarrow\\; x\\approx18{,}1" },
        ],
        exercises: [
            { q: "Förenkla (2³)²÷2⁴", a: "2²=4" },
            { q: "Lös: 2^x=128", a: "x=7" },
            { q: "Lös: lg x=2,5", a: "x=10^{2,5}≈316" },
        ]
    },

    {
        id: 13, klass: "Matte 1", area: "Linjär algebra", emoji: "📉",
        title: "Linjära ekvationssystem",
        content: "System av linjära ekvationer löses med substitution, addition/subtraktion eller matriser. Geometriskt: skärning av linjer i planet.",
        formulas: [
            "\\begin{cases}a_1x+b_1y=c_1\\\\a_2x+b_2y=c_2\\end{cases}",
            "\\text{Substitution: lös en ekvation för x, substituera}",
            "\\text{Addition: multiplicera så att en variabel elimineras}",
            "\\text{Unik lösn.: linjerna skär}\\quad\\text{Inf.: sammanfaller}\\quad\\text{Ingen: parallella}",
        ],
        examples: [
            { problem: "\\begin{cases}x+y=5\\\\x-y=1\\end{cases}", solution: "\\text{Addition: }2x=6\\;\\Rightarrow\\; x=3,\\;y=2" },
            { problem: "\\begin{cases}2x+3y=12\\\\x-y=1\\end{cases}", solution: "x=y+1:\\;2(y+1)+3y=12\\;\\Rightarrow\\;5y=10\\;\\Rightarrow\\;y=2,\\;x=3" },
        ],
        exercises: [
            { q: "x+2y=8, x−y=2", a: "x=4, y=2" },
            { q: "3x+y=10, x+2y=5", a: "x=3, y=1" },
            { q: "Hur nhiều lösningar: 2x+4y=6 och x+2y=4?", a: "Inga (parallella linjer)" },
        ]
    },

    // ─── GYMNASIUM — Matte 2 ──────────────────────────
    {
        id: 14, klass: "Matte 2", area: "Trigonometri", emoji: "📐",
        title: "Trigonometri & enhetscirkeln",
        content: "Enhetscirkeln definierar sin, cos, tan för tất cả vinklar. Additionsformler, dubbelvinklar och trigonometriska identiteter.",
        formulas: [
            "\\sin^2v+\\cos^2v=1\\;(\\text{Pythagoreisk identitet})",
            "\\tan v=\\dfrac{\\sin v}{\\cos v}",
            "\\sin(A\\pm B)=\\sin A\\cos B\\pm\\cos A\\sin B",
            "\\cos(A\\pm B)=\\cos A\\cos B\\mp\\sin A\\sin B",
            "\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}=2R\\;(\\text{sinusregeln})",
            "c^2=a^2+b^2-2ab\\cos C\\;(\\text{cosinusregeln})",
            "A_{\\triangle}=\\tfrac{1}{2}ab\\sin C",
        ],
        examples: [
            { problem: "Exakt: \\sin 120°", solution: "\\sin(180°-60°)=\\sin60°=\\dfrac{\\sqrt{3}}{2}" },
            { problem: "a=7,b=9,C=50°.\\;c=?", solution: "c^2=49+81-126\\cos50°\\approx78\\;\\Rightarrow\\; c\\approx8{,}83" },
        ],
        exercises: [
            { q: "Exakt: cos 135°", a: "−√2/2" },
            { q: "tan 30°", a: "1/√3=√3/3" },
            { q: "Area: a=8, b=5, C=30°", a: "½·40·sin30°=10" },
        ]
    },

    {
        id: 15, klass: "Matte 2", area: "Komplexa tal", emoji: "🌀",
        title: "Komplexa tal",
        content: "Komplexa tal utvidgar de reella med den imaginära enheten i där i²=−1. De ger luôn lösningar på andragradsekvationer.",
        formulas: [
            "i^2=-1,\\quad z=a+bi\\;(a,b\\in\\mathbb{R})",
            "|z|=\\sqrt{a^2+b^2}\\;(\\text{modulen})",
            "\\bar{z}=a-bi\\;(\\text{konjugat})",
            "z_1\\cdot z_2=(a+bi)(c+di)=(ac-bd)+(ad+bc)i",
            "\\dfrac{z_1}{z_2}=\\dfrac{z_1\\bar{z_2}}{|z_2|^2}",
            "\\text{Pol.form: }z=r(\\cos\\theta+i\\sin\\theta),\\;r=|z|",
        ],
        examples: [
            { problem: "(2+3i)(1-i)", solution: "2-2i+3i-3i^2=2+i+3=5+i" },
            { problem: "x^2+2x+5=0", solution: "D=-16\\;\\Rightarrow\\; x=\\dfrac{-2\\pm4i}{2}=-1\\pm2i" },
        ],
        exercises: [
            { q: "|3+4i|", a: "5" },
            { q: "(1+i)²", a: "2i" },
            { q: "Konjugat av 3−5i", a: "3+5i" },
        ]
    },

    // ─── GYMNASIUM — Matte 3 ──────────────────────────
    {
        id: 16, klass: "Matte 3", area: "Derivata", emoji: "∂",
        title: "Derivata: definition & regler",
        content: "Derivatan f′(x) là tangentlutningen och momentan förändringshastighet. Tất cả standardregler härleds ur gränsvärdet av differenskvoten.",
        formulas: [
            "f'(x)=\\lim_{h\\to0}\\dfrac{f(x+h)-f(x)}{h}",
            "(x^n)'=nx^{n-1},\\quad(e^x)'=e^x,\\quad(\\ln x)'=\\dfrac{1}{x}",
            "(\\sin x)'=\\cos x,\\quad(\\cos x)'=-\\sin x,\\quad(\\tan x)'=\\dfrac{1}{\\cos^2 x}",
            "(fg)'=f'g+fg'\\;(\\text{produktregel})",
            "\\left(\\dfrac{f}{g}\\right)'=\\dfrac{f'g-fg'}{g^2}\\;(\\text{kvotregeln})",
            "(f(g(x)))'=f'(g(x))\\cdot g'(x)\\;(\\text{kedjeregeln})",
        ],
        examples: [
            { problem: "h(x)=x^3\\ln x", solution: "h'=3x^2\\ln x+x^3\\cdot\\dfrac{1}{x}=x^2(3\\ln x+1)" },
        ],
        exercises: [
            { q: "Derivera: 5x⁴−3x²+7", a: "20x³−6x" },
            { q: "Derivera: e^{2x}", a: "2e^{2x}" },
            { q: "Derivera: ln(x²+1)", a: "2x/(x²+1)" },
        ]
    },

    {
        id: 17, klass: "Matte 3", area: "Extremvärden", emoji: "🔍",
        title: "Derivatans tillämpningar & optimering",
        content: "f′(x)=0 ger stationära punkter. Teckentabellen avgör max/min/terrasspunkt. f″(x) avgör konvexitet. Optimering maximerar/minimerar en målfunktion.",
        formulas: [
            "f'(a)=0:\\;\\text{stationär punkt}",
            "f''(a)>0:\\;\\text{lokalt min}\\quad f''(a)<0:\\;\\text{lokalt max}",
            "f''(x)>0\\;\\text{(konvex)}\\quad f''(x)<0\\;\\text{(konkav)}",
            "\\text{Inflexionspunkt: }f''\\text{ byter tecken}",
        ],
        examples: [
            { problem: "f(x)=x^3-3x+1.\\;\\text{Extremvärden?}", solution: "f'=3x^2-3=0\\;\\Rightarrow\\; x=\\pm1\\;|\\; f''(1)=6>0\\;\\text{min}\\;|\\; f''(-1)=-6<0\\;\\text{max}" },
            { problem: "Max area rektangel med perimeter 20", solution: "A=x(10-x),\\; A'=10-2x=0\\;\\Rightarrow\\; x=5\\;\\Rightarrow\\; A_{\\max}=25" },
        ],
        exercises: [
            { q: "f(x)=−x²+4x−1. Max eller min?", a: "Max (2,3) ty f''=−2<0" },
            { q: "Steg för kurvsketsning?", a: "Def.mängd→nollst.→f'=0→teckentabell→skiss" },
            { q: "Min av f(x)=x²−6x", a: "(3,−9)" },
        ]
    },

    {
        id: 18, klass: "Matte 3", area: "Integraler", emoji: "∫",
        title: "Integralkalkyl",
        content: "Primitiv funktion F: F′=f. Analysens fundamentalsats kopplar derivata och integral. Bestämd integral ger area (med tecken) under kurvan.",
        formulas: [
            "\\int x^n\\,dx=\\dfrac{x^{n+1}}{n+1}+C\\;(n\\ne-1)",
            "\\int e^x\\,dx=e^x+C,\\quad\\int\\dfrac{1}{x}\\,dx=\\ln|x|+C",
            "\\int\\sin x\\,dx=-\\cos x+C,\\quad\\int\\cos x\\,dx=\\sin x+C",
            "\\int_a^b f(x)\\,dx=\\Big[F(x)\\Big]_a^b=F(b)-F(a)",
            "\\text{Area}=\\int_a^b|f(x)-g(x)|\\,dx",
        ],
        examples: [
            { problem: "\\int_0^3(x^2+2)\\,dx", solution: "\\Big[\\tfrac{x^3}{3}+2x\\Big]_0^3=9+6=15" },
            { problem: "Area: f=x^2,\\;g=x,\\;0\\le x\\le1", solution: "\\int_0^1(x-x^2)dx=\\tfrac{1}{2}-\\tfrac{1}{3}=\\tfrac{1}{6}" },
        ],
        exercises: [
            { q: "∫(3x²−4x+1)dx", a: "x³−2x²+x+C" },
            { q: "∫₀^π sin x dx", a: "2" },
            { q: "∫₁² (2x+eˣ)dx", a: "3+e²−e" },
        ]
    },

    // ─── GYMNASIUM — Matte 4/5 (Spec.) ──────────────
    {
        id: 19, klass: "Matte 4", area: "Vektorer", emoji: "➡️",
        title: "Vektorer i 2D och 3D",
        content: "Vektorer har storlek och riktning. Skalärprodukt mäter vinkel. Vektorprodukt ger normalvektor. Centralt i fysik och linjär algebra.",
        formulas: [
            "\\mathbf{a}+\\mathbf{b}=(a_1+b_1,\\,a_2+b_2,\\,a_3+b_3)",
            "|\\mathbf{a}|=\\sqrt{a_1^2+a_2^2+a_3^2}",
            "\\mathbf{a}\\cdot\\mathbf{b}=a_1b_1+a_2b_2+a_3b_3=|\\mathbf{a}||\\mathbf{b}|\\cos\\theta",
            "\\mathbf{a}\\perp\\mathbf{b}\\;\\Leftrightarrow\\;\\mathbf{a}\\cdot\\mathbf{b}=0",
            "\\mathbf{a}\\times\\mathbf{b}=\\det\\begin{pmatrix}\\mathbf{i}&\\mathbf{j}&\\mathbf{k}\\\\a_1&a_2&a_3\\\\b_1&b_2&b_3\\end{pmatrix}",
            "\\text{Proj}_{\\mathbf{b}}\\mathbf{a}=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{b}|^2}\\mathbf{b}",
        ],
        examples: [
            { problem: "\\mathbf{a}=(2,1,-3),\\;\\mathbf{b}=(1,4,2).\\;\\mathbf{a}\\cdot\\mathbf{b}?", solution: "2+4-6=0\\;\\Rightarrow\\;\\mathbf{a}\\perp\\mathbf{b}" },
        ],
        exercises: [
            { q: "a=(1,2), b=(3,−1). a+2b?", a: "(7,0)" },
            { q: "|a| för a=(1,2,2)", a: "3" },
            { q: "a=(2,3), b=(−3,2) ortogonala?", a: "a·b=−6+6=0, ja" },
        ]
    },

    {
        id: 20, klass: "Matte 4", area: "Matriser", emoji: "🔲",
        title: "Matriser & linjär algebra",
        content: "Matriser representerar linjära avbildningar och ekvationssystem. Determinanten avgör om en matris là inverterbar.",
        formulas: [
            "A\\cdot B:\\;(AB)_{ij}=\\sum_k A_{ik}B_{kj}",
            "\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc",
            "A^{-1}=\\dfrac{1}{\\det A}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}\\;(2\\times2)",
            "A\\mathbf{x}=\\mathbf{b}\\;\\Rightarrow\\;\\mathbf{x}=A^{-1}\\mathbf{b}\\;(\\text{om }\\det A\\ne0)",
            "\\text{Egenvärde: }A\\mathbf{v}=\\lambda\\mathbf{v}\\;\\Rightarrow\\;\\det(A-\\lambda I)=0",
        ],
        examples: [
            { problem: "A=\\begin{pmatrix}2&1\\\\5&3\\end{pmatrix}.\\;A^{-1}?", solution: "\\det=1\\;\\Rightarrow\\; A^{-1}=\\begin{pmatrix}3&-1\\\\-5&2\\end{pmatrix}" },
        ],
        exercises: [
            { q: "det[[3,1],[2,4]]", a: "12−2=10" },
            { q: "AB för A=[[1,0],[0,2]], B=[[3,1],[0,4]]", a: "[[3,1],[0,8]]" },
            { q: "Lös Ax=b: A=[[2,1],[1,1]], b=[3,2]", a: "x=1, y=1" },
        ]
    },

    {
        id: 21, klass: "Matte 5", area: "Diff.ekvationer", emoji: "〜",
        title: "Differentialekvationer",
        content: "ODE beskriver samband giữa funktion och derivata. Används för modellering av tillväxt, sönderfall, oscillationer.",
        formulas: [
            "y'=ky\\;\\Rightarrow\\; y=Ce^{kt}\\;(\\text{exp. tillväxt/sönderfall})",
            "y'+p(x)y=q(x)\\;(\\text{linjär 1:a ordning})",
            "\\text{Integrerande faktor: }\\mu=e^{\\int p\\,dx}",
            "y''+py'+qy=0:\\;y=e^{rx},\\;r^2+pr+q=0",
            "\\text{Halveringstid: }t_{1/2}=\\dfrac{\\ln2}{k}",
        ],
        exercises: [
            { q: "y'=−2y, y(0)=10. y(3)=?", a: "10e^{−6}≈0,025" },
            { q: "Tillväxt k=0,2. Fördubblingstid?", a: "ln2/0,2≈3,47" },
            { q: "Lös: y'=4y, y(0)=1", a: "y=e^{4t}" },
        ]
    },

    {
        id: 22, klass: "Matte 5", area: "Serier", emoji: "∑",
        title: "Talföljder, serier & gränsvärden",
        content: "Aritmetiska och geometriska talföljder. Summor, gränsvärden för geometriska serier. Gränsvärden och kontinuitet.",
        formulas: [
            "\\text{Aritm.: }a_n=a_1+(n-1)d,\\quad S_n=\\dfrac{n(a_1+a_n)}{2}",
            "\\text{Geom.: }a_n=a_1\\cdot q^{n-1},\\quad S_n=a_1\\cdot\\dfrac{q^n-1}{q-1}",
            "\\sum_{n=0}^{\\infty}aq^n=\\dfrac{a}{1-q}\\;(|q|<1)",
            "\\lim_{x\\to0}\\dfrac{\\sin x}{x}=1",
            "\\lim_{n\\to\\infty}\\left(1+\\dfrac{1}{n}\\right)^n=e",
        ],
        examples: [
            { problem: "Geom. serie: a=2, q=1/2, ∞ termer", solution: "S=\\dfrac{2}{1-1/2}=4" },
        ],
        exercises: [
            { q: "Summa geom.: 1+1/3+1/9+...", a: "3/2" },
            { q: "Aritm.: a₁=5, d=3. a₁₀=?", a: "5+9·3=32" },
        ]
    },

    // ─── ÅK 7 tillägg ────────────────────────────────
    {
        id: 23, klass: "Åk 7", area: "Geometri", emoji: "📐",
        title: "Geometri: area, omkrets & volymer",
        content: "Grundläggande geometriska formler för plan- och rumsgeometri. Centralt i Åk 7: ytor, omkretsar och enkla volymer.",
        formulas: [
            "\\text{Rektangel: }A=l\\cdot b,\\quad O=2(l+b)",
            "\\text{Triangel: }A=\\tfrac{1}{2}bh,\\quad O=a+b+c",
            "\\text{Cirkel: }A=\\pi r^2,\\quad O=2\\pi r",
            "\\text{Parallellogram: }A=bh",
            "\\text{Rätblock: }V=l\\cdot b\\cdot h,\\quad A_{\\text{mantel}}=2(lb+lh+bh)",
            "\\text{Cylinder: }V=\\pi r^2 h,\\quad A_{\\text{total}}=2\\pi r(r+h)",
            "\\text{Kon: }V=\\tfrac{1}{3}\\pi r^2 h,\\quad A_{\\text{mantel}}=\\pi r l\\;(l=\\text{snedlinje})",
            "\\text{Klot: }V=\\tfrac{4}{3}\\pi r^3,\\quad A=4\\pi r^2",
        ],
        examples: [
            { problem: "Cirkel r=5 cm. Area och omkrets?", solution: "A=\\pi\\cdot25\\approx78{,}5\\;\\text{cm}^2,\\;O=10\\pi\\approx31{,}4\\;\\text{cm}" },
        ],
        exercises: [
            { q: "Rektangel 6×9. Area och omkrets?", a: "A=54, O=30" },
            { q: "Triangel bas=8, höjd=5. Area?", a: "20" },
        ]
    },

    {
        id: 24, klass: "Åk 7", area: "Statistik", emoji: "📊",
        title: "Statistik: diagram & lägesmått (Åk 7)",
        content: "Datainsamling, stapeldiagram, cirkeldiagram, linjediagram. Medelvärde, median, typvärde och variationsbredd.",
        formulas: [
            "\\bar{x}=\\dfrac{x_1+x_2+\\cdots+x_n}{n}\\quad(\\text{medelvärde})",
            "\\text{Median: mittvärdet i sorterad lista}",
            "\\text{Typvärde: det vanligaste värdet}",
            "\\text{Variationsbredd}=x_{\\max}-x_{\\min}",
        ],
        examples: [
            { problem: "Data: 3,7,4,9,2,7,5. Medelvärde, median, typvärde?", solution: "\\bar{x}=37/7\\approx5{,}3\\;|\\; \\text{Sorterat: }2,3,4,5,7,7,9\\;\\Rightarrow\\;\\text{median}=5,\\;\\text{typvärde}=7" },
        ],
        exercises: [
            { q: "Data: 12,8,15,10,8. Medelvärde?", a: "53/5=10,6" },
            { q: "Sorterat: 3,5,7,9,11. Median?", a: "7" },
        ]
    },

    // ─── ÅK 9 tillägg ────────────────────────────────
    {
        id: 25, klass: "Åk 9", area: "Sannolikhet", emoji: "🎲",
        title: "Sannolikhet & kombinatorik",
        content: "Sannolikhet mäter chansen för một händelse: P(A)=gynnsamma/möjliga. Permutationer och kombinationer räknar arrangemang.",
        formulas: [
            "P(A)=\\dfrac{\\text{gynnsamma utfall}}{\\text{totala utfall}}\\quad 0\\le P\\le1",
            "P(A)+P(A^c)=1\\quad(\\text{komplementregel})",
            "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)",
            "P(A\\cap B)=P(A)\\cdot P(B)\\quad(\\text{oberoende})",
        ],
        exercises: [
            { q: "Mynt kastas 3 ggr. P(alla krona)?", a: "(1/2)³=1/8" },
            { q: "Ur 10 bollar (3 röda). P(röd)?", a: "3/10" },
        ]
    },

    {
        id: 26, klass: "Åk 9", area: "Algebra", emoji: "📈",
        title: "Funktioner & grafer",
        content: "En funktion f: x↦y ger exakt ett y-värde per x. Linjära, kvadratiska och exponentiella funktioner. Grafer, nollpunkter och symmetri.",
        formulas: [
            "\\text{Linjär: }f(x)=kx+m\\quad(k=\\text{lutning},\\;m=\\text{y-snitt})",
            "k=\\dfrac{\\Delta y}{\\Delta x}=\\dfrac{y_2-y_1}{x_2-x_1}",
            "\\text{Kvadratisk: }f(x)=ax^2+bx+c\\quad(a\\ne0)",
            "x_{\\text{vertex}}=-\\dfrac{b}{2a},\\quad y_{\\text{vertex}}=f\\!\\left(-\\dfrac{b}{2a}\\right)",
            "\\text{Exponentiell: }f(x)=a\\cdot b^x\\quad(b>0,b\\ne1)",
        ],
        exercises: [
            { q: "f(x)=3x+6. Nollpunkt?", a: "x=−2" },
            { q: "Lutning: (1,3) och (4,9)?", a: "k=(9−3)/(4−1)=2" },
        ]
    },

    // ─── MATTE 1 tillägg ────────────────────────────
    {
        id: 27, klass: "Matte 1", area: "Potenser & logaritmer", emoji: "🔋",
        title: "Potenser, logaritmer & exponentialekvationer",
        content: "Potensregler, 10-logaritm, naturlig logaritm. Exponentialekvationer löses med logaritmer. Viktigt verktyg för tillväxt och sönderfall.",
        formulas: [
            "a^m\\cdot a^n=a^{m+n},\\quad\\dfrac{a^m}{a^n}=a^{m-n},\\quad(a^m)^n=a^{mn}",
            "a^0=1,\\quad a^{-n}=\\dfrac{1}{a^n},\\quad a^{1/n}=\\sqrt[n]{a}",
            "\\log_{10}(xy)=\\log x+\\log y,\\quad\\log\\dfrac{x}{y}=\\log x-\\log y",
            "\\log(x^n)=n\\log x",
        ],
        exercises: [
            { q: "Förenkla: 2⁵·2⁻²", a: "2³=8" },
            { q: "Lös: 2ˣ=64", a: "x=6" },
        ]
    },

    {
        id: 28, klass: "Matte 1", area: "Sannolikhet", emoji: "🎰",
        title: "Sannolikhet & normalfördelning (Matte 1)",
        content: "Diskret och kontinuerlig sannolikhetsfördelning. Väntevärde och standardavvikelse för diskreta variabler. Normalfördelningens 68-95-99,7-regel.",
        formulas: [
            "E(X)=\\sum x_i\\cdot P(X=x_i)\\quad(\\text{väntevärde})",
            "\\text{Var}(X)=\\sum(x_i-\\mu)^2\\cdot P(X=x_i)",
            "\\sigma=\\sqrt{\\text{Var}(X)}\\quad(\\text{standardavvikelse})",
            "\\text{68-95-99,7: }P(\\mu-\\sigma<X<\\mu+\\sigma)\\approx68\\%",
            "z=\\dfrac{x-\\mu}{\\sigma}\\quad(\\text{standardisering})",
        ],
        exercises: [
            { q: "E(X): P(0)=0,4, P(2)=0,6. E=?", a: "0·0,4+2·0,6=1,2" },
            { q: "μ=100, σ=15. P(70<X<130)≈?", a: "95%" },
        ]
    },
];
