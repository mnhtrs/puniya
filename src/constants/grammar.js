export const GRAMMAR = [
    {
        id: 1, emoji: "📖", title: "Giới từ - En & Ett (Article Gender)",
        content: "Tiếng Thụy Điển có 2 giống: utrum (en) và neutrum (ett). Không có quy tắc tuyệt đối - phải học thuộc.",
        table: {
            headers: ["Loại", "Không xác định", "Xác định", "Số nhiều không XĐ", "Số nhiều XĐ"],
            rows: [["Utrum (en)", "en bil", "bilen", "bilar", "bilarna"], ["Neutrum (ett)", "ett hus", "huset", "hus", "husen"], ["Utrum 2", "en man", "mannen", "män", "männen"], ["Neutrum 2", "ett barn", "barnet", "barn", "barnen"]]
        }
    },
    {
        id: 2, emoji: "⚡", title: "Chia động từ (Verb Conjugation) - Các nhóm",
        content: "Động từ tiếng Thụy Điển chia theo 4 nhóm (konjugation). Động từ KHÔNG chia theo ngôi (jag, du, han đều dùng cùng dạng).",
        table: {
            headers: ["Nhóm", "Nguyên thể", "Hiện tại", "Quá khứ", "Supinum", "Nghĩa"],
            rows: [["1 (-ar)", "tala", "talar", "talade", "talat", "nói"], ["2a (-er)", "läsa", "läser", "läste", "läst", "đọc"], ["2b (-er)", "köpa", "köper", "köpte", "köpt", "mua"], ["3 (bất quy tắc)", "bo", "bor", "bodde", "bott", "sống/ở"], ["4 (bất quy tắc)", "skriva", "skriver", "skrev", "skrivit", "viết"]]
        }
    },
    {
        id: 3, emoji: "🕐", title: "Các thì (Tenses)",
        content: "Tiếng Thụy Điển có 5 thì chính. Tương lai thường dùng 'ska' hoặc 'kommer att' + nguyên thể.",
        table: {
            headers: ["Thì", "Cấu trúc", "Ví dụ", "Nghĩa"],
            rows: [["Hiện tại", "verb + -ar/-er/-r", "Jag äter", "Tôi ăn"], ["Quá khứ đơn", "dạng quá khứ", "Jag åt", "Tôi đã ăn"], ["Hoàn thành", "har + supinum", "Jag har ätit", "Tôi đã từng ăn"], ["Quá khứ hoàn thành", "hade + supinum", "Jag hade ätit", "Tôi đã ăn xong"], ["Tương lai (ska)", "ska + infinitiv", "Jag ska äta", "Tôi sẽ ăn"], ["Tương lai (kommer att)", "kommer att + inf", "Det kommer att regna", "Trời sẽ mưa"]]
        }
    },
    {
        id: 4, emoji: "🔀", title: "Trật tự câu - Quy tắc V2",
        content: "Quy tắc QUAN TRỌNG NHẤT: Động từ chính LUÔN ở vị trí thứ 2 trong câu. Khi trạng ngữ đứng đầu câu, chủ ngữ và động từ đổi chỗ (inversion).",
        examples: [{ sv: "Jag äter lunch kl. 12.", vi: "Tôi ăn trưa lúc 12 giờ. (S-V-O)" },
        { sv: "Kl. 12 äter jag lunch.", vi: "Lúc 12 giờ tôi ăn trưa. (Adv-V-S)" },
        { sv: "Idag har jag inte sovit.", vi: "Hôm nay tôi chưa ngủ. (Adv-Aux-S-Adv-V)" }]
    },
    {
        id: 5, emoji: "🎨", title: "Tính từ - Agreement & Declension",
        content: "Tính từ phải đồng ý với danh từ về giống (en/ett) và tính xác định. Thêm -t cho neutrum không xác định, -a cho xác định và số nhiều.",
        table: {
            headers: ["Trường hợp", "Cấu trúc", "Ví dụ", "Nghĩa"],
            rows: [["En + adj", "adj", "en stor bil", "một xe lớn"], ["Ett + adj", "adj + -t", "ett stort hus", "một nhà lớn"], ["Xác định en", "den + adj + -a", "den stora bilen", "chiếc xe lớn đó"], ["Xác định ett", "det + adj + -a", "det stora huset", "ngôi nhà lớn đó"], ["Số nhiều", "adj + -a", "stora bilar", "những xe lớn"]]
        }
    },
    {
        id: 6, emoji: "📍", title: "Trạng từ (Adverbs)",
        content: "Trạng từ mô tả động từ, tính từ hoặc trạng từ khác. Nhiều trạng từ tạo bằng cách thêm -t vào tính từ neutrum.",
        table: {
            headers: ["Tính từ", "Trạng từ", "Ví dụ", "Nghĩa"],
            rows: [["snabb (nhanh)", "snabbt", "Han springer snabbt", "Anh ấy chạy nhanh"], ["glad (vui)", "glatt", "Hon ler glatt", "Cô ấy cười vui"], ["lugn (bình tĩnh)", "lugnt", "Tala lugnt!", "Nói bình tĩnh thôi!"], ["Trạng từ thời gian:", "—", "—", "—"], ["nu (bây giờ)", "redan (đã)", "snart (sắp)", "alltid (luôn luôn)"], ["aldrig (không bao giờ)", "ibland (thỉnh thoảng)", "ofta (thường xuyên)", "sällan (hiếm khi)"]]
        }
    },
    {
        id: 7, emoji: "🚫", title: "Phủ định - Inte & Aldrig",
        content: "'Inte' (không) đặt SAU động từ chính. Trong câu có trợ động từ, 'inte' đặt sau trợ động từ.",
        examples: [{ sv: "Jag äter inte kött.", vi: "Tôi không ăn thịt." },
        { sv: "Hon kan inte simma.", vi: "Cô ấy không biết bơi." },
        { sv: "Jag har inte sovit.", vi: "Tôi chưa ngủ." },
        { sv: "Han dricker aldrig kaffe.", vi: "Anh ấy không bao giờ uống cà phê." }]
    },
    {
        id: 8, emoji: "❓", title: "Câu hỏi (Questions)",
        content: "Câu hỏi Yes/No: đảo động từ lên đầu. Câu hỏi Wh-: câu hỏi từ + động từ + chủ ngữ.",
        table: {
            headers: ["Câu hỏi", "Tiếng Thụy Điển", "Tiếng Việt"],
            rows: [["Yes/No", "Äter du lunch?", "Bạn có ăn trưa không?"], ["Var (ở đâu)", "Var bor du?", "Bạn sống ở đâu?"], ["Vad (cái gì)", "Vad gör du?", "Bạn đang làm gì?"], ["Vem (ai)", "Vem är det?", "Đó là ai?"], ["Hur (thế nào)", "Hur mår du?", "Bạn có khỏe không?"], ["Varför (tại sao)", "Varför gråter du?", "Tại sao bạn khóc?"], ["När (khi nào)", "När kommer du?", "Khi nào bạn đến?"], ["Hur mycket/många", "Hur mycket kostar det?", "Cái này giá bao nhiêu?"]]
        }
    },
    {
        id: 9, emoji: "🔗", title: "Câu điều kiện (Conditional)",
        content: "Câu điều kiện dùng 'om' (nếu). Loại 1: điều kiện thực. Loại 2: điều kiện giả thiết (dùng thì quá khứ + skulle).",
        examples: [{ sv: "Om det regnar, stannar jag hemma.", vi: "Nếu trời mưa, tôi sẽ ở nhà. (thực tế)" },
        { sv: "Om jag var rik, skulle jag resa världen runt.", vi: "Nếu tôi giàu, tôi sẽ đi vòng quanh thế giới. (giả thiết)" },
        { sv: "Om du hade frågat, skulle jag ha hjälpt.", vi: "Nếu bạn đã hỏi, tôi đã giúp bạn rồi. (quá khứ phản thực)" }]
    },
    {
        id: 10, emoji: "🔄", title: "Câu bị động (Passive Voice)",
        content: "Tiếng Thụy Điển có 2 cách tạo bị động: thêm -s vào động từ (s-passive) hoặc dùng 'bli/vara + particip'.",
        table: {
            headers: ["Cách", "Cấu trúc", "Ví dụ", "Nghĩa"],
            rows: [["S-passive (chủ động)", "verb + -s", "Boken läses.", "Quyển sách được đọc."], ["Bli-passive (quá trình)", "bli + particip", "Boken blir läst.", "Quyển sách đang được đọc."], ["Vara-passive (trạng thái)", "vara + particip", "Boken är läst.", "Quyển sách đã được đọc."], ["Quá khứ s-passive", "verb-quá khứ + -s", "Boken lästes.", "Quyển sách đã được đọc."]]
        }
    },
    {
        id: 11, emoji: "💬", title: "Câu trực tiếp & Gián tiếp",
        content: "Câu gián tiếp (indirect speech) thường thay đổi đại từ, thì động từ, và trạng từ chỉ thời gian/nơi chốn.",
        examples: [{ sv: 'Han sa: "Jag är trött."', vi: 'Anh ấy nói: "Tôi mệt." (trực tiếp)' },
        { sv: "Han sa att han var trött.", vi: "Anh ấy nói rằng anh ấy mệt. (gián tiếp)" },
        { sv: 'Hon frågade: "Var bor du?"', vi: 'Cô ấy hỏi: "Bạn sống ở đâu?" (trực tiếp)' },
        { sv: "Hon frågade var jag bodde.", vi: "Cô ấy hỏi tôi sống ở đâu. (gián tiếp)" }]
    },
    {
        id: 12, emoji: "🔚", title: "Câu hỏi đuôi (Tag Questions)",
        content: "Tiếng Thụy Điển thường dùng 'eller hur?' (phải không?) hoặc 'inte sant?' (đúng không?) thay vì tạo câu hỏi đuôi phức tạp.",
        examples: [{ sv: "Det är vackert, eller hur?", vi: "Đẹp phải không?" },
        { sv: "Du talar svenska, eller hur?", vi: "Bạn nói tiếng Thụy Điển đúng không?" },
        { sv: "Han kom inte, eller hur?", vi: "Anh ấy không đến đúng không?" },
        { sv: "Vi ses imorgon, eller hur?", vi: "Ngày mai gặp nhau nhé?" }]
    },
    {
        id: 13, emoji: "📚", title: "Mệnh đề quan hệ (Relative Clauses)",
        content: "Dùng 'som' (that/which/who) để tạo mệnh đề quan hệ. 'Som' không thay đổi theo giống.",
        examples: [{ sv: "Mannen som bor där är min vän.", vi: "Người đàn ông sống ở đó là bạn tôi." },
        { sv: "Boken som jag läser är intressant.", vi: "Quyển sách tôi đang đọc rất thú vị." },
        { sv: "Huset som vi köpte är gammalt.", vi: "Ngôi nhà chúng tôi mua thì cũ." }]
    },
    {
        id: 14, emoji: "🔢", title: "Số đếm & Thứ tự",
        content: "Số cơ bản và số thứ tự trong tiếng Thụy Điển.",
        table: {
            headers: ["Số", "Đếm", "Thứ tự", "Đọc"],
            rows: [["1", "ett/en", "första", "/ˈeːt/ - /ˈfœʂta/"], ["2", "två", "andra", "/tvoː/ - /ˈandrɑ/"], ["3", "tre", "tredje", "/treː/ - /ˈtrɛdjɛ/"], ["10", "tio", "tionde", "/ˈtiːɔ/"], ["20", "tjugo", "tjugonde", "/ˈɧʉːgɔ/"], ["100", "hundra", "hundrade", "/ˈhɵndrɑ/"], ["1000", "tusen", "tusende", "/ˈtʉːsɛn/"]]
        }
    },
];
