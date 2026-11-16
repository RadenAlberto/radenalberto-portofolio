import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { buildSennaModel } from './senna/buildSennaModel';
import { createSennaMaterials } from './senna/sennaMaterials';

export type SennaWaypointId = 'exterior' | 'wheel' | 'cockpit' | 'wing';

interface HeroSenna3DProps {
  theme?: 'dark' | 'light';
  scrollProgressRef: React.MutableRefObject<number>;
  onActiveWaypointChange?: (wp: SennaWaypointId) => void;
  aeroExpanded: boolean;
}

// Pre-allocated scratch vectors for zero-GC per-frame interpolation
const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();
const _orbitPos = new THREE.Vector3(-5.95, 1.85, 5.55);
const _orbitLook = new THREE.Vector3(0, 0.48, 0);

function getWaypointFromProgress(t: number): SennaWaypointId {
  if (t < 0.2) return 'exterior';
  if (t < 0.45) return 'wheel';
  if (t < 0.76) return 'cockpit';
  return 'wing';
}

export const HeroSenna3D: React.FC<HeroSenna3DProps> = ({
  theme = 'dark',
  scrollProgressRef,
  onActiveWaypointChange,
  aeroExpanded,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef<'dark' | 'light'>(theme);
  const aeroExpandedRef = useRef(aeroExpanded);
  const onWaypointRef = useRef(onActiveWaypointChange);
  const blueprintLineMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const [webglFallback, setWebglFallback] = useState(false);

  useEffect(() => {
    aeroExpandedRef.current = aeroExpanded;
  }, [aeroExpanded]);

  useEffect(() => {
    onWaypointRef.current = onActiveWaypointChange;
  }, [onActiveWaypointChange]);

  useEffect(() => {
    themeRef.current = theme;
    if (blueprintLineMatRef.current) {
      blueprintLineMatRef.current.color.setHex(theme === 'dark' ? 0x38bdf8 : 0x1e293b);
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

    let width = container.clientWidth || 1080;
    let height = container.clientHeight || 640;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
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

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.06, 80);
    camera.position.copy(_orbitPos);

    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(_orbitLook);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = Math.PI * 0.16;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.autoRotate = !isSoftwareGl;
    controls.autoRotateSpeed = 0.45;
    controls.update();

    // Studio Automotive 3-Point Lighting + Overhead Softboxes
    const hemiLight = new THREE.HemisphereLight(0xf8fafc, 0x0f172a, 1.05);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.85);
    keyLight.position.set(-5.5, 8.5, 6.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.15);
    rimLight.position.set(6.5, 4.0, -5.5);
    scene.add(rimLight);

    const cockpitFillLight = new THREE.PointLight(0xfef3c7, 0.75, 4.5);
    cockpitFillLight.position.set(0, 1.02, 0.15);
    scene.add(cockpitFillLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const topSoftbox = new THREE.RectAreaLight(0xffffff, 2.2, 5.2, 2.2);
      topSoftbox.position.set(0, 3.6, 0);
      topSoftbox.lookAt(0, 0.5, 0);
      scene.add(topSoftbox);

      const sideSoftbox = new THREE.RectAreaLight(0xe0f2fe, 1.35, 4.5, 1.2);
      sideSoftbox.position.set(-1.5, 1.4, 4.2);
      sideSoftbox.lookAt(0, 0.5, 0);
      scene.add(sideSoftbox);
    }

    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const mats = createSennaMaterials(maxAnisotropy, themeRef.current);
    blueprintLineMatRef.current = mats.blueprintLine;

    const senna = buildSennaModel(mats);
    scene.add(senna.root);

    // Smooth Scroll-Driven Cinematic Camera Splines (Exterior -> Wheel -> Open Dihedral Door -> Pilot Steering Cockpit -> Swan-Neck Wing & Diffuser)
    const camPosCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-5.95, 1.85, 5.55), // 0.00: Front 3/4 exterior hero (comfortable scale)
        new THREE.Vector3(-2.78, 0.52, 2.55), // 0.24: Front 10-spoke wheel, drilled rotor & Papaya caliper
        new THREE.Vector3(-0.34, 1.06, 1.92), // 0.44: Poised outside rising dihedral door
        new THREE.Vector3(0.05, 0.88, 0.34), // 0.62: Inside pilot cockpit behind carbon steering wheel
        new THREE.Vector3(0.16, 1.18, 1.76), // 0.74: Exit cleanly out open doorway
        new THREE.Vector3(2.85, 1.78, 2.28), // 0.86: Overhead roof snorkel & triple exhausts
        new THREE.Vector3(5.65, 1.48, 2.75), // 1.00: Full rear 3/4 Swan-Neck wing & 6-fin diffuser
      ],
      false,
      'catmullrom',
      0.35
    );

    const camLookCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0.0, 0.48, 0.0), // Exterior center
        new THREE.Vector3(-1.46, 0.36, 0.56), // Front wheel, drilled rotor & Papaya aero duct
        new THREE.Vector3(-0.42, 0.74, 0.28), // Cockpit steering column threshold
        new THREE.Vector3(-1.25, 0.72, 0.32), // Straight ahead through steering wheel, glowing dash & hood
        new THREE.Vector3(0.5, 0.78, 0.1), // Pulling away past monocage roof snorkel
        new THREE.Vector3(1.1, 0.66, 0.0), // Triple top-exit exhausts
        new THREE.Vector3(1.15, 0.56, 0.0), // Swan-neck wing, red LEDs & 6-fin diffuser framed cleanly
      ],
      false,
      'catmullrom',
      0.35
    );

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          width = w;
          height = h;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let smoothProgress = 0;
    let smoothDoorOpen = 0;
    let smoothWingDeploy = 0;
    let lastWaypoint: SennaWaypointId = 'exterior';
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

      const delta = Math.min(clock.getDelta(), 0.1);
      const rawTarget = Math.min(1, Math.max(0, scrollProgressRef.current));
      smoothProgress = THREE.MathUtils.damp(smoothProgress, rawTarget, 8, delta);

      const currentWaypoint = getWaypointFromProgress(smoothProgress);
      if (currentWaypoint !== lastWaypoint) {
        lastWaypoint = currentWaypoint;
        onWaypointRef.current?.(currentWaypoint);
      }

      // 1. Frameless View Offset: Right-side Hero framing (74%) at scroll = 0, centered full-stage once scrolling!
      const heroBlend = Math.max(0, 1 - smoothProgress / 0.22);
      const isDesktop = width >= 900;
      const offsetX = isDesktop ? -width * 0.24 * heroBlend : 0;
      const offsetY = !isDesktop ? -height * 0.15 * heroBlend : 0;
      if (Math.abs(offsetX) > 0.5 || Math.abs(offsetY) > 0.5) {
        camera.setViewOffset(width, height, offsetX, offsetY, width, height);
      } else {
        camera.clearViewOffset();
      }

      // 2. Orbit vs. Cinematic Scroll Camera Flight Handoff
      const inScrollFlight = rawTarget > 0.025 || smoothProgress > 0.025;
      controls.enabled = !inScrollFlight;

      if (inScrollFlight) {
        const curveT = Math.min(1, Math.max(0, smoothProgress));
        camPosCurve.getPointAt(curveT, _camTargetPos);
        camLookCurve.getPointAt(curveT, _camTargetLook);
        camera.position.lerp(_camTargetPos, 1 - Math.exp(-10 * delta));
        controls.target.lerp(_camTargetLook, 1 - Math.exp(-10 * delta));
        camera.lookAt(controls.target);
      } else {
        controls.update();
      }

      // 3. Scroll-Synced Dihedral Door Opening during Cockpit Entry (t = 0.34 .. 0.78)
      const doorTarget =
        smoothProgress >= 0.32 && smoothProgress <= 0.78
          ? Math.min(1, Math.min((smoothProgress - 0.32) / 0.1, (0.78 - smoothProgress) / 0.08))
          : 0;
      smoothDoorOpen = THREE.MathUtils.damp(smoothDoorOpen, doorTarget, 7, delta);

      senna.leftDoorPivot.rotation.set(
        smoothDoorOpen * 0.45,
        -smoothDoorOpen * 0.24,
        smoothDoorOpen * 0.68
      );

      // 4. Rolling Wheels & Drilled Brake Rotors synced to Scroll + Gentle Steering Wheel Turn inside Cockpit
      const wheelSpin = smoothProgress * 12;
      for (let i = 0; i < senna.wheelSpinGroups.length; i++) {
        senna.wheelSpinGroups[i].rotation.z = wheelSpin;
      }

      const steerAngle =
        smoothProgress > 0.45 && smoothProgress < 0.78
          ? Math.sin((smoothProgress - 0.52) * Math.PI * 3.5) * 0.24
          : 0;
      senna.steeringWheelGroup.rotation.x = steerAngle;

      // 5. Active Aero Wing & Splitter/Diffuser Articulation (Scroll End + Manual Toggle)
      const wantAero = aeroExpandedRef.current ? 1 : Math.max(0, (smoothProgress - 0.72) / 0.28);
      smoothWingDeploy = THREE.MathUtils.damp(smoothWingDeploy, wantAero, 7, delta);
      senna.wingGroup.position.y = smoothWingDeploy * 0.12;
      senna.wingGroup.rotation.z = -smoothWingDeploy * 0.14;
      senna.splitterGroup.position.x = aeroExpandedRef.current ? -0.14 : 0;
      senna.diffuserGroup.position.x = aeroExpandedRef.current ? 0.14 : 0;

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
      mats.disposables.forEach((d) => d.dispose());
      senna.disposables.forEach((d) => d.dispose());
      envTex.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [scrollProgressRef]);

  return (
    <div className="absolute inset-0 w-full h-full select-none">
      {webglFallback ? (
        <div className="w-full h-full flex items-center justify-end pr-8">
          <div className="max-w-sm text-center space-y-2">
            <svg
              viewBox="0 0 240 96"
              className="w-60 h-24 text-[#3B82F6] dark:text-[#06B6D4] mx-auto"
              fill="none"
              role="img"
              aria-label="Siluet McLaren Senna"
            >
              <path
                d="M18 66 C28 42 58 36 92 34 L120 22 C142 22 158 32 180 38 L208 40 L218 18 L226 18 L218 50 L224 66 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="rgba(59,130,246,0.12)"
              />
              <circle cx="62" cy="68" r="14" stroke="currentColor" strokeWidth="2" />
              <circle cx="180" cy="68" r="15" stroke="currentColor" strokeWidth="2" />
              <path d="M26 54 L46 54" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              McLaren Senna · Pratinjau 2D
            </span>
          </div>
        </div>
      ) : (
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          aria-label="Model 3D realistis McLaren Senna dengan animasi kamera scroll ke roda dan kokpit kemudi"
        />
      )}
    </div>
  );
};
