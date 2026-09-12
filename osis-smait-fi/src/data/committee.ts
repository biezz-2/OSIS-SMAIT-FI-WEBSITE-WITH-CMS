// Committee data types and structure
export type CommitteeType = "core" | "division";

export interface Member {
  id: string;
  role?: string;
  name: string;
  photo?: string;
  photos?: string[]; // Array of photos for slider
}

export interface Division {
  id: string;
  label: string;
  type: CommitteeType;
  coordinator?: string;
  members: Member[] | string[];
}

// Extended committee data with complete names
const committeeData: Division[] = [
  {
    id: "div_inti",
    label: "Panitia Inti",
    type: "core",
    members: [
      { 
        id: "inti_1", 
        role: "主席 ( Ketua Umum)", 
        name: "Muhammad Azzam Firdaus", 
        photo: "/assets/panitia/Photo-Profile/azzam.webp",
        photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] 
      },
      { 
        id: "inti_2", 
        role: "副主席 (Waket)", 
        name: "Novel Windu Fajrian", 
        photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] 
      },
      { 
        id: "inti_3", 
        role: "秘书 (Sek)", 
        name: "Muhammad Hammam Jundurrahman", 
        photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] 
      },
      { 
        id: "inti_4", 
        role: "财务 (Bend)", 
        name: "Rakean Eka Lingga Wardana", 
        photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] 
      },
    ],
  },
  {
    id: "div_acara",
    label: "Divisi Acara",
    type: "division",
    coordinator: "Surya SIGIT",
    members: [
      { id: "acara_1", name: "Raihanah Ghina Eltsurayya", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "acara_2", name: "Wania Auliya Ramadani", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "acara_3", name: "Radytia Nur Hidayah", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "acara_4", name: "Aqila Al Humaira", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "acara_5", name: "Namira Putri Fachruddin", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "acara_6", name: "Al Fajri Alif Aumi", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "acara_7", name: "Muhammad Irsyad Kaamil Pasha", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "acara_8", name: "Achmad Anshor", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "acara_9", name: "Muhammad Haidar Al Ayyubi", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
  {
    id: "div_lomba",
    label: "Divisi Lomba",
    type: "division",
    coordinator: "Shyfa Putri Azzahra",
    members: [
      { id: "lomba_1", name: "Irsyad Muthi Amrullah", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lomba_2", name: "Almer Shaquelle Althafurrahmad Darmawan", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lomba_3", name: "Lian Muhamad Yaqzan", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lomba_4", name: "Yussie Yukennita Ramadani", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lomba_5", name: "Saskia Meka Tadriana", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lomba_6", name: "Fathimah Taslimah Rahma Fachelfi", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lomba_7", name: "Thifani Arifa Khilfa H.", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lomba_8", name: "Aina Rahma Aulia", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lomba_9", name: "Fathurrochman Roziq", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lomba_10", name: "Qaila Nusaybah Amani", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
  {
    id: "div_konsumsi",
    label: "Konsumsi & P3K",
    type: "division",
    coordinator: "Kayyisa Fathiyyah",
    members: [
      { id: "konsumsi_1", name: "Fatiya Kayisah Az-Zahra", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "konsumsi_2", name: "Zalfa Nur Afifa Zakauha", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "konsumsi_3", name: "Afiqoh Dayini Ataullah Purwana", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "konsumsi_4", name: "Alifah Shafina Amanda", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "konsumsi_5", name: "Raissa Zalika Sadina", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "konsumsi_6", name: "Afiyah Fitriyani Ramadani", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "konsumsi_7", name: "Annisa Regia Listia Faradina", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
  {
    id: "div_humas",
    label: "Humas",
    type: "division",
    coordinator: "Jasmine Vanya Aberka",
    members: [
      { id: "humas_1", name: "Anakia Munggaranti Yusan", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "humas_2", name: "Ray Jibril Ridwan", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "humas_3", name: "Qaulan Tsakilla", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "humas_4", name: "Safa Aprilia Ansari", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "humas_5", name: "Syarla Syafana Dewi", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "humas_6", name: "Laila Khusfi Zahrani", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "humas_7", name: "Irga Andreansyah Setiawan", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
  {
    id: "div_kesekre",
    label: "Kesekretariatan",
    type: "division",
    coordinator: "Rizka Rasyidah",
    members: [
      { id: "kesekre_1", name: "Aisha Ghassani Shaliha", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "kesekre_2", name: "Zaki Ibrahim Azis", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "kesekre_3", name: "Tsurayya Naqiya Octanary", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "kesekre_4", name: "Aluna Adelia Putri", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "kesekre_5", name: "Khalisa Kasih Anindya Kirani Putri", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "kesekre_6", name: "Prananda Ramadhan Ahmad", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
  {
    id: "div_keamanan",
    label: "Keamanan",
    type: "division",
    coordinator: "Abdurrahman Taqi Prasetyo",
    members: [
      { id: "keamanan_1", name: "Muhammad Rizky Tantana", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "keamanan_2", name: "Reyfa Saffa Maheswara", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "keamanan_3", name: "Ananda P. Pratama", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "keamanan_4", name: "Raihan Putra Arifandra", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "keamanan_5", name: "Darel Khalfan Gunadi", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "keamanan_6", name: "Reifa", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "keamanan_7", name: "Faqih Ibrahim", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "keamanan_8", name: "Raihan Akbar Putra Jaya", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
  {
    id: "div_pubdok",
    label: "Pubdok",
    type: "division",
    coordinator: "Keysha Nafidha Almira Gunawan",
    members: [
      { id: "pubdok_1", name: "Masagus Hafidhuddinh", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "pubdok_2", name: "Muhammad Syarif Attabi", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "pubdok_3", name: "Tangguh Fatahila Wulandana", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "pubdok_4", name: "Najwan Azhiim Muntadzor", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "pubdok_5", name: "Athaya Zanirah Ramadani", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "pubdok_6", name: "Muhammad Fahmi Ramadani", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "pubdok_7", name: "Firjatullah Ar-Rizqu Syakira H.", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "pubdok_8", name: "Muhammad Rizky Dzulqoidah", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
  {
    id: "div_lo",
    label: "Liaison Officer (LO)",
    type: "division",
    coordinator: "Adhiena Zahra Rizkya",
    members: [
      { id: "lo_1", name: "Vanesha Sesillawati", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lo_2", name: "Keisha Cleo Rustandi", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lo_3", name: "Rashika Rizquena", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lo_4", name: "Marisa Tabina Silvitiani Gunawan", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lo_5", name: "Zahra Anindya Putri Andrian", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lo_6", name: "Aisyah", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lo_7", name: "Nazmia Tsakib Hanani", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "lo_8", name: "Adzrahaifa Amadea Dwi", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
  {
    id: "div_danus",
    label: "Danus",
    type: "division",
    coordinator: "Kezzia Annisa Salsabila",
    members: [
      { id: "danus_1", name: "Azkarin Fidelya Khansabira", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "danus_2", name: "Zulfan Arifin Rustandi", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "danus_3", name: "Adhwa Nabilah Putri Marsilan", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "danus_4", name: "Alfira Alifiah Raiq", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "danus_5", name: "Nafeeza Keysakura Albanna", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "danus_6", name: "Muhammad Shofwan Abdul Hakim", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "danus_7", name: "Hadziq Mahfuz Muhammad", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
  {
    id: "div_artistik",
    label: "Artistik",
    type: "division",
    coordinator: "Banita Aliya Asrofa",
    members: [
      { id: "artistik_1", name: "Aliya Marwa Ruwaida", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "artistik_2", name: "Resti Dewi Lestari", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "artistik_3", name: "Medina Zulfa Nisa", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "artistik_4", name: "Nasya Ghalia Muharti", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "artistik_5", name: "Keanu Reivan Agasha", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "artistik_6", name: "Alfian Pramudya", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
      { id: "artistik_7", name: "Hanum Salsabila", photos: ["/assets/panitia/Photo-Profile/azzam.webp", "/assets/panitia/card/azzam.webp"] },
    ],
  },
];

// Helper function to find division by member
function findDivisionByMember(member: Member | string, divisions: Division[]): string | undefined {
  for (const div of divisions) {
    if (typeof member === "string") {
      // Check if div.members contains strings
      if (div.members.some(m => typeof m === "string" && m === member)) {
        return div.label;
      }
    } else {
      if (div.members.some(m => typeof m === "object" && m.id === member.id)) {
        return div.label;
      }
    }
  }
  return undefined;
}

// Helper function to get main photo (from photo field, or first from photos array)
function getMainPhoto(member: Member | string): string | undefined {
  if (typeof member === "string") return undefined;
  return member.photo || (member.photos && member.photos[0]);
}

export { committeeData, findDivisionByMember, getMainPhoto };
export default committeeData;
