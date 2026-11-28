export async function downloadFileFromUrl(
  url: string,
  filename: string
): Promise<boolean> {
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!response.ok) return false;

    const blob = await response.blob();
    const isPdfTarget = filename.toLowerCase().endsWith('.pdf') || url.toLowerCase().endsWith('.pdf');

    if (isPdfTarget) {
      const header = await blob.slice(0, 5).text();
      if (!header.startsWith('%PDF')) {
        return false;
      }
    }

    const typedBlob = isPdfTarget
      ? new Blob([blob], { type: 'application/pdf' })
      : blob;
    const blobUrl = URL.createObjectURL(typedBlob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);

    return true;
  } catch {
    return false;
  }
}
