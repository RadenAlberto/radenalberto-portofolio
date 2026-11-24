import * as THREE from 'three';
import type { ProceduralTextureSet } from './textures';

export interface UntarMaterialLibrary {
  curtainGlass: THREE.MeshPhysicalMaterial;
  curtainGlassRecessed: THREE.MeshPhysicalMaterial;
  spandrelMullion: THREE.MeshStandardMaterial;
  finMetalCladding: THREE.MeshStandardMaterial;
  silverLettering: THREE.MeshStandardMaterial;
  shieldCrestFace: THREE.MeshStandardMaterial;
  shieldRimDark: THREE.MeshStandardMaterial;
  concreteLight: THREE.MeshStandardMaterial;
  concreteMid: THREE.MeshStandardMaterial;
  concreteDark: THREE.MeshStandardMaterial;
  podiumColumn: THREE.MeshStandardMaterial;
  podiumStairs: THREE.MeshStandardMaterial;
  podiumSignage: THREE.MeshStandardMaterial;
  roofGreenDeck: THREE.MeshStandardMaterial;
  hvacUnit: THREE.MeshStandardMaterial;
  hvacGrille: THREE.MeshStandardMaterial;
  voidInterior: THREE.MeshStandardMaterial;
  balconyLouver: THREE.MeshStandardMaterial;
  groundBase: THREE.MeshStandardMaterial;
  plazaPaving: THREE.MeshStandardMaterial;
  roadAsphalt: THREE.MeshStandardMaterial;
  roadCurb: THREE.MeshStandardMaterial;
  lawnGrass: THREE.MeshStandardMaterial;
  treeTrunk: THREE.MeshStandardMaterial;
  treeCanopy: THREE.MeshStandardMaterial;
  flagRed: THREE.MeshStandardMaterial;
  flagWhite: THREE.MeshStandardMaterial;
  streetLampGlow: THREE.MeshStandardMaterial;
  contactShadow: THREE.MeshBasicMaterial;
  dispose: () => void;
}

export function createUntarMaterialLibrary(
  textures: ProceduralTextureSet,
): UntarMaterialLibrary {
  const curtainGlass = new THREE.MeshPhysicalMaterial({
    map: textures.curtainWallGlass,
    roughnessMap: textures.curtainWallRoughness,
    color: 0xdff0ff,
    metalness: 0.18,
    roughness: 0.14,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    reflectivity: 0.9,
    envMapIntensity: 1.25,
  });

  const curtainGlassRecessed = new THREE.MeshPhysicalMaterial({
    map: textures.curtainWallGlass,
    color: 0x8bbce8,
    metalness: 0.22,
    roughness: 0.22,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.95,
  });

  const spandrelMullion = new THREE.MeshStandardMaterial({
    color: 0x3b4d63,
    metalness: 0.55,
    roughness: 0.42,
  });

  const finMetalCladding = new THREE.MeshStandardMaterial({
    map: textures.finMetalCladding,
    bumpMap: textures.finMetalBump,
    bumpScale: 0.16,
    color: 0xd8dfe8,
    metalness: 0.62,
    roughness: 0.36,
    envMapIntensity: 1.05,
  });

  const silverLettering = new THREE.MeshStandardMaterial({
    color: 0xe6ecf4,
    metalness: 0.78,
    roughness: 0.24,
    envMapIntensity: 1.2,
  });

  const shieldCrestFace = new THREE.MeshStandardMaterial({
    map: textures.untarShieldCrest,
    color: 0xf0f4f8,
    metalness: 0.45,
    roughness: 0.38,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const shieldRimDark = new THREE.MeshStandardMaterial({
    color: 0x222936,
    metalness: 0.7,
    roughness: 0.32,
  });

  const concreteLight = new THREE.MeshStandardMaterial({
    color: 0xc2c9d4,
    metalness: 0.08,
    roughness: 0.82,
  });

  const concreteMid = new THREE.MeshStandardMaterial({
    color: 0x7c8798,
    metalness: 0.12,
    roughness: 0.78,
  });

  const concreteDark = new THREE.MeshStandardMaterial({
    color: 0x2c3442,
    metalness: 0.15,
    roughness: 0.85,
  });

  const podiumColumn = new THREE.MeshStandardMaterial({
    color: 0xd5dce6,
    metalness: 0.25,
    roughness: 0.48,
  });

  const podiumStairs = new THREE.MeshStandardMaterial({
    color: 0x9aa3b0,
    metalness: 0.05,
    roughness: 0.88,
  });

  const podiumSignage = new THREE.MeshStandardMaterial({
    map: textures.podiumSignage,
    transparent: true,
    metalness: 0.3,
    roughness: 0.35,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  // Light green central roof membrane (seen clearly in Image 5 atap_untar_5161836b.PNG)
  const roofGreenDeck = new THREE.MeshStandardMaterial({
    color: 0x6ec490,
    metalness: 0.05,
    roughness: 0.78,
  });

  const hvacUnit = new THREE.MeshStandardMaterial({
    color: 0xb7c0cc,
    metalness: 0.45,
    roughness: 0.52,
  });

  const hvacGrille = new THREE.MeshStandardMaterial({
    color: 0x2c3543,
    metalness: 0.6,
    roughness: 0.45,
  });

  const voidInterior = new THREE.MeshStandardMaterial({
    color: 0x162233,
    metalness: 0.2,
    roughness: 0.75,
  });

  const balconyLouver = new THREE.MeshStandardMaterial({
    color: 0xc9d1dc,
    metalness: 0.38,
    roughness: 0.45,
  });

  const groundBase = new THREE.MeshStandardMaterial({
    color: 0x0d121b,
    metalness: 0.05,
    roughness: 0.94,
  });

  const plazaPaving = new THREE.MeshStandardMaterial({
    map: textures.plazaPaving,
    color: 0xbac4d4,
    metalness: 0.06,
    roughness: 0.86,
  });

  const roadAsphalt = new THREE.MeshStandardMaterial({
    map: textures.roadAsphalt,
    color: 0xd0d6e0,
    metalness: 0.04,
    roughness: 0.9,
  });

  const roadCurb = new THREE.MeshStandardMaterial({
    color: 0x646f80,
    metalness: 0.05,
    roughness: 0.86,
  });

  const lawnGrass = new THREE.MeshStandardMaterial({
    map: textures.lawnGrass,
    color: 0x9ed6b2,
    metalness: 0.02,
    roughness: 0.92,
  });

  const treeTrunk = new THREE.MeshStandardMaterial({
    color: 0x4b3b2f,
    metalness: 0.02,
    roughness: 0.95,
  });

  const treeCanopy = new THREE.MeshStandardMaterial({
    color: 0x2f6b47,
    metalness: 0.02,
    roughness: 0.88,
  });

  const flagRed = new THREE.MeshStandardMaterial({
    color: 0xc92a2a,
    roughness: 0.72,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const flagWhite = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.72,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const streetLampGlow = new THREE.MeshStandardMaterial({
    color: 0xfff0cc,
    emissive: 0xffd27d,
    emissiveIntensity: 0.85,
    roughness: 0.3,
  });

  const contactShadow = new THREE.MeshBasicMaterial({
    map: textures.contactShadow,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });

  const allMaterials: THREE.Material[] = [
    curtainGlass,
    curtainGlassRecessed,
    spandrelMullion,
    finMetalCladding,
    silverLettering,
    shieldCrestFace,
    shieldRimDark,
    concreteLight,
    concreteMid,
    concreteDark,
    podiumColumn,
    podiumStairs,
    podiumSignage,
    roofGreenDeck,
    hvacUnit,
    hvacGrille,
    voidInterior,
    balconyLouver,
    groundBase,
    plazaPaving,
    roadAsphalt,
    roadCurb,
    lawnGrass,
    treeTrunk,
    treeCanopy,
    flagRed,
    flagWhite,
    streetLampGlow,
    contactShadow,
  ];

  return {
    curtainGlass,
    curtainGlassRecessed,
    spandrelMullion,
    finMetalCladding,
    silverLettering,
    shieldCrestFace,
    shieldRimDark,
    concreteLight,
    concreteMid,
    concreteDark,
    podiumColumn,
    podiumStairs,
    podiumSignage,
    roofGreenDeck,
    hvacUnit,
    hvacGrille,
    voidInterior,
    balconyLouver,
    groundBase,
    plazaPaving,
    roadAsphalt,
    roadCurb,
    lawnGrass,
    treeTrunk,
    treeCanopy,
    flagRed,
    flagWhite,
    streetLampGlow,
    contactShadow,
    dispose: () => {
      allMaterials.forEach((m) => m.dispose());
    },
  };
}
