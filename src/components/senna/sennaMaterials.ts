import * as THREE from 'three';

export interface SennaMaterialLibrary {
  silverBody: THREE.MeshPhysicalMaterial;
  silverEndplate: THREE.MeshPhysicalMaterial;
  carbonTwill: THREE.MeshPhysicalMaterial;
  carbonMatte: THREE.MeshStandardMaterial;
  darkChassis: THREE.MeshStandardMaterial;
  alcantara: THREE.MeshStandardMaterial;
  honeycombMesh: THREE.MeshStandardMaterial;
  canopyGlass: THREE.MeshPhysicalMaterial;
  doorGlass: THREE.MeshPhysicalMaterial;
  papayaMetallic: THREE.MeshPhysicalMaterial;
  papayaCaliper: THREE.MeshPhysicalMaterial;
  drlWhite: THREE.MeshStandardMaterial;
  redTailLed: THREE.MeshStandardMaterial;
  forgedAlloy: THREE.MeshStandardMaterial;
  inconelExhaust: THREE.MeshStandardMaterial;
  tireRubber: THREE.MeshStandardMaterial;
  brakeRotor: THREE.MeshStandardMaterial;
  dashCluster: THREE.MeshStandardMaterial;
  centerDisplay: THREE.MeshStandardMaterial;
  blueprintLine: THREE.LineBasicMaterial;
  contactShadow: THREE.MeshBasicMaterial;
  disposables: Array<{ dispose: () => void }>;
}

function createCarbonCanvasTextures(maxAnisotropy: number) {
  const size = 64;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  if (cCtx && bCtx) {
    // Subtle, fine low-contrast twill carbon weave so no giant zebra stripes appear
    const cell = 8;
    for (let y = 0; y < size; y += cell) {
      for (let x = 0; x < size; x += cell) {
        const idx = ((x / cell) + (y / cell)) % 4;
        const isWarp = idx < 2;
        cCtx.fillStyle = isWarp ? '#181c26' : '#12151d';
        cCtx.fillRect(x, y, cell, cell);

        bCtx.fillStyle = isWarp ? '#b0b0b0' : '#7a7a7a';
        bCtx.fillRect(x, y, cell, cell);
      }
    }
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(6, 6);
  colorMap.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(6, 6);
  bumpMap.anisotropy = maxAnisotropy;

  return { colorMap, bumpMap };
}

function createHoneycombTexture(maxAnisotropy: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    const r = 7;
    const dx = r * 1.732;
    const dy = r * 1.5;
    for (let row = -1; row < 12; row++) {
      for (let col = -1; col < 24; col++) {
        const cx = col * dx + (row % 2 === 0 ? 0 : dx / 2);
        const cy = row * dy;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i + Math.PI / 6;
          const px = cx + r * Math.cos(a);
          const py = cy + r * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1.2);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createBrakeRotorTexture(maxAnisotropy: number) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#525b68';
    ctx.fillRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    for (let r = 46; r < 122; r += 3) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = r % 6 === 0 ? 'rgba(226,232,240,0.24)' : 'rgba(15,23,42,0.28)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 46, 0, Math.PI * 2);
    ctx.fillStyle = '#111827';
    ctx.fill();

    ctx.fillStyle = '#090b10';
    for (let spoke = 0; spoke < 12; spoke++) {
      const baseAngle = (spoke / 12) * Math.PI * 2;
      for (let h = 0; h < 4; h++) {
        const rad = 58 + h * 15;
        const angle = baseAngle + h * 0.08;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createDashClusterTexture(maxAnisotropy: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, 512, 192);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 500, 180);

    const segments = 24;
    for (let i = 0; i < segments; i++) {
      const x = 44 + i * 17.5;
      const h = i > 16 ? 26 : 18 + (i / 16) * 8;
      ctx.fillStyle = i < 14 ? '#06b6d4' : i < 19 ? '#f97316' : '#ef4444';
      ctx.fillRect(x, 42 - (h - 18), 11, h);
    }

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 68px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('3', 256, 128);

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('TRACK', 256, 158);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 34px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('148', 46, 126);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px monospace';
    ctx.fillText('KM/H', 46, 148);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('7,850', 464, 122);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px monospace';
    ctx.fillText('RPM', 464, 144);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createCenterDisplayTexture(maxAnisotropy: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, 256, 384);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 236, 364);

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MCLAREN SENNA', 128, 54);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(56, 190);
    ctx.bezierCurveTo(50, 100, 195, 95, 196, 175);
    ctx.bezierCurveTo(196, 245, 70, 255, 56, 190);
    ctx.stroke();

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(178, 134, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('AERO: ACTIVE', 128, 300);
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('800 KG DF', 128, 336);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 64, 16, 128, 64, 120);
    grad.addColorStop(0, 'rgba(2, 6, 23, 0.72)');
    grad.addColorStop(0.55, 'rgba(2, 6, 23, 0.34)');
    grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSennaMaterials(
  maxAnisotropy: number,
  initialTheme: 'dark' | 'light'
): SennaMaterialLibrary {
  const { colorMap: carbonColorMap, bumpMap: carbonBumpMap } =
    createCarbonCanvasTextures(maxAnisotropy);
  const honeycombTex = createHoneycombTexture(maxAnisotropy);
  const rotorTex = createBrakeRotorTexture(maxAnisotropy);
  const dashTex = createDashClusterTexture(maxAnisotropy);
  const centerTex = createCenterDisplayTexture(maxAnisotropy);
  const shadowTex = createContactShadowTexture();

  // Ice Silver-Blue metallic automotive clearcoat matching user's 4 photos
  const silverBody = new THREE.MeshPhysicalMaterial({
    color: 0xa2bcd3,
    metalness: 0.54,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.45,
    side: THREE.DoubleSide,
  });

  const silverEndplate = new THREE.MeshPhysicalMaterial({
    color: 0xa8bfd4,
    metalness: 0.5,
    roughness: 0.19,
    clearcoat: 0.95,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.3,
  });

  const carbonTwill = new THREE.MeshPhysicalMaterial({
    map: carbonColorMap,
    bumpMap: carbonBumpMap,
    bumpScale: 0.004,
    metalness: 0.28,
    roughness: 0.32,
    clearcoat: 0.6,
    clearcoatRoughness: 0.14,
  });

  const carbonMatte = new THREE.MeshStandardMaterial({
    color: 0x141821,
    roughness: 0.58,
    metalness: 0.22,
  });

  const darkChassis = new THREE.MeshStandardMaterial({
    color: 0x090b10,
    roughness: 0.78,
    metalness: 0.16,
  });

  const alcantara = new THREE.MeshStandardMaterial({
    color: 0x171a24,
    roughness: 0.94,
    metalness: 0.04,
  });

  const honeycombMesh = new THREE.MeshStandardMaterial({
    map: honeycombTex,
    roughness: 0.45,
    metalness: 0.55,
  });

  const canopyGlass = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.12,
    roughness: 0.04,
    transparent: true,
    opacity: 0.34,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const doorGlass = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    metalness: 0.12,
    roughness: 0.04,
    transparent: true,
    opacity: 0.28,
    clearcoat: 1.0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const papayaMetallic = new THREE.MeshPhysicalMaterial({
    color: 0xf97316,
    emissive: 0xc2410c,
    emissiveIntensity: 0.2,
    metalness: 0.45,
    roughness: 0.22,
    clearcoat: 0.9,
  });

  const papayaCaliper = new THREE.MeshPhysicalMaterial({
    color: 0xfb923c,
    emissive: 0xea580c,
    emissiveIntensity: 0.25,
    metalness: 0.5,
    roughness: 0.18,
    clearcoat: 1.0,
  });

  const drlWhite = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xe0f2fe,
    emissiveIntensity: 2.2,
    roughness: 0.12,
  });

  const redTailLed = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 2.4,
    roughness: 0.18,
  });

  const forgedAlloy = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.92,
    roughness: 0.16,
    envMapIntensity: 1.4,
  });

  const inconelExhaust = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.24,
  });

  const tireRubber = new THREE.MeshStandardMaterial({
    color: 0x111318,
    roughness: 0.88,
    metalness: 0.04,
  });

  const brakeRotor = new THREE.MeshStandardMaterial({
    map: rotorTex,
    roughness: 0.36,
    metalness: 0.72,
  });

  const dashCluster = new THREE.MeshStandardMaterial({
    map: dashTex,
    emissiveMap: dashTex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.9,
    roughness: 0.15,
    metalness: 0.1,
  });

  const centerDisplay = new THREE.MeshStandardMaterial({
    map: centerTex,
    emissiveMap: centerTex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.8,
    roughness: 0.15,
    metalness: 0.1,
  });

  const blueprintLine = new THREE.LineBasicMaterial({
    color: initialTheme === 'dark' ? 0x38bdf8 : 0x1e293b,
    transparent: true,
    opacity: 0.18,
  });

  const contactShadow = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.76,
  });

  return {
    silverBody,
    silverEndplate,
    carbonTwill,
    carbonMatte,
    darkChassis,
    alcantara,
    honeycombMesh,
    canopyGlass,
    doorGlass,
    papayaMetallic,
    papayaCaliper,
    drlWhite,
    redTailLed,
    forgedAlloy,
    inconelExhaust,
    tireRubber,
    brakeRotor,
    dashCluster,
    centerDisplay,
    blueprintLine,
    contactShadow,
    disposables: [
      carbonColorMap,
      carbonBumpMap,
      honeycombTex,
      rotorTex,
      dashTex,
      centerTex,
      shadowTex,
      silverBody,
      silverEndplate,
      carbonTwill,
      carbonMatte,
      darkChassis,
      alcantara,
      honeycombMesh,
      canopyGlass,
      doorGlass,
      papayaMetallic,
      papayaCaliper,
      drlWhite,
      redTailLed,
      forgedAlloy,
      inconelExhaust,
      tireRubber,
      brakeRotor,
      dashCluster,
      centerDisplay,
      blueprintLine,
      contactShadow,
    ],
  };
}
