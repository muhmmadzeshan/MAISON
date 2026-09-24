import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PerfumeProduct } from '../../types';

interface PerfumeBottleCanvasProps {
  product: PerfumeProduct;
  engravingText?: string;
  activeChapter?: number; // 1 to 5
  interactive?: boolean;
  className?: string;
  onBottleClick?: () => void;
}

export const PerfumeBottleCanvas: React.FC<PerfumeBottleCanvasProps> = ({
  product,
  engravingText = '',
  activeChapter = 1,
  interactive = true,
  className = '',
  onBottleClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // References to dynamic props to avoid re-initializing scene
  const activeChapterRef = useRef(activeChapter);
  activeChapterRef.current = activeChapter;

  const interactiveRef = useRef(interactive);
  interactiveRef.current = interactive;

  const onBottleClickRef = useRef(onBottleClick);
  onBottleClickRef.current = onBottleClick;

  // Viewport visibility state to pause rendering when offscreen
  const isVisibleRef = useRef(true);

  // References for Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bottleGroupRef = useRef<THREE.Group | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const glassMeshRef = useRef<THREE.Mesh | null>(null);
  const capMeshRef = useRef<THREE.Mesh | null>(null);
  const labelMeshRef = useRef<THREE.Mesh | null>(null);
  const labelTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const labelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const bgMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Interaction tracking
  const pointer = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, velX: 0, velY: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Camera targets for 5 chapters
  const cameraConfigs = useRef([
    { pos: new THREE.Vector3(0, 0.4, 4.4), target: new THREE.Vector3(0, 0, 0) }, // Ch 1: Wide Haute
    { pos: new THREE.Vector3(0, 1.45, 2.2), target: new THREE.Vector3(0, 1.15, 0) }, // Ch 2: Atomizer & Monogram
    { pos: new THREE.Vector3(1.8, 0.2, 3.6), target: new THREE.Vector3(0, 0, 0) }, // Ch 3: Olfactory Pyramid
    { pos: new THREE.Vector3(0.1, -0.1, 2.1), target: new THREE.Vector3(0, -0.1, 0) }, // Ch 4: Liquid Amber Macro
    { pos: new THREE.Vector3(0, 0.35, 4.2), target: new THREE.Vector3(0, 0, 0) }, // Ch 5: Pedestal Discovery
  ]);

  // Helper to draw bespoke luxury label
  const updateLabelTexture = useCallback((name: string, engraving: string, family: string) => {
    let canvas = labelCanvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      labelCanvasRef.current = canvas;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background: Fine textured off-white parchment
    ctx.fillStyle = '#f9f6f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper grain pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    for (let i = 0; i < 250; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Outer and Inner hairline border
    ctx.strokeStyle = '#c9a96e';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    ctx.strokeStyle = 'rgba(201, 169, 110, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    // Maison Seal / Monogram
    ctx.fillStyle = '#c9a96e';
    ctx.font = '300 24px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('M A I S O N', canvas.width / 2, 85);

    // Atelier Location
    ctx.font = '400 14px "Inter", sans-serif';
    ctx.fillStyle = '#8a8278';
    ctx.letterSpacing = '4px';
    ctx.fillText('PARIS · HAUTE PARFUMERIE', canvas.width / 2, 115);

    // Decorative hairline under brand
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 120, 135);
    ctx.lineTo(canvas.width / 2 + 120, 135);
    ctx.stroke();

    // Perfume Name
    ctx.font = '500 48px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#14110e';
    ctx.letterSpacing = '8px';
    ctx.fillText(name.toUpperCase(), canvas.width / 2, 215);

    // Family / Character
    ctx.font = 'italic 300 22px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#6e5f52';
    ctx.letterSpacing = '3px';
    ctx.fillText(`Grand Cru · ${family}`, canvas.width / 2, 260);

    // Engraving Banner if present
    if (engraving && engraving.trim().length > 0) {
      ctx.fillStyle = 'rgba(201, 169, 110, 0.12)';
      ctx.fillRect(canvas.width / 2 - 240, 305, 480, 52);
      ctx.strokeStyle = 'rgba(201, 169, 110, 0.6)';
      ctx.strokeRect(canvas.width / 2 - 240, 305, 480, 52);

      ctx.font = '600 24px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#9e7b39';
      ctx.letterSpacing = '5px';
      ctx.fillText(`❝ ${engraving.toUpperCase()} ❞`, canvas.width / 2, 340);
    } else {
      ctx.font = '400 16px "Inter", sans-serif';
      ctx.fillStyle = '#8a8278';
      ctx.letterSpacing = '3px';
      ctx.fillText('EXTRAIT DE PARFUM · 50 ML / 1.7 FL. OZ.', canvas.width / 2, 335);
    }

    // Bottom batch number
    ctx.font = '400 13px "Inter", sans-serif';
    ctx.fillStyle = '#a89f91';
    ctx.letterSpacing = '2px';
    ctx.fillText('N° 0492 / GRASSE RÉSERVE SPÉCIALE', canvas.width / 2, 430);

    if (labelTextureRef.current) {
      labelTextureRef.current.needsUpdate = true;
    }
  }, []);

  // Update label texture on product or engraving change
  useEffect(() => {
    updateLabelTexture(product.name, engravingText, product.family);
  }, [product.name, product.family, engravingText, updateLabelTexture]);

  // Update liquid, cap, and background colors dynamically
  useEffect(() => {
    if (liquidMeshRef.current?.material) {
      (liquidMeshRef.current.material as THREE.MeshPhysicalMaterial).color.setHex(product.colours.liquidHex);
    }
    if (glassMeshRef.current?.material) {
      (glassMeshRef.current.material as THREE.MeshPhysicalMaterial).color.setHex(product.colours.glassTintHex);
    }
    if (capMeshRef.current?.material) {
      (capMeshRef.current.material as THREE.MeshStandardMaterial).color.setHex(product.colours.capHex);
    }
    if (bgMeshRef.current?.material) {
      const mat = bgMeshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uColorDeep.value.set(product.colours.deep);
        mat.uniforms.uColorMid.value.set(product.colours.mid);
        mat.uniforms.uColorHighlight.value.set(product.colours.highlight);
      }
    }
  }, [product]);

  // Initialize Three.js Scene once on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;

    // Renderer - instantiate inside try/catch with optimized settings
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        precision: 'mediump', // Cuts mobile GPU shader load significantly
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(width, height);
    // Cap pixel ratio to 1.25 for crisp visual fidelity without 4x 4K lag
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    const canvasElem = renderer.domElement;
    canvasElem.className = 'w-full h-full block touch-none cursor-grab';
    canvasElem.setAttribute('role', 'presentation');
    canvasElem.setAttribute('aria-hidden', 'true');
    container.appendChild(canvasElem);

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.copy(cameraConfigs.current[activeChapterRef.current - 1]?.pos || cameraConfigs.current[0].pos);
    cameraRef.current = camera;

    // ----------------------------------------------------
    // ULTRA HIGH-PERFORMANCE PROCEDURAL SILK SMOKE SHADER
    // ----------------------------------------------------
    const bgVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.9999, 1.0);
      }
    `;

    const bgFragmentShader = `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform vec3 uColorDeep;
      uniform vec3 uColorMid;
      uniform vec3 uColorHighlight;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.55;
        for (int i = 0; i < 2; ++i) {
          v += a * noise(p);
          p = p * 2.1 + vec2(1.2, 3.4);
          a *= 0.45;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = (uv - 0.5) * 2.0 + uPointer * 0.12;
        float t = uTime * 0.1;

        float q = fbm(p + vec2(t, -t * 0.5));
        float f = fbm(p + 2.5 * q + vec2(1.5, 3.0));

        float dist = length(uv - 0.5);
        float vignette = smoothstep(0.85, 0.2, dist);

        vec3 col = mix(uColorDeep, uColorMid, clamp(f * 2.5, 0.0, 1.0));
        col = mix(col, uColorHighlight, clamp(q * 0.75, 0.0, 1.0));
        col = mix(vec3(0.05, 0.04, 0.035), col, vignette * 0.8);

        gl_FragColor = vec4(col, 0.85);
      }
    `;

    const bgUniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorDeep: { value: new THREE.Color(product.colours.deep) },
      uColorMid: { value: new THREE.Color(product.colours.mid) },
      uColorHighlight: { value: new THREE.Color(product.colours.highlight) },
    };

    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: bgVertexShader,
      fragmentShader: bgFragmentShader,
      uniforms: bgUniforms,
      depthWrite: false,
      depthTest: false,
    });

    const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial);
    bgQuad.renderOrder = -100;
    scene.add(bgQuad);
    bgMeshRef.current = bgQuad;

    // ----------------------------------------------------
    // SCENT PARTICLES (Optimized count for 60 FPS)
    // ----------------------------------------------------
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 4.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc9a96e,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // ----------------------------------------------------
    // LIGHTS
    // ----------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xfff7ea, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.6);
    keyLight.position.set(2.5, 4.0, 3.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xbad7f2, 2.8);
    rimLight.position.set(-3.0, 2.0, -2.5);
    scene.add(rimLight);

    const liquidBackLight = new THREE.PointLight(0xffb86b, 2.2, 6);
    liquidBackLight.position.set(0, 0.1, -1.6);
    scene.add(liquidBackLight);

    // ----------------------------------------------------
    // BOTTLE GEOMETRY
    // ----------------------------------------------------
    const bottleGroup = new THREE.Group();
    bottleGroupRef.current = bottleGroup;
    scene.add(bottleGroup);

    // 1. Crystal Glass Body (Optimized: No heavy offscreen transmission pass)
    const glassWidth = 1.05;
    const glassHeight = 1.35;
    const glassDepth = 0.65;
    const glassRadius = 0.14;

    const shape = new THREE.Shape();
    const x = -glassWidth / 2;
    const y = -glassDepth / 2;
    const w = glassWidth;
    const h = glassDepth;
    const r = glassRadius;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const extrudeSettings = {
      depth: glassHeight,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };

    const glassGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    glassGeometry.center();
    glassGeometry.rotateX(-Math.PI / 2);

    // High performance physical glass with clearcoat reflection and transparency
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.04,
      metalness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      ior: 1.52,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      side: THREE.FrontSide,
      depthWrite: false,
    });

    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    glassMeshRef.current = glassMesh;
    bottleGroup.add(glassMesh);

    // 2. Liquid Chamber
    const liquidShape = new THREE.Shape();
    const lw = glassWidth * 0.82;
    const lh = glassDepth * 0.78;
    const lr = glassRadius * 0.7;
    const lx = -lw / 2;
    const ly = -lh / 2;

    liquidShape.moveTo(lx + lr, ly);
    liquidShape.lineTo(lx + lw - lr, ly);
    liquidShape.quadraticCurveTo(lx + lw, ly, lx + lw, ly + lr);
    liquidShape.lineTo(lx + lw, ly + lh - lr);
    liquidShape.quadraticCurveTo(lx + lw, ly + lh, lx + lw - lr, ly + lh);
    liquidShape.lineTo(lx + lr, ly + lh);
    liquidShape.quadraticCurveTo(lx, ly + lh, lx, ly + lh - lr);
    liquidShape.lineTo(lx, ly + lr);
    liquidShape.quadraticCurveTo(lx, ly, lx + lr, ly);

    const liquidHeight = glassHeight * 0.82;
    const liquidExtrude = {
      depth: liquidHeight,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };

    const liquidGeometry = new THREE.ExtrudeGeometry(liquidShape, liquidExtrude);
    liquidGeometry.center();
    liquidGeometry.rotateX(-Math.PI / 2);
    liquidGeometry.translate(0, -0.06, 0);

    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(product.colours.liquidHex),
      roughness: 0.15,
      metalness: 0.08,
      transparent: true,
      opacity: 0.88,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    });

    const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidMeshRef.current = liquidMesh;
    bottleGroup.add(liquidMesh);

    // 3. Atomizer Collar
    const neckGeometry = new THREE.CylinderGeometry(0.22, 0.24, 0.28, 24);
    const neckMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.22,
    });
    const neckMesh = new THREE.Mesh(neckGeometry, neckMaterial);
    neckMesh.position.y = glassHeight / 2 + 0.12;
    bottleGroup.add(neckMesh);

    const ringGeometry = new THREE.TorusGeometry(0.24, 0.03, 12, 24);
    const ringMesh = new THREE.Mesh(ringGeometry, neckMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = glassHeight / 2 + 0.24;
    bottleGroup.add(ringMesh);

    // 4. Cap
    const capHeight = 0.58;
    const capGeometry = new THREE.CylinderGeometry(0.38, 0.40, capHeight, 24);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(product.colours.capHex),
      metalness: 0.85,
      roughness: 0.25,
    });
    const capMesh = new THREE.Mesh(capGeometry, capMaterial);
    capMesh.position.y = glassHeight / 2 + 0.28 + capHeight / 2;
    capMeshRef.current = capMesh;
    bottleGroup.add(capMesh);

    const crestGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.04, 24);
    const crestMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
    });
    const crestMesh = new THREE.Mesh(crestGeometry, crestMaterial);
    crestMesh.position.y = glassHeight / 2 + 0.28 + capHeight + 0.01;
    bottleGroup.add(crestMesh);

    // 5. Label
    let canvasLabel = labelCanvasRef.current;
    if (!canvasLabel) {
      canvasLabel = document.createElement('canvas');
      canvasLabel.width = 1024;
      canvasLabel.height = 512;
      labelCanvasRef.current = canvasLabel;
    }
    updateLabelTexture(product.name, engravingText, product.family);

    const labelTexture = new THREE.CanvasTexture(canvasLabel);
    labelTextureRef.current = labelTexture;

    const labelGeometry = new THREE.PlaneGeometry(0.78, 0.54);
    const labelMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.45,
      metalness: 0.08,
      transparent: true,
      side: THREE.FrontSide,
    });
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    labelMesh.position.set(0, -0.04, glassDepth / 2 + 0.055);
    labelMeshRef.current = labelMesh;
    bottleGroup.add(labelMesh);

    // 6. Pedestal & Contact Shadow Plane (Fast & zero draw call penalty)
    const pedestalGeo = new THREE.CylinderGeometry(1.8, 1.9, 0.35, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x181512,
      roughness: 0.85,
      metalness: 0.1,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = -glassHeight / 2 - 0.22;
    bottleGroup.add(pedestalMesh);

    const shadowGeo = new THREE.PlaneGeometry(2.8, 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x050403,
      transparent: true,
      opacity: 0.65,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -glassHeight / 2 - 0.04;
    bottleGroup.add(shadowMesh);

    // ----------------------------------------------------
    // POINTER & DRAG LISTENERS
    // ----------------------------------------------------
    const onPointerDown = (e: PointerEvent) => {
      if (!interactiveRef.current) return;
      isDragging.current = true;
      setIsInteracting(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      try {
        canvasElem.setPointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.current.x = nx;
      pointer.current.y = ny;

      if (isDragging.current && interactiveRef.current) {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        rotation.current.velY = deltaX * 0.008;
        rotation.current.velX = deltaY * 0.005;
        rotation.current.targetY += deltaX * 0.008;
        rotation.current.targetX = Math.max(-0.4, Math.min(0.4, rotation.current.targetX + deltaY * 0.005));
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging.current = false;
      setIsInteracting(false);
      try {
        canvasElem.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    };

    const onClick = () => {
      if (onBottleClickRef.current) {
        onBottleClickRef.current();
      }
    };

    canvasElem.addEventListener('pointerdown', onPointerDown);
    canvasElem.addEventListener('pointermove', onPointerMove);
    canvasElem.addEventListener('pointerup', onPointerUp);
    canvasElem.addEventListener('pointercancel', onPointerUp);
    canvasElem.addEventListener('click', onClick);

    // ----------------------------------------------------
    // INTERSECTION OBSERVER: PAUSE WHEN SCROLLED OUT OF VIEW
    // ----------------------------------------------------
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ----------------------------------------------------
    // RENDER LOOP (With Viewport & Tab Sleep)
    // ----------------------------------------------------
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animFrameId.current = requestAnimationFrame(renderLoop);

      // Save 100% of GPU rendering cycles when scrolled away or tab hidden
      if (!isVisibleRef.current || document.hidden) {
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      if (bgMaterial.uniforms) {
        bgMaterial.uniforms.uTime.value = elapsedTime;
        bgMaterial.uniforms.uPointer.value.lerp(
          new THREE.Vector2(pointer.current.x, pointer.current.y),
          0.05
        );
      }

      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += 0.003;
          if (positions[i * 3 + 1] > 2.5) {
            positions[i * 3 + 1] = -2.5;
          }
          positions[i * 3 + 0] += Math.sin(elapsedTime * 0.8 + i) * 0.001;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smooth camera transition to target chapter config
      const targetConfig =
        cameraConfigs.current[activeChapterRef.current - 1] || cameraConfigs.current[0];
      camera.position.lerp(targetConfig.pos, 0.06);
      camera.lookAt(targetConfig.target);

      // Interactive rotation dampening
      if (interactiveRef.current) {
        if (!isDragging.current) {
          rotation.current.targetY += 0.0025;
          rotation.current.velX *= 0.92;
          rotation.current.velY *= 0.92;
          rotation.current.targetX += rotation.current.velX;
          rotation.current.targetY += rotation.current.velY;
        }

        rotation.current.x += (rotation.current.targetX - rotation.current.x) * 0.08;
        rotation.current.y += (rotation.current.targetY - rotation.current.y) * 0.08;

        const targetRotX = rotation.current.x + pointer.current.y * 0.15;
        const targetRotY = rotation.current.y + pointer.current.x * 0.25;

        bottleGroup.rotation.x = targetRotX;
        bottleGroup.rotation.y = targetRotY;

        bottleGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.025;
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      canvasElem.removeEventListener('pointerdown', onPointerDown);
      canvasElem.removeEventListener('pointermove', onPointerMove);
      canvasElem.removeEventListener('pointerup', onPointerUp);
      canvasElem.removeEventListener('pointercancel', onPointerUp);
      canvasElem.removeEventListener('click', onClick);

      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      renderer.forceContextLoss();

      if (container.contains(canvasElem)) {
        container.removeChild(canvasElem);
      }

      glassGeometry.dispose();
      glassMaterial.dispose();
      liquidGeometry.dispose();
      liquidMaterial.dispose();
      neckGeometry.dispose();
      neckMaterial.dispose();
      capGeometry.dispose();
      capMaterial.dispose();
      labelGeometry.dispose();
      labelMaterial.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      bgMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      {/* Fallback poster image if WebGL is unsupported */}
      {!webglSupported && (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#0d0b09]">
          <img
            src={product.image}
            alt={`${product.name} — Haute Parfumerie Flacon`}
            className="max-h-[80%] max-w-[80%] object-contain filter drop-shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Floating 3D Interaction Hint Badge */}
      {interactive && isHovered && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300 bg-[#0d0b09]/80 backdrop-blur-md px-4 py-1.5 border border-[#c9a96e]/30 rounded-full flex items-center gap-2 text-xs tracking-widest text-[#f3ede4] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-pulse" />
          <span>{isInteracting ? 'Inspecting 360°' : 'Drag to inspect 360°'}</span>
        </div>
      )}

      {/* Real-time Monogram Engraving Overlay Callout */}
      {engravingText && engravingText.trim().length > 0 && (
        <div className="absolute top-6 right-6 pointer-events-none bg-[#0d0b09]/85 backdrop-blur-md px-4 py-2 border border-[#c9a96e]/40 rounded-sm text-right">
          <p className="text-[10px] uppercase tracking-widest text-[#8a8278]">Bespoke Engraving</p>
          <p className="font-serif text-sm tracking-wider text-[#c9a96e]">❝ {engravingText.toUpperCase()} ❞</p>
        </div>
      )}
    </div>
  );
};
