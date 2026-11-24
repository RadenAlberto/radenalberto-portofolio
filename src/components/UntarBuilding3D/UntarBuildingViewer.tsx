import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Compass,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { buildUntarCampusModel } from './geometryUntar';
import { createUntarMaterialLibrary } from './materials';
import { createUntarTextureSet } from './textures';
import {
  CAMERA_PRESETS,
  type CameraPresetId,
  type UntarBuildingViewerProps,
} from './types';

// Reusable module-scope math objects (zero GC inside animation frames)
const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const UntarBuildingViewer: React.FC<UntarBuildingViewerProps> = ({
  initialPreset = 'overview',
  activePreset: controlledPreset,
  onPresetChange,
  showControls = true,
  embedded = false,
  theme = 'dark',
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [internalPreset, setInternalPreset] = useState<CameraPresetId | null>(
    initialPreset,
  );
  const activePreset =
    controlledPreset !== undefined ? controlledPreset : internalPreset;

  const [autoRotate, setAutoRotate] = useState<boolean>(embedded);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [contextLost, setContextLost] = useState<boolean>(false);

  // Mutable refs accessed inside Three.js lifecycle without tearing down WebGL
  const onPresetChangeRef = useRef(onPresetChange);
  onPresetChangeRef.current = onPresetChange;

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const transitionRef = useRef<{
    active: boolean;
    position: [number, number, number];
    target: [number, number, number];
  }>({
    active: false,
    position: CAMERA_PRESETS[initialPreset].position,
    target: CAMERA_PRESETS[initialPreset].target,
  });

  const controlsApiRef = useRef<{
    goToPreset: (presetId: CameraPresetId) => void;
    setAutoRotateEnabled: (enabled: boolean) => void;
  } | null>(null);

  const selectPreset = useCallback(
    (presetId: CameraPresetId) => {
      if (controlledPreset === undefined) {
        setInternalPreset(presetId);
      }
      if (embedded) {
        const shouldAutoRotate = presetId === 'overview';
        setAutoRotate(shouldAutoRotate);
        controlsApiRef.current?.setAutoRotateEnabled(shouldAutoRotate);
      }
      onPresetChangeRef.current?.(presetId);
      controlsApiRef.current?.goToPreset(presetId);
    },
    [controlledPreset, embedded],
  );

  const handleResetView = useCallback(() => {
    setAutoRotate(false);
    controlsApiRef.current?.setAutoRotateEnabled(false);
    selectPreset('overview');
  }, [selectPreset]);

  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => {
      const next = !prev;
      controlsApiRef.current?.setAutoRotateEnabled(next);
      return next;
    });
  }, []);

  // Respond to controlled activePreset changes from parent portfolio app
  useEffect(() => {
    if (controlledPreset) {
      controlsApiRef.current?.goToPreset(controlledPreset);
    }
  }, [controlledPreset]);

  // Keyboard shortcuts (1-4 presets, R reset, H toggle HUD)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      switch (e.key.toLowerCase()) {
        case '1':
          selectPreset('overview');
          break;
        case '2':
          selectPreset('podiumFront');
          break;
        case '3':
          selectPreset('northSide');
          break;
        case '4':
          selectPreset('topPerspective');
          break;
        case 'r':
          handleResetView();
          break;
        case 'h':
          setDockCollapsed((c) => !c);
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleResetView, selectPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    // 1. Scene & Optional Atmospheric Horizon Fog
    const scene = new THREE.Scene();
    if (!embedded) {
      const bgHex = 0x090d14;
      scene.background = new THREE.Color(bgHex);
      scene.fog = new THREE.FogExp2(bgHex, 0.0036);
    }

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      embedded ? 44 : 42,
      width / height,
      0.5,
      480,
    );
    const startPreset = CAMERA_PRESETS[initialPreset];
    camera.position.set(...startPreset.position);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: embedded,
      powerPreference: 'high-performance',
    });
    if (embedded) {
      renderer.setClearColor(0x000000, 0);
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Context Loss / Restore Guards
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // 4. Studio Reflection Environment (RoomEnvironment via PMREM)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // 5. Three-Point Architectural Daylight Rig (Directional + Hemisphere + Cool Rim)
    const hemiLight = new THREE.HemisphereLight(0xa3c9ff, 0x1b2434, 0.95);
    hemiLight.position.set(0, 90, 0);
    scene.add(hemiLight);

    const keySunLight = new THREE.DirectionalLight(0xfff1db, 2.5);
    keySunLight.position.set(-55, 86, 62);
    keySunLight.target.position.set(0, 18, 0);
    scene.add(keySunLight.target);
    if (!isSoftwareGl) {
      keySunLight.castShadow = true;
      keySunLight.shadow.mapSize.set(2048, 2048);
      keySunLight.shadow.camera.near = 15;
      keySunLight.shadow.camera.far = 230;
      const d = 58;
      keySunLight.shadow.camera.left = -d;
      keySunLight.shadow.camera.right = d;
      keySunLight.shadow.camera.top = d;
      keySunLight.shadow.camera.bottom = -d;
      keySunLight.shadow.bias = -0.0004;
      keySunLight.shadow.normalBias = 0.025;
      keySunLight.shadow.radius = 2.5;
    }
    scene.add(keySunLight);

    // Northeast cool fill/rim light so North facade, UNTAR lettering, & balcony louvers stay crisp
    const northRimLight = new THREE.DirectionalLight(0x9bc7ff, 1.05);
    northRimLight.position.set(55, 52, -68);
    northRimLight.target.position.set(0, 22, 0);
    scene.add(northRimLight.target);
    scene.add(northRimLight);

    // 6. Procedural Textures, PBR Materials & Building Geometry
    const maxAnisotropy = Math.min(
      8,
      renderer.capabilities.getMaxAnisotropy(),
    );
    const textures = createUntarTextureSet(maxAnisotropy);
    const materials = createUntarMaterialLibrary(textures);
    const untarModel = buildUntarCampusModel(materials, {
      compactSite: embedded,
    });
    scene.add(untarModel);

    // 7. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...startPreset.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enableZoom = !embedded;
    controls.enablePan = !embedded;
    controls.screenSpacePanning = false;
    controls.minDistance = 24;
    controls.maxDistance = 240;
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI * 0.485; // Stay above ground plane
    controls.autoRotate = !isSoftwareGl && embedded;
    controls.autoRotateSpeed = embedded ? 0.48 : 0.55;
    controls.update();

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 8. Coalesced On-Demand Render Loop with Software-WebGL Pacing
    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
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

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (disposed) return;
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        renderDirty = false;

        let needsMoreFrames = false;

        // Smooth camera preset / Reset View damping
        if (transitionRef.current.active) {
          _desiredPos.set(...transitionRef.current.position);
          _desiredTarget.set(...transitionRef.current.target);

          const lambda = 6.5;
          camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            _desiredPos.x,
            lambda,
            delta,
          );
          camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            _desiredPos.y,
            lambda,
            delta,
          );
          camera.position.z = THREE.MathUtils.damp(
            camera.position.z,
            _desiredPos.z,
            lambda,
            delta,
          );

          controls.target.x = THREE.MathUtils.damp(
            controls.target.x,
            _desiredTarget.x,
            lambda,
            delta,
          );
          controls.target.y = THREE.MathUtils.damp(
            controls.target.y,
            _desiredTarget.y,
            lambda,
            delta,
          );
          controls.target.z = THREE.MathUtils.damp(
            controls.target.z,
            _desiredTarget.z,
            lambda,
            delta,
          );

          const posDist = camera.position.distanceTo(_desiredPos);
          const targetDist = controls.target.distanceTo(_desiredTarget);
          if (posDist < 0.08 && targetDist < 0.08) {
            camera.position.copy(_desiredPos);
            controls.target.copy(_desiredTarget);
            transitionRef.current.active = false;
          } else {
            needsMoreFrames = true;
          }
        }

        const controlsChanged = controls.update();
        if (controlsChanged && !isSoftwareGl) {
          needsMoreFrames = true;
        }
        if (!isSoftwareGl && autoRotateRef.current) {
          needsMoreFrames = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || needsMoreFrames)) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    const onControlsStart = () => {
      if (transitionRef.current.active) {
        transitionRef.current.active = false;
      }
      if (controlledPreset === undefined) {
        setInternalPreset(null);
      }
      onPresetChangeRef.current?.(null);
    };

    const onControlsChange = () => {
      requestRender();
    };

    controls.addEventListener('start', onControlsStart);
    controls.addEventListener('change', onControlsChange);

    controlsApiRef.current = {
      goToPreset: (presetId: CameraPresetId) => {
        const preset = CAMERA_PRESETS[presetId];
        transitionRef.current = {
          active: true,
          position: preset.position,
          target: preset.target,
        };
        lastTime = performance.now();
        requestRender();
      },
      setAutoRotateEnabled: (enabled: boolean) => {
        controls.autoRotate = !isSoftwareGl && enabled;
        if (enabled && !isSoftwareGl) {
          requestRender();
        }
      },
    };

    // ResizeObserver for crisp layout adaptation
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(entry.contentRect.width, 1);
      const h = Math.max(entry.contentRect.height, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    });
    resizeObserver.observe(container);

    // Initial render
    requestRender();

    // Cleanup on unmount
    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlsStart);
      controls.removeEventListener('change', onControlsChange);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        onContextRestored,
      );

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh) {
          obj.geometry?.dispose();
        }
      });
      materials.dispose();
      textures.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      controlsApiRef.current = null;
    };
  }, [initialPreset, controlledPreset, embedded]);

  const presetList = Object.values(CAMERA_PRESETS);

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${
        embedded ? 'bg-transparent' : 'bg-[#090d14]'
      } ${className}`}
    >
      {/* Isolated WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Tampilan 3D Interaktif Gedung Utama Universitas Tarumanagara"
      />

      {/* Graceful WebGL Context Loss Fallback */}
      {contextLost && (
        <div
          className={`absolute inset-0 z-30 flex items-center justify-center p-6 ${
            embedded
              ? 'bg-slate-100/90 dark:bg-[#090d14]/90 text-slate-700 dark:text-slate-200'
              : 'bg-[#090d14] text-slate-200'
          }`}
        >
          <div className="max-w-md text-center space-y-2 border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0e1522] rounded-xl p-6">
            <p className="font-display text-lg font-semibold">
              Konteks WebGL Terhenti
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Muat ulang halaman untuk memulihkan tampilan Gedung Utama UNTAR.
            </p>
          </div>
        </div>
      )}

      {/* Standalone Fullscreen Header */}
      {!embedded && (
        <header className="pointer-events-none absolute top-5 left-5 z-10 max-w-md">
          <p className="text-xs font-medium tracking-wide text-sky-400/90">
            Model Arsitektur 3D · Kampus I Jakarta
          </p>
          <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-slate-100 mt-0.5 text-balance">
            Gedung Utama Universitas Tarumanagara
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {activePreset
              ? CAMERA_PRESETS[activePreset].description
              : 'Mode orbit bebas — gunakan Preset Kamera atau Reset View untuk kembali'}
          </p>
        </header>
      )}

      {/* Unified Collapsible Bottom Control Dock (Standalone Only) */}
      {showControls && !embedded && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-transform duration-300 ease-out ${
            dockCollapsed ? 'translate-y-[calc(100%-18px)]' : 'translate-y-0'
          }`}
          style={{ maxWidth: 'min(940px, 94vw)' }}
        >
          {/* Collapse / Expand Drawer Handle */}
          <button
            type="button"
            onClick={() => setDockCollapsed((c) => !c)}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-t-lg border border-b-0 border-white/10 bg-[#0d1421] text-[11px] font-medium text-slate-300 hover:text-white hover:bg-[#131d2f] transition-colors cursor-pointer whitespace-nowrap"
            aria-expanded={!dockCollapsed}
            title="Sembunyikan atau tampilkan panel kontrol (H)"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
                <span>Tampilkan Kontrol</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sembunyikan</span>
              </>
            )}
          </button>

          {/* Main Compact Horizontal Control Surface (No backdrop-filter over WebGL) */}
          <div className="w-full rounded-xl border border-white/10 bg-[#0d1421]/95 shadow-2xl px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Camera Presets */}
              <div
                className="flex flex-wrap items-center justify-center gap-1 p-1 rounded-lg bg-[#080c14] border border-white/5"
                role="group"
                aria-label="Preset Kamera"
              >
                <span className="hidden md:inline-flex items-center gap-1.5 px-2 text-xs font-medium text-slate-400 whitespace-nowrap">
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                  <span>Kamera</span>
                </span>
                {presetList.map((preset) => {
                  const isActive = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => selectPreset(preset.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400 ${
                        isActive
                          ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:block h-6 w-px bg-white/10 mx-0.5" />

              {/* Reset View & Auto-Orbit Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetView}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#131c2c] text-xs font-medium text-slate-200 hover:bg-[#1a263b] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400"
                  title="Kembalikan kamera ke tampilan awal (R)"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  <span>Reset View</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleAutoRotate}
                  aria-pressed={autoRotate}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400 ${
                    autoRotate
                      ? 'border-sky-400/50 bg-sky-500/15 text-sky-300'
                      : 'border-white/10 bg-[#131c2c] text-slate-300 hover:bg-[#1a263b] hover:text-white'
                  }`}
                  title="Putar kamera mengelilingi gedung secara otomatis"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      autoRotate ? 'text-sky-400' : 'text-slate-400'
                    }`}
                  />
                  <span>Putar Otomatis</span>
                </button>
              </div>
            </div>

            {/* Subtle Navigation & Orientation Legend */}
            <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <span>
                Seret kiri untuk orbit · Gulir untuk zoom · Seret kanan untuk geser
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Compass className="w-3 h-3 text-sky-400/80" />
                <span>Barat (Jl. S. Parman) di kiri depan</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const UntarBuilding3D: React.FC<{ theme?: 'dark' | 'light' }> = ({
  theme = 'dark',
}) => {
  const [activePreset, setActivePreset] = useState<CameraPresetId | null>('overview');
  const presetList = Object.values(CAMERA_PRESETS);

  return (
    <div className="flex flex-col w-full justify-between space-y-2.5">
      <div className="relative w-full max-w-[440px] mx-auto aspect-square lg:max-w-none lg:aspect-auto lg:h-[430px] overflow-hidden rounded-lg border border-slate-200/70 dark:border-white/10 bg-slate-50/40 dark:bg-[#0B0D14]/40">
        <UntarBuildingViewer
          initialPreset="overview"
          activePreset={activePreset ?? undefined}
          onPresetChange={setActivePreset}
          showControls={false}
          embedded
          theme={theme}
        />
      </div>

      {/* Non-overlapping Camera Preset Strip */}
      <div
        className="flex flex-wrap items-center justify-center lg:justify-between gap-1.5"
        role="group"
        aria-label="Sudut Kamera Gedung UNTAR"
      >
        <div className="flex flex-wrap items-center justify-center gap-1">
          {presetList.map((preset) => {
            const isActive = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActivePreset(preset.id)}
                className={`px-2 py-1 rounded font-mono text-[10px] tracking-wider transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-[#3B82F6] dark:bg-[#06B6D4] text-white dark:text-slate-950 border-transparent font-semibold'
                    : theme === 'dark'
                    ? 'bg-[#0D0F17]/80 text-slate-300 border-white/15 hover:border-[#06B6D4] hover:text-white'
                    : 'bg-white/90 text-slate-600 border-slate-300 hover:border-[#3B82F6] hover:text-slate-900'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-1 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] sm:text-[11px] tracking-wider text-slate-500 dark:text-slate-400">
        <span>KAMPUS I · GEDUNG UTAMA — UNTAR</span>
        <span>360° ORBIT · DRAG TO ROTATE</span>
      </div>
    </div>
  );
};
