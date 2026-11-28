import React, { useEffect, useState } from 'react';
import { Download, ExternalLink, FileText, X } from 'lucide-react';
import type { CertificateItem } from '../data/portfolio';
import { downloadFileFromUrl } from '../utils/downloadFile';

interface CertificatePreviewModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export function isImageFileUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(png|jpe?g|webp|gif|avif)$/i.test(url.split('?')[0]);
}

export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  certificate,
  onClose,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfLoadFailed, setPdfLoadFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
    setPdfLoadFailed(false);
    setPdfBlobUrl(null);

    const url = certificate?.fileUrl;
    if (!url || isImageFileUrl(url)) return;

    let active = true;
    let createdUrl: string | null = null;

    fetch(url, { cache: 'no-store', credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('not found');
        const blob = await res.blob();
        const head = await blob.slice(0, 5).text();
        if (!head.startsWith('%PDF')) throw new Error('invalid pdf');
        return new Blob([blob], { type: 'application/pdf' });
      })
      .then((pdfBlob) => {
        if (!active) return;
        createdUrl = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(createdUrl);
      })
      .catch(() => {
        if (active) setPdfLoadFailed(true);
      });

    return () => {
      active = false;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [certificate?.fileUrl]);

  useEffect(() => {
    if (!certificate) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [certificate, onClose]);

  if (!certificate || !certificate.fileUrl) return null;

  const isImg = isImageFileUrl(certificate.fileUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#11131C] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F17]">
          <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
            {certificate.serial} · {certificate.period}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau sertifikat"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            <span>ESC</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-100 dark:bg-[#090A0F] flex items-center justify-center min-h-[280px] max-h-[68vh] overflow-auto p-4">
          {isImg && !imgFailed ? (
            <img
              src={certificate.fileUrl}
              alt={certificate.title}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="max-w-full max-h-[62vh] object-contain rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-[55vh] flex flex-col items-center justify-center gap-3">
              {!isImg && !pdfLoadFailed ? (
                pdfBlobUrl ? (
                  <iframe
                    src={pdfBlobUrl}
                    title={certificate.title}
                    className="w-full h-full rounded-lg border border-slate-200 dark:border-white/10 bg-white"
                  />
                ) : (
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    Memuat dokumen PDF...
                  </p>
                )
              ) : (
                <div className="text-center space-y-2 p-6">
                  <FileText className="w-10 h-10 text-[#3B82F6] dark:text-[#06B6D4] mx-auto" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    File sertifikat tidak ditemukan atau belum diunggah ke{' '}
                    <span className="font-mono">{certificate.fileUrl}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10">
          <div className="min-w-0">
            <h3
              id="cert-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug"
            >
              {certificate.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {certificate.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={certificate.fileUrl}
              download
              onClick={(e) => {
                e.preventDefault();
                const fallbackName = certificate.fileUrl?.split('/').pop() || 'sertifikat.pdf';
                void downloadFileFromUrl(certificate.fileUrl!, fallbackName);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File</span>
            </a>
            <a
              href={certificate.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              <span>Tab Baru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
