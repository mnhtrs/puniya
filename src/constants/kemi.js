export const KEMI = [
    // ─── ÅK 7 ──────────────────────────────────────────
    {
        id: 1, klass: "Åk 7", area: "Grundkemi", emoji: "🧪",
        title: "Ämnen, blandningar & separationsmetoder",
        content: "Kemi studerar ämnens egenskaper och förändringar. Rent ämne: ett grundämne eller en kemisk förening. Blandning: flera ämnen blandat. Separationsmetoder utnyttjar skillnader i egenskaper.",
        keyPoints: [
            "Rent ämne: fast sammansättning (t.ex. H₂O, NaCl)",
            "Blandning: homogen (lösning) eller heterogen (suspension, emulsion)",
            "Destillation: separerar blandningar med olika kokpunkter",
            "Filtrering: separerar fasta partiklar från vätskor",
            "Kromatografi: separerar ämnen efter löslighet/polaritet",
            "Sublimation: fast → gas direkt (t.ex. torris CO₂)",
            "Extraktion: utnyttjar skillnad i löslighet i olika lösningsmedel",
        ],
        examples: [
            { sv: "Saltvatten: homogen blandning → destilleras → rent vatten + salt", vi: "Destillation separerar baserat på kokpunktsskillnad" },
            { sv: "Bläck på papper: kromatografi separerar färgämnen", vi: "Olika ämnen rör sig olika snabbt i lösningsmedlet" },
        ],
        exercises: [
            { q: "Hur separerar man järnfilspån från sand?", a: "Magnet – järn är magnetiskt, sand inte" },
            { q: "Vilket separationssätt passar för olja-vatten?", a: "Separationsapparat (dekantation) – olika densitet och inte blandningsbara" },
            { q: "Är luften ett rent ämne?", a: "Nej, luft är en homogen blandning av N₂, O₂, Ar, CO₂ m.fl." },
        ]
    },

    {
        id: 2, klass: "Åk 7", area: "Grundkemi", emoji: "🔥",
        title: "Fysikaliska & kemiska förändringar",
        content: "Fysikalisk förändring: ämnets identitet bevaras (fas, form). Kemisk förändring: nya ämnen bildas med andra egenskaper.",
        keyPoints: [
            "Fysikalisk: smältning, kokning, upplösning (bevarar molekylstrukturen)",
            "Kemisk: förbränning, rostning, fotosyntesen, jäsning",
            "Kännetecken kemisk reaktion: färgändring, gas bildas, fällning, värmeutveckling/-förbrukning",
            "Masskonstans (Lavoisier): massa bevaras i kemiska reaktioner",
            "Reaktanter → Produkter: A + B → C + D",
        ],
        examples: [
            { sv: "Järn rostar: 4Fe + 3O₂ → 2Fe₂O₃  (kemisk, massa bevaras)", vi: "Produkten Fe₂O₃ har andra egenskaper än järn" },
            { sv: "Is smälter: H₂O(s) → H₂O(l)  (fysikalisk)", vi: "Samma molekyl H₂O, bara aggregationstillståndet ändras" },
        ],
        exercises: [
            { q: "Är socker som löses i vatten en kemisk förändring?", a: "Nej, fysikalisk – sockermolekylerna bevaras" },
            { q: "Vad visar att en kemisk reaktion skett vid förbränning av papper?", a: "Aska, rök, gas bildas, färgändring, värme – nya ämnen med andra egenskaper" },
            { q: "100g järn rostar. Massan av Fe₂O₃ > eller < 100g?", a: "> 100g – syre från luften binds in i produkten (masskonstans)" },
        ]
    },

    // ─── ÅK 8 ──────────────────────────────────────────
    {
        id: 3, klass: "Åk 8", area: "Atomfysik", emoji: "⚛️",
        title: "Atomer, isotoper & periodiska systemet",
        content: "Atomen: kärna (p+n) + elektronmoln. Atomnummer Z=antal protoner. Masstal A=Z+N. Elektroner i skal: 2,8,8,18... Periodiska systemet ordnar grundämnen efter Z och elektronkonfiguration.",
        keyPoints: [
            "Z=protontal (bestämmer grundämnet) | A=masstal=p+n | N=A−Z",
            "Isotoper: samma Z, olika N (t.ex. ¹²C, ¹³C, ¹⁴C)",
            "Elektronkonfiguration: Na=2,8,1 | Cl=2,8,7 | Ne=2,8 (ädelgas)",
            "Period=antal elektronskal | Grupp=ytterelektroner",
            "Grupp 1: alkalimetaller (1 ytterelektron, reaktiva)",
            "Grupp 17: halogener (7 ytterelektroner, reaktiva)",
            "Grupp 18: ädelgaser (fyllt ytterskal, inerta)",
        ],
        examples: [
            { sv: "³⁵Cl: Z=17, A=35 → 17p, 18n, 17e⁻ | Konfiguration: 2,8,7", vi: "Grupp 17 → 7 ytterelektroner → vill ta 1e⁻ → bildas Cl⁻" },
            { sv: "¹²C och ¹⁴C: båda kol (Z=6), men N=6 resp. 8", vi: "¹⁴C är radioaktivt, används för datering" },
        ],
        exercises: [
            { q: "⁳⁹K (Z=19): protoner, neutroner, elektroner?", a: "19p, 20n, 19e⁻, konfiguration 2,8,8,1" },
            { q: "Vilken grupp och period: Ca (Z=20)?", a: "Grupp 2, Period 4 (konfiguration: 2,8,8,2)" },
            { q: "Hur många elektroner har Fe³⁺ (Z=26)?", a: "26−3=23 elektroner" },
        ]
    },

    {
        id: 4, klass: "Åk 8", area: "Kemiska bindningar", emoji: "🔗",
        title: "Kemiska bindningar",
        content: "Atomer binder för ädelgasstruktur. Tre typer: jonbindning (elektrostatisk), kovalent (delat par), metallbindning (elektronhav). Elektronegativitet (EN) avgör typ.",
        keyPoints: [
            "Jonbindning: ΔEN>1,7 | metall+icke-metall | bildar jonkristall",
            "Kovalent: ΔEN<1,7 | icke-metall+icke-metall | enkla/dubbla/trippelbindningar",
            "Polär kovalent: 0,4<ΔEN<1,7 | asymmetrisk elektronfördelning",
            "Metallbindning: metallatomer + fritt rörliga elektroner (elektronhav)",
            "VSEPR: bindande+fria elektronpar bestämmer geometri",
            "H₂O: vinkelbent 104,5° | CO₂: linjär | NH₃: trigonal pyramidal | CH₄: tetraeder",
            "Vätebindning: F, O, N binder H–F, H–O, H–N (viktigt för H₂O)",
        ],
        examples: [
            { sv: "NaCl: EN(Na)=0,9, EN(Cl)=3,2 → ΔEN=2,3>1,7 → jonbindning", vi: "Na⁺ och Cl⁻ hålls av elektrostatisk attraktion i kristall" },
            { sv: "H₂O: polär kovalent, ΔEN=1,4, vinkelbent → dipolmolekyl", vi: "Vätebindningar ger ovanligt högt kokpunkt 100°C" },
        ],
        exercises: [
            { q: "Bindningstyp i HCl? EN(H)=2,2, EN(Cl)=3,2", a: "ΔEN=1,0 → polär kovalent" },
            { q: "Geometri hos BF₃ (3 bindningar, 0 fria par)?", a: "Trigonal plan, 120°" },
            { q: "Varför är CO₂ opolar trots polära bindningar?", a: "Linjär symmetri → dipolmomenten tar ut varandra" },
        ]
    },

    {
        id: 5, klass: "Åk 8", area: "Reaktioner", emoji: "⚗️",
        title: "Kemiska reaktioner & energi",
        content: "Kemisk reaktion: nya ämnen bildas. Masskonstans och laddningskonstans. Reaktionstyper. Aktiveringsenergi och katalysatorer.",
        keyPoints: [
            "Balansering: koefficienter (EJ subskript) för massa+laddningsbalans",
            "Syntes: A+B→AB | Sönderfall: AB→A+B | Substitution: A+BC→AC+B",
            "Dubbel substitution: fällning, neutralisation",
            "Exoterm ΔH<0 (förbränning) | Endoterm ΔH>0 (fotosyntesen)",
            "Aktiveringsenergi E_a: minimienergikraven för att reaktion startar",
            "Katalysator: sänker E_a, förbrukas ej",
            "Reaktionshastighet: ökar med T, c, yta, katalysator",
        ],
        examples: [
            { sv: "CH₄+2O₂→CO₂+2H₂O  ΔH=−890 kJ/mol (exoterm)", vi: "4H och 1C på mỗi sida ✓, 4O på mỗi sida ✓" },
            { sv: "Fe₂O₃+3CO→2Fe+3CO₂  (reduktion av järnoxid)", vi: "Industriell järnframställning i masugn" },
        ],
        exercises: [
            { q: "Balansera: C₃H₈+O₂→CO₂+H₂O", a: "C₃H₈+5O₂→3CO₂+4H₂O" },
            { q: "Balansera: Al+HCl→AlCl₃+H₂", a: "2Al+6HCl→2AlCl₃+3H₂" },
            { q: "Varför ökar reaktionshastigheten med temperatur?", a: "Fler partiklar har tillräcklig energi (≥E_a) vid högre T" },
        ]
    },

    // ─── ÅK 9 ──────────────────────────────────────────
    {
        id: 6, klass: "Åk 9", area: "Organisk kemi", emoji: "🧬",
        title: "Organisk kemi & funktionella grupper",
        content: "Organisk kemi = kolets kemi. Kol bildar 4 bindningar, långa kedjor, ringar. IUPAC-nomenklatur. Funktionella grupper bestämmer reaktivitet.",
        keyPoints: [
            "Alkaner CₙH₂ₙ₊₂: mättade, −an (metan, etan...)",
            "Alkener CₙH₂ₙ: C=C dubbelbindning, −en, additionsreaktion",
            "Alkyner CₙH₂ₙ₋₂: C≡C, −yn",
            "Alkoholer R−OH: −ol (metanol, etanol...) | Fenolgrupp: ArOH",
            "Aldehyder R−CHO: −al | Ketoner R−CO−R: −on",
            "Karbonsyror R−COOH: −syra | Estrar R−COO−R': −at",
            "Aminer R−NH₂ | Amider R−CONH₂",
            "Isomerer: strukturisomerer, geometriska, stereo-/kirala",
        ],
        examples: [
            { sv: "CH₃−CH₂−OH = Etanol: 2C alkohol, −OH grupp, kokpunkt 78°C", vi: "Vätebindning via −OH ger hög kokpunkt jämfört med etan (−89°C)" },
            { sv: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O", vi: "Fischer-esterifiering, reversibel, ester luktar päron" },
        ],
        exercises: [
            { q: "Namnge: CH₃−CH₂−CH₂−CH₂−CH₃", a: "Pentan (5C, alkan)" },
            { q: "Formel för heptan?", a: "C₇H₁₆" },
            { q: "Vilken funktionell grupp har propansyra?", a: "−COOH (karboxylgrupp)" },
        ]
    },

    {
        id: 7, klass: "Åk 9", area: "Syror & baser", emoji: "🧪",
        title: "Syra-basteori & pH",
        content: "Brønsted-Lowry: syra=H⁺-donator, bas=H⁺-acceptor. pH=−log[H⁺]. Vattenjämvikt Kw=[H⁺][OH⁻]=10⁻¹⁴ vid 25°C. Buffertar motstår pH-ändring.",
        keyPoints: [
            "Starka syror: HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄ (100% dissociation)",
            "Starka baser: NaOH, KOH, Ca(OH)₂",
            "pH=−log[H⁺] | pOH=−log[OH⁻] | pH+pOH=14",
            "Svag syra Ka=[H⁺][A⁻]/[HA] | Svag bas Kb",
            "Konjugat par: HA/A⁻",
            "Neutralisation: H⁺+OH⁻→H₂O  ΔH=−57 kJ/mol",
            "Buffertar: svag syra + konjugat bas | pH=pKa+lg([A⁻]/[HA])",
        ],
        examples: [
            { sv: "0,1 M HCl: [H⁺]=0,1 → pH=1 (stark syra)", vi: "100% dissociation" },
            { sv: "0,1 M ättiksyra (Ka=1,8·10⁻⁵): [H⁺]=√(Ka·c)≈1,34·10⁻³ → pH≈2,87", vi: "Svag syra, bara ~1,3% dissocierar" },
        ],
        exercises: [
            { q: "pH för [H⁺]=3,2·10⁻⁴?", a: "pH≈3,49" },
            { q: "[OH⁻] vid pH=11?", a: "10⁻³ mol/L" },
            { q: "HF (Ka=7·10⁻⁴) eller CH₃COOH (Ka=1,8·10⁻⁵) – vilken là starkare?", a: "HF (större Ka → mer dissocierar)" },
        ]
    },

    {
        id: 8, klass: "Åk 9", area: "Redoxkemi", emoji: "⚡",
        title: "Redox: oxidationstal & halvreaktioner",
        content: "Redox = elektronöverföring. OIL RIG. Oxidationstal anger laddningen om tất cả bindningar vore jonbindningar. Halvreaktioner balanseras separat.",
        keyPoints: [
            "OIL: Oxidation Is Loss (ox.tal ökar) | RIG: Reduction Is Gain (minskar)",
            "Regler: O=−2 (vanligen), H=+1 (i förening), summa=molekylens laddning",
            "Oxidationsmedel tar e⁻ (reduceras) | Reduktionsmedel ger e⁻ (oxideras)",
            "Sur lösning: balansera med H₂O och H⁺",
            "Basisk lösning: balansera med H₂O och OH⁻",
            "Galvanisk cell: spontan redox → elektricitet (Daniell: Zn|Cu)",
            "Elektrolys: extern spänning driver icke-spontan redox",
        ],
        examples: [
            { sv: "MnO₄⁻+8H⁺+5e⁻→Mn²⁺+4H₂O (reduktion)", vi: "KMnO₄ là starkt oxidationsmedel, Mn:+7→+2" },
            { sv: "Zn→Zn²⁺+2e⁻  Cu²⁺+2e⁻→Cu  E°cell=1,10V", vi: "Zn-anod oxideras, Cu-katod reduceras" },
        ],
        exercises: [
            { q: "Ox.tal för Cr i K₂Cr₂O₇?", a: "+6" },
            { q: "Balansera: Fe²⁺→Fe³⁺ (sur lösning)", a: "Fe²⁺→Fe³⁺+e⁻" },
            { q: "Vilken metall là anod i Daniells element?", a: "Zink (Zn) – oxideras" },
        ]
    },

    // ─── GYMNASIUM — Kemi 1 ──────────────────────────
    {
        id: 9, klass: "Kemi 1", area: "Stökiometri", emoji: "⚖️",
        title: "Mol, stökiometri & gaslagar",
        content: "Mol là kemins räkneenhet: 1 mol = Nₐ = 6,022·10²³ partiklar. Gaslagar beskriver ideala gaser. Stökiometri beräknar mängder via balanserade reaktioner.",
        keyPoints: [
            "n=m/M | c=n/V | N=n·Nₐ",
            "Ideala gaslagen: PV=nRT  (R=8,314 J·mol⁻¹·K⁻¹)",
            "STP (0°C, 1 atm): 22,4 L/mol",
            "Kombinerade gaslagen: P₁V₁/T₁=P₂V₂/T₂",
            "Avogadros lag: lika volymer gas vid cùng T,P → lika n",
            "Begränsande reagens bestämmer produktmängd",
            "Utbyte%=(faktisk/teoretisk)·100",
            "Spädning: c₁V₁=c₂V₂",
        ],
        examples: [
            { sv: "250 mL 0,100 M NaOH: n=0,025 mol → m=0,025·40=1,00 g", vi: "M(NaOH)=23+16+1=40 g/mol" },
            { sv: "2H₂+O₂→2H₂O: 5 mol H₂ + 2 mol O₂ → O₂ begränsar → 4 mol H₂O", vi: "H₂ behöver 2,5 mol O², men chỉ có 2 finns" },
        ],
        exercises: [
            { q: "M(H₂SO₄)?", a: "2+32+64=98 g/mol" },
            { q: "0,5 mol CO₂ vid STP: volym?", a: "11,2 L" },
            { q: "Spädning: 100 mL 12M HCl→1M. Volym?", a: "c₁V₁=c₂V₂: V₂=1200 mL" },
        ]
    },

    {
        id: 10, klass: "Kemi 1", area: "Termokemi", emoji: "🔥",
        title: "Termokemi & Hess lag",
        content: "Entalpiändring ΔH mäter värmeutbytet vid konstant tryck. Hess lag: ΔH beror ej av reaktionsvägen. Standardbildningsentalpier används för beräkning.",
        keyPoints: [
            "Exoterm: ΔH<0 (värme frigörs) | Endoterm: ΔH>0 (tas upp)",
            "Hess lag: ΔH_total=ΣΔH_steg (additivitet)",
            "ΔH°rxn=ΣΔHf°(produkter)−ΣΔHf°(reaktanter)",
            "Bindningsentalpi: summa brutna − bildade bindningar",
            "Kalorimetri: q=mcΔT (m=massa, c=specifik värmekapacitet, ΔT=temp.ändring)",
            "c(vatten)=4,18 J·g⁻¹·K⁻¹",
        ],
        examples: [
            { sv: "CH₄+2O₂→CO₂+2H₂O: ΔH=ΔHf°(CO₂)+2ΔHf°(H₂O)−ΔHf°(CH₄)", vi: "=(−393)+2(−286)−(−75)=−890 kJ/mol" },
            { sv: "50g vatten värms từ 20→70°C: q=50·4,18·50=10450 J=10,45 kJ", vi: "Kalorimetriberäkning" },
        ],
        exercises: [
            { q: "N₂+3H₂→2NH₃: ΔH=−92kJ. Exo- eller endoterm?", a: "Exoterm (ΔH<0)" },
            { q: "Hess: A→B (ΔH=+30), B→C (ΔH=−80). A→C?", a: "ΔH=+30+(−80)=−50 kJ" },
            { q: "100g nước, q=2kJ. ΔT?", a: "ΔT=q/(mc)=2000/(100·4,18)=4,8°C" },
        ]
    },

    {
        id: 11, klass: "Kemi 1", area: "Reaktionskinetik", emoji: "⏱️",
        title: "Reaktionskinetik & katalys",
        content: "Reaktionshastigheten v=Δ[produkt]/Δt beror av temperatur, koncentration, yta och katalysatorer. Aktiveringsenergi E_a là energibarriären.",
        keyPoints: [
            "v=k[A]ⁿ[B]ᵐ (hastighetslag, n+m=reaktionens ordning)",
            "k=Ae^(−Ea/RT) (Arrhenius)",
            "Kollisionsteori: partiklar behöver đúng energi+orientering",
            "Övergångstillstånd = aktiverat komplex (toppen av energikurvan)",
            "Katalysator: sänker E_a, alternativ reaktionsväg, förbrukas ej",
            "Enzym = biokemisk katalysator (proteiner)",
            "Reaktionens ordning bestäms thực nghiệm, ej từ stökiometri",
        ],
        examples: [
            { sv: "v=k[H₂][NO]² (2:a ordning i NO, 1:a i H₂, totalt 3:e)", vi: "Experimentellt bestämt, ej förutspåbart từ balanserad reaktion" },
            { sv: "Pt-katalysator i avgasrening: 2CO+O₂→2CO₂ sker vid lägre T", vi: "Katalysatorn sänker E_a cho reaktionen" },
        ],
        exercises: [
            { q: "Reaktionens ordning: v=k[A]²[B]?", a: "3:e ordning totalt (2+1)" },
            { q: "Varför ökar k med temperatur?", a: "Arrhenius: fler kollisioner với đủ energi" },
            { q: "Skillnad homogen/heterogen katalys?", a: "Homogen: cùng pha với reaktanter. Heterogen: pha khác (t.ex. Pt-fast)" },
        ]
    },

    // ─── GYMNASIUM — Kemi 2 ──────────────────────────
    {
        id: 12, klass: "Kemi 2", area: "Jämviktslära", emoji: "⇌",
        title: "Kemisk jämvikt & Le Chatelier",
        content: "Dynamisk jämvikt: fram- och bakreaktionshastigheter lika. Kc uttrycker jämviktsläget. Le Chatelier förutsäger respons trên störningar.",
        keyPoints: [
            "Kc=[P]ᵖ[Q]q/[A]ᵃ[B]ᵇ  (stökiometriska exponenter)",
            "Kp=Kc·(RT)^Δn  (gasfasreaktioner)",
            "Q<K: mot produkter | Q>K: mot reaktanter | Q=K: jämvikt",
            "Le Chatelier: +c(reaktant)→mer produkt | +T(exoterm)→mot reaktanter | +P→färre gasmol",
            "Ksp=[Aⁿ⁺]ᵐ[Bᵐ⁻]ⁿ  (löslighetsprodukten)",
            "Haberprocessen: N₂+3H₂⇌2NH₃  ΔH=−92kJ | Kompromiss ~400°C, 200atm",
            "Henderson-Hasselbalch: pH=pKa+lg([A⁻]/[HA])",
        ],
        examples: [
            { sv: "PCl₅⇌PCl₃+Cl₂ (ΔH>0): +T→mer PCl₃, +P→mer PCl₅", vi: "Le Chatelier: systemet motverkar störningen" },
            { sv: "Ksp(AgCl)=1,8·10⁻¹⁰: s=√(1,8·10⁻¹⁰)≈1,3·10⁻⁵ mol/L", vi: "Lösligheten trong nước cất" },
        ],
        exercises: [
            { q: "Kc=0,04 för H₂+I₂⇌2HI. Tolka.", a: "K<1 → reaktanter gynnas" },
            { q: "Skriv Kc för 2SO₂+O₂⇌2SO₃", a: "[SO₃]²/([SO₂]²[O₂])" },
            { q: "Tại sao Haberprocessen ~400°C och không thấp hơn?", a: "Kinetik: reaktionen för långsam vid lägre T trots bättre jämvikt" },
        ]
    },

    {
        id: 13, klass: "Kemi 2", area: "Elektrokemi", emoji: "🔋",
        title: "Elektrokemi: cellpotential & elektrolys",
        content: "Galvaniska celler: spontan redox → elektricitet. Elektrolys: elektricitet → kemisk reaktion. Nernst-ekvationen korrigerar cho icke-standardförhållanden.",
        keyPoints: [
            "E°cell=E°katod−E°anod  (reduktionspotentialer)",
            "ΔG°=−nFE°  (F=96485 C·mol⁻¹)",
            "Nernst: E=E°−(0,0592/n)·lg Q  (vid 25°C)",
            "Faradays 1:a: m=M·Q/(n·F)=M·I·t/(n·F)",
            "Faradays 2:a: vid cùng điện tích: m∝M/n",
            "Elektrolys của nước: 2H₂O→2H₂+O₂  (E°=+1,23V)",
            "Korrosion: Fe→Fe²⁺+2e⁻ (anod), galvanisering = Zn-offranode",
        ],
        examples: [
            { sv: "Daniell: E°cell=0,34−(−0,76)=1,10V  ΔG°=−2·96485·1,10=−212kJ", vi: "Spontan (ΔG°<0)" },
            { sv: "Elektrolys Cu²⁺: I=5A, t=30min → Q=9000C → m=63,5·9000/(2·96485)=2,96g", vi: "Faradays lag" },
        ],
        exercises: [
            { q: "E°cell: Ni|Ni²⁺||Ag⁺|Ag? E°Ni=−0,25, E°Ag=+0,80", a: "0,80−(−0,25)=1,05V" },
            { q: "Elektrolys Al³⁺, I=10A, 1h. Massa Al?", a: "m=27·36000/(3·96485)≈3,36g" },
            { q: "Varför skyddar zink järn?", a: "Zn có E° thấp hơn → oxideras ưu tiên (offranode)" },
        ]
    },

    {
        id: 14, klass: "Kemi 2", area: "Organisk kemi II", emoji: "🔬",
        title: "Reaktionsmekanismer & polymerer",
        content: "Mekanistisk organisk kemi: nukleofil/elektrofil addition, substitution (Sₙ1/Sₙ2), eliminering. Polymerer: addition- och kondensationspolymerisation.",
        keyPoints: [
            "Nukleofil: giàu electron, tấn công elektrofilt centrum (t.ex. OH⁻, CN⁻)",
            "Elektrofil: nghèo electron, tấn công nukleofilt centrum (t.ex. H⁺, Br₂)",
            "Sₙ2: backside attack, inverterar stereokemi, bậc 2",
            "Sₙ1: karbokatjon-intermediär, racemisering, bậc 1",
            "Additionspolymerisation: n CH₂=CH₂ → (−CH₂−CH₂−)ₙ  (polyeten)",
            "Kondensationspolymerisation: monomerer mất H₂O/HCl (nylon, polyester)",
        ],
        examples: [
            { sv: "CH₃Br + OH⁻ → CH₃OH + Br⁻  (Sₙ2, direktinversion)", vi: "Metylbromid + hydroxid → metanol + bromidjon" },
            { sv: "n(CH₂=CHCN) → (−CH₂−CH(CN)−)ₙ  = Polyakrylnitril (PAN)", vi: "Additionspolymerisation, dùng trong dệt may" },
        ],
        exercises: [
            { q: "Sₙ1 hay Sₙ2 cho t-butylklorid+OH⁻?", a: "Sₙ1 – tertiärt kol, stabilt karbokatjon" },
            { q: "Monomer cho polyeten?", a: "Eten CH₂=CH₂" },
            { q: "Khác biệt giữa additions- hay kondensationspolymer?", a: "Addition: không có sản phẩm phụ. Kondensation: mất H₂O hay HCl" },
        ]
    },

    // ─── TILLÄGG: Åk 7-9 Kemi bổ sung ──────────
    {
        id: 15, klass: "Åk 7", area: "Grundkemi", emoji: "🌡️",
        title: "Fasövergångar & lösningar",
        content: "Ämnen finns i tre aggregationstillstånd: fast, flytande, gas. Fasövergångar sker vid nhiệt độ cụ thể. Löslighet beror của lösningsmedel, nhiệt độ hay áp suất.",
        keyPoints: [
            "Smältpunkt (fast→flytande) | Kokpunkt (flytande→gas) | Sublimation (fast→gas)",
            "Kondensation (gas→flytande) | Stelning (flytande→fast) | Deposition (gas→fast)",
            "Lösning: lösningsmedel + löst ämne | Löslig/olöslig",
            "Löslighet ökar với T (fasta ämnen i vatten, vanligen)",
            "Gas: löslighet giảm khi T tăng (đồ uống) | Henrys lag",
            "Koncentration: c=n/V (mol/L) | Masskoncentration: ρ=m/V (g/L)",
        ],
        examples: [
            { sv: "Is → vatten → ånga: 0°C och 100°C vid 1 atm", vi: "Vatten có những đặc tính kỳ diệu nhờ liên kết hydro" },
            { sv: "NaCl(s) → Na⁺(aq) + Cl⁻(aq)  (hòa tan trong nước)", vi: "Jonföreningar dissocierar i vatten" },
        ],
        exercises: [
            { q: "Quá trình gas→fast trực tiếp gọi là gì?", a: "Deposition (t.ex. rimfrost)" },
            { q: "Tại sao đồ uống có gas sủi bọt nhiều hơn khi lạnh?", a: "CO₂ tan tốt hơn ở nhiệt độ thấp (Henrys lag)" },
            { q: "Molaritet là gì?", a: "Nồng độ mol/L (c=n/V)" },
        ]
    },

    {
        id: 16, klass: "Åk 9", area: "Kärn- och strålningskemi", emoji: "☢️",
        title: "Radioaktivitet & kärnreaktioner",
        content: "Radioaktivitet: instabila atomkärnor phân rã tự phát. Alpha-, beta-, gammastrålning. Halveringstid. Fission hay fusion.",
        keyPoints: [
            "Alpha (α): ⁴He-kärna, tầm ngắn, bị chặn bởi giấy",
            "Beta (β⁻): electron, tầm trung, bị chặn bởi nhôm | β⁺: positron",
            "Gamma (γ): bức xạ điện từ, năng lượng cao, bị chặn bởi chì/bê tông",
            "Halveringstid T½: thời gian để phân nửa lượng chất phân rã",
            "N(t)=N₀·(½)^(t/T½) = N₀·e^(−λt)",
            "Kärnklyvning (fission): hạt nhân nặng + neutron → 2 hạt nhân trung bình + năng lượng",
            "Kärnfusion: 2 hạt nhân nhẹ → nặng hơn + năng lượng (mặt trời)",
            "Aktivitet A=λ·N (Becquerel, Bq)",
        ],
        examples: [
            { sv: "¹⁴C → ¹⁴N + β⁻ + ν̄  (koldatering T½=5730 år)", vi: "Dùng để xác định tuổi vật hữu cơ lên tới ~50 000 năm" },
            { sv: "²³⁵U + n → ⁹²Kr + ¹⁴¹Ba + 3n + năng lượng (fission)", vi: "Neutron kích hoạt phản ứng dây chuyền trong nhà máy điện hạt nhân" },
        ],
        exercises: [
            { q: "T½=30 năm. Còn lại bao nhiêu sau 90 năm?", a: "(½)³=1/8 lượng ban đầu" },
            { q: "Bức xạ nào nguy hiểm nhất khi ở trong cơ thể?", a: "Alpha (khả năng ion hóa cao, tầm ngắn trong mô)" },
            { q: "Khác biệt giữa fission hay fusion?", a: "Fission: hạt nhân nặng bị chia tách. Fusion: hạt nhân nhẹ hợp nhất" },
        ]
    },

    {
        id: 17, klass: "Kemi 1", area: "Biokemi (intro)", emoji: "🧬",
        title: "Biokemi: kolhydrater, proteiner & fetter",
        content: "Livets kemiska byggstenar. Kolhydrater cho năng lượng. Proteiner xây dựng tế bào. Fetter dự trữ năng lượng hay tạo màng tế bào.",
        keyPoints: [
            "Kolhydrater CₙH₂ₙOₙ: monosackarider (glukos C₆H₁₂O₆), disackarider, polysackarider",
            "Fotosyntesen: 6CO₂+6H₂O → C₆H₁₂O₆+6O₂  ΔH=+2803 kJ",
            "Cellandning: C₆H₁₂O₆+6O₂ → 6CO₂+6H₂O  ΔH=−2803 kJ",
            "Aminosyror: H₂N−CH(R)−COOH | 20 chuẩn aminosyror",
            "Peptidbindning: −CO−NH− hình thành khi kondensation",
            "Proteinfaltning: primär → sekundär → tertiär → kvartär",
            "Lipider: triglycerider = glycerol + 3 fettsyror",
            "Enzymer: chất xúc tác sinh học",
        ],
        examples: [
            { sv: "Glukos + fruktose → sackaros + H₂O (kondensation)", vi: "Phản ứng ngược lại = hydrolys (tiêu hóa)" },
            { sv: "Alanin+Glycin → Ala-Gly + H₂O (peptidbindning)", vi: "Protein là chuỗi dài aminosyror liên kết peptid" },
        ],
        exercises: [
            { q: "Phản ứng tổng quát của quang hợp là gì?", a: "6CO₂+6H₂O→C₆H₁₂O₆+6O₂" },
            { q: "Khác biệt giữa chất béo no hay không no?", a: "Mättat: không có liên kết đôi (rắn). Omättat: có liên kết đôi (lỏng)" },
            { q: "Enzym có tác dụng gì?", a: "Giảm năng lượng kích hoạt cho phản ứng sinh hóa" },
        ]
    },

    {
        id: 18, klass: "Kemi 2", area: "Analytisk kemi", emoji: "🔭",
        title: "Analytisk kemi & spektroskopi",
        content: "Analytisk kemi identifierar hay kvantifierar ämnen. Spektroskopiska metoder dùng tương tác ánh sáng-vật chất.",
        keyPoints: [
            "Kvantitativ analys: titration, gravimetri, spektrofotometri",
            "Titrering: biết nồng độ (titrant) cho vào cho đến điểm tương đương",
            "n(syra)·z_a = n(bas)·z_b  tại điểm tương đương",
            "Beer-Lamberts lag: A=ε·c·l",
            "IR-spektroskopi: rung động phân tử giúp định danh nhóm chức",
            "NMR: spin hạt nhân trong từ trường giúp xác định cấu trúc carbon",
            "MS (masspektrometri): tỷ lệ m/z cho khối lượng mol hay mảnh vỡ",
            "Kromatografi (GC, HPLC): tách và định danh hỗn hợp",
        ],
        examples: [
            { sv: "25,0 mL HCl titreras med 0,100 M NaOH, åtgång 18,5 mL → c(HCl)=?", vi: "n(NaOH)=0,00185 mol = n(HCl) → c=0,074 M" },
        ],
        exercises: [
            { q: "20,0 mL 0,100M HCl được trung hòa bởi NaOH 0,200M. Thể tích?", a: "c₁V₁=c₂V₂: V₂=10,0 mL" },
            { q: "Phương pháp quang phổ nào định danh nhóm chức?", a: "IR-spektroskopi" },
            { q: "Định luật Beer-Lambert đo cái gì?", a: "Mối liên hệ hấp thụ–nồng độ: A=ε·c·l" },
        ]
    },
];
