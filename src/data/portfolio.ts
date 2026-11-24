export type ProjectCategory = 'Semua' | 'Web & Mobile' | 'Data & Sistem';

export interface ProjectItem {
  id: string;
  serial: string;
  title: string;
  category: Exclude<ProjectCategory, 'Semua'>;
  year: string;
  summary: string;
  detail: string;
  stack: string[];
  liveUrl?: string;
  /** Opsional: path foto/screenshot proyek di folder public/proyek/, misal '/proyek/catatan-app.png' */
  imageUrl?: string;
  diagramType: 'catatan' | 'fashion' | 'bigdata' | 'spk';
}

export interface FocusItem {
  indexLabel: string;
  filename: string;
  title: string;
  description: string;
  highlights: string[];
}

export interface SkillGroup {
  filename: string;
  title: string;
  items: string[];
}

export interface CertificateItem {
  serial: string;
  /** Inisial 2 huruf di kotak kiri sertifikat, misal 'PY', 'SI', 'WD', 'DA' */
  code?: string;
  title: string;
  period: string;
  description: string;
  /** Opsional: path file sertifikat (.jpg/.png/.pdf) di folder public/sertifikat/, misal '/sertifikat/python-pro.pdf' */
  fileUrl?: string;
}

export const PROFILE = {
  shortName: 'Raden Alberto',
  fullName: 'Raden Alberto Lumintu Negoro',
  email: 'lumintzbelajar@gmail.com',
  githubUrl: 'https://github.com/radenalberto',
  cvUrl: '/CV_Raden_Alberto.pdf',
  /** Taruh file foto profil di folder: public/foto-profil.jpeg (atau ubah path di bawah sesuai nama file) */
  photoUrl: '/foto-profil.jpeg',
  availability: 'Terbuka untuk Magang IT / MBKM • Desember 2026 – Juni 2027 (WFO / Hybrid)',
  headlineSub:
    'Mahasiswa Semester 5 S1 Sistem Informasi di Universitas Tarumanagara yang antusias membangun aplikasi web, antarmuka mobile, dan solusi pengolahan data bersama tim.',
  metadata: [
    { label: 'Kampus', value: 'UNTAR · Jakarta Barat (6°10′S 106°47′E)' },
    { label: 'Program Studi', value: 'S1 Sistem Informasi — Semester 5' },
    {
      label: 'Minat Peran',
      value: 'Web/Mobile Developer, Data Analyst, System Analyst, QA / IT Support',
    },
  ],
  aboutParagraphs: [
    'Halo! Saya Alberto, mahasiswa S1 Sistem Informasi semester 5 di Universitas Tarumanagara yang sedang bersemangat mempersiapkan diri untuk berkontribusi langsung di dunia kerja melalui program magang IT / MBKM.',
    'Dalam keseharian kuliah maupun proyek mandiri, saya paling menikmati momen menjembatani kebutuhan pengguna dengan solusi teknologi yang rapi—mulai dari menyusun antarmuka aplikasi web dan mobile yang nyaman dipakai, hingga membersihkan dan mengolah data mentah menjadi informasi yang mudah dipahami tim.',
    'Saya percaya proses belajar terbaik terjadi saat berkolaborasi: mendengar masukan, mendiskusikan arsitektur atau bug bersama rekan tim, dan terus merapikan kode selangkah demi selangkah.',
  ],
  semesterCurrent: 5,
  semesterTotal: 8,
  ipkCurrent: 3.23,
  ipkMax: 4.0,
};

export const FOCUS_ITEMS: FocusItem[] = [
  {
    indexLabel: '01 / 02',
    filename: 'fullstack-cloud.dev',
    title: 'Pengembangan Web Full-Stack & Cloud Database',
    description:
      'Memperdalam arsitektur Next.js App Router, pengelolaan basis data serverless Turso DB (LibSQL), serta integrasi layanan API untuk aplikasi web yang responsif.',
    highlights: ['Next.js App Router', 'Turso DB (LibSQL)', 'REST & Email API'],
  },
  {
    indexLabel: '02 / 02',
    filename: 'data-mobile.lab',
    title: 'Big Data Analytics & Antarmuka Mobile',
    description:
      'Mengasah kemampuan pembersihan dan visualisasi dataset besar dengan Python Pandas, sekaligus membangun tampilan aplikasi lintas platform menggunakan Flutter & Dart.',
    highlights: ['Python & Pandas', 'ETL & OLAP', 'Flutter & Dart'],
  },
];

/*
  CARA MENAMBAH FOTO PROYEK:
  1. Taruh file foto/screenshot di folder: public/proyek/  (misal: public/proyek/catatan.png)
  2. Tambahkan baris imageUrl: '/proyek/catatan.png', di dalam data proyek di bawah ini.
*/
export const PROJECTS: ProjectItem[] = [
  {
    id: 'catatan-app',
    serial: 'PROJECT 01',
    title: 'CatatanApp — Aplikasi Web Catatan Personal',
    category: 'Web & Mobile',
    year: '2026',
    summary:
      'Aplikasi pencatatan web full-stack mode gelap dengan penyimpanan database cloud real-time dan notifikasi email.',
    detail:
      'Dirancang dan dibangun mandiri menggunakan Next.js App Router, TypeScript, Tailwind CSS, Turso DB (LibSQL), Resend API, dan di-deploy aktif di Render.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Turso DB', 'Resend API', 'Render'],
    liveUrl: 'https://raln-catatanweb.onrender.com',
    diagramType: 'catatan',
  },
  {
    id: 'uniqlo-inspired-app',
    serial: 'PROJECT 02',
    title: 'Aplikasi Belanja Pakaian Mobile (Inspirasi Uniqlo)',
    category: 'Web & Mobile',
    year: '2026',
    summary:
      'Aplikasi mobile katalog dan keranjang belanja pakaian lintas platform yang dikerjakan secara kolaboratif dalam tim.',
    detail:
      'Berkontribusi sekitar 50% pada perancangan antarmuka pengguna (halaman katalog, detail produk, dan keranjang belanja) serta berkolaborasi melakukan debugging dan perbaikan error pada logika backend.',
    stack: ['Flutter', 'Dart', 'Android Studio', 'Git'],
    diagramType: 'fashion',
  },
  {
    id: 'big-data-analytics',
    serial: 'PROJECT 03',
    title: 'Pengolahan & Visualisasi Big Data (NYC Taxi & Data Gempa)',
    category: 'Data & Sistem',
    year: '2026',
    summary:
      'Pembersihan data (data cleansing), transformasi ETL/OLAP, dan visualisasi grafik pada dataset perjalanan taksi NYC (Parquet) serta data gempa.',
    detail:
      'Mengolah ribuan baris data mentah di Google Colab menggunakan Python dan Pandas untuk menghasilkan ringkasan statistik dan grafik tren yang mudah dipahami.',
    stack: ['Python', 'Pandas', 'Google Colab', 'ETL', 'OLAP'],
    diagramType: 'bigdata',
  },
  {
    id: 'spk-ahp-pm',
    serial: 'PROJECT 04',
    title: 'Sistem Penunjang Keputusan (Profile Matching & AHP)',
    category: 'Data & Sistem',
    year: '2026',
    summary:
      'Program pemodelan pengambilan keputusan multi-kriteria untuk pembobotan dan pemeringkatan kandidat.',
    detail:
      'Mengimplementasikan perhitungan matriks bobot kriteria dan pemeringkatan alternatif menggunakan metode Profile Matching dan Analytic Hierarchy Process (AHP) dalam bahasa C++.',
    stack: ['C++', 'Profile Matching', 'AHP'],
    diagramType: 'spk',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    filename: 'web-mobile.stack',
    title: 'Web & Mobile',
    items: [
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'Flutter',
      'Dart',
      'HTML5',
      'CSS3',
    ],
  },
  {
    filename: 'data-db.stack',
    title: 'Data & Basis Data',
    items: [
      'Python',
      'Pandas',
      'Oracle Database (SQL & Dasar DBA)',
      'Turso DB (LibSQL)',
      'ETL & OLAP',
    ],
  },
  {
    filename: 'systems-eng.stack',
    title: 'Sistem & Pemrograman',
    items: [
      'C++ (OOP)',
      'Perancangan Sistem (ERD)',
      'Sistem Penunjang Keputusan',
      'Lean Six Sigma',
    ],
  },
  {
    filename: 'tools-collab.stack',
    title: 'Tools & Kolaborasi',
    items: ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Google Colab', 'Render'],
  },
];

/*
  CARA MENAMBAH SERTIFIKAT BARU:
  1. Taruh file sertifikat (.jpg / .png / .pdf) di folder: public/sertifikat/
  2. Copy-paste 1 blok { ... } di bawah ini, lalu ubah serial, code, title, period, description, dan fileUrl.
     Contoh:
     {
       serial: 'NO. 003',
       code: 'DA',
       title: 'Nama Sertifikat Kamu — Penyelenggara',
       period: 'Bulan Tahun',
       description: 'Ringkasan singkat materi atau pencapaian sertifikat.',
       fileUrl: '/sertifikat/nama-file-kamu.jpg',
     },
*/
export const CERTIFICATES: CertificateItem[] = [
  {
    serial: 'NO. 001',
    code: 'PY',
    title: 'Python Pro (2nd Year) — Algonova by Algorithmics',
    period: 'Desember 2024 – September 2025',
    description:
      'Pelatihan pemrograman Python lanjutan mencakup struktur data dan Object-Oriented Programming (OOP).',
  },
  {
    serial: 'NO. 002',
    code: 'SI',
    title: 'Kurikulum Inti S1 Sistem Informasi — Universitas Tarumanagara',
    period: 'Semester 1 – Semester 5 (Aktif)',
    description:
      'Analisis Big Data, Sistem Penunjang Keputusan, Manajemen Basis Data Oracle, Analisis & Perancangan Sistem Informasi, Rekayasa Perangkat Lunak, Lean Six Sigma.',
  },
];

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// Deterministic 26-week (182-day) realistic academic & personal project coding activity matrix
export function getContributionWeeks(): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  // End reference date in November 2026
  const endDate = new Date(2026, 10, 14);
  const totalDays = 26 * 7;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (totalDays - 1));

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  for (let w = 0; w < 26; w++) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + idx);

      // Deterministic pseudo-random wave tuned to semester & project sprints
      const seed = (idx * 37 + w * 13 + d * 7) % 100;
      const sprintBoost = w >= 8 && w <= 13 ? 18 : w >= 19 ? 22 : 0;
      const score = (seed + sprintBoost) % 100;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      let count = 0;
      if (score > 86) {
        level = 4;
        count = 5 + (seed % 4);
      } else if (score > 68) {
        level = 3;
        count = 3 + (seed % 2);
      } else if (score > 46) {
        level = 2;
        count = 2;
      } else if (score > 26) {
        level = 1;
        count = 1;
      }

      const formattedDate = `${current.getDate()} ${monthNames[current.getMonth()]} ${current.getFullYear()}`;
      week.push({ date: formattedDate, count, level });
    }
    weeks.push(week);
  }
  return weeks;
}
