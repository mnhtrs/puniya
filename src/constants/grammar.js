export const GRAMMAR = [
    {
        id: 1, emoji: "📖", title: "Giống của danh từ - En & Ett",
        content: "Trong tiếng Thụy Điển, danh từ được chia thành 2 giống: Utrum (en) và Neutrum (ett). Khoảng 80% là từ 'en'. Không có quy tắc cố định, mẹo nhỏ là 'từ chỉ người/động vật thường là en'.",
        table: {
            headers: ["Giống", "Số ít (Lạ)", "Số ít (Quen)", "Số nhiều (Lạ)", "Số nhiều (Quen)"],
            rows: [
                ["En-word", "en bil (1 xe)", "bilen (xe đó)", "bilar (xe)", "bilarna (những xe đó)"],
                ["Ett-word", "ett hus (1 nhà)", "huset (nhà đó)", "hus (nhà)", "husen (những nhà đó)"],
                ["Từ chỉ người", "en kvinna", "kvinnan", "kvinnor", "kvinnorna"],
                ["Từ mượn", "ett hotell", "hotellet", "hotell", "hotellen"]
            ]
        }
    },
    {
        id: 15, emoji: "👤", title: "Đại từ nhân xưng (Pronouns)",
        content: "Dùng để thay thế tên người/vật. Lưu ý 'den' dùng cho từ giống en, 'det' dùng cho từ giống ett.",
        table: {
            headers: ["Ngôi", "Chủ ngữ", "Tân ngữ", "Sở hữu (en/ett/pl)"],
            rows: [
                ["Tôi", "Jag", "Mig", "Min / Mitt / Mina"],
                ["Bạn", "Du", "Dig", "Din / Ditt / Dina"],
                ["Anh ấy/Cô ấy", "Han / Hon", "Honom / Henne", "Hans / Hennes"],
                ["Nó (en / ett)", "Den / Det", "Den / Det", "Dess"],
                ["Chúng tôi", "Vi", "Oss", "Vår / Vårt / Våra"],
                ["Các bạn", "Ni", "Er", "Er / Ert / Era"],
                ["Họ", "De (dom)", "Dem (dom)", "Deras"]
            ]
        }
    },
    {
        id: 8, emoji: "❓", title: "Đặt câu hỏi (Questions)",
        content: "Sử dụng từ để hỏi (Wh-) hoặc đảo động từ lên đầu câu cho câu hỏi Có/Không.",
        table: {
            headers: ["Từ hỏi", "Tiếng Thụy Điển", "Nghĩa", "Ví dụ"],
            rows: [
                ["Cái gì", "Vad", "What", "Vad heter du? (Tên bạn là gì?)"],
                ["Ở đâu", "Var", "Where", "Var bor du? (Bạn sống ở đâu?)"],
                ["Ai", "Vem", "Who", "Vem är det? (Đó là ai?)"],
                ["Tại sao", "Varför", "Why", "Varför học tiếng Thụy Điển?"],
                ["Thế nào", "Hur", "How", "Hur mår du? (Bạn khỏe không?)"],
                ["Khi nào", "När", "When", "När kommer du?"],
                ["Đi đâu", "Vart", "Where to", "Vart ska du?"],
                ["Của ai", "Vems", "Whose", "Vems bil är det? (Đây là xe của ai?)"]
            ]
        }
    },
    {
        id: 2, emoji: "⚡", title: "Động từ & Các nhóm chia từ",
        content: "Động từ không chia theo ngôi (tất cả các ngôi dùng chung 1 dạng). Có 4 nhóm chính dựa trên đuôi của từ.",
        table: {
            headers: ["Nhóm", "Nguyên thể", "Hiện tại", "Quá khứ", "Nghĩa"],
            rows: [
                ["Nhóm 1 (-ar)", "tala", "talar", "talade", "nói"],
                ["Nhóm 2a (-er)", "läsa", "läser", "läste", "đọc"],
                ["Nhóm 2b (-er)", "köpa", "köper", "köpte", "mua"],
                ["Nhóm 3 (ngắn)", "bo", "bor", "bodde", "sống"],
                ["Nhóm 4 (bất quy tắc)", "skriva", "skriver", "skrev", "viết"]
            ]
        }
    },
    {
        id: 3, emoji: "🕐", title: "Thì của động từ (Tenses)",
        content: "Dùng 'ska' cho dự định và 'kommer att' cho dự đoán tương lai chắc chắn.",
        table: {
            headers: ["Thì", "Cấu trúc", "Ví dụ", "Nghĩa"],
            rows: [
                ["Hiện tại", "V-ar/er", "Jag äter", "Tôi đang ăn"],
                ["Quá khứ", "V-thời điểm", "Jag åt", "Tôi đã ăn (hôm qua)"],
                ["Hoàn thành", "har + supinum", "Jag har ätit", "Tôi đã ăn (rồi)"],
                ["Tương lai", "ska + V", "Jag ska äta", "Tôi sẽ ăn"]
            ]
        }
    },
    {
        id: 7, emoji: "🚫", title: "Phủ định - Inte & Aldrig",
        content: "Từ phủ định 'inte' (không) thường đứng SAU động từ chính trong câu đơn.",
        examples: [
            { sv: "Jag talar inte svenska.", vi: "Tôi không nói tiếng Thụy Điển." },
            { sv: "Han kan inte simma.", vi: "Anh ấy không biết bơi." },
            { sv: "Jag har aldrig varit i Sverige.", vi: "Tôi chưa bao giờ đến Thụy Điển." }
        ]
    },
    {
        id: 5, emoji: "🎨", title: "Tính từ & Sự hòa hợp",
        content: "Tính từ thay đổi theo danh từ: thêm -t nếu danh từ là 'ett', thêm -a nếu là số nhiều hoặc xác định.",
        table: {
            headers: ["Trường hợp", "Ví dụ", "Nghĩa"],
            rows: [
                ["En-word", "en stor hund", "một con chó lớn"],
                ["Ett-word", "ett stort hus", "một ngôi nhà lớn"],
                ["Số nhiều", "stora hundar", "những con chó lớn"],
                ["Xác định", "den stora hunden", "con chó lớn đó"]
            ]
        }
    },
    {
        id: 4, emoji: "🔀", title: "Trật tự câu V2 - 'Luật bất biến'",
        content: "Trong một câu trần thuật, động từ LUÔN đứng ở vị trí thứ 2. Nếu đưa thời gian hay địa điểm lên đầu, chủ ngữ sẽ phải 'nhường chỗ' đẩy ra sau động từ.",
        examples: [
            { sv: "Jag studerar idag.", vi: "Tôi học hôm nay. (V ở vị trí 2)" },
            { sv: "Idag studerar jag.", vi: "Hôm nay tôi học. (V vẫn ở vị trí 2, S ra sau)" },
            { sv: "Nu läser jag dokumentet.", vi: "Bây giờ tôi đọc tài liệu." }
        ]
    },
    {
        id: 13, emoji: "📚", title: "Mệnh đề quan hệ với 'Som'",
        content: "'Som' là siêu đại từ thay thế cho 'Who', 'Which', 'That'. Điểm cộng lớn nhất: 'Som' vô cùng dễ tính vì KHÔNG bao giờ bị biến đổi (không phân biệt giống en/ett hay ít/nhiều).",
        examples: [
            { sv: "Mannen som står där är min lärare.", vi: "Người đàn ông đứng ở đó là thầy tôi." },
            { sv: "Boken som jag köpte är mycket bra.", vi: "Quyển sách tôi mua rất hay." },
            { sv: "Barnen som leker där ute är mycket snälla.", vi: "Những đứa trẻ chơi ngoài kia rất ngoan." }
        ]
    },
    {
        id: 9, emoji: "🔗", title: "Câu điều kiện (Om - If)",
        content: "Dùng 'Om' để đặt giả thiết. Với điều kiện không có thật, dùng quá khứ + 'skulle'.",
        examples: [
            { sv: "Om jag var rik, skulle jag köpa en buss.", vi: "Nếu tôi giàu, tôi sẽ mua một chiếc xe bus." },
            { sv: "Om det regnar, stannar jag hemma.", vi: "Nếu trời mưa, tôi ở nhà." }
        ]
    },
    {
        id: 10, emoji: "🔄", title: "Câu bị động (Passive)",
        content: "Có 2 cách: Thêm đuôi -s vào động từ, hoặc dùng cụm 'Bli + phân từ'.",
        examples: [
            { sv: "Dörren öppnas.", vi: "Cửa đang được mở (S-passive)." },
            { sv: "Han blev biten av en hund.", vi: "Anh ấy bị chó cắn (Bli-passive)." }
        ]
    },
    {
        id: 11, emoji: "💬", title: "Lời nói gián tiếp",
        content: "Khi kể lại lời người khác, dùng liên từ 'att' (rằng) và chú ý lùi thì động từ nếu cần.",
        examples: [
            { sv: 'Han säger: "Jag är trött".', vi: 'Anh ấy nói: "Tôi mệt".' },
            { sv: "Han säger att han är trött.", vi: "Anh ấy nói rằng anh ấy mệt." }
        ]
    },
    {
        id: 14, emoji: "🔢", title: "Số đếm & Số thứ tự",
        content: "Các số từ 1-10 và cách biến đổi sang số thứ tự.",
        table: {
            headers: ["Số", "Tiếng Thụy Điển", "Thứ tự", "Nghĩa"],
            rows: [["1", "en/ett", "första", "Thứ nhất"], ["2", "två", "andra", "Thứ hai"], ["3", "tre", "tredje", "Thứ ba"], ["4", "fyra", "fjärde", "Thứ tư"], ["5", "fem", "femte", "Thứ năm"]]
        }
    }
];
