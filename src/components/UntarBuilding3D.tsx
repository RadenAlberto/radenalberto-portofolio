import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface UntarBuilding3DProps {
  theme: 'dark' | 'light';
}

function createSignTexture(
  lines: string[],
  options: {
    width?: number;
    height?: number;
    bgColor?: string;
    textColor?: string;
    fontSize?: number;
    letterSpacing?: number;
    fontWeight?: string;
  } = {}
): THREE.CanvasTexture {
  const {
    width = 512,
    height = 128,
    bgColor = 'transparent',
    textColor = '#f8fafc',
    fontSize = 68,
    letterSpacing = 0,
    fontWeight = '800',
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (lines.length === 1) {
      ctx.font = `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`;
      const text = lines[0];
      if (letterSpacing > 0 && text.length > 1) {
        const chars = text.split('');
        const widths = chars.map((ch) => ctx.measureText(ch).width);
        const totalW = widths.reduce((a, b) => a + b, 0) + letterSpacing * (chars.length - 1);
        let cursorX = (width - totalW) / 2;
        chars.forEach((ch, idx) => {
          ctx.fillText(ch, cursorX + widths[idx] / 2, height / 2);
          cursorX += widths[idx] + letterSpacing;
        });
      } else {
        ctx.fillText(text, width / 2, height / 2);
      }
    } else {
      ctx.font = `600 ${Math.round(fontSize * 0.48)}px Inter, system-ui, sans-serif`;
      ctx.fillText(lines[0], width / 2, height * 0.32);
      ctx.font = `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.fillText(lines[1], width / 2, height * 0.68);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Loads the official UNTAR PNG crest and recolors all opaque pixels to deep dark navy (#0f172a)
 * matching the real embossed metal crest on Gedung Utama UNTAR.
 */
function createRecoloredCrestTexture(
  src: string,
  tintHex: string
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = tintHex;
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'source-over';
    tex.needsUpdate = true;
  };
  img.src = src;

  return tex;
}

function createSlopedCornerProwGeometry(
  xMin: number,
  xMax: number,
  zBack: number,
  zFront: number,
  yBase: number,
  yFrontInner: number,
  yFrontOuterPeak: number,
  yBackOuter: number,
  yBackInner: number
): THREE.BufferGeometry {
  // 8 vertices of hexahedron with sloped corner apex at (xMax, yFrontOuterPeak, zFront)
  const positions = new Float32Array([
    // Bottom face (y = yBase)
    xMin, yBase, zFront, // 0 FLB
    xMax, yBase, zFront, // 1 FRB
    xMax, yBase, zBack,  // 2 BRB
    xMin, yBase, zBack,  // 3 BLB
    // Top face
    xMin, yFrontInner, zFront,      // 4 FLT
    xMax, yFrontOuterPeak, zFront,  // 5 FRT (apex)
    xMax, yBackOuter, zBack,        // 6 BRT
    xMin, yBackInner, zBack,        // 7 BLT
  ]);

  const indices = [
    // Front (+Z)
    0, 1, 5, 0, 5, 4,
    // Right (+X)
    1, 2, 6, 1, 6, 5,
    // Back (-Z)
    2, 3, 7, 2, 7, 6,
    // Left (-X)
    3, 0, 4, 3, 4, 7,
    // Top (sloped)
    4, 5, 6, 4, 6, 7,
    // Bottom
    3, 2, 1, 3, 1, 0,
  ];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function createPentagonShieldGeometry(radius: number, depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const yCenterOffset = -0.095 * radius;
  for (let i = 0; i < 5; i++) {
    const angle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle) + yCenterOffset;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
}

function createLetterShape(
  char: 'U' | 'N' | 'T' | 'A' | 'R',
  w: number,
  h: number,
  t: number
): THREE.Shape {
  const s = new THREE.Shape();
  if (char === 'U') {
    const c = t * 1.1;
    s.moveTo(0, h);
    s.lineTo(0, c);
    s.lineTo(c, 0);
    s.lineTo(w - c, 0);
    s.lineTo(w, c);
    s.lineTo(w, h);
    s.lineTo(w - t, h);
    s.lineTo(w - t, c + 0.02);
    s.lineTo(w - c - 0.02, t);
    s.lineTo(c + 0.02, t);
    s.lineTo(t, c + 0.02);
    s.lineTo(t, h);
    s.closePath();
  } else if (char === 'N') {
    s.moveTo(0, 0);
    s.lineTo(0, h);
    s.lineTo(t + 0.02, h);
    s.lineTo(w - t, t * 1.9);
    s.lineTo(w - t, h);
    s.lineTo(w, h);
    s.lineTo(w, 0);
    s.lineTo(w - t - 0.02, 0);
    s.lineTo(t, h - t * 1.9);
    s.lineTo(t, 0);
    s.closePath();
  } else if (char === 'T') {
    const mx = w / 2;
    s.moveTo(0, h);
    s.lineTo(w, h);
    s.lineTo(w, h - t);
    s.lineTo(mx + t / 2, h - t);
    s.lineTo(mx + t / 2, 0);
    s.lineTo(mx - t / 2, 0);
    s.lineTo(mx - t / 2, h - t);
    s.lineTo(0, h - t);
    s.closePath();
  } else if (char === 'A') {
    const mx = w / 2;
    s.moveTo(0, 0);
    s.lineTo(mx - t * 0.65, h);
    s.lineTo(mx + t * 0.65, h);
    s.lineTo(w, 0);
    s.lineTo(w - t, 0);
    s.lineTo(w - t * 1.35, t * 1.9);
    s.lineTo(t * 1.35, t * 1.9);
    s.lineTo(t, 0);
    s.closePath();

    const hole = new THREE.Path();
    hole.moveTo(t * 1.7, t * 2.8);
    hole.lineTo(mx, h - t * 1.35);
    hole.lineTo(w - t * 1.7, t * 2.8);
    hole.closePath();
    s.holes.push(hole);
  } else {
    // R
    const cut = t * 1.05;
    const midY = h * 0.44;
    s.moveTo(0, 0);
    s.lineTo(0, h);
    s.lineTo(w - cut, h);
    s.lineTo(w, h - cut);
    s.lineTo(w, midY + cut * 0.7);
    s.lineTo(w - cut * 0.9, midY);
    s.lineTo(w, 0);
    s.lineTo(w - t * 1.15, 0);
    s.lineTo(w - cut * 1.65, midY - t * 0.15);
    s.lineTo(t, midY - t * 0.15);
    s.lineTo(t, 0);
    s.closePath();

    const hole = new THREE.Path();
    hole.moveTo(t, midY + t * 0.75);
    hole.lineTo(t, h - t);
    hole.lineTo(w - cut * 1.15, h - t);
    hole.lineTo(w - t, h - cut * 1.1);
    hole.lineTo(w - t, midY + t * 0.95);
    hole.lineTo(w - cut * 1.15, midY + t * 0.75);
    hole.closePath();
    s.holes.push(hole);
  }
  return s;
}

export const UntarBuilding3D: React.FC<UntarBuilding3DProps> = ({ theme }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef<'dark' | 'light'>(theme);
  const edgeMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const accentEdgeMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const [webglFallback, setWebglFallback] = useState(false);

  useEffect(() => {
    themeRef.current = theme;
    const isDark = theme === 'dark';
    if (edgeMatRef.current) {
      edgeMatRef.current.color.setHex(isDark ? 0x0f172a : 0x1e293b);
    }
    if (accentEdgeMatRef.current) {
      accentEdgeMatRef.current.color.setHex(isDark ? 0x38bdf8 : 0x2563eb);
    }
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 440;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFallback(true);
    };
    const handleContextRestored = () => {
      setWebglFallback(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 160);
    camera.position.set(19.8, 12.8, 24.0);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0.2, 7.6, 0);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.68;
    controls.update();

    const hemiLight = new THREE.HemisphereLight(0xf8fafc, 0x334155, 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.55);
    keyLight.position.set(14, 24, 16);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.85);
    rimLight.position.set(-16, 12, -12);
    scene.add(rimLight);

    // Architectural Materials tuned to Gedung Utama UNTAR
    const claddingMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.65,
      metalness: 0.16,
    });
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ribSlateMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.6,
      metalness: 0.25,
    });
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.85,
      metalness: 0.12,
    });
    const blueGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      emissive: 0x0c4a6e,
      emissiveIntensity: 0.26,
      roughness: 0.12,
      metalness: 0.35,
      clearcoat: 0.92,
      clearcoatRoughness: 0.08,
    });
    const warmWindowMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.2,
      roughness: 0.2,
      metalness: 0.15,
    });
    const skylightGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.18,
      roughness: 0.18,
      metalness: 0.2,
      transparent: true,
      opacity: 0.82,
    });
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      roughness: 0.84,
      metalness: 0.02,
    });
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.9,
      metalness: 0.05,
    });

    const isDarkInit = themeRef.current === 'dark';
    const edgeMat = new THREE.LineBasicMaterial({
      color: isDarkInit ? 0x0f172a : 0x1e293b,
      transparent: true,
      opacity: 0.8,
    });
    const accentEdgeMat = new THREE.LineBasicMaterial({
      color: isDarkInit ? 0x38bdf8 : 0x2563eb,
      transparent: true,
      opacity: 0.55,
    });
    edgeMatRef.current = edgeMat;
    accentEdgeMatRef.current = accentEdgeMat;

    // Typography & Dark-Navy Official Crest Textures
    const untarFrontTex = createSignTexture(['UNTAR'], {
      width: 768,
      height: 192,
      textColor: '#f8fafc',
      fontSize: 140,
      letterSpacing: 32,
      fontWeight: '900',
    });
    const untarFrontMat = new THREE.MeshBasicMaterial({
      map: untarFrontTex,
      transparent: true,
    });

    const untarSideTex = createSignTexture(['UNTAR'], {
      width: 512,
      height: 128,
      textColor: '#0f172a',
      fontSize: 96,
      letterSpacing: 22,
      fontWeight: '900',
    });
    const untarSideMat = new THREE.MeshBasicMaterial({
      map: untarSideTex,
      transparent: true,
    });

    const tarumanagaraBannerTex = createSignTexture(['UNIVERSITAS', 'TARUMANAGARA'], {
      width: 640,
      height: 160,
      textColor: '#f8fafc',
      fontSize: 48,
      fontWeight: '800',
    });
    const tarumanagaraBannerMat = new THREE.MeshBasicMaterial({
      map: tarumanagaraBannerTex,
      transparent: true,
    });

    // Dark navy-black (#0f172a) recolored official UNTAR crest matching real building photos
    const navyCrestTex = createRecoloredCrestTexture('/assets/aistudio/pngegg_8343e903.png', '#0f172a');
    const navyCrestMat = new THREE.MeshBasicMaterial({
      map: navyCrestTex,
      transparent: true,
      alphaTest: 0.04,
    });

    const buildingGroup = new THREE.Group();
    const disposables: Array<{ dispose: () => void }> = [
      claddingMat,
      concreteMat,
      ribSlateMat,
      darkStoneMat,
      blueGlassMat,
      warmWindowMat,
      skylightGlassMat,
      foliageMat,
      trunkMat,
      edgeMat,
      accentEdgeMat,
      untarFrontTex,
      untarFrontMat,
      untarSideTex,
      untarSideMat,
      tarumanagaraBannerTex,
      tarumanagaraBannerMat,
      navyCrestTex,
      navyCrestMat,
      envTex,
    ];

    const addOutlinedMesh = (
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      pos: [number, number, number],
      parent: THREE.Object3D = buildingGroup,
      lineMaterial: THREE.LineBasicMaterial = edgeMat
    ) => {
      disposables.push(geometry);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry, 24);
      disposables.push(edges);
      const lines = new THREE.LineSegments(edges, lineMaterial);
      lines.position.copy(mesh.position);
      parent.add(lines);
      return mesh;
    };

    // =========================================================================
    // 1. GROUND PLAZA, STEPPED TERRACE & FRONT "TARUMANAGARA" MONUMENT SIGN
    // =========================================================================
    addOutlinedMesh(new THREE.BoxGeometry(10.8, 0.32, 8.4), darkStoneMat, [0, 0.16, 0]);
    addOutlinedMesh(new THREE.BoxGeometry(9.5, 0.18, 1.3), concreteMat, [0, 0.41, 3.05]);
    addOutlinedMesh(new THREE.BoxGeometry(9.1, 0.16, 0.9), concreteMat, [0, 0.58, 2.85]);

    // Front Plaza "TARUMANAGARA" Sign + Dark Navy Crest on Pentagon Shield
    addOutlinedMesh(new THREE.BoxGeometry(4.2, 0.34, 0.28), darkStoneMat, [-0.8, 0.68, 3.5]);

    const plazaShieldGeo = createPentagonShieldGeometry(0.38, 0.06);
    addOutlinedMesh(plazaShieldGeo, claddingMat, [-0.8, 1.18, 3.58]);

    const plazaCrestGeo = new THREE.PlaneGeometry(0.68, 0.68);
    disposables.push(plazaCrestGeo);
    const plazaCrest = new THREE.Mesh(plazaCrestGeo, navyCrestMat);
    plazaCrest.position.set(-0.8, 1.18, 3.65);
    buildingGroup.add(plazaCrest);

    const plazaTextGeo = new THREE.PlaneGeometry(3.4, 0.72);
    disposables.push(plazaTextGeo);
    const plazaText = new THREE.Mesh(plazaTextGeo, tarumanagaraBannerMat);
    plazaText.position.set(-0.8, 0.74, 3.66);
    buildingGroup.add(plazaText);

    // =========================================================================
    // 2. WIDE LOWER GLASS PODIUM, COLONNADE & RIGHT PORTICO
    // =========================================================================
    addOutlinedMesh(new THREE.BoxGeometry(7.2, 1.1, 4.3), darkStoneMat, [-0.95, 1.1, 0.45]);
    for (let px = -4.2; px <= 2.3; px += 1.3) {
      addOutlinedMesh(
        new THREE.CylinderGeometry(0.14, 0.14, 1.1, 10),
        claddingMat,
        [px, 1.1, 2.55]
      );
    }

    addOutlinedMesh(
      new THREE.BoxGeometry(7.6, 1.55, 4.75),
      blueGlassMat,
      [-0.95, 2.38, 0.52],
      buildingGroup,
      accentEdgeMat
    );
    [1.62, 2.12, 2.62, 3.16].forEach((py) => {
      addOutlinedMesh(new THREE.BoxGeometry(7.72, 0.08, 4.86), claddingMat, [-0.95, py, 0.52]);
    });
    for (let mx = -4.65; mx <= 2.75; mx += 0.74) {
      addOutlinedMesh(new THREE.BoxGeometry(0.06, 1.54, 4.84), concreteMat, [mx, 2.38, 0.52]);
    }

    const skylightGeo = new THREE.BoxGeometry(3.6, 0.45, 2.2);
    const skylightMesh = addOutlinedMesh(
      skylightGeo,
      skylightGlassMat,
      [-2.85, 3.4, 0.35],
      buildingGroup,
      accentEdgeMat
    );
    skylightMesh.rotation.x = 0.16;

    // Iconic Right-Side Double-Height Entrance Portico Frame
    addOutlinedMesh(new THREE.BoxGeometry(0.42, 2.95, 0.46), claddingMat, [2.75, 1.9, 2.75]);
    addOutlinedMesh(new THREE.BoxGeometry(0.42, 2.95, 0.46), claddingMat, [4.05, 1.9, 2.75]);
    addOutlinedMesh(new THREE.BoxGeometry(1.9, 0.52, 2.2), claddingMat, [3.4, 3.45, 1.9]);
    addOutlinedMesh(
      new THREE.BoxGeometry(1.5, 2.7, 1.7),
      blueGlassMat,
      [3.35, 1.9, 1.55],
      buildingGroup,
      accentEdgeMat
    );

    // =========================================================================
    // 3. MAIN BLUE CURTAIN WALL TOWER + 5 STAGGERED CUTOUTS + "UNTAR"
    // =========================================================================
    const towerW = 4.45;
    const towerH = 11.8;
    const towerD = 4.05;
    const towerCenterX = -1.3;
    const towerBaseY = 3.16;
    const towerCenterY = towerBaseY + towerH / 2;
    const towerCenterZ = -0.58;

    addOutlinedMesh(
      new THREE.BoxGeometry(towerW, towerH, towerD),
      blueGlassMat,
      [towerCenterX, towerCenterY, towerCenterZ],
      buildingGroup,
      accentEdgeMat
    );

    // Fine Curtain-Wall Grid (18 horizontal floors x 8 vertical columns)
    const floors = 18;
    for (let f = 0; f <= floors; f++) {
      const fy = towerBaseY + (f / floors) * towerH;
      addOutlinedMesh(
        new THREE.BoxGeometry(towerW + 0.06, 0.055, towerD + 0.06),
        concreteMat,
        [towerCenterX, fy, towerCenterZ]
      );
    }
    const towerCols = 8;
    for (let c = 0; c <= towerCols; c++) {
      const cx = towerCenterX - towerW / 2 + (c / towerCols) * towerW;
      addOutlinedMesh(
        new THREE.BoxGeometry(0.055, towerH + 0.06, towerD + 0.06),
        concreteMat,
        [cx, towerCenterY, towerCenterZ]
      );
    }
    for (let bz = -2.55; bz <= 1.35; bz += 0.65) {
      addOutlinedMesh(
        new THREE.BoxGeometry(towerW + 0.06, towerH + 0.06, 0.055),
        concreteMat,
        [towerCenterX, towerCenterY, bz]
      );
    }

    // Subtle scattered light window accents seen on the blue facade
    const accentPanes: [number, number][] = [
      [-3.1, 12.1],
      [-2.1, 11.3],
      [-1.0, 9.6],
      [-2.8, 7.2],
      [-1.1, 5.1],
      [-0.2, 8.9],
    ];
    accentPanes.forEach(([ax, ay]) => {
      addOutlinedMesh(
        new THREE.BoxGeometry(0.24, 0.5, 0.04),
        warmWindowMat,
        [ax, ay, 1.46],
        buildingGroup,
        accentEdgeMat
      );
    });

    // 5 Signature Staggered White-Framed Deep Vertical Void Cutouts (exact match to image_5cdea62b.png)
    const cutouts: [number, number][] = [
      [-3.08, 10.15], // Upper-left cutout
      [-2.42, 4.95],  // Lower-left cutout
      [-1.78, 8.35],  // Center-mid cutout
      [-0.78, 6.55],  // Lower-right-mid cutout
      [-0.25, 11.85], // Upper-right cutout below "R"
    ];
    cutouts.forEach(([cx, cy]) => {
      addOutlinedMesh(new THREE.BoxGeometry(0.46, 1.52, 0.14), claddingMat, [cx, cy, 1.47]);
      addOutlinedMesh(new THREE.BoxGeometry(0.3, 1.32, 0.16), darkStoneMat, [cx, cy, 1.48]);
    });

    // Bold Projecting White Horizontal Cornice Band Right Under "UNTAR" (image.png)
    addOutlinedMesh(
      new THREE.BoxGeometry(towerW + 0.18, 0.2, towerD + 0.18),
      claddingMat,
      [towerCenterX, towerBaseY + towerH - 1.56, towerCenterZ]
    );

    // Real 3D Extruded Raised "U N T A R" Channel Letters Proud of Curtain Wall Mullions
    const frontLettersGroup = new THREE.Group();
    const frontChars: Array<'U' | 'N' | 'T' | 'A' | 'R'> = ['U', 'N', 'T', 'A', 'R'];
    const fLetterW = 0.48;
    const fLetterH = 0.78;
    const fLetterT = 0.115;
    const fLetterGap = 0.24;
    const fTotalW = frontChars.length * fLetterW + (frontChars.length - 1) * fLetterGap;
    frontChars.forEach((ch, idx) => {
      const geo = new THREE.ExtrudeGeometry(createLetterShape(ch, fLetterW, fLetterH, fLetterT), {
        depth: 0.16,
        bevelEnabled: false,
      });
      const lx = -fTotalW / 2 + idx * (fLetterW + fLetterGap);
      addOutlinedMesh(geo, claddingMat, [lx, 0, 0], frontLettersGroup, edgeMat);
    });
    frontLettersGroup.position.set(towerCenterX, towerBaseY + towerH - 1.24, 1.49);
    buildingGroup.add(frontLettersGroup);

    // Rooftop mechanical deck & thin antenna rail
    addOutlinedMesh(
      new THREE.BoxGeometry(3.2, 0.44, 2.4),
      concreteMat,
      [towerCenterX, towerBaseY + towerH + 0.22, towerCenterZ - 0.1]
    );

    // =========================================================================
    // 4. CORNER LOUVERED GLAZED SHAFT WITH PROJECTING WHITE L-FRAME (image_5cdea62b.png)
    // =========================================================================
    const shaftX = 1.42;
    const shaftZ = 1.15;
    const shaftBaseY = 3.16;
    const shaftLevels = 16;
    const shaftLevelH = 0.65;
    const shaftH = shaftLevels * shaftLevelH; // Top at 13.56

    addOutlinedMesh(
      new THREE.BoxGeometry(1.38, shaftH, 1.45),
      blueGlassMat,
      [shaftX, shaftBaseY + shaftH / 2, shaftZ],
      buildingGroup,
      accentEdgeMat
    );
    // Projecting left-side vertical frame rail & overhanging top canopy cap
    addOutlinedMesh(
      new THREE.BoxGeometry(0.14, shaftH + 0.18, 1.62),
      claddingMat,
      [shaftX - 0.72, shaftBaseY + shaftH / 2, shaftZ]
    );
    for (let l = 0; l <= shaftLevels; l++) {
      const ly = shaftBaseY + l * shaftLevelH;
      const isTopCap = l === shaftLevels;
      addOutlinedMesh(
        new THREE.BoxGeometry(isTopCap ? 1.72 : 1.5, isTopCap ? 0.2 : 0.075, isTopCap ? 1.75 : 1.6),
        claddingMat,
        [shaftX, ly, shaftZ]
      );
    }
    [0.95, 1.42, 1.9].forEach((lx) => {
      addOutlinedMesh(new THREE.BoxGeometry(0.055, shaftH, 1.56), concreteMat, [
        lx,
        shaftBaseY + shaftH / 2,
        shaftZ,
      ]);
    });

    // =========================================================================
    // 5. ANGLED DOUBLE-SLOPED CORNER SPIRE, RIBBED WALLS & BOTH CRESTS
    //    (Rotated ~27.5 deg sideways to match image_040dc35c.png & image_08e58c04.png)
    // =========================================================================
    const rightWingGroup = new THREE.Group();
    rightWingGroup.position.set(1.55, 0, 1.05);
    rightWingGroup.rotation.y = 0.48;
    buildingGroup.add(rightWingGroup);

    // Lower rectangular core in local rightWingGroup coords (x: 0..2.15, z: -3.05..+0.45)
    addOutlinedMesh(
      new THREE.BoxGeometry(2.15, 13.73, 3.5),
      claddingMat,
      [1.075, 7.185, -1.3],
      rightWingGroup
    );

    // Upper Double-Sloped Triangular Corner Prow Crown (apex at front-outer x=2.15, z=+0.45, y=17.0)
    const prowCrownGeo = createSlopedCornerProwGeometry(
      0,
      2.15,
      -1.25,
      0.45,
      14.0,
      14.0,
      17.0,
      14.05,
      14.0
    );
    addOutlinedMesh(prowCrownGeo, claddingMat, [0, 0, 0], rightWingGroup);

    // Vertical Metallic Cladding Ribs along Front (+z_local) and Right (+x_local) White Walls
    for (let rx = 0.16; rx <= 2.05; rx += 0.24) {
      const frac = rx / 2.15;
      const topY = 14.0 + frac * 2.9;
      const ribH = topY - 3.2;
      addOutlinedMesh(
        new THREE.BoxGeometry(0.035, ribH, 0.04),
        ribSlateMat,
        [rx, 3.2 + ribH / 2, 0.46],
        rightWingGroup
      );
    }
    for (let rz = -2.95; rz <= 0.36; rz += 0.24) {
      let topY = 14.05;
      if (rz > -1.25) {
        const frac = (rz - -1.25) / (0.45 - -1.25);
        topY = 14.05 + frac * 2.85;
      }
      const ribH = topY - 3.2;
      addOutlinedMesh(
        new THREE.BoxGeometry(0.04, ribH, 0.035),
        ribSlateMat,
        [2.16, 3.2 + ribH / 2, rz],
        rightWingGroup
      );
    }

    // Crest #1 (Front Sloped Angled White Face) — Solid 3D Raised Pentagon Plaque + Navy Crest
    const frontShieldGeo = createPentagonShieldGeometry(0.82, 0.14);
    addOutlinedMesh(frontShieldGeo, claddingMat, [1.28, 13.85, 0.49], rightWingGroup);

    const frontCrestGeo = new THREE.PlaneGeometry(1.5, 1.5);
    disposables.push(frontCrestGeo);
    const frontCrest = new THREE.Mesh(frontCrestGeo, navyCrestMat);
    frontCrest.position.set(1.28, 13.85, 0.64);
    rightWingGroup.add(frontCrest);

    // Crest #2 (Right-Side +x_local Sloped White Face, visible in image_470658df.png)
    const sideShieldGroup = new THREE.Group();
    const sideShieldGeo = createPentagonShieldGeometry(0.74, 0.14);
    addOutlinedMesh(sideShieldGeo, claddingMat, [0, 0, 0], sideShieldGroup, edgeMat);
    sideShieldGroup.rotation.y = Math.PI / 2;
    sideShieldGroup.position.set(2.19, 13.7, -0.36);
    rightWingGroup.add(sideShieldGroup);

    const sideCrestGeo = new THREE.PlaneGeometry(1.36, 1.36);
    disposables.push(sideCrestGeo);
    const sideCrest = new THREE.Mesh(sideCrestGeo, navyCrestMat);
    sideCrest.position.set(2.34, 13.7, -0.36);
    sideCrest.rotation.y = Math.PI / 2;
    rightWingGroup.add(sideCrest);

    // Right-Side 3D Extruded Embossed "U N T A R" Channel Letters on +x_local Parapet
    const sideLettersGroup = new THREE.Group();
    const sLetterW = 0.26;
    const sLetterH = 0.46;
    const sLetterT = 0.07;
    const sLetterGap = 0.095;
    const sTotalW = frontChars.length * sLetterW + (frontChars.length - 1) * sLetterGap;
    frontChars.forEach((ch, idx) => {
      const geo = new THREE.ExtrudeGeometry(createLetterShape(ch, sLetterW, sLetterH, sLetterT), {
        depth: 0.13,
        bevelEnabled: false,
      });
      const lx = -sTotalW / 2 + idx * (sLetterW + sLetterGap);
      addOutlinedMesh(geo, darkStoneMat, [lx, 0, 0], sideLettersGroup, edgeMat);
    });
    sideLettersGroup.rotation.y = Math.PI / 2;
    sideLettersGroup.position.set(2.19, 12.68, -2.14);
    rightWingGroup.add(sideLettersGroup);

    // =========================================================================
    // 6. REAR & SIDE AUTHENTIC DETAILS: CANTILEVERED SKY-NOTCH & SKYBRIDGE PORTS
    // =========================================================================
    addOutlinedMesh(
      new THREE.BoxGeometry(1.45, 0.55, 1.35),
      claddingMat,
      [0.45, 14.35, -2.05]
    );
    addOutlinedMesh(
      new THREE.BoxGeometry(0.95, 0.72, 0.95),
      darkStoneMat,
      [0.55, 13.8, -2.18]
    );

    [4.65, 8.45].forEach((sy) => {
      addOutlinedMesh(
        new THREE.BoxGeometry(1.05, 0.62, 0.78),
        concreteMat,
        [-4.05, sy, -0.78],
        buildingGroup,
        accentEdgeMat
      );
    });

    // =========================================================================
    // 7. FLANKING CAMPUS TREES ALONG JL. LETJEN S. PARMAN PLAZA
    // =========================================================================
    const treePositions: [number, number][] = [
      [-4.65, 3.25],
      [-3.35, 3.45],
      [1.85, 3.4],
      [4.55, 2.75],
    ];
    treePositions.forEach(([tx, tz]) => {
      addOutlinedMesh(new THREE.CylinderGeometry(0.07, 0.09, 0.65, 8), trunkMat, [tx, 0.65, tz]);
      addOutlinedMesh(new THREE.IcosahedronGeometry(0.42, 1), foliageMat, [tx, 1.15, tz]);
    });

    scene.add(buildingGroup);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      controls.update();
      renderer.render(scene, camera);
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[450px] w-full overflow-hidden">
        {webglFallback ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg viewBox="0 0 240 180" className="w-52 h-40 mb-3" fill="none">
              <rect x="35" y="145" width="170" height="10" rx="2" className="fill-slate-300 dark:fill-slate-700" />
              <rect x="55" y="34" width="85" height="111" rx="2" stroke="#06B6D4" strokeWidth="1.5" className="fill-[#1d4ed8]/20" />
              <polygon points="145,145 145,38 185,18 185,145" stroke="#38bdf8" strokeWidth="1.5" className="fill-slate-200 dark:fill-slate-700" />
            </svg>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
              Model 3D Gedung Utama UNTAR
            </p>
          </div>
        ) : (
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            aria-label="Model arsitektur 3D interaktif 360 derajat Gedung Utama Universitas Tarumanagara"
          />
        )}
      </div>

      {/* Crisp Monospace Architectural Caption */}
      <div className="pt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] tracking-wider text-slate-500 dark:text-slate-400">
        <span>KAMPUS I · GEDUNG UTAMA — UNTAR</span>
        <span>360° ORBIT · DRAG TO ROTATE</span>
      </div>
    </div>
  );
};
