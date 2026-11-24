export type CameraPresetId =
  | 'overview'
  | 'podiumFront'
  | 'northSide'
  | 'topPerspective';

export interface CameraPreset {
  id: CameraPresetId;
  label: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
}

export const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  overview: {
    id: 'overview',
    label: 'Ikhtisar 3/4',
    description: 'Sudut pandang ikonik barat-daya memperlihatkan menara, sirip barat, dan podium',
    position: [-88, 46, 72],
    target: [-4, 24, -2],
  },
  podiumFront: {
    id: 'podiumFront',
    label: 'Depan Podium',
    description: 'Tampak depan jalan (barat) menampilkan tangga akses, 4 kolom tinggi, dan fasad podium',
    position: [-98, 20, 4],
    target: [-8, 22, -2],
  },
  northSide: {
    id: 'northSide',
    label: 'Samping Utara',
    description: 'Tampak sisi utara menampilkan dinding kaca biru, ceruk void, balkon bertingkat, dan tulisan UNTAR',
    position: [16, 52, -98],
    target: [0, 25, -2],
  },
  topPerspective: {
    id: 'topPerspective',
    label: 'Perspektif Atas',
    description: 'Sudut pandang udara menampilkan atap hijau muda, utilitas atap, tapak, dan jalan raya barat',
    position: [-36, 126, 52],
    target: [-6, 14, -2],
  },
};

export interface UntarBuildingViewerProps {
  /** Initial camera preset on mount */
  initialPreset?: CameraPresetId;
  /** Controlled active camera preset (optional) */
  activePreset?: CameraPresetId;
  /** Callback when camera preset changes or is cleared by user drag */
  onPresetChange?: (preset: CameraPresetId | null) => void;
  /** Whether built-in portfolio control dock is rendered */
  showControls?: boolean;
  /** Render transparently with compact plinth & scroll-safe OrbitControls inside portfolio cards */
  embedded?: boolean;
  /** Active portfolio color theme */
  theme?: 'dark' | 'light';
  /** Optional className for outer wrapper */
  className?: string;
}
