import * as THREE from 'three';
import type { UntarMaterialLibrary } from './materials';

interface RectHole {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/**
 * Helper to create a BoxGeometry whose UVs are scaled to world units
 * so shared tiled textures (glass grids, paving, louvers) remain uniform across panels.
 */
function createTiledBoxGeometry(
  w: number,
  h: number,
  d: number,
  tileU: number,
  tileV: number,
): THREE.BoxGeometry {
  const geo = new THREE.BoxGeometry(w, h, d);
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(norm.getX(i));
    const ny = Math.abs(norm.getY(i));
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    if (nx > 0.5) {
      uv.setXY(i, (z + d * 0.5) / tileU, (y + h * 0.5) / tileV);
    } else if (ny > 0.5) {
      uv.setXY(i, (x + w * 0.5) / tileU, (z + d * 0.5) / tileV);
    } else {
      uv.setXY(i, (x + w * 0.5) / tileU, (y + h * 0.5) / tileV);
    }
  }
  uv.needsUpdate = true;
  return geo;
}

/**
 * Builds an extruded 3D geometric block letter for "UNTAR"
 */
function createLetterShape(char: 'U' | 'N' | 'T' | 'A' | 'R'): THREE.Shape {
  const s = new THREE.Shape();
  // Normalized height = 1.0, width ~0.72..0.8, origin bottom-left (0, 0)
  switch (char) {
    case 'U': {
      const w = 0.72;
      const t = 0.16;
      s.moveTo(0, 1);
      s.lineTo(t, 1);
      s.lineTo(t, 0.24);
      s.quadraticCurveTo(t, t, w / 2, t);
      s.quadraticCurveTo(w - t, t, w - t, 0.24);
      s.lineTo(w - t, 1);
      s.lineTo(w, 1);
      s.lineTo(w, 0.26);
      s.quadraticCurveTo(w, 0, w / 2, 0);
      s.quadraticCurveTo(0, 0, 0, 0.26);
      s.closePath();
      break;
    }
    case 'N': {
      const w = 0.76;
      const t = 0.16;
      s.moveTo(0, 0);
      s.lineTo(0, 1);
      s.lineTo(t * 1.15, 1);
      s.lineTo(w - t, 0.28);
      s.lineTo(w - t, 1);
      s.lineTo(w, 1);
      s.lineTo(w, 0);
      s.lineTo(w - t * 1.15, 0);
      s.lineTo(t, 0.72);
      s.lineTo(t, 0);
      s.closePath();
      break;
    }
    case 'T': {
      const w = 0.74;
      const t = 0.17;
      s.moveTo(0, 1);
      s.lineTo(w, 1);
      s.lineTo(w, 1 - t);
      s.lineTo(w / 2 + t / 2, 1 - t);
      s.lineTo(w / 2 + t / 2, 0);
      s.lineTo(w / 2 - t / 2, 0);
      s.lineTo(w / 2 - t / 2, 1 - t);
      s.lineTo(0, 1 - t);
      s.closePath();
      break;
    }
    case 'A': {
      const w = 0.78;
      const t = 0.16;
      s.moveTo(0, 0);
      s.lineTo(0.28, 1);
      s.lineTo(w - 0.28, 1);
      s.lineTo(w, 0);
      s.lineTo(w - t * 1.1, 0);
      s.lineTo(w - 0.23, 0.24);
      s.lineTo(0.23, 0.24);
      s.lineTo(t * 1.1, 0);
      s.closePath();

      const hole = new THREE.Path();
      hole.moveTo(0.28, 0.39);
      hole.lineTo(w / 2, 0.82);
      hole.lineTo(w - 0.28, 0.39);
      hole.closePath();
      s.holes.push(hole);
      break;
    }
    case 'R': {
      const w = 0.74;
      const t = 0.16;
      s.moveTo(0, 0);
      s.lineTo(0, 1);
      s.lineTo(0.46, 1);
      s.quadraticCurveTo(w, 1, w, 0.72);
      s.quadraticCurveTo(w, 0.48, 0.5, 0.45);
      s.lineTo(w, 0);
      s.lineTo(w - t * 1.15, 0);
      s.lineTo(0.35, 0.44);
      s.lineTo(t, 0.44);
      s.lineTo(t, 0);
      s.closePath();

      const hole = new THREE.Path();
      hole.moveTo(t, 0.59);
      hole.lineTo(0.44, 0.59);
      hole.quadraticCurveTo(w - t, 0.59, w - t, 0.72);
      hole.quadraticCurveTo(w - t, 0.85, 0.44, 0.85);
      hole.lineTo(t, 0.85);
      hole.closePath();
      s.holes.push(hole);
      break;
    }
  }
  return s;
}

function createUntar3DTextGroup(
  materials: UntarMaterialLibrary,
  scale = 3.1,
): THREE.Group {
  const group = new THREE.Group();
  const letters: Array<'U' | 'N' | 'T' | 'A' | 'R'> = ['U', 'N', 'T', 'A', 'R'];
  const spacing = 1.05;
  const totalWidth = (letters.length - 1) * spacing + 0.75;
  let cursor = -totalWidth / 2;

  for (const ch of letters) {
    const shape = createLetterShape(ch);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments: 8,
    });
    const mesh = new THREE.Mesh(geo, materials.silverLettering);
    mesh.position.set(cursor * scale, 0, 0);
    mesh.scale.set(scale, scale, scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    cursor += spacing;
  }

  return group;
}

/**
 * Builds the 3D pentagonal shield UNTAR emblem mounted on the West Fin faces.
 */
function createUntarShieldEmblem(
  materials: UntarMaterialLibrary,
  radius = 2.45,
): THREE.Group {
  const group = new THREE.Group();

  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(0, radius * 0.96);
  shieldShape.lineTo(radius * 0.86, radius * 0.52);
  shieldShape.quadraticCurveTo(radius * 0.84, -radius * 0.25, radius * 0.54, -radius * 0.75);
  shieldShape.lineTo(0, -radius * 1.02);
  shieldShape.lineTo(-radius * 0.54, -radius * 0.75);
  shieldShape.quadraticCurveTo(-radius * 0.84, -radius * 0.25, -radius * 0.86, radius * 0.52);
  shieldShape.closePath();

  const bodyGeo = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 2,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, materials.shieldRimDark);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Front crest plate mapped cleanly to the procedural shield crest texture
  const faceGeo = new THREE.ShapeGeometry(shieldShape, 16);
  const pos = faceGeo.attributes.position;
  const uv = faceGeo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const u = x / (radius * 2.15) + 0.5;
    const v = y / (radius * 2.15) + 0.5;
    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;

  const faceMesh = new THREE.Mesh(faceGeo, materials.shieldCrestFace);
  faceMesh.position.z = 0.305;
  faceMesh.receiveShadow = true;
  group.add(faceMesh);

  return group;
}

/**
 * Generates an extruded/subdivided curtain wall facade between [xStart..xEnd] and [yStart..yEnd]
 * with genuine recessed 3D sky-terrace void pockets for each hole.
 */
function buildCurtainFacadeWithVoids(
  xStart: number,
  xEnd: number,
  yStart: number,
  yEnd: number,
  zPlane: number,
  outwardSign: 1 | -1,
  holes: RectHole[],
  materials: UntarMaterialLibrary,
): THREE.Group {
  const group = new THREE.Group();
  const wallDepth = 0.45;
  const recessDepth = 2.1;

  // Collect sorted unique X and Y cutlines across the facade
  const xs = Array.from(
    new Set([xStart, xEnd, ...holes.flatMap((h) => [h.x0, h.x1])]),
  ).sort((a, b) => a - b);
  const ys = Array.from(
    new Set([yStart, yEnd, ...holes.flatMap((h) => [h.y0, h.y1])]),
  ).sort((a, b) => a - b);

  for (let ix = 0; ix < xs.length - 1; ix++) {
    const x0 = xs[ix];
    const x1 = xs[ix + 1];
    const w = x1 - x0;
    if (w < 0.05) continue;

    for (let iy = 0; iy < ys.length - 1; iy++) {
      const y0 = ys[iy];
      const y1 = ys[iy + 1];
      const h = y1 - y0;
      if (h < 0.05) continue;

      const cx = (x0 + x1) * 0.5;
      const cy = (y0 + y1) * 0.5;
      const isHole = holes.some(
        (hole) => cx > hole.x0 && cx < hole.x1 && cy > hole.y0 && cy < hole.y1,
      );

      if (!isHole) {
        const panelGeo = createTiledBoxGeometry(w, h, wallDepth, 8.2, 11.2);
        const panel = new THREE.Mesh(panelGeo, materials.curtainGlass);
        panel.position.set(cx, cy, zPlane - outwardSign * (wallDepth * 0.5));
        panel.castShadow = true;
        panel.receiveShadow = true;
        group.add(panel);
      } else {
        // Recessed sky-terrace pocket with dark back glass, side reveals, floor, and ceiling
        const backZ = zPlane - outwardSign * recessDepth;
        const backGlassGeo = createTiledBoxGeometry(w, h, 0.25, 8.2, 11.2);
        const backGlass = new THREE.Mesh(backGlassGeo, materials.curtainGlassRecessed);
        backGlass.position.set(cx, cy, backZ);
        backGlass.receiveShadow = true;
        group.add(backGlass);

        // Floor soffit & ceiling soffit
        const slabGeo = new THREE.BoxGeometry(w + 0.1, 0.32, recessDepth);
        const floorSlab = new THREE.Mesh(slabGeo, materials.concreteMid);
        floorSlab.position.set(cx, y0 + 0.16, zPlane - outwardSign * (recessDepth * 0.5));
        floorSlab.castShadow = true;
        floorSlab.receiveShadow = true;
        group.add(floorSlab);

        const ceilSlab = new THREE.Mesh(slabGeo, materials.concreteLight);
        ceilSlab.position.set(cx, y1 - 0.16, zPlane - outwardSign * (recessDepth * 0.5));
        ceilSlab.castShadow = true;
        ceilSlab.receiveShadow = true;
        group.add(ceilSlab);

        // Side vertical reveals
        const sideGeo = new THREE.BoxGeometry(0.32, h, recessDepth);
        const leftReveal = new THREE.Mesh(sideGeo, materials.concreteMid);
        leftReveal.position.set(x0 + 0.16, cy, zPlane - outwardSign * (recessDepth * 0.5));
        leftReveal.castShadow = true;
        leftReveal.receiveShadow = true;
        group.add(leftReveal);

        const rightReveal = new THREE.Mesh(sideGeo, materials.concreteMid);
        rightReveal.position.set(x1 - 0.16, cy, zPlane - outwardSign * (recessDepth * 0.5));
        rightReveal.castShadow = true;
        rightReveal.receiveShadow = true;
        group.add(rightReveal);

        // Subtle glass guardrail on terrace floor
        const railGeo = new THREE.BoxGeometry(w - 0.4, 0.9, 0.08);
        const rail = new THREE.Mesh(railGeo, materials.spandrelMullion);
        rail.position.set(cx, y0 + 0.72, zPlane - outwardSign * 0.2);
        group.add(rail);
      }
    }
  }

  return group;
}

/**
 * Builds a quad wall panel between 2D plan endpoints (x0,z0) -> (x1,z1) with
 * varying top heights (yTop0, yTop1) and uniform world-space UVs for vertical metal ribs.
 */
function createSlopedFinWallMesh(
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  yBot: number,
  yTop0: number,
  yTop1: number,
  thickness: number,
  material: THREE.Material,
): THREE.Mesh {
  const dx = x1 - x0;
  const dz = z1 - z0;
  const len = Math.hypot(dx, dz);
  // Outward normal in XZ for edge P0->P1: (dx, 0, dz) x (0, 1, 0) = (-dz, 0, dx)
  const outX = -dz / len;
  const outZ = dx / len;
  // Back face steps inward opposite to outward normal
  const ix = -outX * thickness;
  const iz = -outZ * thickness;

  // 8 corner points: 0..3 exterior front face, 4..7 interior back face
  const p = [
    [x0, yBot, z0], // 0: FBL
    [x1, yBot, z1], // 1: FBR
    [x1, yTop1, z1], // 2: FTR
    [x0, yTop0, z0], // 3: FTL
    [x0 + ix, yBot, z0 + iz], // 4: BBL
    [x1 + ix, yBot, z1 + iz], // 5: BBR
    [x1 + ix, yTop1, z1 + iz], // 6: BTR
    [x0 + ix, yTop0, z0 + iz], // 7: BTL
  ];

  const positions: number[] = [];
  const uvs: number[] = [];

  const addTri = (a: number[], b: number[], c: number[], uva: [number, number], uvb: [number, number], uvc: [number, number]) => {
    positions.push(...a, ...b, ...c);
    uvs.push(...uva, ...uvb, ...uvc);
  };

  const addQuad = (
    i0: number,
    i1: number,
    i2: number,
    i3: number,
    uv0: [number, number],
    uv1: [number, number],
    uv2: [number, number],
    uv3: [number, number],
  ) => {
    addTri(p[i0], p[i1], p[i2], uv0, uv1, uv2);
    addTri(p[i0], p[i2], p[i3], uv0, uv2, uv3);
  };

  const uScale = len / 8.5;
  const v0Scale = (yTop0 - yBot) / 14;
  const v1Scale = (yTop1 - yBot) / 14;

  // Exterior Front face (CCW outward)
  addQuad(0, 1, 2, 3, [0, 0], [uScale, 0], [uScale, v1Scale], [0, v0Scale]);
  // Interior Back face
  addQuad(5, 4, 7, 6, [0, 0], [uScale, 0], [uScale, v0Scale], [0, v1Scale]);
  // Sloped Top Cap
  addQuad(3, 2, 6, 7, [0, 0], [uScale, 0], [uScale, 0.2], [0, 0.2]);
  // Left Edge (x0,z0)
  addQuad(4, 0, 3, 7, [0, 0], [0.2, 0], [0.2, v0Scale], [0, v0Scale]);
  // Right Edge (x1,z1)
  addQuad(1, 5, 6, 2, [0, 0], [0.2, 0], [0.2, v1Scale], [0, v1Scale]);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * 1. Menara Utama (Main Tower) + Rooftop Green Membrane & HVAC Utilities
 */
function buildMainTower(materials: UntarMaterialLibrary): THREE.Group {
  const tower = new THREE.Group();
  tower.name = 'MainTower';

  const xMin = -6.5;
  const xMax = 22.5;
  const zMin = -9.5;
  const zMax = 9.5;
  const width = xMax - xMin; // 29m
  const depth = zMax - zMin; // 19m
  const roofY = 52.0;
  const podiumY = 12.0;

  // Structural dark inner core (prevents any light leak behind glass or voids)
  const coreGeo = new THREE.BoxGeometry(width - 2.6, roofY - 1.0, depth - 2.6);
  const core = new THREE.Mesh(coreGeo, materials.voidInterior);
  core.position.set((xMin + xMax) * 0.5, (roofY - 1.0) * 0.5, 0);
  core.castShadow = true;
  core.receiveShadow = true;
  tower.add(core);

  // North Curtain Wall (z = zMin = -9.5, outwardSign = -1)
  // Includes 3 distinct recessed sky-terrace voids matching Image 3 (angle2_69e75c98.png)
  const northHoles: RectHole[] = [
    { x0: -0.5, x1: 2.5, y0: 33.5, y1: 41.5 }, // Upper-west void
    { x0: 5.5, x1: 8.5, y0: 18.0, y1: 25.0 },  // Lower-center void
    { x0: 14.0, x1: 17.2, y0: 27.5, y1: 35.0 }, // Mid-east void
  ];
  const northWall = buildCurtainFacadeWithVoids(
    xMin,
    xMax,
    podiumY,
    roofY,
    zMin,
    -1,
    northHoles,
    materials,
  );
  tower.add(northWall);

  // Lower North facade from ground to podiumY (partially visible on east end)
  const northLowerGeo = createTiledBoxGeometry(width, podiumY, 0.5, 8.2, 11.2);
  const northLower = new THREE.Mesh(northLowerGeo, materials.curtainGlass);
  northLower.position.set((xMin + xMax) * 0.5, podiumY * 0.5, zMin + 0.25);
  northLower.castShadow = true;
  northLower.receiveShadow = true;
  tower.add(northLower);

  // South Curtain Wall (z = zMax = +9.5, outwardSign = +1)
  // Includes the East vertical sky-terrace column + louvers matching Image 2 (angle_3_c7c7f7ce.png)
  const southHoles: RectHole[] = [
    { x0: 17.0, x1: 20.6, y0: 34.0, y1: 41.5 }, // Prominent 2-story terrace void
  ];
  const southWall = buildCurtainFacadeWithVoids(
    xMin,
    xMax,
    podiumY,
    roofY,
    zMax,
    1,
    southHoles,
    materials,
  );
  tower.add(southWall);

  // South lower podium extension
  const southLowerGeo = createTiledBoxGeometry(width, podiumY, 0.5, 8.2, 11.2);
  const southLower = new THREE.Mesh(southLowerGeo, materials.curtainGlass);
  southLower.position.set((xMin + xMax) * 0.5, podiumY * 0.5, zMax - 0.25);
  southLower.castShadow = true;
  southLower.receiveShadow = true;
  tower.add(southLower);

  // Projecting horizontal canopy & louver bands in the East South-facade bay (Image 2)
  const canopyGeo = new THREE.BoxGeometry(4.8, 0.45, 1.8);
  const upperCanopy = new THREE.Mesh(canopyGeo, materials.concreteLight);
  upperCanopy.position.set(18.8, 45.2, zMax + 0.65);
  upperCanopy.castShadow = true;
  tower.add(upperCanopy);

  const midCanopy = new THREE.Mesh(canopyGeo, materials.concreteLight);
  midCanopy.position.set(18.8, 41.5, zMax + 0.55);
  midCanopy.castShadow = true;
  tower.add(midCanopy);

  const louverLevels = [15.5, 20.2, 25.0, 29.8, 42.8];
  for (const ly of louverLevels) {
    const bandGeo = new THREE.BoxGeometry(3.5, 1.5, 0.25);
    const band = new THREE.Mesh(bandGeo, materials.balconyLouver);
    band.position.set(18.8, ly, zMax - 0.05);
    tower.add(band);
  }

  // East End Wall (x = xMax = +22.5)
  const eastCladGeo = new THREE.BoxGeometry(0.8, roofY, depth);
  const eastClad = new THREE.Mesh(eastCladGeo, materials.concreteMid);
  eastClad.position.set(xMax - 0.4, roofY * 0.5, 0);
  eastClad.castShadow = true;
  eastClad.receiveShadow = true;
  tower.add(eastClad);

  // Subtle vertical architectural pilasters on East wall
  for (let rz = -7; rz <= 7; rz += 3.5) {
    const pilasterGeo = new THREE.BoxGeometry(0.45, roofY, 0.7);
    const pilaster = new THREE.Mesh(pilasterGeo, materials.concreteLight);
    pilaster.position.set(xMax + 0.1, roofY * 0.5, rz);
    pilaster.castShadow = true;
    tower.add(pilaster);
  }

  // 3D "UNTAR" Silver Block Letters on North and South Facades
  const southSign = createUntar3DTextGroup(materials, 3.15);
  southSign.position.set(7.5, 45.8, zMax + 0.15);
  tower.add(southSign);

  const northSign = createUntar3DTextGroup(materials, 3.15);
  northSign.rotation.y = Math.PI;
  northSign.position.set(6.5, 45.8, zMin - 0.15);
  tower.add(northSign);

  // Horizontal metal cornice bands below UNTAR lettering (matches Image 2 & 3)
  const corniceGeo = new THREE.BoxGeometry(width + 0.2, 0.35, depth + 0.45);
  const cornice = new THREE.Mesh(corniceGeo, materials.concreteLight);
  cornice.position.set((xMin + xMax) * 0.5, 44.3, 0);
  tower.add(cornice);

  // Roof Perimeter Parapet & Slabs (y = 52.0 .. 53.2)
  const roofDeckGeo = new THREE.BoxGeometry(width, 0.6, depth);
  const roofDeck = new THREE.Mesh(roofDeckGeo, materials.concreteLight);
  roofDeck.position.set((xMin + xMax) * 0.5, roofY - 0.3, 0);
  roofDeck.receiveShadow = true;
  tower.add(roofDeck);

  // Light-green central roof field (seen in Image 5 atap_untar_5161836b.PNG)
  const greenDeckGeo = new THREE.BoxGeometry(width - 3.6, 0.14, depth - 6.8);
  const greenDeck = new THREE.Mesh(greenDeckGeo, materials.roofGreenDeck);
  greenDeck.position.set((xMin + xMax) * 0.5 + 0.4, roofY + 0.08, -1.6);
  greenDeck.receiveShadow = true;
  tower.add(greenDeck);

  // Parapet walls (North, East, South)
  const parapetH = 1.2;
  const parapetThick = 0.55;
  const northParapet = new THREE.Mesh(
    new THREE.BoxGeometry(width, parapetH, parapetThick),
    materials.concreteLight,
  );
  northParapet.position.set((xMin + xMax) * 0.5, roofY + parapetH * 0.5, zMin + parapetThick * 0.5);
  northParapet.castShadow = true;
  tower.add(northParapet);

  const southParapet = new THREE.Mesh(
    new THREE.BoxGeometry(width, parapetH, parapetThick),
    materials.concreteLight,
  );
  southParapet.position.set((xMin + xMax) * 0.5, roofY + parapetH * 0.5, zMax - parapetThick * 0.5);
  southParapet.castShadow = true;
  tower.add(southParapet);

  const eastParapet = new THREE.Mesh(
    new THREE.BoxGeometry(parapetThick, parapetH, depth),
    materials.concreteLight,
  );
  eastParapet.position.set(xMax - parapetThick * 0.5, roofY + parapetH * 0.5, 0);
  eastParapet.castShadow = true;
  tower.add(eastParapet);

  // Rooftop HVAC / Chiller Units along the south utility strip (matching Image 5)
  const chillerPositions: Array<[number, number, number, number]> = [
    [-1.5, 5.4, 5.5, 2.5],
    [6.5, 5.4, 6.2, 2.8],
    [14.5, 5.4, 5.5, 2.5],
    [3.0, 2.6, 3.6, 1.8],
    [11.0, 2.6, 4.0, 1.8],
  ];
  for (const [cx, cz, cw, cd] of chillerPositions) {
    const unitBody = new THREE.Mesh(
      new THREE.BoxGeometry(cw, 1.6, cd),
      materials.hvacUnit,
    );
    unitBody.position.set(cx, roofY + 0.85, cz);
    unitBody.castShadow = true;
    unitBody.receiveShadow = true;
    tower.add(unitBody);

    // Top fan grilles
    const fans = Math.max(2, Math.floor(cw / 1.8));
    for (let f = 0; f < fans; f++) {
      const fx = cx - cw * 0.3 + (f * cw * 0.6) / Math.max(1, fans - 1);
      const grille = new THREE.Mesh(
        new THREE.CylinderGeometry(0.58, 0.58, 0.14, 16),
        materials.hvacGrille,
      );
      grille.position.set(fx, roofY + 1.68, cz);
      tower.add(grille);
    }
  }

  // Rooftop piping runs & antenna masts (matching Image 2 & Image 5)
  const pipeGeo = new THREE.CylinderGeometry(0.14, 0.14, 21, 10);
  pipeGeo.rotateZ(Math.PI * 0.5);
  const pipe = new THREE.Mesh(pipeGeo, materials.silverLettering);
  pipe.position.set(7.0, roofY + 0.35, 3.8);
  tower.add(pipe);

  const mastHeights: Array<[number, number, number]> = [
    [18.5, 7.2, 8.5],
    [3.5, 7.8, 5.0],
  ];
  for (const [mx, mz, mh] of mastHeights) {
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.11, mh, 8),
      materials.silverLettering,
    );
    mast.position.set(mx, roofY + mh * 0.5, mz);
    tower.add(mast);
  }

  return tower;
}

/**
 * 2. Iconic West Fin (Sirip Sisi Barat) + NW Tiered Horizontal Balcony Bay + 3D Shield Emblems
 */
function buildWestFinAndBalconies(materials: UntarMaterialLibrary): THREE.Group {
  const finGroup = new THREE.Group();
  finGroup.name = 'WestFinAndBalconies';

  // Key plan & elevation anchor coordinates (matches all 5 reference photos)
  const pPeakX = -18.0;
  const pPeakZ = 9.5;
  const pPeakY = 63.2;

  const pSouthX = -6.5;
  const pSouthZ = 9.5;
  const pSouthY = 53.2;

  const pNwX = -11.2;
  const pNwZ = -2.2;
  const pNwY = 52.8;

  // 1) South Fin Face (from P_peak to P_south, sloping down East)
  const southFinWall = createSlopedFinWallMesh(
    pPeakX,
    pPeakZ,
    pSouthX,
    pSouthZ,
    0,
    pPeakY,
    pSouthY,
    0.75,
    materials.finMetalCladding,
  );
  finGroup.add(southFinWall);

  // 2) WNW Angled Fin Face (from P_nw to P_peak, rising sharply South-Southwest)
  const wnwFinWall = createSlopedFinWallMesh(
    pNwX,
    pNwZ,
    pPeakX,
    pPeakZ,
    0,
    pNwY,
    pPeakY,
    0.75,
    materials.finMetalCladding,
  );
  finGroup.add(wnwFinWall);

  // Crisp vertical spine trim right at the sharp SW prow corner
  const spineGeo = new THREE.CylinderGeometry(0.28, 0.28, pPeakY, 8);
  const spine = new THREE.Mesh(spineGeo, materials.silverLettering);
  spine.position.set(pPeakX, pPeakY * 0.5, pPeakZ);
  spine.castShadow = true;
  finGroup.add(spine);

  // Back wall closing the triangular prow cleanly into the Main Tower core (-6.5, -2.2 .. +9.5)
  const innerCloseWall = createSlopedFinWallMesh(
    -6.5,
    -2.2,
    pNwX,
    pNwZ,
    0,
    52.0,
    pNwY,
    0.6,
    materials.concreteMid,
  );
  finGroup.add(innerCloseWall);

  // Triangular roof truss beams inside the West Fin recess (visible in Image 5 aerial view!)
  const floorPos = new Float32Array([
    pPeakX + 0.5, 50.8, pPeakZ - 0.5,
    pSouthX, 50.8, pSouthZ - 0.5,
    pSouthX, 50.8, pNwZ + 0.3,
    pPeakX + 0.5, 50.8, pPeakZ - 0.5,
    pSouthX, 50.8, pNwZ + 0.3,
    pNwX + 0.4, 50.8, pNwZ + 0.3,
  ]);
  const triFloorGeo = new THREE.BufferGeometry();
  triFloorGeo.setAttribute('position', new THREE.BufferAttribute(floorPos, 3));
  triFloorGeo.computeVertexNormals();
  const triFloorMesh = new THREE.Mesh(triFloorGeo, materials.concreteDark);
  triFloorMesh.receiveShadow = true;
  finGroup.add(triFloorMesh);

  // Cross-bracing steel roof struts inside the triangular fin cavity (matching Image 5)
  for (let t = 0.22; t <= 0.78; t += 0.26) {
    const startPt = new THREE.Vector3(
      THREE.MathUtils.lerp(pPeakX + 0.8, pSouthX, t),
      52.2,
      pSouthZ - 0.4,
    );
    const endPt = new THREE.Vector3(
      THREE.MathUtils.lerp(pPeakX + 0.8, pNwX + 0.4, t),
      52.2,
      THREE.MathUtils.lerp(pPeakZ - 0.4, pNwZ + 0.4, t),
    );
    const strutLen = startPt.distanceTo(endPt);
    const strut = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.32, strutLen),
      materials.silverLettering,
    );
    strut.position.copy(startPt).lerp(endPt, 0.5);
    strut.lookAt(endPt);
    strut.castShadow = true;
    finGroup.add(strut);
  }

  // 3) 3D Beveled Shield UNTAR Emblems on BOTH Fin Faces (matching Images 1, 2, 3, 4)
  // South Fin Emblem (outward normal = +Z)
  const southEmblem = createUntarShieldEmblem(materials, 2.45);
  southEmblem.position.set(-12.2, 52.6, pPeakZ + 0.03);
  finGroup.add(southEmblem);

  // WNW Angled Fin Emblem (outward normal = (-dz/len, 0, dx/len))
  const wnwEmblem = createUntarShieldEmblem(materials, 2.45);
  const wnwDx = pPeakX - pNwX;
  const wnwDz = pPeakZ - pNwZ;
  const wnwLen = Math.hypot(wnwDx, wnwDz);
  const wnwOutX = -wnwDz / wnwLen;
  const wnwOutZ = wnwDx / wnwLen;
  const wnwMidX = (pPeakX + pNwX) * 0.5;
  const wnwMidZ = (pPeakZ + pNwZ) * 0.5;
  wnwEmblem.position.set(wnwMidX + wnwOutX * 0.03, 52.8, wnwMidZ + wnwOutZ * 0.03);
  wnwEmblem.rotation.y = Math.atan2(wnwOutX, wnwOutZ);
  finGroup.add(wnwEmblem);

  // 4) Northwest Tiered Horizontal Balcony / Louver Stack (Images 1, 3, 4)
  // Sits along the NW flank between x = -11.2 .. -6.5 and z = -9.5 .. -2.2
  const bayX0 = -11.2;
  const bayX1 = -6.5;
  const bayZ0 = -9.5;
  const bayZ1 = -2.2;
  const bayW = bayX1 - bayX0;
  const bayD = bayZ1 - bayZ0;
  const bayTopY = 50.2;

  // Recessed blue glass core inside the balcony bay
  const bayGlassGeo = createTiledBoxGeometry(bayW - 0.8, bayTopY, bayD - 0.8, 7.5, 10.5);
  const bayGlass = new THREE.Mesh(bayGlassGeo, materials.curtainGlassRecessed);
  bayGlass.position.set((bayX0 + bayX1) * 0.5 + 0.35, bayTopY * 0.5, (bayZ0 + bayZ1) * 0.5 + 0.35);
  bayGlass.castShadow = true;
  bayGlass.receiveShadow = true;
  finGroup.add(bayGlass);

  // Vertical outer corner frame column
  const bayCornerCol = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, bayTopY, 0.45),
    materials.concreteLight,
  );
  bayCornerCol.position.set(bayX0 + 0.22, bayTopY * 0.5, bayZ0 + 0.22);
  bayCornerCol.castShadow = true;
  finGroup.add(bayCornerCol);

  // Horizontal balcony slabs / sunshade louvers stacked bottom to top (floors 1..15)
  for (let y = 12.0; y <= bayTopY - 1.5; y += 2.95) {
    const ledge = new THREE.Mesh(
      new THREE.BoxGeometry(bayW + 0.3, 0.32, bayD + 0.3),
      materials.balconyLouver,
    );
    ledge.position.set((bayX0 + bayX1) * 0.5 - 0.1, y, (bayZ0 + bayZ1) * 0.5 - 0.1);
    ledge.castShadow = true;
    ledge.receiveShadow = true;
    finGroup.add(ledge);

    // Thin safety rail bar in front of each balcony ledge
    const railWest = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.6, bayD),
      materials.spandrelMullion,
    );
    railWest.position.set(bayX0 - 0.15, y + 0.42, (bayZ0 + bayZ1) * 0.5);
    finGroup.add(railWest);

    const railNorth = new THREE.Mesh(
      new THREE.BoxGeometry(bayW, 0.6, 0.08),
      materials.spandrelMullion,
    );
    railNorth.position.set((bayX0 + bayX1) * 0.5, y + 0.42, bayZ0 - 0.15);
    finGroup.add(railNorth);
  }

  // Projecting top roof canopy slab capping the NW balcony stack (prominent in Image 1 & 4)
  const bayCap = new THREE.Mesh(
    new THREE.BoxGeometry(bayW + 1.4, 0.75, bayD + 1.4),
    materials.concreteLight,
  );
  bayCap.position.set((bayX0 + bayX1) * 0.5 - 0.45, bayTopY + 0.2, (bayZ0 + bayZ1) * 0.5 - 0.45);
  bayCap.castShadow = true;
  bayCap.receiveShadow = true;
  finGroup.add(bayCap);

  return finGroup;
}

/**
 * 3. Wide Lower Podium (Sisi Barat / Depan Jalan)
 *    - Wide central staircase
 *    - 4 tall slender vertical columns
 *    - Recessed blue glass curtain wall
 *    - "UNIVERSITAS TARUMANAGARA" podium signage
 *    - Indonesian Flagpole & Pedestrian Skybridge
 */
function buildWestPodium(materials: UntarMaterialLibrary): THREE.Group {
  const podium = new THREE.Group();
  podium.name = 'WestPodium';

  const podXMin = -27.5;
  const podXMax = -6.5;
  const podZMin = -18.5;
  const podZMax = 11.5;
  const podW = podXMax - podXMin; // 21m
  const podD = podZMax - podZMin; // 30m
  const podH = 12.2;
  const terraceY = 2.6;

  // Main podium glass volume (recessed behind the 4 tall outer columns)
  const glassBoxGeo = createTiledBoxGeometry(podW - 2.6, podH - 0.8, podD - 0.8, 7.0, 9.0);
  const glassBox = new THREE.Mesh(glassBoxGeo, materials.curtainGlass);
  glassBox.position.set(
    (podXMin + podXMax) * 0.5 + 1.3,
    (podH - 0.8) * 0.5,
    (podZMin + podZMax) * 0.5,
  );
  glassBox.castShadow = true;
  glassBox.receiveShadow = true;
  podium.add(glassBox);

  // Dark lobby glass entrance portal at terrace level behind stairs
  const lobbyPortal = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 4.2, 9.6),
    materials.voidInterior,
  );
  lobbyPortal.position.set(podXMin + 2.4, terraceY + 2.1, -1.5);
  podium.add(lobbyPortal);

  // Deep overhanging podium roof slab & fascia (supported by the 4 tall columns!)
  const roofSlab = new THREE.Mesh(
    new THREE.BoxGeometry(podW + 1.8, 1.15, podD + 0.8),
    materials.concreteLight,
  );
  roofSlab.position.set((podXMin + podXMax) * 0.5 - 0.9, podH - 0.55, (podZMin + podZMax) * 0.5);
  roofSlab.castShadow = true;
  roofSlab.receiveShadow = true;
  podium.add(roofSlab);

  // Subtle dark soffit under the podium roof overhang
  const soffit = new THREE.Mesh(
    new THREE.BoxGeometry(podW + 1.4, 0.16, podD + 0.4),
    materials.concreteMid,
  );
  soffit.position.set((podXMin + podXMax) * 0.5 - 0.9, podH - 1.16, (podZMin + podZMax) * 0.5);
  podium.add(soffit);

  // Left (North) and Right (South) podium end-walls
  const northEndWall = new THREE.Mesh(
    new THREE.BoxGeometry(podW + 1.5, podH, 0.85),
    materials.concreteLight,
  );
  northEndWall.position.set((podXMin + podXMax) * 0.5 - 0.75, podH * 0.5, podZMin + 0.2);
  northEndWall.castShadow = true;
  northEndWall.receiveShadow = true;
  podium.add(northEndWall);

  const southEndWall = new THREE.Mesh(
    new THREE.BoxGeometry(podW + 1.5, podH, 1.1),
    materials.concreteLight,
  );
  southEndWall.position.set((podXMin + podXMax) * 0.5 - 0.75, podH * 0.5, podZMax - 0.25);
  southEndWall.castShadow = true;
  southEndWall.receiveShadow = true;
  podium.add(southEndWall);

  // Podium raised plinth / terrace deck
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(podW + 1.8, terraceY, podD + 0.4),
    materials.podiumStairs,
  );
  plinth.position.set((podXMin + podXMax) * 0.5 - 0.9, terraceY * 0.5, (podZMin + podZMax) * 0.5);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  podium.add(plinth);

  // 4 Tall Vertical Columns along the West Podium Front (matching Image 4: angle_1_3316f315.PNG)
  const colPositionsZ = [-14.2, -7.2, 2.2, 9.0];
  const colX = podXMin - 1.05;
  for (const cz of colPositionsZ) {
    const col = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, podH - 0.8, 0.85),
      materials.podiumColumn,
    );
    col.position.set(colX, (podH - 0.8) * 0.5, cz);
    col.castShadow = true;
    col.receiveShadow = true;
    podium.add(col);

    // Subtle column plinth base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.55, 1.15),
      materials.concreteMid,
    );
    base.position.set(colX, 0.275, cz);
    podium.add(base);
  }

  // Wide Central Access Staircase on the West front (z = -6.2 .. +1.2)
  const stairWidth = 7.4;
  const stairCenterZ = -2.5;
  const stepCount = 10;
  const stairRun = 4.8;
  const stepDepth = stairRun / stepCount;
  const stepHeight = terraceY / stepCount;

  for (let s = 0; s < stepCount; s++) {
    const stepH = (s + 1) * stepHeight;
    const stepX = podXMin - 1.8 - (stepCount - 1 - s) * stepDepth - stepDepth * 0.5;
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(stepDepth + 0.08, stepH, stairWidth),
      materials.podiumStairs,
    );
    step.position.set(stepX, stepH * 0.5, stairCenterZ);
    step.castShadow = true;
    step.receiveShadow = true;
    podium.add(step);
  }

  // Flanking stair cheek walls
  for (const side of [-1, 1]) {
    const cheek = new THREE.Mesh(
      new THREE.BoxGeometry(stairRun + 0.6, 1.2, 0.45),
      materials.concreteLight,
    );
    cheek.position.set(
      podXMin - 1.8 - stairRun * 0.5,
      0.6,
      stairCenterZ + side * (stairWidth * 0.5 + 0.25),
    );
    cheek.castShadow = true;
    podium.add(cheek);
  }

  // "UNIVERSITAS TARUMANAGARA" Podium Signage mounted on the left-center glass facade (Image 4)
  const signW = 10.8;
  const signH = 1.45;
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(signW, signH),
    materials.podiumSignage,
  );
  signMesh.rotation.y = -Math.PI * 0.5; // Facing West (-X)
  signMesh.position.set(podXMin + 2.52, 5.15, -10.8);
  podium.add(signMesh);

  // Indonesian Red-and-White Flagpole on the front northwest plaza (seen in Image 4)
  const poleX = podXMin - 3.6;
  const poleZ = -13.8;
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.09, 10.5, 10),
    materials.silverLettering,
  );
  pole.position.set(poleX, 5.25, poleZ);
  pole.castShadow = true;
  podium.add(pole);

  const flagRed = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.55),
    materials.flagRed,
  );
  flagRed.position.set(poleX + 0.9, 9.95, poleZ + 0.25);
  flagRed.rotation.y = -0.3;
  podium.add(flagRed);

  const flagWhite = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.55),
    materials.flagWhite,
  );
  flagWhite.position.set(poleX + 0.9, 9.4, poleZ + 0.25);
  flagWhite.rotation.y = -0.3;
  podium.add(flagWhite);

  // Pedestrian Covered Walkway / Skybridge extending West from podium plaza (seen in Image 5)
  const bridgeRoof = new THREE.Mesh(
    new THREE.BoxGeometry(9.5, 0.28, 3.4),
    materials.concreteLight,
  );
  bridgeRoof.position.set(podXMin - 7.8, 4.2, -2.5);
  bridgeRoof.castShadow = true;
  podium.add(bridgeRoof);

  for (const bx of [podXMin - 4.2, podXMin - 11.4]) {
    for (const bz of [-3.9, -1.1]) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 4.2, 8),
        materials.spandrelMullion,
      );
      post.position.set(bx, 2.1, bz);
      post.castShadow = true;
      podium.add(post);
    }
  }

  return podium;
}

/**
 * 4. Campus Environment: West Road (Jl. Letjen S. Parman), Plaza, North Green Lawn & Procedural Trees
 */
function buildSiteEnvironment(
  materials: UntarMaterialLibrary,
  compactSite = false,
): THREE.Group {
  const site = new THREE.Group();
  site.name = 'SiteEnvironment';

  if (!compactSite) {
    // Extended dark terrain horizon ground plane (y = 0)
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(240, 64),
      materials.groundBase,
    );
    ground.rotation.x = -Math.PI * 0.5;
    ground.position.y = -0.04;
    ground.receiveShadow = true;
    site.add(ground);
  }

  // Soft radial contact shadow directly beneath the building footprint
  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(compactSite ? 78 : 92, compactSite ? 64 : 76),
    materials.contactShadow,
  );
  contactShadow.rotation.x = -Math.PI * 0.5;
  contactShadow.position.set(-2, 0.005, -2);
  site.add(contactShadow);

  // Campus Plaza Paved Slab around Podium & Tower
  const plaza = new THREE.Mesh(
    new THREE.BoxGeometry(68, 0.14, 58),
    materials.plazaPaving,
  );
  plaza.position.set(-2.5, 0.04, -3.5);
  plaza.receiveShadow = true;
  site.add(plaza);

  // Manicured Green Lawn Court on the North side (matching Image 5 atap_untar_5161836b.PNG)
  const northLawn = new THREE.Mesh(
    new THREE.BoxGeometry(30, 0.18, 13.5),
    materials.lawnGrass,
  );
  northLawn.position.set(6.5, 0.06, -21.5);
  northLawn.receiveShadow = true;
  site.add(northLawn);

  // Front West landscaped grass strip along the campus fence/sidewalk
  const westLawn = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 0.18, 42),
    materials.lawnGrass,
  );
  westLawn.position.set(-34.8, 0.06, -4.5);
  westLawn.receiveShadow = true;
  site.add(westLawn);

  const roadLen = compactSite ? 58 : 190;
  const roadZ = compactSite ? -3.5 : -4;

  // Jl. Letjen S. Parman Arterial Roadway on the West side (x = -52 .. -38)
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(15.5, 0.08, roadLen),
    materials.roadAsphalt,
  );
  road.position.set(-46.5, 0.01, roadZ);
  road.receiveShadow = true;
  site.add(road);

  // Sidewalk curbs bordering the roadway
  const eastCurb = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.22, roadLen),
    materials.roadCurb,
  );
  eastCurb.position.set(-38.0, 0.11, roadZ);
  eastCurb.receiveShadow = true;
  site.add(eastCurb);

  const westCurb = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.22, roadLen),
    materials.roadCurb,
  );
  westCurb.position.set(-55.0, 0.11, roadZ);
  westCurb.receiveShadow = true;
  site.add(westCurb);

  // Roadway Streetlamps along the East curb of Jl. S. Parman
  const lampStart = compactSite ? -26 : -56;
  const lampEnd = compactSite ? 22 : 48;
  for (let lz = lampStart; lz <= lampEnd; lz += 24) {
    const lampPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.15, 7.5, 8),
      materials.spandrelMullion,
    );
    lampPost.position.set(-38.1, 3.75, lz);
    lampPost.castShadow = true;
    site.add(lampPost);

    const lampArm = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.14, 0.14),
      materials.spandrelMullion,
    );
    lampArm.position.set(-38.9, 7.4, lz);
    site.add(lampArm);

    const lampHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.14, 0.32),
      materials.streetLampGlow,
    );
    lampHead.position.set(-39.6, 7.32, lz);
    site.add(lampHead);
  }

  // Instanced Multi-Part Procedural Trees (campus & street trees, bottom-center grounded)
  const treeCoords: Array<[number, number]> = [
    // North lawn border (matches Image 5)
    [-5.0, -28.0], [0.5, -28.5], [6.0, -28.5], [11.5, -28.2], [17.0, -28.0],
    [-4.5, -14.8], [3.5, -14.5], [12.0, -14.5], [20.5, -14.5],
    // West plaza & Jl. S. Parman sidewalk trees (kept away from central staircase sightline)
    [-34.8, -22.5], [-34.8, -17.0], [-34.8, -11.5],
    [-34.8, 7.5], [-34.8, 13.0], [-34.8, 18.5],
    // South perimeter & East campus garden
    [-19.0, 16.5], [-9.5, 16.5], [1.5, 16.5], [12.5, 16.5], [22.0, 16.5],
    [27.5, -11.0], [27.5, -3.5], [27.5, 4.0], [27.5, 11.5],
    ...(compactSite
      ? []
      : ([
          [-56.8, -28.0],
          [-56.8, -8.0],
          [-56.8, 12.0],
          [-56.8, 32.0],
        ] as Array<[number, number]>)),
  ];

  const count = treeCoords.length;
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.34, 2.8, 8);
  trunkGeo.translate(0, 1.4, 0); // bottom-center pivot
  const canopyGeo = new THREE.IcosahedronGeometry(2.15, 1);
  canopyGeo.translate(0, 3.85, 0);

  const trunks = new THREE.InstancedMesh(trunkGeo, materials.treeTrunk, count);
  const canopies = new THREE.InstancedMesh(canopyGeo, materials.treeCanopy, count);
  trunks.castShadow = true;
  trunks.receiveShadow = true;
  canopies.castShadow = true;
  canopies.receiveShadow = true;

  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();

  treeCoords.forEach(([tx, tz], i) => {
    const scaleFactor = 0.85 + ((i * 37) % 100) / 300; // 0.85 .. 1.18
    dummy.position.set(tx, 0.1, tz);
    dummy.rotation.y = (i * 1.37) % (Math.PI * 2);
    dummy.scale.set(scaleFactor, scaleFactor * (0.95 + (i % 3) * 0.08), scaleFactor);
    dummy.updateMatrix();

    trunks.setMatrixAt(i, dummy.matrix);
    canopies.setMatrixAt(i, dummy.matrix);

    // Subtle organic green tint variation
    tint.setHSL(0.39 + (i % 5) * 0.012, 0.42, 0.27 + (i % 4) * 0.03);
    canopies.setColorAt(i, tint);
  });

  trunks.instanceMatrix.needsUpdate = true;
  canopies.instanceMatrix.needsUpdate = true;
  if (canopies.instanceColor) canopies.instanceColor.needsUpdate = true;
  trunks.computeBoundingSphere();
  canopies.computeBoundingSphere();

  site.add(trunks);
  site.add(canopies);

  return site;
}

/**
 * Main exported scene builder assembling Gedung Utama (Gedung 1) UNTAR and its campus site.
 */
export function buildUntarCampusModel(
  materials: UntarMaterialLibrary,
  options: { compactSite?: boolean } = {},
): THREE.Group {
  const root = new THREE.Group();
  root.name = 'GedungUtamaUNTAR';

  root.add(buildMainTower(materials));
  root.add(buildWestFinAndBalconies(materials));
  root.add(buildWestPodium(materials));
  root.add(buildSiteEnvironment(materials, options.compactSite));

  return root;
}
