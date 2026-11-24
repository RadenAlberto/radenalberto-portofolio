import * as THREE from 'three';

export interface ProceduralTextureSet {
  curtainWallGlass: THREE.CanvasTexture;
  curtainWallRoughness: THREE.CanvasTexture;
  finMetalCladding: THREE.CanvasTexture;
  finMetalBump: THREE.CanvasTexture;
  untarShieldCrest: THREE.CanvasTexture;
  podiumSignage: THREE.CanvasTexture;
  roadAsphalt: THREE.CanvasTexture;
  plazaPaving: THREE.CanvasTexture;
  lawnGrass: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  dispose: () => void;
}

function configureColorTexture(
  canvas: HTMLCanvasElement,
  maxAnisotropy: number,
  repeatX = 1,
  repeatY = 1,
  wrap = true,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  if (wrap) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
  } else {
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
  }
  tex.repeat.set(repeatX, repeatY);
  tex.needsUpdate = true;
  return tex;
}

function configureDataTexture(
  canvas: HTMLCanvasElement,
  maxAnisotropy: number,
  repeatX = 1,
  repeatY = 1,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = maxAnisotropy;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.needsUpdate = true;
  return tex;
}

function createCurtainWallTextures(maxAnisotropy: number): {
  color: THREE.CanvasTexture;
  roughness: THREE.CanvasTexture;
} {
  const w = 512;
  const h = 512;
  const cColor = document.createElement('canvas');
  cColor.width = w;
  cColor.height = h;
  const ctx = cColor.getContext('2d')!;

  const cRough = document.createElement('canvas');
  cRough.width = w;
  cRough.height = h;
  const rCtx = cRough.getContext('2d')!;

  // Base architectural deep sapphire-cerulean glass
  ctx.fillStyle = '#154b7e';
  ctx.fillRect(0, 0, w, h);

  rCtx.fillStyle = '#1c1c1c'; // smooth glass (~0.11 roughness)
  rCtx.fillRect(0, 0, w, h);

  const cols = 4;
  const rows = 4;
  const cellW = w / cols;
  const cellH = h / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellW;
      const y = row * cellH;

      // Subtle sky reflection gradient & realistic per-pane tint variance
      const shade = ((row * 7 + col * 13) % 5) - 2;
      const grad = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
      grad.addColorStop(0, `rgb(${28 + shade * 2}, ${92 + shade * 4}, ${152 + shade * 5})`);
      grad.addColorStop(0.55, `rgb(${18 + shade * 2}, ${72 + shade * 3}, ${126 + shade * 4})`);
      grad.addColorStop(1, `rgb(${12 + shade}, ${54 + shade * 3}, ${102 + shade * 3})`);
      ctx.fillStyle = grad;
      ctx.fillRect(x + 3, y + 3, cellW - 6, cellH - 6);

      // Spandrel horizontal band on upper third of each floor cell
      ctx.fillStyle = 'rgba(8, 30, 58, 0.42)';
      ctx.fillRect(x + 3, y + 3, cellW - 6, cellH * 0.28);

      // Subtle interior floor slab hint
      ctx.fillStyle = 'rgba(130, 195, 245, 0.10)';
      ctx.fillRect(x + 5, y + cellH * 0.34, cellW - 10, cellH * 0.56);

      // Anodized slate-blue aluminum mullion frames
      ctx.strokeStyle = '#3b648b';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 1.5, y + 1.5, cellW - 3, cellH - 3);

      // Inner dark gasket line
      ctx.strokeStyle = '#0d2642';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y + 4, cellW - 8, cellH - 8);

      // Mullion higher roughness
      rCtx.strokeStyle = '#909090';
      rCtx.lineWidth = 5;
      rCtx.strokeRect(x + 1.5, y + 1.5, cellW - 3, cellH - 3);
    }
  }

  return {
    color: configureColorTexture(cColor, maxAnisotropy, 1, 1, true),
    roughness: configureDataTexture(cRough, maxAnisotropy, 1, 1),
  };
}

function createFinMetalTextures(maxAnisotropy: number): {
  color: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
} {
  const w = 512;
  const h = 512;
  const cColor = document.createElement('canvas');
  cColor.width = w;
  cColor.height = h;
  const ctx = cColor.getContext('2d')!;

  const cBump = document.createElement('canvas');
  cBump.width = w;
  cBump.height = h;
  const bCtx = cBump.getContext('2d')!;

  ctx.fillStyle = '#c4cbd4';
  ctx.fillRect(0, 0, w, h);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, w, h);

  // Crisp vertical fluted ribs characteristic of UNTAR's West Fin
  const ribCount = 32;
  const ribW = w / ribCount;
  for (let i = 0; i < ribCount; i++) {
    const x = i * ribW;
    const g = ctx.createLinearGradient(x, 0, x + ribW, 0);
    g.addColorStop(0, '#96a0ac');
    g.addColorStop(0.2, '#d6dce4');
    g.addColorStop(0.55, '#cad2dc');
    g.addColorStop(0.85, '#adb6c2');
    g.addColorStop(1, '#858f9c');
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, ribW, h);

    const bg = bCtx.createLinearGradient(x, 0, x + ribW, 0);
    bg.addColorStop(0, '#383838');
    bg.addColorStop(0.25, '#e8e8e8');
    bg.addColorStop(0.7, '#d0d0d0');
    bg.addColorStop(1, '#303030');
    bCtx.fillStyle = bg;
    bCtx.fillRect(x, 0, ribW, h);
  }

  // Horizontal architectural floor seam lines
  const seams = 8;
  for (let j = 0; j < seams; j++) {
    const y = (j * h) / seams;
    ctx.fillStyle = 'rgba(55, 65, 80, 0.55)';
    ctx.fillRect(0, y, w, 3);
    bCtx.fillStyle = '#1a1a1a';
    bCtx.fillRect(0, y, w, 3);
  }

  return {
    color: configureColorTexture(cColor, maxAnisotropy, 2, 4, true),
    bump: configureDataTexture(cBump, maxAnisotropy, 2, 4),
  };
}

function createUntarShieldCrestTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);
  const cx = size / 2;
  const cy = size / 2;

  // Brushed silver shield background plate
  const bgGrad = ctx.createLinearGradient(0, 40, 0, size - 40);
  bgGrad.addColorStop(0, '#dde3ea');
  bgGrad.addColorStop(0.5, '#c2cbd6');
  bgGrad.addColorStop(1, '#9ea9b7');

  const drawShieldPath = (scale: number) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 210 * scale);
    ctx.lineTo(cx + 185 * scale, cy - 115 * scale);
    ctx.quadraticCurveTo(cx + 180 * scale, cy + 55 * scale, cx + 115 * scale, cy + 165 * scale);
    ctx.lineTo(cx, cy + 225 * scale);
    ctx.lineTo(cx - 115 * scale, cy + 165 * scale);
    ctx.quadraticCurveTo(cx - 180 * scale, cy + 55 * scale, cx - 185 * scale, cy - 115 * scale);
    ctx.closePath();
  };

  drawShieldPath(1.0);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Dark metallic double border inside the pentagon/shield
  drawShieldPath(0.95);
  ctx.strokeStyle = '#1f2631';
  ctx.lineWidth = 14;
  ctx.stroke();

  drawShieldPath(0.84);
  ctx.strokeStyle = '#2d3748';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Stylized Tarumanagara relief crest (flanking wings/garuda motif, central flame/candle & lotus petals)
  ctx.save();
  ctx.translate(cx, cy + 8);
  ctx.fillStyle = '#1b222c';
  ctx.strokeStyle = '#1b222c';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Central flame / torch pillar
  ctx.beginPath();
  ctx.moveTo(0, -112);
  ctx.bezierCurveTo(28, -72, 22, -26, 0, 12);
  ctx.bezierCurveTo(-22, -26, -28, -72, 0, -112);
  ctx.fill();

  // Inner bright highlight on flame
  ctx.fillStyle = '#9aa5b4';
  ctx.beginPath();
  ctx.moveTo(0, -82);
  ctx.bezierCurveTo(10, -56, 8, -28, 0, -8);
  ctx.bezierCurveTo(-8, -28, -10, -56, 0, -82);
  ctx.fill();

  // Symmetrical ornamental Garuda / scroll wings
  ctx.fillStyle = '#1b222c';
  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.scale(dir, 1);

    // Upper sweeping wing arc
    ctx.beginPath();
    ctx.moveTo(18, -16);
    ctx.bezierCurveTo(68, -68, 128, -56, 126, -6);
    ctx.bezierCurveTo(124, 34, 86, 56, 48, 42);
    ctx.bezierCurveTo(78, 22, 92, -6, 68, -24);
    ctx.bezierCurveTo(48, -36, 30, -24, 18, -16);
    ctx.fill();

    // Outer wing feather curls
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.ellipse(98 - k * 16, 46 + k * 20, 26 - k * 3, 10, 0.45 + k * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lower lotus / book base curves
    ctx.beginPath();
    ctx.moveTo(4, 24);
    ctx.bezierCurveTo(38, 24, 72, 62, 54, 96);
    ctx.bezierCurveTo(34, 118, 12, 108, 4, 92);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Bottom pedestal scroll
  ctx.beginPath();
  ctx.ellipse(0, 118, 58, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  return configureColorTexture(canvas, maxAnisotropy, 1, 1, false);
}

function createPodiumSignageTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const w = 2048;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, w, h);

  // Subtle dark brushed fascia strip behind lettering for crisp readability
  ctx.fillStyle = 'rgba(13, 30, 52, 0.72)';
  ctx.fillRect(0, 32, w, h - 64);

  // Fine metallic upper & lower trim line
  ctx.fillStyle = '#9aa6b5';
  ctx.fillRect(0, 32, w, 4);
  ctx.fillRect(0, h - 36, w, 4);

  // Top small line: UNIVERSITAS
  ctx.fillStyle = '#e5ebf2';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '600 40px "Plus Jakarta Sans", "Arial", sans-serif';
  ctx.fillText('UNIVERSITAS', 64, 82);

  // Bold main line: TARUMANAGARA
  ctx.fillStyle = '#f4f7fa';
  ctx.font = '700 102px "Plus Jakarta Sans", "Arial", sans-serif';
  ctx.fillText('TARUMANAGARA', 60, 166);

  return configureColorTexture(canvas, maxAnisotropy, 1, 1, false);
}

function createRoadAsphaltTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const w = 512;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1b2029';
  ctx.fillRect(0, 0, w, h);

  // Subtle mineral asphalt grain
  for (let i = 0; i < 4500; i++) {
    const x = (i * 73) % w;
    const y = (i * 137) % h;
    const v = 26 + (i % 16);
    ctx.fillStyle = `rgb(${v}, ${v + 4}, ${v + 10})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Edge solid lane lines
  ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
  ctx.fillRect(24, 0, 5, h);
  ctx.fillRect(w - 29, 0, 5, h);

  // Dashed lane dividers (3 lanes each side + center divider)
  ctx.fillStyle = 'rgba(226, 232, 240, 0.42)';
  const lanePositions = [w * 0.25, w * 0.75];
  for (const lx of lanePositions) {
    for (let y = 16; y < h; y += 64) {
      ctx.fillRect(lx - 2, y, 4, 34);
    }
  }

  // Center median double yellow/amber divider
  ctx.fillStyle = 'rgba(217, 164, 65, 0.65)';
  ctx.fillRect(w / 2 - 7, 0, 4, h);
  ctx.fillRect(w / 2 + 3, 0, 4, h);

  return configureColorTexture(canvas, maxAnisotropy, 1, 8, true);
}

function createPlazaPavingTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#252c38';
  ctx.fillRect(0, 0, size, size);

  const tiles = 8;
  const tileS = size / tiles;
  for (let r = 0; r < tiles; r++) {
    for (let c = 0; c < tiles; c++) {
      const tone = 36 + ((r * 3 + c * 5) % 9);
      ctx.fillStyle = `rgb(${tone}, ${tone + 6}, ${tone + 15})`;
      ctx.fillRect(c * tileS + 2, r * tileS + 2, tileS - 4, tileS - 4);
    }
  }

  return configureColorTexture(canvas, maxAnisotropy, 12, 12, true);
}

function createLawnGrassTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1f4230';
  ctx.fillRect(0, 0, size, size);

  // Subtle mowed checkerboard grid matching aerial photo (atap_untar_5161836b.PNG)
  const grid = 8;
  const cell = size / grid;
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#244d38' : '#1d3e2d';
      ctx.fillRect(c * cell, r * cell, cell, cell);
    }
  }

  // Fine grass noise speckles
  for (let i = 0; i < 3000; i++) {
    const x = (i * 97) % size;
    const y = (i * 193) % size;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(85, 165, 110, 0.14)' : 'rgba(15, 35, 22, 0.18)';
    ctx.fillRect(x, y, 2, 2);
  }

  return configureColorTexture(canvas, maxAnisotropy, 4, 2, true);
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.5,
  );
  grad.addColorStop(0, 'rgba(3, 6, 12, 0.65)');
  grad.addColorStop(0.55, 'rgba(3, 6, 12, 0.28)');
  grad.addColorStop(1, 'rgba(3, 6, 12, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createUntarTextureSet(maxAnisotropy: number): ProceduralTextureSet {
  const glass = createCurtainWallTextures(maxAnisotropy);
  const fin = createFinMetalTextures(maxAnisotropy);
  const untarShieldCrest = createUntarShieldCrestTexture(maxAnisotropy);
  const podiumSignage = createPodiumSignageTexture(maxAnisotropy);
  const roadAsphalt = createRoadAsphaltTexture(maxAnisotropy);
  const plazaPaving = createPlazaPavingTexture(maxAnisotropy);
  const lawnGrass = createLawnGrassTexture(maxAnisotropy);
  const contactShadow = createContactShadowTexture();

  const allTextures: THREE.Texture[] = [
    glass.color,
    glass.roughness,
    fin.color,
    fin.bump,
    untarShieldCrest,
    podiumSignage,
    roadAsphalt,
    plazaPaving,
    lawnGrass,
    contactShadow,
  ];

  return {
    curtainWallGlass: glass.color,
    curtainWallRoughness: glass.roughness,
    finMetalCladding: fin.color,
    finMetalBump: fin.bump,
    untarShieldCrest,
    podiumSignage,
    roadAsphalt,
    plazaPaving,
    lawnGrass,
    contactShadow,
    dispose: () => {
      allTextures.forEach((t) => t.dispose());
    },
  };
}
