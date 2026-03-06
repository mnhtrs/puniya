export const READINGS = [
    {
        id: 1, level: "A1", title: "🏠 En dag i Sverige",
        text: "Det är måndag morgon. Klockan är sju. Lisa vaknar upp och sträcker sig. Solen skiner genom fönstret. Hon stiger upp, borstar tänderna och går ner till köket. Hon dricker en kopp kaffe och äter frukost med smörgås och ost. Sedan tar hon bussen till jobbet. Lisa arbetar som sjuksköterska på ett sjukhus i Stockholm. På lunchen äter hon med sina kollegor. Om kvällen läser hon en bok och lägger sig tidigt.",
        translation: "Đó là sáng thứ Hai. Đồng hồ chỉ bảy giờ. Lisa thức dậy và vươn vai. Mặt trời chiếu qua cửa sổ. Cô đứng dậy, đánh răng và đi xuống bếp. Cô uống một tách cà phê và ăn sáng với bánh sandwich và phô mai. Sau đó cô bắt xe buýt đến chỗ làm. Lisa làm y tá tại một bệnh viện ở Stockholm.",
        questions: [
            { type: "mc", q: "Vad dricker Lisa på morgonen?", options: ["Mjölk", "Juice", "Kaffe", "Te"], answer: 2, vi: "Lisa uống gì vào buổi sáng?" },
            { type: "mc", q: "Var arbetar Lisa?", options: ["På en skola", "På ett sjukhus", "På ett kontor", "På ett café"], answer: 1, vi: "Lisa làm việc ở đâu?" },
            { type: "mc", q: "Hur tar Lisa sig till jobbet?", options: ["Hon går", "Hon cyklar", "Hon kör bil", "Hon tar bussen"], answer: 3, vi: "Lisa đi làm bằng phương tiện gì?" },
            { type: "input", q: "Vad äter Lisa till frukost?", a: "smörgås och ost", vi: "Lisa ăn gì vào bữa sáng?" },
            { type: "input", q: "Vad gör Lisa om kvällen?", a: "läser en bok", vi: "Lisa làm gì vào buổi tối?" },
        ]
    },
    {
        id: 2, level: "A2", title: "🐻 Björnen och räven (folksaga)",
        text: "Det var en gång en björn och en räv som bodde i samma skog. Björnen var stor och stark men inte särskilt smart. Räven var liten men mycket listig. En dag hittade björnen ett stort honungskrus. 'Den här honungen är min!' sa björnen. Räven tänkte snabbt och sa: 'Visst, men vet du inte att honung som finns i udda krukorna är giftig? Det där är en udda kruka.' Björnen blev rädd och lät räven ta honungen. Räven skrattade hela vägen hem. Moralen: List kan besegra styrka.",
        translation: "Ngày xưa có một con gấu và một con cáo sống trong cùng một khu rừng. Con gấu to lớn và mạnh mẽ nhưng không thông minh. Con cáo nhỏ bé nhưng rất ranh mãnh. Một ngày con gấu tìm thấy một hũ mật ong lớn. 'Mật ong này là của ta!' con gấu nói. Con cáo nghĩ nhanh và nói: 'Tất nhiên, nhưng bạn có biết mật ong trong hũ số lẻ là độc không? Đó là hũ số lẻ đấy.' Con gấu sợ hãi để con cáo lấy mật ong. Con cáo cười suốt đường về nhà.",
        questions: [
            { type: "mc", q: "Vem var stark men inte smart?", options: ["Räven", "Björnen", "Vargen", "Älgen"], answer: 1, vi: "Ai mạnh nhưng không thông minh?" },
            { type: "mc", q: "Vad hittade björnen?", options: ["Ett äpple", "En fisk", "Ett honungskrus", "En nöt"], answer: 2, vi: "Con gấu tìm thấy gì?" },
            { type: "mc", q: "Vad sa räven om honungskrusen?", options: ["Att den var tom", "Att udda krukors honung är giftig", "Att björnen inte gillades honung", "Att honungen var gammal"], answer: 1, vi: "Con cáo nói gì về hũ mật ong?" },
            { type: "mc", q: "Vad är moralen i berättelsen?", options: ["Styrka är viktigast", "List kan besegra styrka", "Man ska aldrig dela med sig", "Rävar är onda"], answer: 1, vi: "Bài học của câu chuyện là gì?" },
            { type: "input", q: "Hur var räven karaktäriserad?", a: "listig", vi: "Con cáo được mô tả như thế nào?" },
        ]
    },
    {
        id: 3, level: "A2", title: "⚡ Tor och Utgårda-Loke (nordisk mytologi)",
        text: "Tor, åskguden, reste en dag till jättarnas land Utgård tillsammans med Loke. De mötte jätten Utgårda-Loke som utmanade dem i tävlingar. Loke skulle äta snabbast, men förlorade mot Logi som åt upp både mat och ben och själva bordet. Tor skulle dricka upp ett horn med öl, men kunde inte tömma det trots tre försök. Sedan skulle Tor lyfta jättens katt – han lyckades bara lyfta en tass. Till slut fick Tor brottas med en gammal kvinna. Utgårda-Loke avslöjade sedan att Logi var elden, hornet var kopplat till havet, katten var Midgårdsormen och kvinnan var Ålderdomen. Inga gudar eller människor kan besegra dessa krafter.",
        translation: "Thần sấm Tor một ngày du hành đến vùng đất của những người khổng lồ cùng với Loke. Họ gặp người khổng lồ Utgårda-Loke và bị thách đấu. Loke thi ăn nhanh nhất nhưng thua Logi. Tor uống sừng bia nhưng không thể cạn sau ba lần thử. Tor nhấc mèo của người khổng lồ nhưng chỉ nhấc được một chân. Sau đó Utgårda-Loke tiết lộ: Logi là lửa, sừng kết nối với biển, con mèo là con rắn Midgård, và người phụ nữ là Tuổi già.",
        questions: [
            { type: "mc", q: "Vem reste med Tor till Utgård?", options: ["Oden", "Freja", "Loke", "Tyr"], answer: 2, vi: "Ai cùng đi với Tor đến Utgård?" },
            { type: "mc", q: "Vad var Logi i verkligheten?", options: ["En jätte", "Elden", "Vinden", "Havet"], answer: 1, vi: "Thực ra Logi là gì?" },
            { type: "mc", q: "Vad representerade den gamla kvinnan som Tor brottades med?", options: ["Döden", "Ålderdomen", "Sjukdomen", "Vintern"], answer: 1, vi: "Người phụ nữ già đại diện cho điều gì?" },
            { type: "mc", q: "Vad var katten i verkligheten?", options: ["En vanlig katt", "Fenrisulven", "Midgårdsormen", "Jättekatten"], answer: 2, vi: "Con mèo thực ra là gì?" },
            { type: "input", q: "Varför kunde Tor inte tömma hornet?", a: "det var kopplat till havet", vi: "Tại sao Tor không thể uống cạn sừng?" },
        ]
    },
    {
        id: 4, level: "B1", title: "👑 Gustav Vasa och befrielsen av Sverige",
        text: "Gustav Vasa är en av Sveriges viktigaste historiska figurer. År 1521 ledde han ett uppror mot den danska kungen Kristian II, som hade låtit halshugga svenska adelsmän i det som kallas Stockholms blodbad år 1520. Gustav Vasa flydde till Dalarna och fick stöd av bönderna där. Den 6 juni 1523 valdes han till kung, och Sverige blev självständigt igen. Denna dag firas nu som Sveriges nationaldag. Gustav Vasa reformerade också kyrkan och genomförde reformationen i Sverige, vilket stärkte kungamaktens ekonomi avsevärt.",
        translation: "Gustav Vasa là một trong những nhân vật lịch sử quan trọng nhất của Thụy Điển. Năm 1521 ông lãnh đạo cuộc nổi dậy chống lại vua Đan Mạch Kristian II, người đã ra lệnh chém đầu các quý tộc Thụy Điển trong sự kiện gọi là Vụ thảm sát Stockholm năm 1520. Gustav Vasa chạy trốn đến Dalarna và nhận được sự ủng hộ của nông dân ở đó.",
        questions: [
            { type: "mc", q: "Vilket år valdes Gustav Vasa till kung?", options: ["1520", "1521", "1523", "1525"], answer: 2, vi: "Gustav Vasa được bầu làm vua năm nào?" },
            { type: "mc", q: "Mot vem ledde Gustav Vasa ett uppror?", options: ["Mot den norska kungen", "Mot den danska kungen Kristian II", "Mot den ryska tsaren", "Mot den tyska keieraren"], answer: 1, vi: "Gustav Vasa lãnh đạo cuộc nổi dậy chống lại ai?" },
            { type: "mc", q: "Vad firas den 6 juni i Sverige?", options: ["Midsommar", "Valborg", "Nationaldagen", "Lucia"], answer: 2, vi: "Ngày 6 tháng 6 là ngày gì ở Thụy Điển?" },
            { type: "mc", q: "Var fick Gustav Vasa stöd från bönder?", options: ["I Stockholm", "I Dalarna", "I Göteborg", "I Skåne"], answer: 1, vi: "Gustav Vasa nhận được sự ủng hộ của nông dân ở đâu?" },
            { type: "input", q: "Vad kallas massakern år 1520?", a: "Stockholms blodbad", vi: "Vụ thảm sát năm 1520 được gọi là gì?" },
            { type: "input", q: "Vad reformerade Gustav Vasa förutom politiken?", a: "kyrkan", vi: "Ngoài chính trị, Gustav Vasa cải cách gì?" },
        ]
    },
    {
        id: 5, level: "A2", title: "🌲 Nils Holgerssons resa (Selma Lagerlöf)",
        text: "Nils Holgersson var en pojke som bodde på en gård i Skåne. Han var lat och elak mot djuren. En dag förvandlade en tomte honom till en liten människa, lika stor som en tumme. Han ryckte med på en resa med en flock vildgäss som flög norrut. Ledaren hette Akka från Kebnekaise. Under resan lärde sig Nils att respektera naturen och djuren. Han såg hela Sverige från ovan och lärde sig om landets geografi, historia och natur. Till slut förvandlades han tillbaka till en riktig pojke, men nu var han en bättre människa.",
        translation: "Nils Holgersson là một cậu bé sống trên một trang trại ở Skåne. Cậu lười biếng và độc ác với động vật. Một ngày một tiểu yêu biến cậu thành người tí hon. Cậu được mang theo trong chuyến bay cùng một đàn ngỗng hoang bay về phía bắc. Trong chuyến hành trình, Nils học được cách tôn trọng thiên nhiên và động vật.",
        questions: [
            { type: "mc", q: "Var bodde Nils Holgersson?", options: ["I Norrland", "I Dalarna", "I Skåne", "I Stockholm"], answer: 2, vi: "Nils Holgersson sống ở đâu?" },
            { type: "mc", q: "Vem förvandlade Nils?", options: ["En häxa", "En tomte", "En fé", "En drake"], answer: 1, vi: "Ai đã biến đổi Nils?" },
            { type: "mc", q: "Vad hette ledaren för vildgässen?", options: ["Akka från Kebnekaise", "Greta från Göteborg", "Maria från Malmö", "Birka från Birka"], answer: 0, vi: "Lãnh đạo của đàn ngỗng hoang tên là gì?" },
            { type: "mc", q: "Vad lärde sig Nils under resan?", options: ["Att flyga", "Att respektera naturen", "Att tala med djur", "Att bli osynlig"], answer: 1, vi: "Nils học được gì trong chuyến hành trình?" },
            { type: "input", q: "Hur stor var Nils efter förvandlingen?", a: "lika stor som en tumme", vi: "Nils to bằng cỡ nào sau khi bị biến đổi?" },
            { type: "input", q: "Vad lärde sig Nils om Sverige under resan?", a: "geografi, historia och natur", vi: "Nils học được gì về Thụy Điển?" },
        ]
    },
    {
        id: 6, level: "B1", title: "❄️ Vintermorgon i Lappland",
        text: "Klockan är fyra på morgonen och det är kolsvart utomhus. Temperaturen är minus trettio grader. I en liten stuga nära Kiruna vaknar samernas herde Aslak. Han klär på sig sina varma kläder av renskinn och går ut. Renhjorden har spridit sig under natten. Med hjälp av sin ledarhund Bálggis samlar han ihop renarna. Norrskenets gröna och lila lysande band dansar på himlen ovanför fjällen. Aslak tänker på sina förfäder som levt detta liv i hundratals år, som nomader i takt med årstiderna och renens vandring.",
        translation: "Đồng hồ chỉ bốn giờ sáng và trời tối đen bên ngoài. Nhiệt độ âm ba mươi độ. Trong một túp lều nhỏ gần Kiruna, người chăn tuần lộc Sami Aslak thức dậy. Anh mặc quần áo ấm bằng da tuần lộc và đi ra ngoài. Với sự giúp đỡ của con chó dẫn đường Bálggis, anh tập hợp lại đàn tuần lộc. Ánh sáng bắc cực quang màu xanh và tím nhảy múa trên bầu trời.",
        questions: [
            { type: "mc", q: "Hur kallt är det i berättelsen?", options: ["Minus tio grader", "Minus tjugo grader", "Minus trettio grader", "Noll grader"], answer: 2, vi: "Nhiệt độ trong câu chuyện là bao nhiêu?" },
            { type: "mc", q: "Vad heter Aslaks hund?", options: ["Snövit", "Bálggis", "Fjäll", "Nisse"], answer: 1, vi: "Tên con chó của Aslak là gì?" },
            { type: "mc", q: "Vad dansar på himlen?", options: ["Stjärnor", "Moln", "Norrsken", "Fåglar"], answer: 2, vi: "Điều gì đang nhảy múa trên bầu trời?" },
            { type: "mc", q: "Vilket folk tillhör Aslak?", options: ["Vikingarna", "Samerna", "Finnarna", "Norrmännen"], answer: 1, vi: "Aslak thuộc dân tộc nào?" },
            { type: "input", q: "Vad är Aslaks yrke?", a: "herde (renhjordsherde)", vi: "Nghề nghiệp của Aslak là gì?" },
            { type: "input", q: "Vad är gjorda Aslaks varma kläder av?", a: "renskinn", vi: "Quần áo ấm của Aslak làm bằng gì?" },
        ]
    },
    {
        id: 7, level: "A2", title: "🎄 Lucia och ljuset (svensk tradition)",
        text: "Den trettonde december firas Luciadagen i Sverige. Det är en av de mörkaste dagarna på året. Tidigt på morgonen, innan solen går upp, klär sig en flicka i vit klänning med ett ljuskransar på huvudet. Hon är Lucia. Med sina tärnor sjunger hon Luciasången och bär ljus mot mörkret. På skolor, sjukhus och kyrkor tågar Luciatåg. Traditionen blandas med den tidiga kristna martyren Lucia från Sicilien och nordiska ljusfester. Saffransbullar och pepparkakor hör till. I Sverige là một biểu tượng của hy vọng và ánh sáng trong đêm đông.",
        translation: "Ngày 13 tháng 12 được kỷ niệm là ngày Lucia ở Thụy Điển. Đây là một trong những ngày tối nhất trong năm. Sáng sớm, trước khi mặt trời mọc, một cô bé mặc váy trắng với vòng hoa nến trên đầu. Cô ấy là Lucia. Cùng với các cô phù dâu, cô hát bài Luciasången và mang ánh sáng chống lại bóng tối.",
        questions: [
            { type: "mc", q: "Vilken dag firas Lucia?", options: ["13 november", "13 december", "24 december", "6 januari"], answer: 1, vi: "Lucia được kỷ niệm vào ngày nào?" },
            { type: "mc", q: "Vad bär Lucia på huvudet?", options: ["En krona", "En hatt", "Ett ljuskransar", "En blomsterkrans"], answer: 2, vi: "Lucia đội gì trên đầu?" },
            { type: "mc", q: "Vad là Lucia một biểu tượng của?", options: ["Julen", "Vintern", "Hopp och ljus", "Döden"], answer: 2, vi: "Lucia là biểu tượng của điều gì?" },
            { type: "mc", q: "Vilka bakverk hör till Lucia?", options: ["Kladdkaka och kanelbullar", "Saffransbullar och pepparkakor", "Prinsesstårta och mazariner", "Semlor och chokladbollar"], answer: 1, vi: "Những món bánh nào thuộc về Lucia?" },
            { type: "input", q: "Vad heter sången som sjungs på Lucia?", a: "Luciasången", vi: "Bài hát được hát trong ngày Lucia tên là gì?" },
        ]
    },
    {
        id: 8, level: "B1", title: "🔬 Alfred Nobel och dynamiten",
        text: "Alfred Nobel föddes i Stockholm år 1833. Han var kemist, uppfinnare och affärsman. Hans mest kända uppfinning là dynamiten, som han patenterade år 1867. Nobel uppfann dynamiten för att göra sprängning säkrare inom gruvdrift och byggande. Men dynamiten användes också i krig och orsakat mycket lidande. Nobels bror Emil dog i en explosion vid familjens fabrik. Mot slutet av sitt liv funderade Nobel på sitt arv. Han beslutade att lämna sin förmögenhet till priser som belönar vetenskapliga och humanistiska framsteg. Nobelpriserna delas ut varje år den 10 december, dödsdag.",
        translation: "Alfred Nobel sinh ra ở Stockholm năm 1833. Ông là nhà hóa học, nhà phát minh và doanh nhân. Phát minh nổi tiếng nhất của ông là dynamite, được cấp bằng sáng chế năm 1867. Nobel phát minh dynamite để làm cho việc nổ mìn an toàn hơn trong khai thác mỏ và xây dựng. Nhưng dynamite cũng được sử dụng trong chiến tranh và gây ra nhiều đau khổ.",
        questions: [
            { type: "mc", q: "Vilket år patenterade Nobel dynamiten?", options: ["1833", "1856", "1867", "1895"], answer: 2, vi: "Nobel cấp bằng sáng chế dynamite năm nào?" },
            { type: "mc", q: "Vad uppfanns dynamiten ursprungligen för?", options: ["Militärt bruk", "Gruvdrift och byggande", "Pyroteknik", "Rymdfart"], answer: 1, vi: "Dynamite ban đầu được phát minh để làm gì?" },
            { type: "mc", q: "När delas Nobelpriserna ut?", options: ["10 oktober", "10 november", "10 december", "24 december"], answer: 2, vi: "Giải Nobel được trao vào ngày nào?" },
            { type: "mc", q: "Var föddes Alfred Nobel?", options: ["Göteborg", "Uppsala", "Malmö", "Stockholm"], answer: 3, vi: "Alfred Nobel sinh ra ở đâu?" },
            { type: "input", q: "Vad hände Nobels bror Emil?", a: "han dog i en explosion", vi: "Điều gì đã xảy ra với anh trai Emil của Nobel?" },
            { type: "input", q: "Vad bestämde Nobel att göra với tài sản của mình?", a: "lämna den till priser (Nobelprisen)", vi: "Nobel quyết định làm gì với tài sản của mình?" },
        ]
    },
    {
        id: 9, level: "A2", title: "🎭 Astrid Lindgren och Pippi Långstrump",
        text: "Astrid Lindgren là một trong những tác giả sách thiếu nhi được đọc nhiều nhất trên thế giới. Cô sáng tạo ra Pippi Långstrump năm 1945. Pippi là một cô bé chín tuổi với hai bím tóc đỏ và tàn nhang. Cô sống một mình trong Villa Villekulla với con khỉ Herr Nilsson và con ngựa Lansen. Pippi là cô bé mạnh nhất thế giới và nhấc ngựa một cách dễ dàng. Cô ấy tự do, vui vẻ và không quan tâm đến quy tắc của người lớn. Astrid Lindgren lớn lên ở một trang trại ở Småland và lấy tuổi thơ của mình làm cảm hứng. Cô nhận được giải thưởng Andersen và được đề nghị cho giải Nobel Văn học.",
        translation: "Astrid Lindgren là một trong những tác giả sách thiếu nhi được đọc nhiều nhất trên thế giới. Bà sáng tạo ra Pippi Tất Dài năm 1945. Pippi là cô bé chín tuổi với hai bím tóc đỏ và tàn nhang. Cô sống một mình trong Villa Villekulla với con khỉ Herr Nilsson và con ngựa. Pippi là cô bé mạnh nhất thế giới và nhấc ngựa dễ dàng.",
        questions: [
            { type: "mc", q: "Vilket år skapade Astrid Lindgren Pippi Långstrump?", options: ["1939", "1942", "1945", "1950"], answer: 2, vi: "Astrid Lindgren sáng tạo Pippi Tất Dài năm nào?" },
            { type: "mc", q: "Hur gammal là Pippi Långstrump?", options: ["Sju år", "Åtta år", "Nio år", "Tio år"], answer: 2, vi: "Pippi Tất Dài bao nhiêu tuổi?" },
            { type: "mc", q: "Vad heter Pippis hus?", options: ["Villa Solsken", "Villa Villekulla", "Bullerbyn", "Katthult"], answer: 1, vi: "Nhà của Pippi tên là gì?" },
            { type: "mc", q: "Var växte Astrid Lindgren upp?", options: ["I Stockholm", "I Göteborg", "I Småland", "I Norrland"], answer: 2, vi: "Astrid Lindgren lớn lên ở đâu?" },
            { type: "input", q: "Vad heter Pippis apa?", a: "Herr Nilsson", vi: "Con khỉ của Pippi tên là gì?" },
            { type: "input", q: "Varför là Pippi đặc biệt?", a: "hon är världens starkaste flicka", vi: "Tại sao Pippi đặc biệt?" },
        ]
    },
    {
        id: 10, level: "B1", title: "🌊 Vikingarna và những hành trình của họ",
        text: "Vikingarna là những thủy thủ, thương nhân và chiến binh Scandinavia sống trong giai đoạn 793-1066 sau Công nguyên. Họ đến từ những gì ngày nay là Thụy Điển, Na Uy và Đan Mạch. Người Viking Thụy Điển đi về phía đông qua các con sông ở Nga và Ukraine ngày nay, đến tận Constantinople và Trung Đông. Người Viking Na Uy đến Iceland, Greenland và thậm chí Bắc Mỹ, năm trăm năm trước Columbus. Người Viking không chỉ là những chiến binh man rợ mà còn là những thợ thủ công, thương nhân và người kể chuyện tài năng. Họ để lại những hòn đá rune khắp Scandinavia kể về những hành trình và những anh hùng của họ.",
        translation: "Người Viking là những thủy thủ, thương nhân và chiến binh người Scandinavia sống trong giai đoạn 793-1066 sau Công nguyên. Người Viking Thụy Điển đi về phía đông qua các con sông ở Nga và Ukraine, đến tận Constantinople. Người Viking Na Uy đến Iceland, Greenland và thậm chí Bắc Mỹ, năm trăm năm trước Columbus.",
        questions: [
            { type: "mc", q: "Under vilken period levde vikingarna?", options: ["500-800 e.Kr", "793-1066 e.Kr", "1000-1200 e.Kr", "1200-1400 e.Kr"], answer: 1, vi: "Người Viking sống trong giai đoạn nào?" },
            { type: "mc", q: "Vart seglade svenska vikingar?", options: ["Västerut till Amerika", "Österut via Ryssland till Konstantinopel", "Söderut till Afrika", "Norrut till Arktis"], answer: 1, vi: "Người Viking Thụy Điển đi thuyền về hướng nào?" },
            { type: "mc", q: "Hur nhiều năm trước Columbus đã đến Bắc Mỹ?", options: ["Hundra år", "Tvåhundra år", "Trehundra år", "Femhundra år"], answer: 3, vi: "Người Viking đến Bắc Mỹ trước Columbus bao nhiêu năm?" },
            { type: "mc", q: "Vad là runstenar?", options: ["Vikingaskepp", "Stenskulpturer med runor som kể về hành trình", "Vikingavapen", "Vikingakronor"], answer: 1, vi: "Đá rune là gì?" },
            { type: "input", q: "Từ ba quốc gia nào người Viking đến?", a: "Sverige, Norge och Danmark", vi: "Người Viking đến từ ba quốc gia nào?" },
        ]
    },
    {
        id: 11, level: "B2", title: "📚 August Strindberg và Röda rummet",
        text: "August Strindberg (1849-1912) là nhà viết kịch và tiểu thuyết gia quan trọng nhất của Thụy Điển. Tiểu thuyết 'Röda rummet' của ông từ năm 1879 được coi là bước đột phá của văn học Thụy Điển hiện đại. Tiểu thuyết miêu tả một người lý tưởng trẻ tuổi, Arvid Falk, người bắt đầu làm phóng viên ở Stockholm. Anh gặp phải tham nhũng, giả dối và bất công giai cấp trong xã hội Thụy Điển. Strindberg phê phán mạnh mẽ nhà thờ, giới tư sản và hệ thống chính trị. Tiểu thuyết được viết với phong cách hiện thực và châm biếm sâu cay. Strindberg có một cuộc đời sóng gió với ba cuộc hôn nhân và những cuộc khủng hoảng tâm lý định kỳ, nhưng ông đã sáng tạo ra một sự nghiệp văn học đồ sộ ảnh hưởng đến toàn bộ kịch nghệ hiện đại.",
        translation: "August Strindberg là nhà viết kịch và tiểu thuyết quan trọng nhất của Thụy Điển. Tiểu thuyết 'Röda rummet' năm 1879 được coi là bước đột phá của văn học Thụy Điển hiện đại. Tiểu thuyết miêu tả một người lý tưởng trẻ tuổi Arvid Falk làm phóng viên ở Stockholm, gặp phải sự tham nhũng và bất công giai cấp.",
        questions: [
            { type: "mc", q: "Vilket năm publicerades 'Röda rummet'?", options: ["1849", "1872", "1879", "1912"], answer: 2, vi: "'Röda rummet' được xuất bản năm nào?" },
            { type: "mc", q: "Vad heter huvudpersonen i 'Röda rummet'?", options: ["August Strindberg", "Arvid Falk", "Erik Pettersson", "Johan Berg"], answer: 1, vi: "Nhân vật chính trong 'Röda rummet' tên là gì?" },
            { type: "mc", q: "Vad phê phán Strindberg trong 'Röda rummet'?", options: ["Naturen", "Korruption och klassorättvisor", "Utländska kulturer", "Teknikutvecklingen"], answer: 1, vi: "Strindberg phê phán điều gì trong 'Röda rummet'?" },
            { type: "mc", q: "Vad là vai trò của Strindberg trong văn học Thụy Điển?", options: ["En mindre känd författare", "Sveriges mest betydande dramatiker", "En barnboksförfattare", "En poetförfattare"], answer: 1, vi: "Vai trò của Strindberg trong văn học Thụy Điển là gì?" },
            { type: "input", q: "Trong thể loại nào Röda rummet được viết?", a: "realistisk satir / roman", vi: "Röda rummet được viết theo thể loại nào?" },
            { type: "input", q: "Vad jobbar Arvid Falk som?", a: "journalist", vi: "Arvid Falk làm nghề gì?" },
        ]
    },
    {
        id: 12, level: "A2", title: "🏔️ Midsommar ở Thụy Điển",
        text: "Midsommar là một trong những lễ hội quan trọng nhất của Thụy Điển. Nó luôn được tổ chức vào thứ Sáu rơi vào gần ngày 24 tháng 6 nhất, tức là vào thời điểm hạ chí. Gia đình và bạn bè tập hợp ngoài trời để nhảy múa quanh cột midsommarstången, được trang trí bằng lá xanh và hoa. Những trò chơi truyền thống như 'Smågrodorna' được nghe thấy ở khắp nơi. Salad cá trích, dâu tây với kem và nubbe là món ăn Midsommar điển hình. Ở miền bắc Thụy Điển, phía bắc vòng Bắc Cực, có mặt trời lúc nửa đêm trong suốt Midsommar, có nghĩa là mặt trời không bao giờ lặn. Midsommar là một ngày hội của thiên nhiên, tình yêu và mùa hè Thụy Điển.",
        translation: "Midsommar là một trong những lễ hội quan trọng nhất của Thụy Điển. Nó được tổ chức vào thứ Sáu gần nhất với ngày 24 tháng 6. Gia đình và bạn bè tập hợp ngoài trời để nhảy múa quanh cột Midsommar. Ở miền bắc Thụy Điển, bắc Vòng Bắc Cực, đây là mặt trời lúc nửa đêm.",
        questions: [
            { type: "mc", q: "När được kỷ niệm midsommar ở Thụy Điển?", options: ["24 juni alltid", "Fredagen nhất 24 juni", "Första lördagen i juni", "24 juli"], answer: 1, vi: "Midsommar được tổ chức khi nào?" },
            { type: "mc", q: "Vad nhảy múa quanh cái gì trong Midsommar?", options: ["Ett träd", "En eld", "Midsommarstången", "En fontän"], answer: 2, vi: "Người ta nhảy múa quanh cái gì trong Midsommar?" },
            { type: "mc", q: "Vad là món ăn Midsommar truyền thống?", options: ["Köttbullar och lingon", "Sill, jordgubbar och nubbe", "Pizza och pasta", "Falukorv och potatis"], answer: 1, vi: "Món ăn truyền thống của Midsommar là gì?" },
            { type: "mc", q: "Vad là mặt trời lúc nửa đêm?", options: ["En festival", "Att solen không bao giờ lặn", "En typ av lampor", "En speciell soluppgång"], answer: 1, vi: "Mặt trời lúc nửa đêm là gì?" },
            { type: "input", q: "Vad heter một bài hát Midsommar truyền thống cho trẻ em?", a: "Smågrodorna", vi: "Bài hát truyền thống cho trẻ em trong Midsommar tên là gì?" },
        ]
    },
    {
        id: 13, level: "B1", title: "🌍 Thụy Điển và tranh luận khí hậu — Greta Thunberg",
        text: "Greta Thunberg sinh năm 2003 ở Stockholm. Năm 2018, khi mười lăm tuổi, cô bắt đầu đình công ngoài Quốc hội ở Stockholm vì các biện pháp khí hậu. Cô cầm một tấm bảng với dòng chữ 'Skolstrejk för klimatet'. Cuộc phản đối của cô nhanh chóng lan sang các nước khác và khởi đầu một phong trào toàn cầu có tên là Fridays for Future. Greta được chẩn đoán mắc hội chứng Asperger và được gọi là gương mặt của phong trào khí hậu toàn cầu. Cô chỉ trích các nhà lãnh đạo thế giới vì đã không làm đủ để đối phó với biến đổi khí hậu. Năm 2019, cô đã có một bài phát biểu nổi tiếng trước Liên hợp quốc: 'How dare you'. Thụy Điển nổi tiếng về ý thức bảo vệ môi trường, với các mục tiêu cao về năng lượng tái tạo.",
        translation: "Greta Thunberg sinh năm 2003 ở Stockholm. Năm 2018, khi 15 tuổi, cô bắt đầu đình công trước tòa nhà Quốc hội ở Stockholm vì hành động khí hậu. Phong trào của cô nhanh chóng lan rộng ra các quốc gia khác và khởi đầu phong trào toàn cầu Fridays for Future.",
        questions: [
            { type: "mc", q: "Năm nào cuộc đình công khí hậu của Greta Thunberg bắt đầu?", options: ["2016", "2017", "2018", "2019"], answer: 2, vi: "Greta bắt đầu đình công khí hậu năm nào?" },
            { type: "mc", q: "Vad đã viết trên bảng của Greta?", options: ["Rädda haven", "Skolstrejk för klimatet", "Stoppa utsläppen", "Fridays for Future"], answer: 1, vi: "Tấm biểu ngữ của Greta viết gì?" },
            { type: "mc", q: "Vad heter phong trào toàn cầu mà Greta khởi xướng?", options: ["Green Peace", "Extinction Rebellion", "Fridays for Future", "Climate Action Now"], answer: 2, vi: "Phong trào toàn cầu mà Greta khởi xướng tên là gì?" },
            { type: "mc", q: "Trước tổ chức nào Greta đã có bài phát biểu nổi tiếng?", options: ["EU", "NATO", "FN", "G20"], answer: 2, vi: "Trước tổ chức nào Greta đọc bài phát biểu nổi tiếng?" },
            { type: "input", q: "Vilken chẩn đoán bệnh mà Greta Thunberg có?", a: "Aspergers syndrom", vi: "Greta Thunberg có chẩn đoán bệnh gì?" },
        ]
    },
    {
        id: 14, level: "A1", title: "🍎 Ẩm thực và nấu ăn ở Thụy Điển",
        text: "Ở Thụy Điển người ta ăn sáng, trưa và tối. Vào bữa sáng, nhiều người ăn cháo yến mạch hoặc ngũ cốc với sữa. Những chiếc bánh sandwich với phô mai hoặc thịt nguội cũng rất phổ biến. Vào bữa trưa, nhiều người ăn ở nhà hàng hoặc nơi làm việc. Một bữa trưa điển hình của Thụy Điển là thịt viên với khoai tây nghiền và mứt lingon. Vào bữa tối, người ta thường nấu mì Ý, súp hoặc cá. Thứ Sáu đôi khi được gọi là 'fredagsmys' khi người ta ăn tacos hoặc pizza trước TV. Các món ăn Thụy Điển còn bao gồm smörgåsbord, cá hồi ngâm và janssons frestelse.",
        translation: "Ở Thụy Điển người ta ăn sáng, trưa và tối. Bữa sáng nhiều người ăn cháo yến mạch hoặc ngũ cốc với sữa. Bữa trưa điển hình của Thụy Điển là thịt viên với khoai tây nghiền và mứt việt quất. Thứ Sáu đôi khi được gọi là 'fredagsmys' khi người ta ăn tacos hoặc pizza trước TV.",
        questions: [
            { type: "mc", q: "Vad là một bữa trưa điển hình của Thụy Điển?", options: ["Sushi", "Köttbullar med potatismos", "Pasta carbonara", "Currysoppa"], answer: 1, vi: "Bữa trưa điển hình của Thụy Điển là gì?" },
            { type: "mc", q: "Vad được gọi là tối thứ Sáu ở Thụy Điển?", options: ["Fredagskul", "Fredagsfest", "Fredagsmys", "Fredagsmiddag"], answer: 2, vi: "Tối thứ Sáu ở Thụy Điển được gọi là gì?" },
            { type: "mc", q: "Vad người ta ăn vào 'fredagsmys'?", options: ["Köttbullar", "Sill", "Tacos eller pizza", "Smörgåsbord"], answer: 2, vi: "Người ta ăn gì trong 'fredagsmys'?" },
            { type: "input", q: "Sáng sớm, hãy kể tên một lựa chọn bữa sáng điển hình của Thụy Điển.", a: "havregrynsgröt / smörgåsar med ost", vi: "Kể tên một món ăn sáng điển hình của Thụy Điển." },
            { type: "input", q: "Vad là gravad lax?", a: "en svensk fiskrätt / salt-marinerad lax", vi: "Gravad lax là gì?" },
        ]
    },
    {
        id: 15, level: "B2", title: "🏛️ Xã hội phúc lợi Thụy Điển",
        text: "Thụy Điển nổi tiếng với hệ thống phúc lợi mạnh mẽ, thường được gọi là 'Mô hình Thụy Điển'. Nó được xây dựng dựa trên các quyền phổ quát: chăm sóc y tế miễn phí, giáo dục miễn phí từ mẫu giáo đến đại học, và các quy định hào phóng về nghỉ phép của cha mẹ. Hệ thống này được tài trợ bởi thuế cao — nằm trong số những mức thuế cao nhất thế giới. Hệ thống này được thiết lập dần dần trong suốt thế kỷ 20, đặc biệt là trong kỷ nguyên dài của đảng Xã hội Dân chủ (1932-1976). Thụy Điển cũng có các liên đoàn lao động mạnh mẽ và sự hợp tác chặt chẽ giữa chủ lao động, liên đoàn lao động và nhà nước, được gọi là 'chủ nghĩa nghiệp đoàn'. Những người chỉ trích cho rằng thuế cao làm giảm tăng trưởng và tự do cá nhân. Những người ủng hộ chỉ ra sự bất bình đẳng thấp, chất lượng cuộc sống cao và năng lực cạnh tranh kinh tế mạnh mẽ.",
        translation: "Thụy Điển nổi tiếng with hệ thống phúc lợi mạnh mẽ, thường được gọi là 'Mô hình Thụy Điển'. Nó xây dựng trên các quyền phổ quát: y tế miễn phí, giáo dục miễn phí từ mầm non đến đại học, và chính sách nghỉ thai sản hào phóng. Được tài trợ bởi thuế cao.",
        questions: [
            { type: "mc", q: "Vad được gọi là hệ thống phúc lợi Thụy Điển?", options: ["Den nordiska modellen", "Den svenska modellen", "Folkhemmet", "Socialstaten"], answer: 1, vi: "Hệ thống phúc lợi Thụy Điển được gọi là gì?" },
            { type: "mc", q: "Hệ thống phúc lợi Thụy Điển được tài trợ như thế nào?", options: ["Genom lotteri", "Genom höga skatter", "Genom utländska lån", "Genom naturresurser"], answer: 1, vi: "Hệ thống phúc lợi Thụy Điển được tài trợ như thế nào?" },
            { type: "mc", q: "Trong giai đoạn nào đảng Xã hội Dân chủ thống trị?", options: ["1900-1932", "1932-1976", "1976-2000", "2000-nutid"], answer: 1, vi: "Đảng Xã hội Dân chủ thống trị trong giai đoạn nào?" },
            { type: "mc", q: "Vad được gọi là sự hợp tác giữa chủ lao động, nghiệp đoàn và nhà nước?", options: ["Demokrati", "Socialism", "Korporativism", "Liberalism"], answer: 2, vi: "Sự hợp tác giữa chủ lao động, công đoàn và nhà nước được gọi là gì?" },
            { type: "input", q: "Cấp độ giáo dục nào là miễn phí ở Thụy Điển?", a: "från förskola till universitet", vi: "Giáo dục từ cấp nào đến cấp nào miễn phí ở Thụy Điển?" },
            { type: "input", q: "Kể tên một lập luận chống lại thuế cao.", a: "minskar tillväxt / individuella friheter", vi: "Nêu một lập luận chống lại thuế cao." },
        ]
    },
    {
        id: 16, level: "A2", title: "🐺 Con sói muốn có một con cừu non (Aesop bằng tiếng Thụy Điển)",
        text: "Một con sói nhìn thấy một con cừu non đang uống nước bên một con sông. Con sói muốn ăn thịt con cừu nhưng muốn có một lý do. 'Mày làm đục nước của tao!' con sói buộc tội. 'Điều đó không thể đúng,' con cừu non nói. 'Tôi đang uống phía dưới anh.' 'Năm ngoái mày đã xúc phạm tao!' con sói nói. 'Năm ngoái? Tôi chỉ mới một tuổi thôi,' con cừu non trả lời. 'Vậy thì đó là cha của mày!' con sói hét lên. Và với điều đó, con sói tấn công con cừu non vô tội. Bài học: Kẻ muốn làm hại người vô tội sẽ luôn tìm được một cái cớ.",
        translation: "Một con sói thấy con cừu non đang uống nước bên sông. Con sói muốn ăn con cừu nhưng cần lý do. 'Mày làm đục nước của ta!' sói buộc tội. 'Không thể đúng,' cừu nói. 'Ta uống ở hạ nguồn.' 'Năm ngoái mày đã xúc phạm ta!' sói nói. 'Năm ngoái? Ta chỉ mới một tuổi,' cừu trả lời.",
        questions: [
            { type: "mc", q: "Con cừu non ở đâu trong câu chuyện?", options: ["I en skog", "Vid en flod", "På en äng", "I ett hus"], answer: 1, vi: "Con cừu non đang ở đâu trong câu chuyện?" },
            { type: "mc", q: "Lời buộc tội đầu tiên của con sói là gì?", options: ["Att lammet stulits mat", "Att lammet grumlade vattnet", "Att lammet var bullrigt", "Att lammet trespaserat"], answer: 1, vi: "Lời buộc tội đầu tiên của sói là gì?" },
            { type: "mc", q: "Tại sao con cừu non không thể xúc phạm con sói vào năm ngoái?", options: ["Det var i ett annat land", "Lammet var bara ett år gammalt", "Lammet kände inte vargen", "Lammet var snällt"], answer: 1, vi: "Tại sao cừu không thể xúc phạm sói năm ngoái?" },
            { type: "mc", q: "Bài học của câu chuyện là gì?", options: ["Vargar är onda", "Lamm ska vara försiktiga", "Den som vill skada hittar alltid ett svepskäl", "Floder är farliga"], answer: 2, vi: "Bài học của câu chuyện là gì?" },
            { type: "input", q: "Cuối cùng con sói đã làm gì?", a: "anföll det oskyldiga lammet", vi: "Cuối cùng sói đã làm gì?" },
        ]
    },
    {
        id: 17, level: "B1", title: "🎵 ABBA và ngành công nghiệp âm nhạc Thụy Điển",
        text: "ABBA là nhóm nhạc nổi tiếng quốc tế nhất của Thụy Điển. Nhóm bao gồm Agnetha Fältskog, Björn Ulvaeus, Benny Andersson và Anni-Frid Lyngstad. Họ đã giành chiến thắng tại Eurovision Song Contest năm 1974 với bài hát 'Waterloo' tại Brighton. Sau đó, họ trở thành một trong những ban nhạc bán chạy nhất thế giới với các bản hit như 'Dancing Queen', 'Mamma Mia' và 'Fernando'. ABBA đã bán được hơn 400 triệu đĩa trên toàn thế giới. Nhóm tan rã vào năm 1982 nhưng tái hợp vào năm 2021 với album 'Voyage'. Thụy Điển kể từ sau ABBA đã có một ngành xuất khẩu âm nhạc mạnh mẽ — Robyn, Avicii, Swedish House Mafia, Max Martin với tư cách là nhà sản xuất.",
        translation: "ABBA là nhóm nhạc Thụy Điển nổi tiếng nhất thế giới. Nhóm bao gồm Agnetha, Björn, Benny và Anni-Frid. Họ thắng Eurovision 1974 với bài 'Waterloo'. ABBA bán được hơn 400 triệu đĩa trên toàn thế giới. Nhóm giải tán năm 1982 nhưng tái hợp năm 2021.",
        questions: [
            { type: "mc", q: "Năm nào ABBA đã thắng Eurovision?", options: ["1972", "1974", "1976", "1978"], answer: 1, vi: "ABBA thắng Eurovision năm nào?" },
            { type: "mc", q: "Bài hát nào ABBA đã thắng?", options: ["Dancing Queen", "Mamma Mia", "Fernando", "Waterloo"], answer: 3, vi: "Tên bài hát ABBA thắng cuộc là gì?" },
            { type: "mc", q: "ABBA đã bán được bao nhiêu đĩa?", options: ["100 miljoner", "200 miljoner", "300 miljoner", "400 miljoner"], answer: 3, vi: "ABBA bán được bao nhiêu đĩa?" },
            { type: "mc", q: "Năm nào ABBA tái hợp?", options: ["2019", "2020", "2021", "2022"], answer: 2, vi: "ABBA tái hợp năm nào?" },
            { type: "input", q: "Kể tên một bài hát nổi tiếng của ABBA.", a: "Dancing Queen / Mamma Mia / Fernando / Waterloo", vi: "Kể tên một bài hát nổi tiếng của ABBA." },
            { type: "input", q: "Album nào ABBA đã phát hành năm 2021?", a: "Voyage", vi: "Album ABBA phát hành năm 2021 tên là gì?" },
        ]
    },
    {
        id: 18, level: "B1", title: "🌱 Rừng Thụy Điển và quyền của mọi người",
        text: "Thụy Điển là một trong những quốc gia nhiều rừng nhất châu Âu — khoảng 69 phần trăm đất nước được bao phủ bởi rừng. Rừng là trung tâm trong văn hóa và kinh tế Thụy Điển. Nó cung cấp nguyên liệu thô cho ngành công nghiệp giấy và gỗ, và quan trọng đối với du lịch và vác hoạt động ngoài trời. Allemansrätten là một nguyên tắc độc đáo của Thụy Điển cho phép mọi người quyền ở trong thiên nhiên, ngay cả trên đất tư nhân, miễn là họ không làm phiền hoặc phá hoại. Bạn được phép hái dâu và nấm, cắm trại một đêm và đi bộ tự do. Nhưng bạn không được làm hại thiên nhiên, làm phiền động vật hoặc các trang trại. Allemansrätten có nghĩa là tự do nhưng cũng đi đôi với trách nhiệm.",
        translation: "Thụy Điển là một trong những quốc gia có độ che phủ rừng cao nhất châu Âu — khoảng 69% đất đai là rừng. Allemansrätten là nguyên tắc độc đáo của Thụy Điển cho phép mọi người ở trong thiên nhiên, kể cả trên đất tư, miễn là không làm phiền hoặc phá hoại.",
        questions: [
            { type: "mc", q: "Bao nhiêu phần trăm của Thụy Điển được bao phủ bởi rừng?", options: ["40%", "55%", "69%", "80%"], answer: 2, vi: "Bao nhiêu phần trăm diện tích Thụy Điển là rừng?" },
            { type: "mc", q: "Allemansrätten có nghĩa là gì?", options: ["Att man får jaga var som helst", "Att alla har rätt att vistas i naturen", "Att man får hugga ned träd fritt", "Att staten äger all skog"], answer: 1, vi: "Allemansrätten có nghĩa là gì?" },
            { type: "mc", q: "Bạn ĐƯỢC phép làm gì theo Allemansrätten?", options: ["Hugga träd", "Bygga hus", "Plocka bär och svamp", "Elda hur som helst"], answer: 2, vi: "Theo allemansrätten, bạn được phép làm gì?" },
            { type: "mc", q: "Bạn KHÔNG được làm gì theo Allemansrätten?", options: ["Campa en natt", "Promenera fritt", "Skada naturen eller störa djur", "Plocka svamp"], answer: 2, vi: "Theo allemansrätten, bạn KHÔNG được làm gì?" },
            { type: "input", q: "Allemansrätten có nghĩa là gì ngoài tự do?", a: "ansvar", vi: "Ngoài tự do, allemansrätten còn có nghĩa là gì?" },
        ]
    },
    {
        id: 19, level: "A2", title: "🚂 Một hành trình bằng tàu hỏa qua Thụy Điển",
        text: "Erik đi tàu từ Malmö ở phía nam đến Kiruna ở phía bắc. Đó là một hành trình dài, gần hai mươi tiếng. Ở Malmö, anh băng qua cầu Öresund nối liền Thụy Điển và Đan Mạch. Tàu dừng ở Göteborg, Stockholm và Sundsvall. Phía bắc Sundsvall, núi bắt đầu xuất hiện. Quang cảnh thật tuyệt vời với rừng, hồ và những ngọn núi tuyết phủ. Ở Kiruna, nhiều người làm việc trong mỏ quặng sắt, một trong những mỏ quặng sắt ngầm lớn nhất thế giới. Erik bị mê hoặc bởi sự rộng lớn của Thụy Điển và sự thay đổi kỳ diệu của thiên nhiên từ nam ra bắc.",
        translation: "Erik đi tàu từ Malmö ở phía nam đến Kiruna ở phía bắc. Đó là chuyến đi dài gần hai mươi tiếng. Tàu dừng ở Göteborg, Stockholm và Sundsvall. Ở phía bắc Sundsvall bắt đầu núi. Ở Kiruna nhiều người làm việc trong mỏ quặng sắt.",
        questions: [
            { type: "mc", q: "Erik bắt đầu hành trình từ thành phố nào?", options: ["Stockholm", "Göteborg", "Malmö", "Sundsvall"], answer: 2, vi: "Erik bắt đầu chuyến đi từ thành phố nào?" },
            { type: "mc", q: "Cầu Öresund nối liền những gì?", options: ["Sverige och Norge", "Sverige och Finland", "Sverige och Danmark", "Sverige och Tyskland"], answer: 2, vi: "Öresundsbron kết nối những quốc gia nào?" },
            { type: "mc", q: "Chuyến đi tàu mất bao lâu?", options: ["Fem timmar", "Tio timmar", "Femton timmar", "Tjugo timmar"], answer: 3, vi: "Chuyến tàu mất bao lâu?" },
            { type: "mc", q: "Trong Kiruna có cái gì?", options: ["En hamn", "En järnmalmsgruva", "En flygplats", "En universitetet"], answer: 1, vi: "Ở Kiruna có gì?" },
            { type: "input", q: "Dãy núi bắt đầu từ phía bắc của đâu?", a: "norr om Sundsvall", vi: "Núi bắt đầu ở phía bắc đâu?" },
        ]
    },
    {
        id: 20, level: "B2", title: "📖 Hjalmar Söderberg — Doktor Glas (Trích đoạn)",
        text: "Hjalmar Söderberg (1869-1941) là một trong những nhà văn văn xuôi tinh tế nhất của Thụy Điển. Tiểu thuyết 'Doktor Glas' của ông từ năm 1905 được viết dưới dạng nhật ký của một bác sĩ cô đơn tại Stockholm. Bác sĩ Glas thông minh, nhạy cảm và bị dằn vặt về mặt đạo đức. Anh yêu Helga, người đã kết hôn với một linh mục mà cô ghét cay ghét đắng. Glas đã suy nghĩ rất lâu liệu mình có quyền giúp Helga được tự do hay không, ngay cả bằng những phương tiện phi đạo đức. Tiểu thuyết khám phá quyền lấy mặng sống, đạo đức chủ quan và sự cô đơn của cuộc sống hiện đại. Phong cách của Söderberg rõ ràng, mỉa mai và đầy nhạc tính. Tiểu thuyết vẫn là một trong những tác phẩm văn học Thụy Điển được đọc nhiều nhất.",
        translation: "Hjalmar Söderberg là một trong những nhà văn xuôi hàng đầu của Thụy Điển. Tiểu thuyết 'Doktor Glas' năm 1905 được viết như nhật ký của một bác sĩ cô đơn ở Stockholm. Tiểu thuyết khám phá quyền lấy đi mạng sống, đạo đức chủ quan và sự cô đơn trong cuộc sống hiện đại.",
        questions: [
            { type: "mc", q: "'Doktor Glas' được viết dưới dạng nào?", options: ["Som ett brev", "Som en dagbok", "Som ett drama", "Som en dikt"], answer: 1, vi: "'Doktor Glas' được viết dưới dạng nào?" },
            { type: "mc", q: "Helga kết hôn với ai?", options: ["Doktor Glas", "En läkare", "En präst", "En affärsman"], answer: 2, vi: "Helga kết hôn với ai?" },
            { type: "mc", q: "Tiểu thuyết đề cập đến những chủ đề nào?", options: ["Kärlek och äventyr", "Rätten att ta liv och subjektiv moral", "Politisk revolution", "Naturvetenskap"], answer: 1, vi: "Tiểu thuyết đề cập những chủ đề nào?" },
            { type: "mc", q: "Phong cách của Söderberg được miêu tả như thế nào?", options: ["Dramatisk och explosiv", "Klar, ironisk och musikalisk", "Enkel och barnvänlig", "Tung och filosofisk"], answer: 1, vi: "Phong cách của Söderberg được mô tả như thế nào?" },
            { type: "input", q: "Nhân vật chính trong Doktor Glas làm nghề gì?", a: "läkare", vi: "Nhân vật chính trong Doktor Glas có nghề nghiệp gì?" },
            { type: "input", q: "Năm nào Doktor Glas được xuất bản?", a: "1905", vi: "Doktor Glas được xuất bản năm nào?" },
        ]
    },
];

export const LISTENINGS = [
    {
        id: 1, level: "A1", title: "Hej! Presentera dig",
        text: "Hej! Jag heter Anna Lindström. Jag är tjugotre år gammal och jag kommer från Göteborg. Jag studerar på universitetet och läser svenska och historia. På fritiden gillar jag att läsa böcker och lyssna på musik.",
        translation: "Xin chào! Tôi tên là Anna Lindström. Tôi hai mươi ba tuổi và đến từ Göteborg. Tôi học đại học và đang học tiếng Thụy Điển và lịch sử. Lúc rảnh tôi thích đọc sách và nghe nhạc.",
        vocab: ["heter = tên là", "år gammal = tuổi", "kommer från = đến từ", "studerar = đang học", "fritiden = thời gian rảnh"]
    },
    {
        id: 2, level: "A1", title: "I affären (Tại cửa hàng)",
        text: "Kund: Ursäkta, var finns brödet? Personal: Det finns i hyllan längst bort till höger. Kund: Tack! Och hur mycket kostar den här osten? Personal: Den kostar fyrtio kronor. Kund: Okej, jag tar den. Kan jag betala med kort? Personal: Ja, självklart!",
        translation: "KH: Xin lỗi, bánh mì ở đâu? NV: Ở kệ xa nhất phía bên phải. KH: Cảm ơn! Và phô mai này giá bao nhiêu? NV: Bốn mươi krona. KH: Được, tôi lấy. Tôi có thể thanh toán bằng thẻ không? NV: Vâng, tất nhiên!",
        vocab: ["Ursäkta = Xin lỗi", "var finns = ở đâu có", "hyllan = kệ hàng", "kostar = có giá", "betala med kort = trả bằng thẻ"]
    },
    {
        id: 3, level: "A2", title: "Vädret i Sverige (Thời tiết)",
        text: "Idag är det mulet och kallt i Stockholm. Temperaturen är bara tre grader. Det förväntas regna på eftermiddagen. I helgen däremot kommer det att bli sol och uppemot tio grader. Perfekt väder för en promenad i parken!",
        translation: "Hôm nay trời nhiều mây và lạnh ở Stockholm. Nhiệt độ chỉ ba độ. Dự báo sẽ mưa vào buổi chiều. Vào cuối tuần ngược lại sẽ có nắng và lên đến mười độ. Thời tiết hoàn hảo để đi dạo trong công viên!",
        vocab: ["mulet = nhiều mây", "grader = độ", "förväntas = được dự báo", "uppemot = lên đến", "promenad = đi dạo"]
    },
    {
        id: 4, level: "B1", title: "Sveriges historia (Lịch sử Thụy Điển)",
        text: "Sverige har en rik och fascinerande historia. Vikingarna, som levde från 700- till 1100-talet, var kända för sina sjöresor och handel. Under medeltiden var Sverige en del av Kalmarunionen med Danmark och Norge. På 1600-talet var Sverige en stormakt i Europa. Idag är Sverige känt för sin höga levnadsstandard, sina sociala reformer och sitt engagemang för miljön.",
        translation: "Thụy Điển có lịch sử phong phú và hấp dẫn. Người Viking, sống từ thế kỷ 7 đến 11, nổi tiếng với các chuyến đi biển và thương mại. Thời trung cổ Thụy Điển là một phần của Liên minh Kalmar với Đan Mạch và Na Uy. Vào thế kỷ 17 Thụy Điển là một cường quốc ở châu Âu. Ngày nay Thụy Điển nổi tiếng với mức sống cao, các cải cách xã hội và cam kết vì môi trường.",
        vocab: ["fascinerande = hấp dẫn", "sjöresor = chuyến đi biển", "stormakt = cường quốc", "levnadsstandard = mức sống", "engagemang = cam kết"]
    },
];

export const SPEAKINGS = [
    {
        id: 1, title: "Giới thiệu bản thân", prompt: "Hãy giới thiệu bản thân bằng tiếng Thụy Điển trong 3-4 câu.",
        example: "Hej! Jag heter [tên]. Jag är [tuổi] år gammal och jag kommer từ [nơi]. Tôi làm việc/học tập như [nghề]. Lúc rảnh rỗi tôi thích [sở thích].",
        hint: "Nhớ dùng: heter (tên là), år gammal (tuổi), kommer từ (đến từ), tycker om (thích)"
    },
    {
        id: 2, title: "Đặt hàng tại nhà hàng", prompt: "Hãy đặt một bữa ăn tại nhà hàng Thụy Điển.",
        example: "Hej! Kan jag få se menyn? Jag skulle vilja beställa en köttbullar med potatis och lingonsylt. Och en öl, tack. Hur nhiều nó có giá?",
        hint: "Kan jag få = cho tôi xin; skulle vilja = muốn; beställa = đặt hàng"
    },
    {
        id: 3, title: "Hỏi đường", prompt: "Hỏi đường đến ga tàu điện ngầm gần nhất.",
        example: "Ursäkta mig! Kan du hjälpa mig? Var ligger närmaste tunnelbana? Hur mất bao lâu để đi đến đó? Cảm ơn rất nhiều!",
        hint: "Ursäkta = xin lỗi; var ligger = ở đâu; närmaste = gần nhất; hur lång tid = mất bao lâu"
    },
    {
        id: 4, title: "Kể về ngày của bạn", prompt: "Kể lại những gì bạn đã làm hôm nay.",
        example: "Idag vaknade jag kl. 7. Sedan drack jag kaffe och åt frukost. På förmiddagen jobbade jag hemifrån. På eftermiddagen gick jag och handlade mat. Ikväll ska jag titta på TV.",
        hint: "Dùng quá khứ: vaknade (thức dậy), drack (uống), åt (ăn), gick (đi)"
    },
];

export const WRITINGS = [
    { id: 1, title: "📝 Giới thiệu bản thân", prompt: "Viết đoạn văn giới thiệu bản thân (5-7 câu) bằng tiếng Thụy Điển.", tip: "Dùng: Jag heter..., Jag är...år, Jag kommer từ..., Jag tycker om att..." },
    { id: 2, title: "✉️ Viết email cho bạn", prompt: "Viết email ngắn cho người bạn Thụy Điển, kể về cuối tuần vừa rồi.", tip: "Bắt đầu: Hej [tên]! Kết thúc: Hälsningar/Med vänliga hälsningar" },
    { id: 3, title: "📖 Mô tả gia đình", prompt: "Mô tả gia đình của bạn bằng tiếng Thụy Điển.", tip: "min familj = gia đình tôi; har = có; år gammal = tuổi; jobbar som = làm việc là" },
    { id: 4, title: "🌆 Mô tả thành phố", prompt: "Viết về thành phố bạn đang sống hoặc muốn đến thăm ở Thụy Điển.", tip: "Stockholm, Göteborg, Malmö; vacker = đẹp; stor/liten = lớn/nhỏ; det finns = có" },
];
