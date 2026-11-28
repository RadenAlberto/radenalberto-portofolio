export type ProjectCategory = 'Semua' | 'Web & Mobile' | 'Data & Sistem';
export type ProjectLayoutMode = 'grid' | 'bento' | 'list';

export interface ProjectItem {
  id: string;
  serial: string;
  title: string;
  category: Exclude<ProjectCategory, 'Semua'>;
  year: string;
  summary: string;
  detail: string;
  stack: string[];
  /** Peran Anda di proyek ini, misal: 'Full-Stack Mandiri' atau 'Frontend Tim (50%)' */
  role?: string;
  liveUrl?: string;
  /** Link repositori GitHub proyek (opsional). Contoh: 'https://github.com/radenalberto/catatan-app' */
  repoUrl?: string;
  /** Foto utama kartu (cover). Contoh: '/proyek/catatan-1.png' */
  imageUrl?: string;
  /** Galeri foto tambahan (tampil sebagai slider saat kartu diklik). Contoh: ['/proyek/catatan-2.png', '/proyek/catatan-3.png'] */
  gallery?: string[];
  /** Keterangan tahap/fitur untuk tiap slide di galeri (1-to-1 dengan [imageUrl, ...gallery]) */
  galleryCaptions?: string[];
  /** Pilih 'contain' untuk screenshot HP/portrait agar tidak terpotong, atau 'cover' (default) untuk memenuhi bingkai */
  imageFit?: 'cover' | 'contain';
  /** Set true agar proyek diprioritaskan di Beranda & tampil besar di mode tata letak Bento */
  featured?: boolean;
  /** Opsional: ilustrasi cadangan jika belum ada foto */
  diagramType?: 'catatan' | 'music' | 'fashion' | 'bigdata' | 'spk';
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
  /** Isi link LinkedIn Anda di sini jika sudah siap ditampilkan (misal: 'https://linkedin.com/in/username') */
  linkedinUrl: '',
  /** File CV PDF Anda di folder: public/cv-raden-alberto.pdf (kosongkan '' jika ingin menyembunyikan tombol Unduh CV) */
  cvUrl: '/cv-raden-alberto.pdf',
  cvDownloadName: 'CV Raden Alberto.pdf',
  /** Taruh file foto profil di folder: public/foto-profil.jpeg (atau ubah path di bawah sesuai nama file) */
  photoUrl: '/foto-profil.jpeg',
  availability: 'Terbuka untuk Magang IT / MBKM • Desember 2026 – Juni 2027 (WFO / Hybrid)',
  headlineSub:
    'Mahasiswa S1 Sistem Informasi Semester 5 di Universitas Tarumanagara. Berfokus pada pengembangan aplikasi web, antarmuka mobile Flutter, dan pengolahan data menggunakan Python serta SQL.',
  metadata: [
    { label: 'Kampus', value: 'UNTAR · Jakarta Barat (6°10′S 106°47′E)' },
    { label: 'Program Studi', value: 'S1 Sistem Informasi — Semester 5' },
    {
      label: 'Minat Peran',
      value: 'Web/Mobile Developer, Data Analyst, System Analyst, QA / IT Support',
    },
  ],
  aboutParagraphs: [
    'Saya Alberto, mahasiswa Semester 5 S1 Sistem Informasi di Universitas Tarumanagara (UNTAR) yang sedang mempersiapkan diri untuk program magang IT / MBKM (Desember 2026 – Juni 2027).',
    'Saya terbiasa mengerjakan proyek dari perancangan hingga implementasi: membangun web app full-stack dengan Next.js dan database cloud, menyusun UI aplikasi belanja mobile di Flutter, hingga mengolah data mentah menggunakan Python Pandas.',
    'Dalam kerja tim, saya nyaman berbagi peran antara antarmuka dan backend, melacak error bersama lewat Git, serta merapikan dokumentasi sistem agar mudah dipahami anggota tim lain.',
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
  =============================================================================
  PANDUAN MENGATUR KARYA, FOTO, & TATA LETAK:
  1. TAMBAH FOTO:
     - Taruh foto/screenshot (.png / .jpg / .webp) ke folder: public/proyek/
     - Isi `imageUrl: '/proyek/nama-foto-utama.png'` untuk sampul kartu.
     - Jika ada beberapa foto, tambahkan `gallery: ['/proyek/foto-2.png', '/proyek/foto-3.png']`.
     - Untuk screenshot HP vertikal agar utuh tidak terpotong, tambahkan `imageFit: 'contain'`.
  2. TAMBAH KARYA BARU:
     - Copy salah satu blok `{ ... }` di array PROJECTS, taruh di urutan yang diinginkan
       (urutan atas = tampil lebih dulu), lalu ubah id, serial, title, category, year, summary, detail, stack.
  3. ATUR TATA LETAK:
     - Ubah `defaultLayout` di PROJECT_SECTION_CONFIG:
       'bento' -> Kartu utama (featured: true) lebar penuh di atas, sisanya 2 kolom
       'grid'  -> Semua kartu 2 kolom sama rata
       'list'  -> Tampilan baris horizontal (gambar kiri, detail kanan)
     - Ubah `homeShowcaseCount` untuk mengatur jumlah karya yang tampil di Beranda (misal 3 atau 4).
  =============================================================================
*/
export const PROJECT_SECTION_CONFIG: {
  defaultLayout: ProjectLayoutMode;
  homeShowcaseCount: number;
} = {
  defaultLayout: 'bento',
  homeShowcaseCount: 3,
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'catatan-app',
    serial: 'PROJECT 01',
    title: 'CatatanApp — Aplikasi Web Catatan Personal',
    category: 'Web & Mobile',
    year: '2026',
    role: 'Full-Stack Mandiri',
    summary:
      'Aplikasi web pencatatan personal mode gelap dengan sinkronisasi database cloud real-time dan notifikasi email otomatis.',
    detail:
      'Membangun keseluruhan frontend dan backend menggunakan Next.js App Router, TypeScript, dan Tailwind CSS; menghubungkan penyimpanan cloud Turso DB (LibSQL) serta notifikasi via Resend API sebelum di-deploy ke Render.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Turso DB', 'Resend API', 'Render'],
    liveUrl: 'https://raln-catatanweb.onrender.com',
    featured: true,
    diagramType: 'catatan',
  },
  {
    id: 'ralnfy-music',
    serial: 'PROJECT 02',
    title: 'Ralnfy — Streaming Musik & AI DJ (Web Music Player)',
    category: 'Web & Mobile',
    year: '2026',
    role: 'Pengembang Web Mandiri',
    summary:
      'Aplikasi web pemutar musik YouTube Music dengan mode piringan hitam (vinyl), lirik sinkron interaktif LRCLIB, kurasi AI personal, dan Asisten Musik AI.',
    detail:
      'Membangun antarmuka pemutar musik lengkap dengan 9 alur fitur utama: mulai dari eksplorasi beranda & kurasi suasana AI, mode pemutar piringan hitam (vinyl player) dengan jarum pemutar dan lirik karaoke sinkron realtime (kontrol tempo & offset timing), integrasi metadata katalog LRCLIB, Asisten Musik AI (AI DJ dialog pintar), manajemen playlist koleksi & lagu disukai, hingga pencatatan histori pemutaran dengan fitur smart resume dan kontrol privasi pencarian.',
    stack: [
      'TypeScript',
      'Tailwind CSS',
      'YouTube Stream',
      'LRCLIB Synced Lyrics',
      'AI DJ Assistant',
      'Audio UI',
    ],
    liveUrl: 'https://ralnfy.ai.studio',
    imageUrl: '/proyek/ralnfy/01-beranda-kurasi-ai.png',
    gallery: [
      '/proyek/ralnfy/02-vinyl-player-deja-vu.png',
      '/proyek/ralnfy/03-lirik-sinkron-offset.png',
      '/proyek/ralnfy/04-profil-lagu-antrean.png',
      '/proyek/ralnfy/05-asisten-musik-ai.png',
      '/proyek/ralnfy/06-koleksi-playlist-tersimpan.png',
      '/proyek/ralnfy/07-daftar-lagu-disukai.png',
      '/proyek/ralnfy/08-histori-pemutaran.png',
      '/proyek/ralnfy/09-riwayat-pencarian-privasi.png',
    ],
    galleryCaptions: [
      'Tahap 1 · Beranda Musik & Kurasi AI: Eksplorasi lagu, rekomendasi cepat berdasarkan suasana (Trending, Pop, Indie, Chill Lo-Fi).',
      'Tahap 2 · Pemutar Piringan Hitam (Vinyl Record): Animasi piringan berputar, jarum pemutar, visualizer neon, & lirik sinkron realtime.',
      'Tahap 3 · Mode Karaoke & Offset Lirik: Fitur sinkronisasi ketukan lirik (-2d s/d +2d), kontrol tempo playback, dan klik lirik untuk seek audio.',
      'Tahap 4 · Profil Lagu & Integrasi Metadata: Penarikan metadata resmi katalog LRCLIB, informasi artis/album, serta antrean putar lagu.',
      'Tahap 5 · Asisten Musik AI (AI DJ): Dialog cerdas untuk konsultasi lagu, rekomendasi genre, dan bedah makna lirik lagu.',
      'Tahap 6 · Manajemen Koleksi & Playlist: Pengelolaan pustaka lagu tersimpan, tampilan cover album, dan status pemutar aktif.',
      'Tahap 7 · Daftar Lagu Favorit: Kurasi lagu yang disukai dengan opsi pembuatan playlist manual maupun rekomendasi AI otomatis.',
      'Tahap 8 · Histori Pemutaran & Smart Resume: Pencatatan riwayat dengar kronologis dengan fitur lanjutkan pemutaran dari posisi menit terakhir.',
      'Tahap 9 · Riwayat Pencarian & Kontrol Privasi: Pelacakan kata kunci pencarian dengan opsi hapus riwayat dan tombol jeda perekaman histori.',
    ],
    featured: true,
    diagramType: 'music',
  },
  {
    id: 'uniqlo-inspired-app',
    serial: 'PROJECT 03',
    title: 'UniqloPlus — Aplikasi Belanja Pakaian (Inspirasi Uniqlo)',
    category: 'Web & Mobile',
    year: '2026',
    role: 'Frontend & Debugging Tim (50%)',
    summary:
      'Aplikasi katalog produk dan keranjang belanja pakaian yang dibangun bersama tim, mulai dari halaman produk hingga checkout.',
    detail:
      'Mengerjakan sekitar 50% perancangan antarmuka pengguna (katalog, detail produk, dan keranjang belanja) serta membantu tim melakukan debugging logika backend hingga aplikasi berjalan aktif di Render.',
    stack: ['Flutter', 'Dart', 'Android Studio', 'Git', 'Render'],
    liveUrl: 'https://uniqloplus.onrender.com',
    imageFit: 'contain',
    diagramType: 'fashion',
  },
  {
    id: 'big-data-analytics',
    serial: 'PROJECT 04',
    title: 'Pengolahan & Visualisasi Big Data (NYC Taxi & Data Gempa)',
    category: 'Data & Sistem',
    year: '2026',
    role: 'Data Cleansing & Visualisasi',
    summary:
      'Pembersihan ribuan baris data mentah, transformasi ETL/OLAP, dan visualisasi grafik tren pada dataset NYC Taxi (Parquet) serta data gempa.',
    detail:
      'Mengolah dataset skala besar di Google Colab menggunakan Python dan Pandas untuk menyaring anomali data, merangkum agregasi OLAP, dan menyajikan grafik tren statistik.',
    stack: ['Python', 'Pandas', 'Google Colab', 'ETL', 'OLAP'],
    diagramType: 'bigdata',
  },
  {
    id: 'spk-ahp-pm',
    serial: 'PROJECT 05',
    title: 'Sistem Penunjang Keputusan (Profile Matching & AHP)',
    category: 'Data & Sistem',
    year: '2026',
    role: 'Pemodelan & Implementasi C++',
    summary:
      'Program pemodelan pengambilan keputusan multi-kriteria untuk pembobotan kriteria dan pemeringkatan alternatif kandidat.',
    detail:
      'Mengimplementasikan perhitungan matriks perbandingan berpasangan, uji konsistensi bobot, serta pemeringkatan skor akhir menggunakan metode Profile Matching dan AHP dalam bahasa C++.',
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
