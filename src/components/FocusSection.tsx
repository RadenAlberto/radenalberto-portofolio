import React from 'react';
import { RevealOnScroll } from './RevealOnScroll';
import { FOCUS_ITEMS } from '../data/portfolio';

export const FocusArchitectureIllustration: React.FC<{ variant: 'fullstack' | 'datamobile' }> = ({
  variant,
}) => {
  if (variant === 'fullstack') {
    return (
      <svg
        viewBox="0 0 380 260"
        className="w-full max-w-[360px] mx-auto drop-shadow-sm"
        fill="none"
        aria-label="Ilustrasi arsitektur Full-Stack Next.js App Router dan Cloud Database Turso DB"
      >
        {/* Subtle Isometric Blueprint Base */}
        <polygon
          points="190,235 45,175 190,115 335,175"
          className="fill-[#3B82F6]/[0.06] dark:fill-[#06B6D4]/[0.08] stroke-[#3B82F6]/35 dark:stroke-[#06B6D4]/35"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />

        {/* Cloud Database Stack (Turso LibSQL) */}
        <g transform="translate(115, 130)">
          <ellipse
            cx="75"
            cy="52"
            rx="62"
            ry="18"
            className="fill-white dark:fill-[#11131C] stroke-[#3B82F6] dark:stroke-[#06B6D4]"
            strokeWidth="1.5"
          />
          <path
            d="M13 30 V52 C13 62 41 70 75 70 C109 70 137 62 137 52 V30"
            className="fill-white dark:fill-[#11131C] stroke-[#3B82F6] dark:stroke-[#06B6D4]"
            strokeWidth="1.5"
          />
          <ellipse
            cx="75"
            cy="30"
            rx="62"
            ry="18"
            className="fill-[#3B82F6]/15 dark:fill-[#06B6D4]/20 stroke-[#3B82F6] dark:stroke-[#06B6D4]"
            strokeWidth="1.5"
          />
          <text
            x="75"
            y="34"
            textAnchor="middle"
            className="fill-[#2563EB] dark:fill-[#22D3EE]"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            TURSO DB (LIBSQL)
          </text>
        </g>

        {/* Data Flow Connectors */}
        <path
          d="M190 96 V142"
          stroke="#06B6D4"
          strokeWidth="1.8"
          strokeDasharray="4 3"
        />
        <circle cx="190" cy="119" r="4" fill="#3B82F6" />

        {/* Top Application Window (Next.js App Router) */}
        <g transform="translate(65, 22)">
          <rect
            x="0"
            y="0"
            width="250"
            height="78"
            rx="8"
            className="fill-white dark:fill-[#131724] stroke-slate-300 dark:stroke-white/25"
            strokeWidth="1.5"
          />
          <path
            d="M0 20 H250"
            className="stroke-slate-200 dark:stroke-white/15"
            strokeWidth="1.2"
          />
          <circle cx="14" cy="10" r="3" fill="#3B82F6" />
          <circle cx="25" cy="10" r="3" fill="#06B6D4" />
          <circle cx="36" cy="10" r="3" className="fill-slate-300 dark:fill-white/25" />
          <text
            x="236"
            y="13"
            textAnchor="end"
            className="fill-slate-400 dark:fill-slate-400"
            fontSize="8.5"
            fontFamily="JetBrains Mono, monospace"
          >
            NEXT.JS APP ROUTER
          </text>

          {/* Left UI preview + Right API card */}
          <rect
            x="14"
            y="30"
            width="132"
            height="36"
            rx="4"
            className="fill-slate-100 dark:fill-[#0B0E17] stroke-slate-200 dark:stroke-white/10"
          />
          <rect x="22" y="38" width="68" height="7" rx="2" fill="#3B82F6" fillOpacity="0.65" />
          <rect
            x="22"
            y="50"
            width="108"
            height="5"
            rx="2"
            className="fill-slate-300 dark:fill-white/15"
          />

          <rect
            x="156"
            y="30"
            width="80"
            height="36"
            rx="4"
            fill="#06B6D4"
            fillOpacity="0.14"
            stroke="#06B6D4"
            strokeOpacity="0.6"
          />
          <text
            x="196"
            y="51"
            textAnchor="middle"
            className="fill-[#0891B2] dark:fill-[#22D3EE]"
            fontSize="8.5"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            REST / EMAIL
          </text>
        </g>

        {/* Precision Corner Marks */}
        <path d="M24 38 V24 H38" stroke="#3B82F6" strokeOpacity="0.45" strokeWidth="1.5" />
        <path d="M356 222 V236 H342" stroke="#06B6D4" strokeOpacity="0.45" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 380 260"
      className="w-full max-w-[360px] mx-auto drop-shadow-sm"
      fill="none"
      aria-label="Ilustrasi pipeline Python Pandas ETL dan tampilan aplikasi mobile Flutter"
    >
      {/* Left ETL & Data Analytics Stack */}
      <g transform="translate(22, 26)">
        <rect
          x="0"
          y="0"
          width="196"
          height="204"
          rx="8"
          className="fill-white dark:fill-[#131724] stroke-slate-300 dark:stroke-white/25"
          strokeWidth="1.5"
        />
        <text
          x="16"
          y="22"
          className="fill-slate-500 dark:fill-slate-400"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
        >
          PYTHON · PANDAS ETL
        </text>
        <path d="M0 32 H196" className="stroke-slate-200 dark:stroke-white/15" />

        {/* ETL Badges */}
        <rect
          x="16"
          y="46"
          width="50"
          height="24"
          rx="4"
          fill="#3B82F6"
          fillOpacity="0.14"
          stroke="#3B82F6"
          strokeOpacity="0.6"
        />
        <text
          x="41"
          y="61"
          textAnchor="middle"
          className="fill-[#2563EB] dark:fill-[#60A5FA]"
          fontSize="8"
          fontFamily="JetBrains Mono, monospace"
        >
          RAW
        </text>
        <path d="M66 58 H74" stroke="#06B6D4" strokeWidth="1.5" />
        <rect
          x="74"
          y="46"
          width="54"
          height="24"
          rx="4"
          fill="#06B6D4"
          fillOpacity="0.16"
          stroke="#06B6D4"
          strokeOpacity="0.7"
        />
        <text
          x="101"
          y="61"
          textAnchor="middle"
          className="fill-[#0891B2] dark:fill-[#22D3EE]"
          fontSize="8"
          fontFamily="JetBrains Mono, monospace"
        >
          CLEAN
        </text>
        <path d="M128 58 H136" stroke="#06B6D4" strokeWidth="1.5" />
        <rect
          x="136"
          y="46"
          width="44"
          height="24"
          rx="4"
          fill="#3B82F6"
          fillOpacity="0.14"
          stroke="#3B82F6"
          strokeOpacity="0.6"
        />
        <text
          x="158"
          y="61"
          textAnchor="middle"
          className="fill-[#2563EB] dark:fill-[#60A5FA]"
          fontSize="8"
          fontFamily="JetBrains Mono, monospace"
        >
          OLAP
        </text>

        {/* Bar & Line Chart */}
        <rect x="20" y="140" width="18" height="44" rx="2" fill="#3B82F6" fillOpacity="0.45" />
        <rect x="46" y="122" width="18" height="62" rx="2" fill="#3B82F6" fillOpacity="0.65" />
        <rect x="72" y="102" width="18" height="82" rx="2" fill="#06B6D4" fillOpacity="0.85" />
        <rect x="98" y="128" width="18" height="56" rx="2" fill="#3B82F6" fillOpacity="0.55" />
        <rect x="124" y="92" width="18" height="92" rx="2" fill="#06B6D4" />
        <rect x="150" y="114" width="18" height="70" rx="2" fill="#3B82F6" fillOpacity="0.75" />
        <path
          d="M28 130 L55 112 L81 95 L107 118 L133 84 L160 104"
          stroke="#22D3EE"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Connector Beam */}
      <path d="M218 128 H246" stroke="#06B6D4" strokeWidth="1.6" strokeDasharray="4 3" />

      {/* Right Flutter Mobile Wireframe */}
      <g transform="translate(246, 36)">
        <rect
          x="0"
          y="0"
          width="110"
          height="188"
          rx="14"
          className="fill-white dark:fill-[#151A2A] stroke-[#3B82F6] dark:stroke-[#06B6D4]"
          strokeWidth="1.8"
        />
        <rect
          x="36"
          y="10"
          width="38"
          height="4"
          rx="2"
          className="fill-slate-300 dark:fill-white/25"
        />
        <rect
          x="12"
          y="24"
          width="86"
          height="58"
          rx="6"
          fill="#3B82F6"
          fillOpacity="0.16"
          stroke="#3B82F6"
          strokeOpacity="0.5"
        />
        <text
          x="55"
          y="57"
          textAnchor="middle"
          className="fill-[#2563EB] dark:fill-[#22D3EE]"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
        >
          FLUTTER UI
        </text>
        <rect
          x="12"
          y="92"
          width="40"
          height="42"
          rx="5"
          className="fill-slate-100 dark:fill-white/5 stroke-slate-200 dark:stroke-white/15"
        />
        <rect
          x="58"
          y="92"
          width="40"
          height="42"
          rx="5"
          className="fill-slate-100 dark:fill-white/5 stroke-slate-200 dark:stroke-white/15"
        />
        <rect x="12" y="144" width="86" height="28" rx="6" fill="#3B82F6" />
        <text
          x="55"
          y="162"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="8.5"
          fontFamily="JetBrains Mono, monospace"
        >
          DART MODULE
        </text>
      </g>
    </svg>
  );
};

export const FocusSection: React.FC = () => {
  return (
    <section id="fokus" className="py-8 sm:py-12 space-y-12">
      <RevealOnScroll>
        <div className="pb-6 border-b border-slate-200 dark:border-white/15">
          <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">03</span>
            <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
            <span>FOKUS SAAT INI</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-none">
            Sedang Dipelajari
          </h2>
        </div>
      </RevealOnScroll>

      {/* Alternating Asymmetric Editorial Rows (Open Canvas, No Identical Boxes) */}
      <div className="space-y-16 sm:space-y-20">
        {FOCUS_ITEMS.map((item, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <RevealOnScroll key={item.filename} delayMs={idx * 80}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  idx > 0 ? 'pt-12 border-t border-slate-200/80 dark:border-white/10' : ''
                }`}
              >
                {/* Illustration Column */}
                <div
                  className={`lg:col-span-6 flex items-center justify-center ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <FocusArchitectureIllustration
                    variant={idx === 0 ? 'fullstack' : 'datamobile'}
                  />
                </div>

                {/* Editorial Copy Column */}
                <div
                  className={`lg:col-span-6 space-y-5 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">
                      {item.indexLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.filename}</span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-[1.02]">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {item.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {item.highlights.map((h, i) => (
                      <React.Fragment key={h}>
                        <span className="text-slate-800 dark:text-slate-200">{h}</span>
                        {i < item.highlights.length - 1 && (
                          <span aria-hidden="true" className="text-[#3B82F6] dark:text-[#06B6D4]">
                            /
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
};
