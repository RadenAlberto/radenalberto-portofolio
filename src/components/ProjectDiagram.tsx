import React from 'react';

interface ProjectDiagramProps {
  type: 'catatan' | 'music' | 'fashion' | 'bigdata' | 'spk';
}

export const ProjectDiagram: React.FC<ProjectDiagramProps> = ({ type }) => {
  return (
    <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-[#0B0D14] border-b border-slate-200/80 dark:border-white/10">
      {/* Subtle architectural grid inside preview */}
      <div
        className="absolute inset-0 opacity-50 dark:opacity-40"
        style={{
          backgroundSize: '20px 20px',
          backgroundImage:
            'linear-gradient(to right, rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.08) 1px, transparent 1px)',
        }}
      />

      <div className="relative w-full h-full flex items-center justify-center p-4 transition-transform duration-300 ease-out group-hover:scale-105">
        {type === 'catatan' && (
          <svg
            viewBox="0 0 320 160"
            className="w-full h-full max-w-[290px]"
            fill="none"
            aria-label="Diagram arsitektur UI CatatanApp"
          >
            {/* Sidebar + Editor split layout */}
            <rect
              x="16"
              y="14"
              width="288"
              height="132"
              rx="8"
              className="fill-white dark:fill-[#131724] stroke-slate-300 dark:stroke-white/15"
              strokeWidth="1.2"
            />
            <rect
              x="24"
              y="24"
              width="70"
              height="112"
              rx="5"
              className="fill-slate-100 dark:fill-[#0E111B] stroke-slate-200 dark:stroke-white/10"
            />
            {/* Note list items */}
            <rect x="32" y="34" width="54" height="14" rx="3" fill="#3B82F6" fillOpacity="0.22" stroke="#3B82F6" strokeOpacity="0.6" />
            <rect x="32" y="54" width="46" height="8" rx="2" className="fill-slate-300 dark:fill-white/15" />
            <rect x="32" y="68" width="52" height="8" rx="2" className="fill-slate-300 dark:fill-white/10" />
            <rect x="32" y="82" width="40" height="8" rx="2" className="fill-slate-300 dark:fill-white/10" />
            {/* Main editor area */}
            <text x="106" y="40" className="fill-[#0891B2] dark:fill-[#22D3EE]" fontSize="7.5" fontFamily="JetBrains Mono, monospace">
              raln-catatanweb.onrender.com
            </text>
            <rect x="106" y="46" width="182" height="6" rx="2" className="fill-slate-300 dark:fill-white/15" />
            <rect x="106" y="58" width="164" height="6" rx="2" className="fill-slate-300 dark:fill-white/10" />
            <rect x="106" y="70" width="140" height="6" rx="2" className="fill-slate-300 dark:fill-white/10" />
            {/* Cloud DB sync & Resend notification nodes */}
            <rect x="106" y="92" width="84" height="36" rx="5" fill="#3B82F6" fillOpacity="0.14" stroke="#3B82F6" strokeOpacity="0.6" />
            <text x="148" y="114" textAnchor="middle" className="fill-[#3B82F6] dark:fill-[#60A5FA]" fontSize="9" fontFamily="JetBrains Mono, monospace">
              TURSO DB
            </text>
            <rect x="204" y="92" width="84" height="36" rx="5" fill="#06B6D4" fillOpacity="0.14" stroke="#06B6D4" strokeOpacity="0.6" />
            <text x="246" y="114" textAnchor="middle" className="fill-[#0891B2] dark:fill-[#22D3EE]" fontSize="9" fontFamily="JetBrains Mono, monospace">
              RESEND API
            </text>
            <path d="M190 110 H204" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="3 2" />
          </svg>
        )}

        {type === 'music' && (
          <svg
            viewBox="0 0 320 160"
            className="w-full h-full max-w-[290px]"
            fill="none"
            aria-label="Diagram antarmuka aplikasi pemutar musik Ralnfy"
          >
            <rect
              x="16"
              y="14"
              width="288"
              height="132"
              rx="8"
              className="fill-white dark:fill-[#131724] stroke-slate-300 dark:stroke-white/15"
              strokeWidth="1.2"
            />
            {/* Album disc */}
            <circle cx="66" cy="70" r="32" fill="#3B82F6" fillOpacity="0.16" stroke="#3B82F6" strokeOpacity="0.65" strokeWidth="1.5" />
            <circle cx="66" cy="70" r="10" fill="#06B6D4" fillOpacity="0.35" stroke="#06B6D4" strokeWidth="1.2" />
            {/* Track title & domain */}
            <text x="114" y="38" className="fill-[#0891B2] dark:fill-[#22D3EE]" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              RALNFY · MUSIC
            </text>
            <text x="114" y="51" className="fill-slate-500 dark:fill-slate-400" fontSize="7" fontFamily="JetBrains Mono, monospace">
              ralnfy.ai.studio
            </text>
            {/* Equalizer bars */}
            <rect x="114" y="72" width="6" height="18" rx="2" fill="#3B82F6" fillOpacity="0.6" />
            <rect x="124" y="64" width="6" height="26" rx="2" fill="#06B6D4" />
            <rect x="134" y="70" width="6" height="20" rx="2" fill="#3B82F6" fillOpacity="0.75" />
            <rect x="144" y="60" width="6" height="30" rx="2" fill="#06B6D4" fillOpacity="0.9" />
            <rect x="154" y="68" width="6" height="22" rx="2" fill="#3B82F6" fillOpacity="0.65" />
            <rect x="164" y="74" width="6" height="16" rx="2" fill="#06B6D4" fillOpacity="0.7" />
            {/* Queue list right */}
            <rect x="212" y="28" width="76" height="16" rx="3" fill="#3B82F6" fillOpacity="0.14" stroke="#3B82F6" strokeOpacity="0.5" />
            <rect x="212" y="50" width="76" height="14" rx="3" className="fill-slate-200 dark:fill-white/10" />
            <rect x="212" y="70" width="76" height="14" rx="3" className="fill-slate-200 dark:fill-white/10" />
            {/* Progress bar */}
            <rect x="34" y="122" width="252" height="6" rx="3" className="fill-slate-200 dark:fill-white/10" />
            <rect x="34" y="122" width="142" height="6" rx="3" fill="#06B6D4" />
          </svg>
        )}

        {type === 'fashion' && (
          <svg
            viewBox="0 0 320 160"
            className="w-full h-full max-w-[290px]"
            fill="none"
            aria-label="Diagram antarmuka aplikasi mobile katalog pakaian"
          >
            {/* Three mobile screens side-by-side */}
            <rect
              x="24"
              y="18"
              width="78"
              height="126"
              rx="10"
              className="fill-white dark:fill-[#131724] stroke-slate-300 dark:stroke-white/15"
              strokeWidth="1.3"
            />
            <rect x="32" y="28" width="62" height="44" rx="4" fill="#3B82F6" fillOpacity="0.18" stroke="#3B82F6" strokeOpacity="0.45" />
            <rect x="32" y="78" width="28" height="30" rx="4" className="fill-slate-200 dark:fill-white/10" />
            <rect x="66" y="78" width="28" height="30" rx="4" className="fill-slate-200 dark:fill-white/10" />
            <rect x="32" y="114" width="62" height="18" rx="4" fill="#06B6D4" fillOpacity="0.22" />

            {/* Center detail screen */}
            <rect
              x="121"
              y="10"
              width="78"
              height="140"
              rx="10"
              className="fill-white dark:fill-[#151A2A] stroke-[#3B82F6]/60"
              strokeWidth="1.5"
            />
            <rect x="131" y="22" width="58" height="58" rx="6" fill="#06B6D4" fillOpacity="0.18" stroke="#06B6D4" strokeOpacity="0.55" />
            <path d="M148 40 L160 34 L172 40 L168 62 H152 Z" stroke="#06B6D4" strokeWidth="1.5" fill="#06B6D4" fillOpacity="0.2" />
            <text x="160" y="94" textAnchor="middle" className="fill-slate-600 dark:fill-slate-200" fontSize="8" fontFamily="JetBrains Mono, monospace">
              UNIQLOPLUS
            </text>
            <text x="160" y="105" textAnchor="middle" className="fill-slate-400 dark:fill-slate-400" fontSize="6.2" fontFamily="JetBrains Mono, monospace">
              uniqloplus.onrender.com
            </text>
            <rect x="131" y="116" width="58" height="22" rx="5" fill="#3B82F6" />
            <text x="160" y="130" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              + CART
            </text>

            {/* Right cart screen */}
            <rect
              x="218"
              y="18"
              width="78"
              height="126"
              rx="10"
              className="fill-white dark:fill-[#131724] stroke-slate-300 dark:stroke-white/15"
              strokeWidth="1.3"
            />
            <rect x="226" y="30" width="62" height="24" rx="4" className="fill-slate-100 dark:fill-white/5 stroke-slate-200 dark:stroke-white/10" />
            <rect x="226" y="60" width="62" height="24" rx="4" className="fill-slate-100 dark:fill-white/5 stroke-slate-200 dark:stroke-white/10" />
            <rect x="226" y="92" width="62" height="1" className="fill-slate-300 dark:fill-white/15" />
            <rect x="226" y="104" width="62" height="26" rx="4" fill="#3B82F6" fillOpacity="0.16" stroke="#3B82F6" strokeOpacity="0.5" />
          </svg>
        )}

        {type === 'bigdata' && (
          <svg
            viewBox="0 0 320 160"
            className="w-full h-full max-w-[290px]"
            fill="none"
            aria-label="Diagram pipeline ETL OLAP dan visualisasi big data"
          >
            {/* ETL Pipeline top */}
            <rect x="20" y="20" width="76" height="30" rx="5" fill="#3B82F6" fillOpacity="0.16" stroke="#3B82F6" strokeOpacity="0.65" />
            <text x="58" y="38" textAnchor="middle" className="fill-[#2563EB] dark:fill-[#60A5FA]" fontSize="9" fontFamily="JetBrains Mono, monospace">
              PARQUET
            </text>
            <path d="M96 35 H122" stroke="#06B6D4" strokeWidth="1.5" />
            <rect x="122" y="20" width="76" height="30" rx="5" fill="#06B6D4" fillOpacity="0.16" stroke="#06B6D4" strokeOpacity="0.65" />
            <text x="160" y="38" textAnchor="middle" className="fill-[#0891B2] dark:fill-[#22D3EE]" fontSize="9" fontFamily="JetBrains Mono, monospace">
              ETL/PANDAS
            </text>
            <path d="M198 35 H224" stroke="#06B6D4" strokeWidth="1.5" />
            <rect x="224" y="20" width="76" height="30" rx="5" fill="#3B82F6" fillOpacity="0.16" stroke="#3B82F6" strokeOpacity="0.65" />
            <text x="262" y="38" textAnchor="middle" className="fill-[#2563EB] dark:fill-[#60A5FA]" fontSize="9" fontFamily="JetBrains Mono, monospace">
              OLAP VIEW
            </text>

            {/* Analytics Chart bottom */}
            <rect
              x="20"
              y="64"
              width="280"
              height="80"
              rx="6"
              className="fill-white dark:fill-[#131724] stroke-slate-300 dark:stroke-white/15"
            />
            <text x="34" y="79" className="fill-slate-500 dark:fill-slate-400" fontSize="7.2" fontFamily="JetBrains Mono, monospace">
              NYC TAXI · GEMPA DATASET
            </text>
            {/* Bars */}
            <rect x="38" y="108" width="16" height="24" rx="2" fill="#3B82F6" fillOpacity="0.5" />
            <rect x="64" y="96" width="16" height="36" rx="2" fill="#3B82F6" fillOpacity="0.7" />
            <rect x="90" y="84" width="16" height="48" rx="2" fill="#06B6D4" fillOpacity="0.85" />
            <rect x="116" y="100" width="16" height="32" rx="2" fill="#3B82F6" fillOpacity="0.6" />
            <rect x="142" y="76" width="16" height="56" rx="2" fill="#06B6D4" />
            {/* Trend line */}
            <path
              d="M180 122 L206 106 L232 112 L258 84 L284 92"
              stroke="#06B6D4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="206" cy="106" r="3" fill="#3B82F6" />
            <circle cx="258" cy="84" r="3.5" fill="#06B6D4" />
          </svg>
        )}

        {type === 'spk' && (
          <svg
            viewBox="0 0 320 160"
            className="w-full h-full max-w-[290px]"
            fill="none"
            aria-label="Diagram matriks pembobotan AHP dan Profile Matching"
          >
            {/* Left Matrix AHP */}
            <rect
              x="18"
              y="18"
              width="126"
              height="124"
              rx="7"
              className="fill-white dark:fill-[#131724] stroke-slate-300 dark:stroke-white/15"
            />
            <text x="30" y="36" className="fill-slate-500 dark:fill-slate-400" fontSize="8" fontFamily="JetBrains Mono, monospace">
              AHP · PROFILE
            </text>
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => {
                const isDiag = row === col;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={30 + col * 36}
                    y={48 + row * 28}
                    width="30"
                    height="22"
                    rx="3"
                    fill={isDiag ? '#06B6D4' : '#3B82F6'}
                    fillOpacity={isDiag ? 0.3 : 0.12}
                    stroke={isDiag ? '#06B6D4' : '#3B82F6'}
                    strokeOpacity={isDiag ? 0.8 : 0.35}
                  />
                );
              })
            )}

            {/* Connector */}
            <path d="M144 80 H176" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="160" cy="80" r="4" fill="#3B82F6" />

            {/* Right Ranking Output */}
            <rect
              x="176"
              y="18"
              width="126"
              height="124"
              rx="7"
              className="fill-white dark:fill-[#131724] stroke-slate-300 dark:stroke-white/15"
            />
            <text x="188" y="36" className="fill-slate-500 dark:fill-slate-400" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              RANKING OUTPUT
            </text>
            <rect x="188" y="48" width="102" height="22" rx="4" fill="#06B6D4" fillOpacity="0.22" stroke="#06B6D4" strokeOpacity="0.7" />
            <text x="196" y="62" className="fill-[#0891B2] dark:fill-[#22D3EE]" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              #1 · 0.914
            </text>
            <rect x="188" y="78" width="84" height="22" rx="4" fill="#3B82F6" fillOpacity="0.16" stroke="#3B82F6" strokeOpacity="0.5" />
            <text x="196" y="92" className="fill-[#2563EB] dark:fill-[#60A5FA]" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              #2 · 0.842
            </text>
            <rect x="188" y="108" width="66" height="22" rx="4" className="fill-slate-200 dark:fill-white/10" />
            <text x="196" y="122" className="fill-slate-600 dark:fill-slate-400" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              #3 · 0.768
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};
