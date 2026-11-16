import * as THREE from 'three';
import type { SennaMaterialLibrary } from './sennaMaterials';

export interface SennaModelHandles {
  root: THREE.Group;
  wingGroup: THREE.Group;
  splitterGroup: THREE.Group;
  diffuserGroup: THREE.Group;
  leftDoorPivot: THREE.Group;
  rightDoorPivot: THREE.Group;
  steeringWheelGroup: THREE.Group;
  wheelSpinGroups: THREE.Group[];
  disposables: Array<{ dispose: () => void }>;
}

/**
 * Generates a smooth, watertight double-curved parametric surface from a grid evaluator(u, v) -> [x, y, z].
 */
function createParametricGrid(
  uSegs: number,
  vSegs: number,
  evalFn: (u: number, v: number) => [number, number, number]
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iu = 0; iu <= uSegs; iu++) {
    const u = iu / uSegs;
    for (let iv = 0; iv <= vSegs; iv++) {
      const v = iv / vSegs;
      const [x, y, z] = evalFn(u, v);
      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  const stride = vSegs + 1;
  for (let iu = 0; iu < uSegs; iu++) {
    for (let iv = 0; iv < vSegs; iv++) {
      const a = iu * stride + iv;
      const b = (iu + 1) * stride + iv;
      const c = (iu + 1) * stride + (iv + 1);
      const d = iu * stride + (iv + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export function buildSennaModel(mats: SennaMaterialLibrary): SennaModelHandles {
  const root = new THREE.Group();
  const chassisGroup = new THREE.Group();
  const cockpitGroup = new THREE.Group();
  const wingGroup = new THREE.Group();
  const splitterGroup = new THREE.Group();
  const diffuserGroup = new THREE.Group();
  const leftDoorPivot = new THREE.Group();
  const rightDoorPivot = new THREE.Group();
  const steeringWheelGroup = new THREE.Group();
  const wheelSpinGroups: THREE.Group[] = [];
  const disposables: Array<{ dispose: () => void }> = [];

  root.add(
    chassisGroup,
    cockpitGroup,
    wingGroup,
    splitterGroup,
    diffuserGroup,
    leftDoorPivot,
    rightDoorPivot
  );

  const addMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    pos: [number, number, number] = [0, 0, 0],
    parent: THREE.Object3D = chassisGroup,
    rot: [number, number, number] = [0, 0, 0],
    castShadow = true
  ) => {
    disposables.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // =========================================================================
  // 1. UNDERBODY MONOCAGE FLOOR & SCULPTED CARBON SIDE ROCKERS
  // =========================================================================
  const floorGeo = createParametricGrid(18, 12, (u, v) => {
    const x = THREE.MathUtils.lerp(-2.12, 2.1, u);
    const halfW =
      x < -1.1
        ? THREE.MathUtils.lerp(0.84, 0.94, (x + 2.12) / 1.02)
        : x < 0.8
        ? 0.94
        : THREE.MathUtils.lerp(0.94, 0.86, (x - 0.8) / 1.3);
    const z = (v - 0.5) * 2 * halfW;
    return [x, 0.165, z];
  });
  addMesh(floorGeo, mats.carbonMatte, [0, 0, 0], chassisGroup);

  // Sleek Carbon Side Aero Skirts between front & rear wheel arches
  [-0.95, 0.95].forEach((sz) => {
    const sign = sz > 0 ? 1 : -1;
    const skirtGeo = createParametricGrid(16, 4, (u, v) => {
      const x = THREE.MathUtils.lerp(-1.02, 0.98, u);
      const flare = Math.pow(Math.abs(u - 0.5) * 2, 3) * 0.05;
      const y = 0.15 + v * 0.055 + flare * v;
      const z = sz + sign * (0.045 * (1 - v) + 0.01 * Math.sin(u * Math.PI));
      return [x, y, z];
    });
    addMesh(skirtGeo, mats.carbonTwill, [0, 0, 0], chassisGroup);
  });

  // =========================================================================
  // 2. SMOOTH DOUBLE-CURVED FRONT CLAMSHELL & FENDER ARCHES (x: -2.26 -> -0.82)
  // =========================================================================
  const frontClamGeo = createParametricGrid(32, 26, (u, v) => {
    const x = THREE.MathUtils.lerp(-2.26, -0.82, u);
    // Lateral profile wraps from left lower fender lip (-1) up over fenders & hood to right lip (+1)
    const s = (v - 0.5) * 2; // -1 .. +1
    const absS = Math.abs(s);

    // Overall front width tapers gracefully toward nose tip
    const maxHalfW =
      0.78 + 0.18 * smoothstep(-2.26, -1.52, x) - 0.02 * smoothstep(-1.25, -0.82, x);
    const z = s * maxHalfW;

    // Base sloped nose height from 0.34 at tip up to 0.72 at windshield cowl
    const baseHoodY = 0.32 + 0.38 * Math.pow(u, 0.85);

    // Muscular twin front fender peaks over wheels (around absS = 0.74, x = -1.48)
    const wheelDist = Math.abs(x + 1.48);
    const fenderPeak =
      0.13 * Math.exp(-Math.pow((absS - 0.72) / 0.22, 2)) * (0.45 + 0.55 * Math.exp(-wheelDist * 2.2));

    // Recessed Senna center hood aero channel (around absS < 0.38)
    const hoodRecess =
      -0.065 *
      Math.exp(-Math.pow(absS / 0.34, 2.2)) *
      smoothstep(-2.05, -1.7, x) *
      smoothstep(-0.88, -1.15, x);

    // Outer shoulder curve dropping down toward lower fender skirt & curved wheel arch cutout
    const edgeDrop = smoothstep(0.76, 1.0, absS);
    const dxWheel = x + 1.48;
    const archCurve =
      Math.abs(dxWheel) < 0.41 ? 0.36 + Math.sqrt(Math.max(0, 0.41 * 0.41 - dxWheel * dxWheel)) : 0.21;
    const lowerLipY = THREE.MathUtils.lerp(0.22, archCurve, smoothstep(-1.92, -1.78, x) * smoothstep(-1.02, -1.14, x));

    const topY = baseHoodY + fenderPeak + hoodRecess;
    const y = THREE.MathUtils.lerp(topY, lowerLipY, Math.pow(edgeDrop, 1.35));

    return [x, y, z];
  });
  addMesh(frontClamGeo, mats.silverBody, [0, 0, 0], chassisGroup);

  // Recessed Matte Carbon Hood Intake Scoop Insert sitting cleanly in the front aero valley
  const hoodCarbonGeo = createParametricGrid(14, 12, (u, v) => {
    const x = THREE.MathUtils.lerp(-1.86, -1.04, u);
    const s = (v - 0.5) * 2;
    const w = THREE.MathUtils.lerp(0.32, 0.48, u);
    const z = s * w;
    const baseY = 0.34 + 0.36 * Math.pow((x + 2.26) / 1.44, 0.85);
    const centerBridge = 0.025 * Math.exp(-Math.pow(s / 0.24, 2));
    return [x, baseY - 0.015 + centerBridge, z];
  });
  addMesh(hoodCarbonGeo, mats.carbonMatte, [0, 0, 0], chassisGroup);

  // =========================================================================
  // 3. SMOOTH DOUBLE-CURVED REAR HAUNCHES & FASTBACK DECK (x: 0.48 -> 2.24)
  // =========================================================================
  const rearBodyGeo = createParametricGrid(32, 28, (u, v) => {
    const x = THREE.MathUtils.lerp(0.48, 2.24, u);
    const s = (v - 0.5) * 2;
    const absS = Math.abs(s);

    const maxHalfW = 0.94 + 0.05 * Math.sin(u * Math.PI * 0.85) - 0.1 * smoothstep(1.82, 2.24, x);
    const z = s * maxHalfW;

    // Center deck tapers smoothly down from behind cabin roof (0.88) to tail fascia (0.64)
    const centerDeckY = THREE.MathUtils.lerp(0.84, 0.64, Math.pow(u, 0.9));

    // Muscular rear fenders swelling over rear wheels (x = 1.46)
    const rDist = Math.abs(x - 1.46);
    const haunchRise =
      0.13 * Math.exp(-Math.pow((absS - 0.72) / 0.22, 2)) * (0.4 + 0.6 * Math.exp(-rDist * 1.9));

    const edgeDrop = smoothstep(0.74, 1.0, absS);
    const dxRear = x - 1.46;
    const rearArchCurve =
      Math.abs(dxRear) < 0.44 ? 0.39 + Math.sqrt(Math.max(0, 0.44 * 0.44 - dxRear * dxRear)) : 0.23;
    const tailBottom = THREE.MathUtils.lerp(0.24, 0.42, smoothstep(1.88, 2.24, x));
    const lowerLipY =
      Math.abs(dxRear) < 0.44
        ? rearArchCurve
        : x > 1.88
        ? tailBottom
        : 0.23;

    const topY = centerDeckY + haunchRise;
    const y = THREE.MathUtils.lerp(topY, lowerLipY, Math.pow(edgeDrop, 1.35));

    return [x, y, z];
  });
  addMesh(rearBodyGeo, mats.silverBody, [0, 0, 0], chassisGroup);

  // Dark Matte Inner Wheel-Arch Barrel Liners + Side Intake Cavities (no hollow see-through gaps!)
  [
    { x: -1.48, y: 0.36, r: 0.415 },
    { x: 1.46, y: 0.39, r: 0.445 },
  ].forEach(({ x, y, r }) => {
    [-0.78, 0.78].forEach((wz) => {
      const linerGeo = new THREE.CylinderGeometry(r, r, 0.34, 24, 1, true, 0, Math.PI);
      linerGeo.rotateX(Math.PI / 2);
      addMesh(linerGeo, mats.darkChassis, [x, y, wz], chassisGroup, [0, 0, Math.PI / 2], false);
    });
  });

  // Sculpted Dark Side Aero Undercut Cavities framing the doors
  [-0.72, 0.72].forEach((iz) => {
    addMesh(new THREE.BoxGeometry(1.18, 0.46, 0.14), mats.darkChassis, [0.16, 0.48, iz], chassisGroup);
  });

  // =========================================================================
  // 4. FRONT CARBON SPLITTER, PAPAYA ACTIVE AERO INTAKES & LED LIGHTBLADES
  // =========================================================================
  const splitterShape = new THREE.Shape();
  splitterShape.moveTo(-2.32, -0.74);
  splitterShape.quadraticCurveTo(-2.4, 0, -2.32, 0.74);
  splitterShape.lineTo(-2.08, 0.96);
  splitterShape.lineTo(-1.82, 0.96);
  splitterShape.lineTo(-1.82, -0.96);
  splitterShape.lineTo(-2.08, -0.96);
  splitterShape.closePath();

  const splitterGeo = new THREE.ExtrudeGeometry(splitterShape, {
    depth: 0.032,
    bevelEnabled: true,
    bevelSize: 0.01,
    bevelThickness: 0.01,
    bevelSegments: 2,
  });
  splitterGeo.rotateX(Math.PI / 2);
  addMesh(splitterGeo, mats.carbonTwill, [0, 0.165, 0], splitterGroup);

  // Upturned carbon splitter winglets
  [-0.96, 0.96].forEach((ez) => {
    const epShape = new THREE.Shape();
    epShape.moveTo(-2.14, 0.14);
    epShape.lineTo(-1.84, 0.14);
    epShape.lineTo(-1.88, 0.28);
    epShape.quadraticCurveTo(-2.08, 0.24, -2.14, 0.14);
    const epGeo = new THREE.ExtrudeGeometry(epShape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSize: 0.005,
      bevelThickness: 0.005,
    });
    epGeo.translate(0, 0, -0.01);
    addMesh(epGeo, mats.carbonTwill, [0, 0, ez], splitterGroup);
  });

  // Central Front Radiator Honeycomb Mesh
  addMesh(new THREE.BoxGeometry(0.1, 0.18, 0.82), mats.honeycombMesh, [-2.22, 0.25, 0], splitterGroup);

  // Papaya Orange Active Aero Ducts, White DRL Lightblade & Matrix Headlights
  [-0.6, 0.6].forEach((pz) => {
    const sign = pz > 0 ? 1 : -1;
    // Recessed dark carbon headlight & intake cavity
    addMesh(
      new THREE.BoxGeometry(0.18, 0.26, 0.34),
      mats.darkChassis,
      [-2.14, 0.34, pz],
      splitterGroup,
      [0, sign * -0.14, 0]
    );

    // Signature Papaya Orange sculpted inner aero duct scoop
    const ductGeo = createParametricGrid(8, 8, (u, v) => {
      const dx = THREE.MathUtils.lerp(-2.22, -2.02, u);
      const dy = THREE.MathUtils.lerp(0.18, 0.33, v);
      const dz = pz + (u - 0.5) * -0.04 * sign + (v - 0.5) * 0.03 * sign;
      return [dx, dy, dz];
    });
    addMesh(ductGeo, mats.papayaMetallic, [0, 0, 0], splitterGroup);

    // Horizontal White LED DRL Lightblade
    addMesh(
      new THREE.BoxGeometry(0.18, 0.026, 0.32),
      mats.drlWhite,
      [-2.16, 0.37, pz],
      splitterGroup,
      [sign * 0.05, sign * -0.14, -0.08]
    );

    // Matrix Upper Projector Lenses
    [-0.08, 0, 0.08].forEach((lz) => {
      addMesh(
        new THREE.SphereGeometry(0.022, 10, 10),
        mats.drlWhite,
        [-2.12, 0.435, pz + lz],
        splitterGroup
      );
    });
  });

  // =========================================================================
  // 5. FULL REALISTIC MONOCAGE COCKPIT INTERIOR
  // =========================================================================
  // Monocage floor, side sills, center carbon spine & rear firewall bulkhead
  addMesh(new THREE.BoxGeometry(1.42, 0.04, 1.24), mats.carbonMatte, [-0.15, 0.23, 0], cockpitGroup);
  addMesh(new THREE.BoxGeometry(1.3, 0.22, 0.2), mats.carbonTwill, [-0.12, 0.33, 0], cockpitGroup);
  addMesh(new THREE.BoxGeometry(0.08, 0.58, 1.24), mats.carbonTwill, [0.54, 0.54, 0], cockpitGroup);

  // Curved Alcantara Dashboard Cowl sweeping smoothly across front of cockpit
  const dashGeo = createParametricGrid(10, 14, (u, v) => {
    const x = THREE.MathUtils.lerp(-0.96, -0.52, u);
    const s = (v - 0.5) * 2;
    const z = s * 0.64;
    const y = THREE.MathUtils.lerp(0.68, 0.74, u) - Math.pow(s, 2) * 0.04;
    return [x, y, z];
  });
  addMesh(dashGeo, mats.alcantara, [0, 0, 0], cockpitGroup);

  // Portrait Center Infotainment Screen
  addMesh(
    new THREE.BoxGeometry(0.03, 0.21, 0.14),
    mats.darkChassis,
    [-0.49, 0.6, 0],
    cockpitGroup,
    [0, 0, 0.25]
  );
  addMesh(
    new THREE.PlaneGeometry(0.125, 0.185),
    mats.centerDisplay,
    [-0.472, 0.6, 0],
    cockpitGroup,
    [0, Math.PI / 2, 0],
    false
  );

  // Folding Digital Track Telemetry Cluster (LHD z = +0.34)
  addMesh(
    new THREE.BoxGeometry(0.025, 0.105, 0.25),
    mats.carbonTwill,
    [-0.55, 0.77, 0.34],
    cockpitGroup,
    [0, 0, 0.18]
  );
  addMesh(
    new THREE.PlaneGeometry(0.23, 0.088),
    mats.dashCluster,
    [-0.535, 0.77, 0.34],
    cockpitGroup,
    [0, Math.PI / 2, 0],
    false
  );

  // Steering Column + Carbon Flat-Bottom Steering Wheel (LHD z = +0.34)
  addMesh(
    new THREE.CylinderGeometry(0.032, 0.038, 0.22, 14),
    mats.carbonTwill,
    [-0.52, 0.69, 0.34],
    cockpitGroup,
    [0, 0, Math.PI / 2 - 0.24]
  );

  steeringWheelGroup.position.set(-0.4, 0.72, 0.34);
  steeringWheelGroup.rotation.set(0, 0, 0.22);
  cockpitGroup.add(steeringWheelGroup);

  const rimGeo = new THREE.TorusGeometry(0.135, 0.016, 12, 32);
  rimGeo.rotateY(Math.PI / 2);
  addMesh(rimGeo, mats.carbonTwill, [0, 0, 0], steeringWheelGroup);
  addMesh(new THREE.BoxGeometry(0.034, 0.022, 0.024), mats.papayaMetallic, [0, 0.135, 0], steeringWheelGroup);
  [-0.128, 0.128].forEach((gz) => {
    addMesh(new THREE.BoxGeometry(0.034, 0.1, 0.028), mats.alcantara, [0, -0.01, gz], steeringWheelGroup);
  });
  addMesh(new THREE.BoxGeometry(0.026, 0.04, 0.22), mats.carbonTwill, [0, -0.01, 0], steeringWheelGroup);
  addMesh(new THREE.CylinderGeometry(0.038, 0.038, 0.032, 16), mats.darkChassis, [0.005, 0, 0], steeringWheelGroup, [
    0,
    0,
    Math.PI / 2,
  ]);
  [-0.095, 0.095].forEach((sz) => {
    addMesh(new THREE.BoxGeometry(0.01, 0.085, 0.032), mats.forgedAlloy, [-0.028, 0.02, sz], steeringWheelGroup);
  });

  // Overhead Roof Engine Start & Door Control Pod
  addMesh(new THREE.BoxGeometry(0.24, 0.04, 0.11), mats.carbonTwill, [-0.2, 1.07, 0], cockpitGroup);
  addMesh(new THREE.CylinderGeometry(0.013, 0.013, 0.018, 12), mats.redTailLed, [-0.22, 1.045, 0], cockpitGroup);

  // Dual Sculpted Carbon Bucket Seats
  [0.34, -0.34].forEach((seatZ) => {
    const seatGroup = new THREE.Group();
    seatGroup.position.set(0.06, 0.26, seatZ);
    cockpitGroup.add(seatGroup);

    const seatProfile = new THREE.Shape();
    seatProfile.moveTo(-0.32, 0.04);
    seatProfile.lineTo(0.08, 0);
    seatProfile.quadraticCurveTo(0.24, 0.02, 0.31, 0.58);
    seatProfile.quadraticCurveTo(0.32, 0.73, 0.22, 0.73);
    seatProfile.quadraticCurveTo(0.16, 0.71, 0.14, 0.52);
    seatProfile.quadraticCurveTo(0.08, 0.16, -0.05, 0.11);
    seatProfile.lineTo(-0.3, 0.13);
    seatProfile.closePath();

    const seatGeo = new THREE.ExtrudeGeometry(seatProfile, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    seatGeo.translate(0, 0, -0.19);
    addMesh(seatGeo, mats.carbonTwill, [0, 0, 0], seatGroup);

    addMesh(new THREE.BoxGeometry(0.036, 0.44, 0.24), mats.alcantara, [0.13, 0.38, 0], seatGroup, [
      0,
      0,
      -0.22,
    ]);
    addMesh(new THREE.BoxGeometry(0.04, 0.4, 0.04), mats.papayaMetallic, [0.132, 0.38, 0], seatGroup, [
      0,
      0,
      -0.22,
    ]);
  });

  // Aluminum Racing Pedals
  [0.27, 0.4].forEach((pz) => {
    addMesh(
      new THREE.BoxGeometry(0.014, 0.1, 0.05),
      mats.forgedAlloy,
      [-0.84, 0.35, pz],
      cockpitGroup,
      [0, 0, -0.35]
    );
  });

  // =========================================================================
  // 6. SMOOTH CURVED TEARDROP CANOPY GLASS, ROOF SNORKEL & TRIPLE EXHAUSTS
  // =========================================================================
  // Smooth Teardrop Windshield & Canopy Dome (continuous parametric dome, zero degenerate folds)
  const canopyDomeGeo = createParametricGrid(22, 18, (u, v) => {
    const x = THREE.MathUtils.lerp(-1.04, 0.62, u);
    const s = (v - 0.5) * 2;
    const widthProfile = 0.62 - 0.14 * Math.pow(Math.abs(u - 0.42) * 1.4, 2);
    const z = s * widthProfile;

    // Arch height peaks around u = 0.55 (over driver head) and curves smoothly across width
    const centerlineY =
      u < 0.55
        ? THREE.MathUtils.lerp(0.68, 1.13, Math.sin((u / 0.55) * (Math.PI / 2)))
        : THREE.MathUtils.lerp(1.13, 0.85, Math.pow((u - 0.55) / 0.45, 1.4));
    const sideDrop = 0.26 * Math.pow(Math.abs(s), 2.1);
    return [x, centerlineY - sideDrop, z];
  });
  addMesh(canopyDomeGeo, mats.canopyGlass, [0, 0, 0], chassisGroup, [0, 0, 0], false);

  // Curved Carbon Roof Spine & Overhead Snorkel Scoop
  const roofSpineGeo = createParametricGrid(18, 10, (u, v) => {
    const x = THREE.MathUtils.lerp(-0.55, 1.05, u);
    const s = (v - 0.5) * 2;
    const z = s * THREE.MathUtils.lerp(0.28, 0.16, u);
    const baseRoofY =
      x < 0.1
        ? THREE.MathUtils.lerp(0.94, 1.14, smoothstep(-0.55, 0.1, x))
        : THREE.MathUtils.lerp(1.14, 0.8, smoothstep(0.1, 1.05, x));
    // Overhead snorkel bulge between x = -0.05 and x = 0.55
    const snorkelBulge =
      0.08 * Math.exp(-Math.pow((x - 0.18) / 0.24, 2)) * Math.cos(s * Math.PI * 0.45);
    return [x, baseRoofY + snorkelBulge - Math.pow(s, 2) * 0.03, z];
  });
  addMesh(roofSpineGeo, mats.carbonTwill, [0, 0, 0], chassisGroup);
  addMesh(new THREE.BoxGeometry(0.035, 0.055, 0.2), mats.darkChassis, [-0.02, 1.16, 0], chassisGroup);

  // Slim Curved Carbon A-Pillar Frames
  [-0.58, 0.58].forEach((az) => {
    const sign = az > 0 ? 1 : -1;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.02, 0.68, sign * 0.62),
      new THREE.Vector3(-0.74, 0.91, sign * 0.56),
      new THREE.Vector3(-0.32, 1.07, sign * 0.48),
      new THREE.Vector3(0.05, 1.12, sign * 0.34),
    ]);
    const pillarGeo = new THREE.TubeGeometry(curve, 14, 0.024, 8, false);
    addMesh(pillarGeo, mats.carbonTwill, [0, 0, 0], chassisGroup);
    void az;
  });

  // Recessed Carbon Exhaust Surround & Triple Top-Exit Metallic Exhausts (image_5011e423.png)
  addMesh(new THREE.BoxGeometry(0.42, 0.06, 0.42), mats.carbonTwill, [1.54, 0.72, 0], chassisGroup);
  const exhaustCoords: Array<[number, number]> = [
    [1.46, -0.1],
    [1.46, 0.1],
    [1.62, 0],
  ];
  exhaustCoords.forEach(([ex, ez]) => {
    addMesh(
      new THREE.CylinderGeometry(0.052, 0.052, 0.1, 16),
      mats.inconelExhaust,
      [ex, 0.755, ez],
      chassisGroup,
      [0, 0, -0.32]
    );
    addMesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.11, 14),
      mats.darkChassis,
      [ex, 0.758, ez],
      chassisGroup,
      [0, 0, -0.32]
    );
  });

  // =========================================================================
  // 7. SCULPTED DIHEDRAL DOORS WITH LOWER TRANSPARENT GLASS PANEL
  // =========================================================================
  const buildDihedralDoor = (pivot: THREE.Group, sideSign: 1 | -1) => {
    pivot.position.set(-0.86, 0.72, sideSign * 0.74);

    // Sculpted Curved Door Upper Shoulder (Ice Silver-Blue)
    const upperGeo = createParametricGrid(14, 8, (u, v) => {
      const dx = THREE.MathUtils.lerp(0, 1.24, u);
      const dy = THREE.MathUtils.lerp(-0.04, -0.25, v);
      const waistPinch = -0.06 * Math.sin(u * Math.PI);
      const dz = sideSign * (0.14 + waistPinch + Math.sin(v * Math.PI) * 0.035);
      return [dx, dy, dz];
    });
    addMesh(upperGeo, mats.silverBody, [0, 0, 0], pivot);

    // Lower Door Sill Trim (Ice Silver-Blue + Carbon Blade)
    const lowerGeo = createParametricGrid(14, 6, (u, v) => {
      const dx = THREE.MathUtils.lerp(0.05, 1.18, u);
      const dy = THREE.MathUtils.lerp(-0.4, -0.5, v);
      const waistPinch = -0.05 * Math.sin(u * Math.PI);
      const dz = sideSign * (0.13 + waistPinch + (1 - v) * 0.025);
      return [dx, dy, dz];
    });
    addMesh(lowerGeo, mats.silverBody, [0, 0, 0], pivot);

    // Signature Transparent Lower Door Window Panel (curved to match door waist!)
    const lowerGlassGeo = createParametricGrid(12, 4, (u, v) => {
      const dx = THREE.MathUtils.lerp(0.18, 1.02, u);
      const dy = THREE.MathUtils.lerp(-0.25, -0.4, v);
      const waistPinch = -0.055 * Math.sin(THREE.MathUtils.lerp(0.15, 0.82, u) * Math.PI);
      const dz = sideSign * (0.135 + waistPinch);
      return [dx, dy, dz];
    });
    addMesh(lowerGlassGeo, mats.doorGlass, [0, 0, 0], pivot, [0, 0, 0], false);

    // Sculpted Carbon Wing Mirror on Aerodynamic Stalk
    const stalkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.12, -0.04, sideSign * 0.14),
      new THREE.Vector3(0.14, 0.03, sideSign * 0.24),
      new THREE.Vector3(0.15, 0.06, sideSign * 0.31),
    ]);
    addMesh(new THREE.TubeGeometry(stalkCurve, 8, 0.014, 6, false), mats.carbonTwill, [0, 0, 0], pivot);
    const mirrorPod = new THREE.SphereGeometry(0.075, 14, 12);
    mirrorPod.scale(1.35, 0.65, 1.0);
    addMesh(mirrorPod, mats.carbonTwill, [0.15, 0.065, sideSign * 0.32], pivot);
  };

  buildDihedralDoor(leftDoorPivot, 1);
  buildDihedralDoor(rightDoorPivot, -1);

  // =========================================================================
  // 8. SMOOTH CAMBERED SWAN-NECK CARBON REAR WING & ENDPLATES
  // =========================================================================
  [-0.44, 0.44].forEach((pz) => {
    const pylonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.72, 0.68, pz),
      new THREE.Vector3(1.78, 1.12, pz),
      new THREE.Vector3(1.88, 1.4, pz),
      new THREE.Vector3(2.04, 1.38, pz),
      new THREE.Vector3(2.02, 1.28, pz),
    ]);
    const pylonGeo = new THREE.TubeGeometry(pylonCurve, 18, 0.026, 8, false);
    pylonGeo.scale(1.4, 1, 0.48);
    addMesh(pylonGeo, mats.carbonTwill, [0, 0, 0], wingGroup);
  });

  // Gull-curved Dual Airfoil Blade
  const airfoilShape = new THREE.Shape();
  airfoilShape.moveTo(-0.26, 0.025);
  airfoilShape.quadraticCurveTo(0, 0.062, 0.26, -0.015);
  airfoilShape.quadraticCurveTo(0, -0.01, -0.26, 0.025);

  const mainWingGeo = new THREE.ExtrudeGeometry(airfoilShape, {
    depth: 1.98,
    bevelEnabled: true,
    bevelSize: 0.008,
    bevelThickness: 0.008,
    bevelSegments: 2,
    curveSegments: 16,
  });
  mainWingGeo.translate(0, 0, -0.99);
  const wPos = mainWingGeo.attributes.position;
  for (let i = 0; i < wPos.count; i++) {
    const zVal = wPos.getZ(i);
    const yVal = wPos.getY(i);
    const arch = Math.sin(Math.min(1, Math.abs(zVal) / 0.99) * Math.PI) * 0.042;
    wPos.setY(i, yVal + arch);
  }
  mainWingGeo.computeVertexNormals();
  addMesh(mainWingGeo, mats.carbonTwill, [2.04, 1.28, 0], wingGroup, [0, 0, 0.13]);

  // Rounded Sculpted Wing Endplates
  [-1.005, 1.005].forEach((ez) => {
    const epShape = new THREE.Shape();
    epShape.moveTo(-0.28, 0.11);
    epShape.quadraticCurveTo(0, 0.16, 0.3, 0.09);
    epShape.quadraticCurveTo(0.32, -0.06, 0.25, -0.2);
    epShape.quadraticCurveTo(-0.08, -0.22, -0.26, -0.12);
    epShape.closePath();

    const epGeo = new THREE.ExtrudeGeometry(epShape, {
      depth: 0.032,
      bevelEnabled: true,
      bevelSize: 0.01,
      bevelThickness: 0.01,
      curveSegments: 14,
    });
    epGeo.translate(0, 0, -0.016);
    addMesh(epGeo, mats.silverEndplate, [2.05, 1.22, ez], wingGroup, [0, 0, 0.12]);
  });

  // =========================================================================
  // 9. REAR HONEYCOMB FASCIA, SLIM RED LED LIGHTBLADES & 6-FIN DIFFUSER
  // =========================================================================
  addMesh(new THREE.BoxGeometry(0.06, 0.24, 1.62), mats.honeycombMesh, [2.22, 0.53, 0], diffuserGroup);
  addMesh(new THREE.BoxGeometry(0.11, 0.065, 1.72), mats.carbonTwill, [2.23, 0.39, 0], diffuserGroup);

  [-0.55, 0.55].forEach((tz) => {
    addMesh(new THREE.BoxGeometry(0.05, 0.028, 0.46), mats.redTailLed, [2.26, 0.6, tz], diffuserGroup);
    addMesh(new THREE.BoxGeometry(0.05, 0.022, 0.22), mats.redTailLed, [2.25, 0.35, tz * 1.15], diffuserGroup);
  });

  addMesh(new THREE.BoxGeometry(0.4, 0.05, 1.68), mats.carbonTwill, [2.06, 0.185, 0], diffuserGroup);
  [-0.66, -0.41, -0.16, 0.16, 0.41, 0.66].forEach((fz) => {
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.35, 0);
    finShape.lineTo(0.37, 0.19);
    finShape.quadraticCurveTo(0.16, 0.21, 0, 0.1);
    finShape.closePath();
    const finGeo = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.018,
      bevelEnabled: true,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    });
    finGeo.translate(0, 0, -0.009);
    addMesh(finGeo, mats.carbonTwill, [1.88, 0.155, fz], diffuserGroup);
  });

  // =========================================================================
  // 10. PRECISION 10-SPOKE Y-SPLIT FORGED WHEELS, DRILLED ROTORS & CALIPERS
  // =========================================================================
  const wheelConfigs: Array<{ x: number; z: number; r: number; w: number }> = [
    { x: -1.48, z: 0.89, r: 0.355, w: 0.26 },
    { x: -1.48, z: -0.89, r: 0.355, w: 0.26 },
    { x: 1.46, z: 0.92, r: 0.385, w: 0.3 },
    { x: 1.46, z: -0.92, r: 0.385, w: 0.3 },
  ];

  wheelConfigs.forEach(({ x, z, r, w }) => {
    const wheelHub = new THREE.Group();
    wheelHub.position.set(x, r, z);
    chassisGroup.add(wheelHub);

    const sideSign = z > 0 ? 1 : -1;

    // Static Curved Papaya Orange 6-Piston Brembo Brake Caliper
    const caliperX = x < 0 ? 0.135 : -0.135;
    const caliperGeo = new THREE.CylinderGeometry(r * 0.4, r * 0.4, 0.085, 16, 1, false, -0.62, 1.24);
    caliperGeo.rotateX(Math.PI / 2);
    addMesh(
      caliperGeo,
      mats.papayaCaliper,
      [caliperX, 0.02, -sideSign * 0.01],
      wheelHub,
      [0, 0, x < 0 ? -0.35 : 2.75]
    );

    const spinGroup = new THREE.Group();
    wheelHub.add(spinGroup);
    wheelSpinGroups.push(spinGroup);

    // Smooth chamfered Michelin tire profile
    const rimOuterR = r * 0.7;
    const rimInnerR = r * 0.67;
    const tireHalfW = w * 0.5;
    const lathePts = [
      new THREE.Vector2(rimOuterR, -tireHalfW * 0.86),
      new THREE.Vector2(r * 0.93, -tireHalfW),
      new THREE.Vector2(r, -tireHalfW * 0.84),
      new THREE.Vector2(r, tireHalfW * 0.84),
      new THREE.Vector2(r * 0.93, tireHalfW),
      new THREE.Vector2(rimOuterR, tireHalfW * 0.86),
    ];
    const tireGeo = new THREE.LatheGeometry(lathePts, 40);
    tireGeo.rotateX(Math.PI / 2);
    addMesh(tireGeo, mats.tireRubber, [0, 0, 0], spinGroup);

    // Open forged alloy rim barrel & crisp rim lip torus
    const barrelGeo = new THREE.CylinderGeometry(rimOuterR, rimOuterR, w * 0.86, 36, 1, true);
    barrelGeo.rotateX(Math.PI / 2);
    addMesh(barrelGeo, mats.forgedAlloy, [0, 0, 0], spinGroup);

    addMesh(
      new THREE.TorusGeometry(rimOuterR * 0.98, 0.013, 10, 36),
      mats.forgedAlloy,
      [0, 0, sideSign * (w * 0.41)],
      spinGroup
    );

    // Cross-Drilled Carbon-Ceramic Rotor Disc
    const rotorGeo = new THREE.CylinderGeometry(r * 0.59, r * 0.59, 0.024, 32);
    rotorGeo.rotateX(Math.PI / 2);
    addMesh(rotorGeo, mats.brakeRotor, [0, 0, -sideSign * 0.02], spinGroup);

    // 5 Y-Split Twin Spokes cleanly connecting hub (0.055) to rimInnerR (zero overhang!)
    const rStart = 0.055;
    const rEnd = rimInnerR * 0.97;
    const outerFaceZ = sideSign * (w * 0.37);
    const hubFaceZ = sideSign * (w * 0.29);

    for (let s = 0; s < 5; s++) {
      const baseAng = (s / 5) * Math.PI * 2;
      [-0.19, 0.19].forEach((offsetAng) => {
        const angOuter = baseAng + offsetAng;
        const angInner = baseAng + offsetAng * 0.35;
        const p0 = new THREE.Vector3(Math.cos(angInner) * rStart, Math.sin(angInner) * rStart, hubFaceZ);
        const p1 = new THREE.Vector3(Math.cos(angOuter) * rEnd, Math.sin(angOuter) * rEnd, outerFaceZ);
        const spokeCurve = new THREE.LineCurve3(p0, p1);
        const spokeGeo = new THREE.TubeGeometry(spokeCurve, 1, 0.011, 6, false);
        addMesh(spokeGeo, mats.forgedAlloy, [0, 0, 0], spinGroup);
      });
    }

    // Center-lock anodized cap
    const centerCapGeo = new THREE.CylinderGeometry(0.052, 0.058, 0.045, 18);
    centerCapGeo.rotateX(Math.PI / 2);
    addMesh(centerCapGeo, mats.darkChassis, [0, 0, sideSign * (w * 0.32)], spinGroup);
    addMesh(
      new THREE.TorusGeometry(0.036, 0.006, 8, 18),
      mats.papayaCaliper,
      [0, 0, sideSign * (w * 0.345)],
      spinGroup
    );
  });

  // =========================================================================
  // 11. SOFT RADIAL CONTACT SHADOW GROUNDING
  // =========================================================================
  const shadowGeo = new THREE.PlaneGeometry(5.6, 2.8);
  shadowGeo.rotateX(-Math.PI / 2);
  addMesh(shadowGeo, mats.contactShadow, [0, 0.01, 0], root, [0, 0, 0], false);

  return {
    root,
    wingGroup,
    splitterGroup,
    diffuserGroup,
    leftDoorPivot,
    rightDoorPivot,
    steeringWheelGroup,
    wheelSpinGroups,
    disposables,
  };
}
