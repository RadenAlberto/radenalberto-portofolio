import React from 'react';

interface AppWindowProps {
  title: string;
  rightMeta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const AppWindow: React.FC<AppWindowProps> = ({
  title,
  rightMeta,
  children,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#11131C] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200 ${className}`}
    >
      {/* Thin App Window Title Bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/90 dark:bg-[#0D0F17]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]/60 dark:bg-[#06B6D4]/60" />
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 truncate">
            {title}
          </span>
        </div>
        {rightMeta ? (
          <div className="font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap">
            {rightMeta}
          </div>
        ) : null}
      </div>

      {/* Window Content */}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};
