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
            { q: "Varför fungerar kromatografi för att separera färger?", a: "Ämnena har olika förmåga att fästa vid papperet/lösa sig i vätskan" },
            { q: "Hur skulle du utvinna rent salt från havsvatten?", a: "Genom indunstning eller destillation" },
            { q: "Vad kallas en blandning av sand och vatten?", a: "Heterogen blandning (suspension)" }
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
            { q: "Är fotosyntesen en fysikalisk eller kemisk reaktion?", a: "Kemisk. Koldioxid och vatten blir till socker och syre" },
            { q: "Varför kallar vi kondensation för en fysikalisk förändring?", a: "Vattenmolekylen (H₂O) förändras inte kemiskt, bara dess aggregationstillstånd" },
            { q: "Ge ett exempel på när en fällning bildas.", a: "T.ex. när silvernitrat blandas med natriumklorid och vitt silverklorid faller till botten" }
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
            { q: "Varför reagerar alkalimetaller så våldsamt med vatten?", a: "De har bara en valenselektron som lätt avges för att nå ädelgasstruktur" },
            { q: "Vad kännetecknar isotoperna av ett grundämne?", a: "Samma antal protoner (och elektroner) men olika antal neutroner" },
            { q: "Vilken grupp kallas för halogener?", a: "Grupp 17" }
        ]
    },

    {
        id: 4, klass: "Åk 8", area: "Kemiska bindningar", emoji: "🔗",
        title: "Kemiska bindningar: Jon, Kovalent, Metall",
        content: "Atomer binder för att upnå ädelgasstruktur (oktettregeln). Tre typer: jonbindning (elektrostatisk), kovalent (dela elektronpar), metallbindning (elektronhav).",
        keyPoints: [
            "Jonbindning: ΔEN>1,7 | metall+icke-metall | bildar jonkristall",
            "Kovalent: ΔEN<1,7 | icke-metall+icke-metall | enkla/dubbla/trippelbindningar",
            "Polär kovalent: asymmetrisk elektronfördelning",
            "Metallbindning: leder ström och värme pga rörliga elektroner",
            "VSEPR: elektronpar repelerar varandra → molekylgeometri",
        ],
        examples: [
            { sv: "NaCl: EN(Na)=0,9, EN(Cl)=3,2 → ΔEN=2,3>1,7 → jonbindning", vi: "Na⁺ och Cl⁻ attraheras till ett kristallgitter" },
            { sv: "CO₂: dubbelbindningar O=C=O", vi: "Linjär geometri på grund av repulsion" },
        ],
        exercises: [
            { q: "Vilken bindning bildas mellan Na och Cl?", a: "Jonbindning" },
            { q: "Varför leder metaller ström?", a: "Delokaliserade elektroner ('elektronhav') som kan röra sig fritt" },
            { q: "Är molekylen O₂ en jonförening eller kovalent förening?", a: "Kovalent förening (ickemetall + ickemetall, delar elektronpar)" },
            { q: "Förklara varför koksalt (NaCl) har en så hög smältpunkt.", a: "Starka elektrostatiska krafter i jonkristallen (jonbindning)" },
            { q: "Ge exempel på en molekyl med polär kovalent bindning.", a: "H₂O, HCl" },
            { q: "Vad kallas regeln att atomer strävar efter 8 valenselektroner?", a: "Oktettregeln" }
        ]
    },

    {
        id: 5, klass: "Åk 8", area: "Reaktioner", emoji: "⚗️",
        title: "Kemiska reaktioner & energi",
        content: "Masskonstans gäller alltid. Vi balanserar med koefficienter. Kemiska reaktioner kan vara exoterma eller endoterma.",
        keyPoints: [
            "Balansering: antal atomer av varje slag måste vara samma på båda sidor",
            "Exoterm: energi frigörs (blir varmt, T ökar)",
            "Endoterm: energi upptas (blir kallt, T minskar)",
            "Aktiveringsenergi (E_a): krävs för att starta reaktionen",
            "Katalysator: ökar reaktionshastigheten, sänker E_a",
        ],
        examples: [
            { sv: "C + O₂ → CO₂ + energi (exoterm)", vi: "Förbränning av kol" },
            { sv: "Enzymer är kroppens biologiska katalysatorer", vi: "Underlättar matsmältning etc." },
        ],
        exercises: [
            { q: "Balansera: H₂ + O₂ → H₂O", a: "2H₂ + O₂ → 2H₂O" },
            { q: "Vad kallas den minsta energi som krävs för att en reaktion ska starta?", a: "Aktiveringsenergi" },
            { q: "Brinnande ved är ett exempel på en...", a: "Exoterm reaktion (avger värme)" },
            { q: "Balansera följande ekvation: N₂ + H₂ → NH₃", a: "N₂ + 3H₂ → 2NH₃" },
            { q: "Hur fungerar en katalysator?", a: "Den sänker aktiveringsenergin och påskyndar reaktionen utan att förbrukas själv" },
            { q: "Varför förvarar vi mat i kylskåp?", a: "För att sänka temperaturen, vilket sänker reaktionshastigheten hos bakteriers nedbrytning" }
        ]
    },

    // ─── ÅK 9 ──────────────────────────────────────────
    {
        id: 6, klass: "Åk 9", area: "Organisk kemi", emoji: "🧬",
        title: "Organisk kemi: Kolets kemi",
        content: "Organisk kemi är kolets (C) kemi. Kol kan bilda långa kedjor. Organiska ämnen från naturen (kolväten, alkoholer).",
        keyPoints: [
            "Alkaner (mättade): -an. Metan, etan, propan, butan",
            "Alkener (1 dubbelbindning): -en. Eten, propen",
            "Alkyner (1 trippelbindning): -yn. Etyn, propyn",
            "Alkoholer: har OH-grupp (hydroxylgrupp). Slutar på -ol.",
            "Metanol är mycket giftigt (träsprit). Etanol finns i drycker.",
            "Fossila bränslen är blandningar av olika kolväten.",
        ],
        examples: [
            { sv: "CH₄ är metan, den enklaste alkanen", vi: "Huvudbeståndsdel i naturgas" },
            { sv: "C₂H₅OH är etanol, alkohol i vin", vi: "Bildas genom jäsning av socker" },
        ],
        exercises: [
            { q: "Vilken typ av bindningar finns i alkaner?", a: "Bara enkelbindningar (mättade kolväten)" },
            { q: "Vad kännetecknar en alkohol kemiskt?", a: "Den innehåller en eller flera OH-grupper (hydroxylgrupper)" },
            { q: "Nämn de fyra första alkanerna i metanserien.", a: "Metan (CH₄), etan (C₂H₆), propan (C₃H₈), butan (C₄H₁₀)" },
            { q: "Vilken av dessa är giftigast och kan leda till blindhet: etanol eller metanol?", a: "Metanol (träsprit)" },
            { q: "Vad betyder det att ett kolväte är omättat?", a: "Det innehåller minst en dubbel- eller trippelbindning" },
            { q: "Varför används eten ofta inom kemisk industri?", a: "Som råvara till plaster (polyeten)" }
        ]
    },

    {
        id: 7, klass: "Åk 9", area: "Syror & baser", emoji: "🧪",
        title: "Syror och baser",
        content: "Syror avger vätejoner (H⁺). Baser tar upp vätejoner (avger hydroxidjoner, OH⁻). pH-skalan mäter surhet.",
        keyPoints: [
            "Sur lösning: pH < 7, överskott på H⁺",
            "Basisk/alkalisk lösning: pH > 7, överskott på OH⁻",
            "Neutral lösning: pH = 7 (H⁺ = OH⁻)",
            "Starka syror: Saltsyra (HCl), svavelsyra (H₂SO₄), salpetersyra (HNO₃)",
            "Svaga syror: Ättiksyra, citronsyra, kolsyra",
            "Neutralisation: Syra + Bas → Salt + Vatten",
            "Indikatorer byter färg: BTB, fenolftalein, pH-papper.",
        ],
        examples: [
            { sv: "HCl + NaOH → NaCl + H₂O", vi: "Klassisk neutralisation (avger koksalt och vatten)" },
            { sv: "Citron har lågt pH pga citronsyra", vi: "Surt (pH ca 2-3)" },
        ],
        exercises: [
            { q: "Vilken jon gör en vattenlösning sur?", a: "Vätejonen (H⁺)" },
            { q: "Vad händer med pH i en sur lösning om du späder den med mycket vatten?", a: "pH stiger och närmar sig 7" },
            { q: "Nämn magens starka syra.", a: "Saltsyra (HCl)" },
            { q: "Vilka två ämnen bildas när syra reagerar med bas?", a: "Vatten och ett salt" },
            { q: "Om du doppar blått lackmuspapper i citronjuice, vilken färg får papperet?", a: "Röd (sur lösning)" },
            { q: "Vad kallas en bas som fungerar som propplösare hemma?", a: "Natriumhydroxid (kaustiksoda)" }
        ]
    },

    {
        id: 8, klass: "Åk 9", area: "Miljökemi", emoji: "🌍",
        title: "Miljökemi: Kolets och Kvävets kretslopp",
        content: "Kemiska processer påverkar vår miljö extremt mycket. Växthuseffekten, försurning, och kretslopp är centrala begrepp.",
        keyPoints: [
            "Förhöjd växthuseffekt: pga ökad halt CO₂, CH₄ (förbränning av fossila bränslen)",
            "Försurning: SO₂ från olja bildar svavelsyra i moln → surt regn",
            "Övergödning: Kväve och fosfor från gödsel läcker ut i sjöar",
            "Kolkretsloppet: Fotosyntes (upptar CO₂) ⇌ Cellandning/Förbränning (avger CO₂)",
            "Ozonlagret (O₃) i stratosfären skyddar mot UV, stördes tidigare av freoner (CFC).",
        ],
        examples: [
            { sv: "Kalkas sjöar", vi: "För att höja pH och rädda fisk när sjön drabbats av surt regn (neutralisation)" },
            { sv: "Biobränslen ökar ej CO₂ totalt", vi: "Kort kolets kretslopp (det kol som binds har nyss vuxit)" },
        ],
        exercises: [
            { q: "Vilken gas bidrar mest till den förstärkta växthuseffekten?", a: "Koldioxid (CO₂)" },
            { q: "Varför minskar pH i sjöarna ibland kraftigt (surt regn)?", a: "Föroreningar (svaveldioxid och kväveoxider) från förbränning reagerar med vatten i molnen" },
            { q: "Hur motverkar man försurning i sjöar i praktiken?", a: "Genom sjökalkning (neutralisation av syran)" },
            { q: "Vad orsakar biologisk övergödning i Östersjön?", a: "Läckage av fosfor och kväve från jordbruk (gödningsmedel)" },
            { q: "Skillnaden mellan naturlig och förstärkt växthuseffekt?", a: "Naturlig möjliggör liv (håller värmen). Förstärkt är människoskapad och ökar medeltemperaturen för snabbt" },
            { q: "Vad är skillnaden på ozon vid marknivå och i stratosfären?", a: "Stratosfäriskt ozon skyddar oss (UV-filter), marknära ozon är giftigt/skadligt" }
        ]
    },

    // ─── GYMNASIUM — Kemi 1 ──────────────────────────
    {
        id: 9, klass: "Kemi 1", area: "Stökiometri", emoji: "⚖️",
        title: "Mol, substansmängd & beräkningar",
        content: "Mol är kemins räkneenhet. Stökiometrin behandlar mass-, mol- och volymberäkningar i reaktioner via balanserade formler.",
        keyPoints: [
            "n = m / M (Substansmängd = massa / molmassa)",
            "c = n / V (Koncentration = substansmängd / volym)",
            "Nₐ = 6,022·10²³ partiklar per mol",
            "Begränsande reaktant: den som tar slut först",
            "Molar (M) = mol/dm³",
        ],
        examples: [
            { sv: "Beräkna massan för 0.5 mol NaOH (M=40 g/mol).", vi: "m = n × M = 0.5 × 40 = 20 g" },
            { sv: "Spädning: c1×V1 = c2×V2", vi: "Lagom för att beräkna stamlösningars spädningsförhållanden" },
        ],
        exercises: [
            { q: "Beräkna molmassan för koldioxid (CO₂). C=12, O=16", a: "12 + 2×16 = 44 g/mol" },
            { q: "Hur många mol är 36 gram vatten (H₂O, M=18)?", a: "n = m/M = 36/18 = 2.0 mol" },
            { q: "Vad är koncentrationen om 0,1 mol salt löses i 0,5 dm³ vatten?", a: "c = n/V = 0,1/0,5 = 0,2 mol/dm³ (0,2 M)" },
            { q: "Reaktion: 2H₂ + O₂ → 2H₂O. Du har 2 mol H₂ och 2 mol O₂. Vilken är begränsande?", a: "H₂ (Kräver bara 1 mol O₂ för att reagera med 2 mol H₂. O₂ blir över, H₂ tar slut)" },
            { q: "Du har 100 ml 2,0 M HCl. Hur lagar du 0,5 M HCl utifrån denna?", a: "Lös ut för z: c1V1=c2V2 → 2×0,1=0,5×V2 → V2=0,4 liter. Du tillsätter alltså 300 ml vatten." },
            { q: "Vad står bokstaven Nₐ för?", a: "Avogadros konstant (antalet molekyler i 1 mol)" }
        ]
    },

    {
        id: 10, klass: "Kemi 1", area: "Termokemi & Reaktioner", emoji: "🔥",
        title: "Termokemi & energiomsättning",
        content: "Förhållandet mellan energi och kemiska reaktioner. Specifik värmekapacitet och entalpi-beräkningar.",
        keyPoints: [
            "ΔH < 0 = Exoterm (Värme utvecklas)",
            "ΔH > 0 = Endoterm (Värme upptas)",
            "q = m × c × ΔT (Värmeenergin formeln)",
            "Entalpi, H, är kemiskt bunden energi.",
        ],
        examples: [
            { sv: "H₂(g) + ½O₂(g) → H₂O(l) ΔH = -286 kJ", vi: "Exotermt, mycket energi frigörs." },
            { sv: "Is smälter: endoterm process, värme krävs.", vi: "Omgivningen blir kall om tillförd värme tas därifrån." },
        ],
        exercises: [
            { q: "100 g vatten värms upp från 20°C till 80°C (c=4,18 J/gK). Beräkna energi q.", a: "q = 100 × 4,18 × 60 = 25 080 J (25,08 kJ)" },
            { q: "Är cellandning exoterm eller endoterm?", a: "Exoterm (energi utvinns ur maten)" },
            { q: "När saltet NH₄NO₃ löses i vatten blir bägaren iskall. Vad säger detta om ΔH?", a: "ΔH > 0, reaktionen är endoterm" },
            { q: "Varför upplevs eld som varm?", a: "Molekylens bildningsentalpier är lägre än reaktanternas, överskott släpps som energi (värme)" },
            { q: "Termen som används för värme-förändring vid konstant tryck?", a: "Entalpi (ΔH)" }
        ]
    },

    {
        id: 11, klass: "Kemi 1", area: "Analytisk", emoji: "🧪",
        title: "Titrering och Kvantitativ Analys",
        content: "Utnyttjande av syra-bas-reaktioner (oftast neutralisation) för att exakt ta reda på koncentrationer. Användning av utslagsgivande indikatorer.",
        keyPoints: [
            "Titrator = Lösning med känd koncentration i byretten",
            "Provlösning = Lösning med okänd koncentration i e-kolven",
            "Ekvivalenspunkt: då substansmängden H⁺ är ekvivalent med OH⁻",
            "c×V för syra = c×V för bas (vid förhållandet 1:1)",
        ],
        examples: [
            { sv: "Titrering av HCl med NaOH. Indikator BTB slår om till grönt vid EP.", vi: "Mäta volym avtappad NaOH." },
        ],
        exercises: [
            { q: "25 ml HCl titreras med 15 ml 0,20 M NaOH (1:1 förhållande). Vad är klorvätesyrans c?", a: "n(NaOH)=0,015 × 0,20 = 0,003 mol = n(HCl). c(HCl)=0,003/0,025=0,12 M" },
            { q: "Vilken indikator rekommenderas om ekvivalenspunkten ligger nära pH 8?", a: "Fenolftalein" },
            { q: "Hur ser du att titreringen är färdig?", a: "Indikatorn genomgår en snabb färgförändring" },
            { q: "Om du har svavelsyra (H₂SO₄) vs NaOH, vad är molförhållandet?", a: "1 mol syra kräver 2 mol bas (pga två protoner)" }
        ]
    },

    // ─── GYMNASIUM — Kemi 2 ──────────────────────────
    {
        id: 12, klass: "Kemi 2", area: "Reaktionskinetik", emoji: "⏱️",
        title: "Reaktionshastighet",
        content: "Mäter hur snabbt reaktioner förlöper, dvs koncentrationsförändring över tid. Påverkas av kollisioner.",
        keyPoints: [
            "Kollisionsteorin: Atomer måste krocka med rätt energi OCH rätt vinkel.",
            "Faktorer som påverkar: Temperatur (T), Koncentration (c), Finfördelning (kontaktyta), Katalysator.",
            "Hälften av partiklarna får tillräcklig aktiveringsenergi när T höjs (typiskt dubblad hastighet per 10 grader)",
            "Mätningsmetoder: färgändring, volym gas per tidsenhet, pH-sänkning.",
        ],
        examples: [
            { sv: "Dammexplosion i en mjölkvarn", vi: "På grund av enorm kontaktyta hos pulvret" },
            { sv: "Lösa ett sockerbett går snabbast i hett te.", vi: "Högre rörelseenergi ger fler starka kollisioner" },
        ],
        exercises: [
            { q: "Varför brinner stålull men en massiv stålbit av järn inte lika lätt (med tändsticka)?", a: "Finfördelning/kontaktytan är enorm hos stålull, vilket ger mycket fler framgångsrika kollisioner med syre per sekund" },
            { q: "Hur minskar en biologisk katalysator aktiveringsenergin?", a: "Enzym (proteiner) har passform som tvingar molekylerna i rätt kontaktvinkel / böjer bindningarna" },
            { q: "Vilka enheter mäter man kemisk reaktionshastighet i vanligen?", a: "M / s (mol dm⁻³ s⁻¹)" },
            { q: "Varför sker reaktionen snabbare vid högre koncentration?", a: "Fler molekyler per volymenhet ger större sannolikhet att de krockar (kollision)!" },
            { q: "Rita en entalpikurva för en exoterm process utan och med katalysator. Vad ändras?", a: "Toppen / aktiveringsenergin (puckeln) blir lägre, men ΔH mellan start och mål är oförändrad" }
        ]
    },

    {
        id: 13, klass: "Kemi 2", area: "Kemisk Jämvikt", emoji: "⇌",
        title: "Kemisk Jämvikt & Massverkans Lag",
        content: "En del reaktioner går inte till 100%. De är reversibla och bildar dynamiska jämviktssystem. Beskrivs med uttrycket K.",
        keyPoints: [
            "K (Jämviktskonstanten) = [Produkterna] / [Reaktanterna] (Massverkans lag)",
            "Om K >> 1 gäller jämvikten åt produkternas håll.",
            "Om K << 1 gäller jämvikten åt reaktanternas håll.",
            "Le Chateliers princip: Om system i jämvikt störs, förskjuts det så störningen motverkas.",
        ],
        examples: [
            { sv: "Haber-Bosch: N₂ + 3H₂ ⇌ 2NH₃ (gas)", vi: "Om trycket ökar, förskjuts jämvikten åt höger mot färre gas-mol (2 mot 4)." },
        ],
        exercises: [
            { q: "H₂ + I₂ ⇌ 2HI, skriv K.", a: "K = [HI]² / ([H₂]*[I₂])" },
            { q: "Process är EXOTERM (A + B ⇌ C + Värme). Vad sker med K om Temperaturen höjs?", a: "Reaktionen förskjuts åt vänster för att bli av med värmen → Mindre produkt → Konstant K minskar." },
            { q: "Samma ekvation: Vad sker om du kontinuerligt suger bort C?", a: "Enligt Le Chatelier går reaktionen snabbt åt höger och tillverkar mer C" },
            { q: "Om is smälter till vatten... ÄR detta Le Chatelier?", a: "Ja om du tillför värmen tvingas is smälta för att absorbera den" },
            { q: "För vad är pKa och Ka särskilt anpassade för lösningsvarianter av jämvikter?", a: "Syrakonstanten för en svag syra (anpassad term för utvärderingen)" }
        ]
    },

    {
        id: 14, klass: "Kemi 2", area: "Organisk & Biokemi", emoji: "🧪",
        title: "Fördjupad Organisk Kemi, Isomeri, Makromolekyler",
        content: "Organiska reaktioner (substitution, addition). Strukturisomeri, Stereoisomeri. Polypeptider, Fetter och Kolhydrater.",
        keyPoints: [
            "Stereoisomeri: Cis-trans isomeri (i dubbelbindningar) respektive Optisk isomeri (kirala kol med fyra olika gupper bundna).",
            "Sₙ1 vs Sₙ2 nukleofil substitution.",
            "Oxidation av alkoholer: Primär alkohol → Aldehyd → Karboxylsyra. Sekundär → Keton. (Tertiär kan ej ox).",
            "Ester = Alkoholl + Karboxylsyra → (Smultmondoft)",
            "Proteiner styrs av sidokedjorna hos aminosyror (intermolekylära krafter)",
        ],
        examples: [
            { sv: "Mjölksyra har optiska isomerer: D-mjölksyra respektive L-mjölksyra", vi: "De är spegelbilder av varandra pga ett assymetriskt kol." },
        ],
        exercises: [
            { q: "Rita / tänk cis-2-buten vs trans-2-buten. Vad skiljer smält/kokpunkt?", a: "Mindre symetrisk i geometrin (cis) har ofta annorlunda polaritet och därmed smältpunkt pga dipol-dipol" },
            { q: "Vad bildas om propan-2-ol oxideras måttligt?", a: "En keton (propanon = aceton)" },
            { q: "En ester används för doft. Etansyra + etanol luktar kemikalie...? Namn?", a: "Etyletanoat (etylester, etylacetat)" },
            { q: "När proteiner koagulerar pga syra/värme, vad kallas processen?", a: "Denaturering" },
            { q: "Skillnaden Sₙ1 och Sₙ2?", a: "Små snabba atomer vänder paraplyt på ett steg (Sₙ2). Steg i två med karbokatjon (Sₙ1)" },
            { q: "Vilken funktionell grupp ger frukter starka kemiska dofter?", a: "Estern (COO-grupp)" }
        ]
    }
];
