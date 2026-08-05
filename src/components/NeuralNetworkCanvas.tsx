import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { subscribe } from '../theme';

/**
 * Reads a color token from the stylesheet so the scene stays in sync with the
 * design system instead of carrying its own hex literals. Falls back to the
 * dark-theme value if the variable is missing (e.g. during a hot reload).
 */
const readColor = (token: string, fallback: number): number => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  if (!raw) return fallback;
  try {
    return new THREE.Color(raw).getHex();
  } catch {
    return fallback;
  }
};

/**
 * Scene palette. The four node layers walk the brand ramp
 * blue → blue → purple → green; the rim lights pick up primary and tertiary.
 * `-on-inverse` variants are used for the node bodies because the canvas is
 * transparent over both a light and a dark page and needs the saturated end of
 * the ramp to stay visible either way.
 */
const readScenePalette = () => ({
  layers: [
    readColor('--ui-accent-primary-on-inverse', 0x4f9ddb),
    readColor('--ui-accent-primary', 0x4f9ddb),
    readColor('--ui-accent-tertiary', 0x8b4fdb),
    readColor('--ui-accent-secondary-on-inverse', 0x4fdb8b),
  ],
  rimLight: readColor('--ui-accent-primary-on-inverse', 0x4f9ddb),
  fillLight: readColor('--ui-accent-tertiary', 0x8b4fdb),
  edge: readColor('--ui-text-muted', 0x7c8695),
});

export const NeuralNetworkCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Always-empty host that React owns but never renders children into, so the
  // imperatively appended <canvas> can never collide with reconciliation.
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // Animation values & interaction references
  const isHoveredRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const parallaxRef = useRef({ x: 0, y: 0 });
  const scrollRatioRef = useRef(1.0); // 1.0 means fully visible, 0.0 means out of view

  useEffect(() => {
    if (!containerRef.current || !canvasHostRef.current) return;

    const container = containerRef.current;

    // The canvas is created here rather than in JSX so that each run of this
    // effect owns its own element. Cleanup calls renderer.forceContextLoss(),
    // which permanently kills a canvas's WebGL context — on a JSX-owned canvas
    // the element survives StrictMode's mount/unmount/mount cycle in dev, and
    // the second WebGLRenderer would be handed the dead context and throw,
    // taking the whole React tree down with it and blanking the site.
    const canvas = document.createElement('canvas');
    canvas.id = 'neural-network-canvas-webgl';
    canvas.className = 'w-full h-full block focus:outline-none';
    canvas.style.pointerEvents = 'auto';
    canvasHostRef.current.appendChild(canvas);

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight || 500;

    // Setup Scene
    const scene = new THREE.Scene();

    // Setup Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9);

    // Setup Renderer with alpha support for transparent backdrop
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.62);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    let palette = readScenePalette();

    // Brand-blue rim light to match the glass cube reference edge glow
    const pointLightBlue = new THREE.PointLight(palette.rimLight, 4, 15);
    pointLightBlue.position.set(-4, 3, -5);
    scene.add(pointLightBlue);

    // Purple fill underneath
    const pointLightCyan = new THREE.PointLight(palette.fillLight, 2, 12);
    pointLightCyan.position.set(4, -3, 4);
    scene.add(pointLightCyan);

    // Create the Neural Network group
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Nodes definition: 4 Layers forming a 3D Cube (each with a 3x3 = 9 node grid)
    // Layer X bounds, count, color details
    const layersConfig = [
      { id: 0, x: -1.8, nodesCount: 9, color: palette.layers[0] }, // Brand blue
      { id: 1, x: -0.6, nodesCount: 9, color: palette.layers[1] }, // Brand blue (themed)
      { id: 2, x: 0.6, nodesCount: 9, color: palette.layers[2] },  // Brand purple
      { id: 3, x: 1.8, nodesCount: 9, color: palette.layers[3] }   // Brand green
    ];

    const nodesData: Array<{
      mesh: THREE.Mesh;
      layerId: number;
      baseColor: number;
      pulseOffset: number;
      x: number;
      y: number;
      z: number;
      r: number;
      c: number;
    }> = [];

    // Helper to produce a unique refractive glass-like material
    const getGlassMaterial = (colorHex: number) => {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorHex),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.5,
        thickness: 0.5,
        reflectivity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05, // super glossy
      });
    };

    // Instantiate Sphere Nodes in a precise 3D grid structure
    const sphereGeometry = new THREE.SphereGeometry(0.18, 32, 16);

    layersConfig.forEach((layer) => {
      // Create a 3x3 grid on the Y and Z axes for each layer
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const material = getGlassMaterial(layer.color);
          const nodeMesh = new THREE.Mesh(sphereGeometry, material);

          const xPos = layer.x;
          const yPos = (r - 1.0) * 1.2;
          const zPos = (c - 1.0) * 1.2;

          nodeMesh.position.set(xPos, yPos, zPos);
          networkGroup.add(nodeMesh);

          nodesData.push({
            mesh: nodeMesh,
            layerId: layer.id,
            baseColor: layer.color,
            pulseOffset: Math.random() * Math.PI * 2,
            x: xPos,
            y: yPos,
            z: zPos,
            r,
            c
          });
        }
      }
    });

    // Create Edges/Connections
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: palette.edge,
      opacity: 0.35,
      transparent: true
    });

    const linesGroup = new THREE.Group();
    networkGroup.add(linesGroup);

    // Feedforward Connection Pattern (fully-connected layer to layer)
    for (let l = 0; l < 3; l++) {
      const currentLayerNodes = nodesData.filter(n => n.layerId === l);
      const nextLayerNodes = nodesData.filter(n => n.layerId === l + 1);

      currentLayerNodes.forEach((currNode) => {
        nextLayerNodes.forEach((nextNode) => {
          const points = [
            new THREE.Vector3(currNode.mesh.position.x, currNode.mesh.position.y, currNode.mesh.position.z),
            new THREE.Vector3(nextNode.mesh.position.x, nextNode.mesh.position.y, nextNode.mesh.position.z)
          ];
          const edgeGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(edgeGeometry, edgeMaterial);
          linesGroup.add(line);
        });
      });
    }

    // Set loading false
    setLoading(false);

    // Raycaster for hover targeting
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();
    let currentlyHoveredNode: typeof nodesData[0] | null = null;

    // Trigger glowing signal beams to move down the connections recursively to the end of the network
    const triggerSignalBeams = (sourceNode: typeof nodesData[0]) => {
      const l = sourceNode.layerId;
      if (l >= 3) {
        // Last layer has no next layers, so we pulse it bright white
        const targetMat = sourceNode.mesh.material as THREE.MeshPhysicalMaterial;
        const origColor = sourceNode.baseColor;
        targetMat.color.setHex(0xFFFFFF);
        gsap.killTweensOf(sourceNode.mesh.scale);
        gsap.timeline()
          .to(sourceNode.mesh.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 0.15, ease: "power2.out" })
          .to(sourceNode.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.25, ease: "power2.in", onComplete: () => {
            targetMat.color.setHex(origColor);
          }});
        return;
      }

      const nextLayerNodes = nodesData.filter(n => n.layerId === l + 1);

      // Pulse the active source node
      const sourceMat = sourceNode.mesh.material as THREE.MeshPhysicalMaterial;
      const sourceOrigColor = sourceNode.baseColor;
      sourceMat.color.setHex(0xFFFFFF);
      
      gsap.killTweensOf(sourceNode.mesh.scale);
      gsap.timeline()
        .to(sourceNode.mesh.scale, { x: 1.7, y: 1.7, z: 1.7, duration: 0.15, ease: "power2.out" })
        .to(sourceNode.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2, ease: "power2.in", onComplete: () => {
          sourceMat.color.setHex(sourceOrigColor);
        }});

      // For every target node in the next layer, launch a glowing white photon beam
      nextLayerNodes.forEach((nextNode, index) => {
        // Create individual geometry & material to clean up properly
        const beamGeo = new THREE.SphereGeometry(0.065, 8, 8);
        const beamMat = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          transparent: true,
          opacity: 1.0
        });

        const beamMesh = new THREE.Mesh(beamGeo, beamMat);
        const startPos = new THREE.Vector3(sourceNode.mesh.position.x, sourceNode.mesh.position.y, sourceNode.mesh.position.z);
        const endPos = new THREE.Vector3(nextNode.mesh.position.x, nextNode.mesh.position.y, nextNode.mesh.position.z);

        beamMesh.position.copy(startPos);
        networkGroup.add(beamMesh);

        // Slightly stagger the propagation start times of different index slots for elegant fluid visual layering
        const delay = index * 0.015;

        gsap.to(beamMesh.position, {
          x: endPos.x,
          y: endPos.y,
          z: endPos.z,
          duration: 0.65,
          delay: delay,
          ease: "power2.out",
          onComplete: () => {
            // Remove from rendering and dispose components free from memory leaks
            networkGroup.remove(beamMesh);
            beamGeo.dispose();
            beamMat.dispose();

            // Recursively ignite the next node and cascade to the next layer
            triggerSignalBeams(nextNode);
          }
        });
      });
    };

    // Ambient idle rotation: yaw only, so it reads as a turntable rather than a
    // tumble. ~0.048 rad/s — a full revolution takes a bit over two minutes.
    // Suppressed entirely for visitors who ask for reduced motion.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AMBIENT_SPIN_PER_FRAME = prefersReducedMotion ? 0 : 0.0012;

    // Let's create drag state and listeners to support grabbing and manual rotation with inertia
    const dragRotation = { x: 0.45, y: 0.7, z: 0.35 };
    let isDragging = false;
    let hasDragged = false;
    const startPointer = { x: 0, y: 0 };
    let velocityY = 0;
    let velocityX = 0;

    const handlePointerDown = (event: PointerEvent) => {
      // Only capture mouse left clicks or touch gestures
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      isDragging = true;
      hasDragged = false;
      velocityY = 0;
      velocityX = 0;
      startPointer.x = event.clientX;
      startPointer.y = event.clientY;
      container.style.cursor = 'grabbing';
      
      try {
        container.setPointerCapture(event.pointerId);
      } catch (e) {
        // Fallback
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      // Collect pointer coordinates relative to NDC for continuous light parallax
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / width) * 2 - 1;
      const y = -((event.clientY - rect.top) / height) * 2 + 1;
      mouseRef.current = { x, y };
      mouseVector.x = x;
      mouseVector.y = y;

      if (!isDragging) return;

      const dx = event.clientX - startPointer.x;
      const dy = event.clientY - startPointer.y;

      // Threshold to filter tap vs drag
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasDragged = true;
      }

      // Elegant rotational speed factor
      const sensitivity = 0.006;
      dragRotation.y += dx * sensitivity;
      dragRotation.x += dy * sensitivity;

      // Track relative movement as rotational velocities for momentum
      velocityY = dx * sensitivity;
      velocityX = dy * sensitivity;

      startPointer.x = event.clientX;
      startPointer.y = event.clientY;
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';

      try {
        container.releasePointerCapture(event.pointerId);
      } catch (e) {}

      // If they only did a tap/click, trigger node activation forward cascade signals
      if (!hasDragged) {
        const rect = container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / width) * 2 - 1;
        const y = -((event.clientY - rect.top) / height) * 2 + 1;

        const clickRaycaster = new THREE.Raycaster();
        const clickMouse = new THREE.Vector2(x, y);
        clickRaycaster.setFromCamera(clickMouse, camera);
        const intersects = clickRaycaster.intersectObjects(nodesData.map(n => n.mesh));

        if (intersects.length > 0) {
          const primaryHit = intersects[0].object as THREE.Mesh;
          const clickedNode = nodesData.find(n => n.mesh === primaryHit);

          if (clickedNode) {
            triggerSignalBeams(clickedNode);
          }
        }
      }
    };

    const handlePointerEnter = () => {
      isHoveredRef.current = true;
    };

    const handlePointerLeave = () => {
      isHoveredRef.current = false;
      // Reset raycasted node highlights
      if (currentlyHoveredNode) {
        const material = currentlyHoveredNode.mesh.material as THREE.MeshPhysicalMaterial;
        material.color.setHex(currentlyHoveredNode.baseColor);
        gsap.to(currentlyHoveredNode.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        currentlyHoveredNode = null;
      }
    };

    // Repaint the existing materials when the theme flips. Deliberately NOT a
    // dependency of this effect: re-running it would tear down and rebuild the
    // whole WebGL scene on every toggle.
    const unsubscribeTheme = subscribe(() => {
      palette = readScenePalette();

      pointLightBlue.color.setHex(palette.rimLight);
      pointLightCyan.color.setHex(palette.fillLight);
      edgeMaterial.color.setHex(palette.edge);

      nodesData.forEach((node) => {
        const nextColor = palette.layers[node.layerId] ?? node.baseColor;
        // baseColor must be updated too — the hover reset and the beam cascade
        // both restore from it, so a stale value repaints in the old palette.
        node.baseColor = nextColor;
        // Skip the hovered node: it is currently white by design and will pick
        // up the new baseColor when the pointer leaves.
        if (currentlyHoveredNode?.mesh !== node.mesh) {
          (node.mesh.material as THREE.MeshPhysicalMaterial).color.setHex(nextColor);
        }
      });
    });

    // Setup IntersectionObserver to throttle animation when out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        scrollRatioRef.current = entry.intersectionRatio;
      });
    }, { threshold: [0.0, 0.05, 0.1, 0.3, 0.5, 1.0] });

    observer.observe(container);

    // Set elegant initial 3D orientation tilt to make depth visible
    networkGroup.rotation.order = 'YXZ';
    networkGroup.rotation.y = dragRotation.y;
    networkGroup.rotation.x = dragRotation.x;
    networkGroup.rotation.z = dragRotation.z;

    let clock = new THREE.Clock();

    // Scroll responsive zoom and expansion values
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const handleScroll = (e?: Event) => {
      let scrollTop = window.scrollY;
      if (e && (e as CustomEvent).detail && typeof (e as CustomEvent).detail.scrollY === 'number') {
        scrollTop = (e as CustomEvent).detail.scrollY;
      }
      const threshold = 650; // Distance over which the zoom occurs
      targetScrollProgress = Math.min(Math.max(scrollTop / threshold, 0), 1.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('smoothscroll', handleScroll, { passive: true });

    // GSAP scale emergence on mount (starts subtle and expands)
    const emergence = { scale: 0.6 };
    const scaleTween = gsap.to(emergence, {
      scale: 1.0,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.2
    });

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Save computing cycles if section is hidden
      if (scrollRatioRef.current < 0.05) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      // The loop bails out early while off-screen without reading the clock, so the
      // first delta after it comes back can be seconds long. Cap it, otherwise the
      // lerps below overshoot and the whole scene visibly snaps.
      const relativeTimeSpeed = Math.min(delta / (1 / 60) || 1.0, 3.0);

      // Detect device category for styling and scaling responsiveness
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const deviceScale = isMobile ? 0.55 : (isTablet ? 0.75 : 1.0);

      // Dampened lerp for butter-smooth scroll responsive animation
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08 * relativeTimeSpeed;

      // 1. SCROLL ZOOM & EXPANSION
      // Expand spacing and scale up the cubic object to fill the screen
      const scrollScale = 1.0 + currentScrollProgress * 1.5;
      const finalScale = emergence.scale * scrollScale * deviceScale;
      networkGroup.scale.set(finalScale, finalScale, finalScale);

      // Move camera closer and Zoom past the cubic object
      const baseCameraZ = 9.0;
      camera.position.z = baseCameraZ - currentScrollProgress * 11.5;

      // 2. MOUSE PARALLAX & DETAILED TILT LERP (smooth, subtly responsive to mouse movements)
      parallaxRef.current.x += (mouseRef.current.x * 0.12 - parallaxRef.current.x) * 0.03 * relativeTimeSpeed;
      parallaxRef.current.y += (mouseRef.current.y * 0.08 - parallaxRef.current.y) * 0.03 * relativeTimeSpeed;
      
      // Calculate responsive horizontal offset (shift right on desktop screens, center on mobile)
      // As scroll progress increases, decrease the offset to bring it into center for full-screen zoom
      const maxOffset = isMobile ? 0 : (isTablet ? 0.8 : 2.0);
      const currentOffset = maxOffset * (1.5 - Math.min(currentScrollProgress, 1.0) * 3.5);

      networkGroup.position.x = parallaxRef.current.x + currentOffset;
      networkGroup.position.y = parallaxRef.current.y + 0.5;

      // If we are not actively dragging, apply momentum velocities and simulate friction
      if (!isDragging) {
        dragRotation.y += velocityY * relativeTimeSpeed;
        dragRotation.x += velocityX * relativeTimeSpeed;

        // Elegant dampening (95% retention per frame)
        velocityY *= Math.pow(0.95, relativeTimeSpeed);
        velocityX *= Math.pow(0.95, relativeTimeSpeed);

        // Clamp to absolute zero below threshold
        if (Math.abs(velocityY) < 0.0001) velocityY = 0;
        if (Math.abs(velocityX) < 0.0001) velocityX = 0;

        // Ambient turntable drift. Folded into dragRotation rather than applied
        // separately so it composes with momentum and continues from wherever
        // the user last left the object, instead of fighting their drag.
        dragRotation.y += AMBIENT_SPIN_PER_FRAME * relativeTimeSpeed;
      }

      // Responsive mouse rotation tilt with manual drag rotation incorporated seamlessly
      networkGroup.rotation.y = dragRotation.y + parallaxRef.current.x * 0.25;
      networkGroup.rotation.x = dragRotation.x - parallaxRef.current.y * 0.25;
      networkGroup.rotation.z = dragRotation.z;

      // 3. NODE PULSE & SINUSOIDAL MOTION
      nodesData.forEach((node) => {
        const pulseRatio = Math.sin(elapsedTime * 1.8 + node.pulseOffset);
        // Soft ±3.5% scale vibration
        const pulseScale = 1.0 + pulseRatio * 0.035;
        
        // If it isn't currently hovered, apply the base pulse scale
        if (currentlyHoveredNode?.mesh !== node.mesh) {
          node.mesh.scale.set(pulseScale, pulseScale, pulseScale);
        }
      });

      // 4. RAYCAST HOVER CASTING
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(nodesData.map(n => n.mesh));

      if (intersects.length > 0) {
        const primaryHit = intersects[0].object as THREE.Mesh;
        const matchedNode = nodesData.find(n => n.mesh === primaryHit);

        if (matchedNode && matchedNode !== currentlyHoveredNode) {
          // Reset previous
          if (currentlyHoveredNode) {
            const mat = currentlyHoveredNode.mesh.material as THREE.MeshPhysicalMaterial;
            mat.color.setHex(currentlyHoveredNode.baseColor);
            gsap.to(currentlyHoveredNode.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.25 });
          }

          // Active new
          currentlyHoveredNode = matchedNode;
          const matchedMat = matchedNode.mesh.material as THREE.MeshPhysicalMaterial;
          // Emphasize with brighter white highlight
          matchedMat.color.setHex(0xFFFFFF);
          
          container.style.cursor = 'pointer';

          gsap.to(matchedNode.mesh.scale, {
            x: 1.45,
            y: 1.45,
            z: 1.45,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      } else {
        // Reset hovered state if targeting space
        if (currentlyHoveredNode) {
          const mat = currentlyHoveredNode.mesh.material as THREE.MeshPhysicalMaterial;
          mat.color.setHex(currentlyHoveredNode.baseColor);
          
          container.style.cursor = isDragging ? 'grabbing' : 'grab';

          gsap.to(currentlyHoveredNode.mesh.scale, {
            x: 1.0,
            y: 1.0,
            z: 1.0,
            duration: 0.3,
            ease: "power2.out"
          });
          currentlyHoveredNode = null;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 500;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointercancel', handlePointerUp);
    container.addEventListener('mouseenter', handlePointerEnter);
    container.addEventListener('mouseleave', handlePointerLeave);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      observer.disconnect();
      unsubscribeTheme();
      scaleTween.kill();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('smoothscroll', handleScroll);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointercancel', handlePointerUp);
      container.removeEventListener('mouseenter', handlePointerEnter);
      container.removeEventListener('mouseleave', handlePointerLeave);

      // Stop every in-flight tween first: the beam tweens hold onComplete callbacks
      // that re-add meshes to a scene we are about to tear down.
      gsap.killTweensOf(nodesData.map(n => n.mesh.scale));
      networkGroup.traverse((obj) => {
        gsap.killTweensOf(obj.position);
        gsap.killTweensOf(obj.scale);
      });

      // The component remounts on every navigation back to Home, so GPU-side
      // buffers must be released explicitly or each visit leaks a WebGL context.
      networkGroup.traverse((obj) => {
        const mesh = obj as THREE.Mesh | THREE.Line;
        if ((mesh as THREE.Mesh).isMesh || (mesh as THREE.Line).isLine) {
          mesh.geometry?.dispose();
          const material = mesh.material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material?.dispose();
          }
        }
      });
      sphereGeometry.dispose();
      edgeMaterial.dispose();

      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      // Safe because this canvas belongs to this effect run and is discarded here.
      canvas.remove();
    };
  }, []);

  return (
    <div
      id="neural-network-canvas-container"
      ref={containerRef}
      className="relative w-full h-full min-h-[420px] md:min-h-[550px] flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
    >
      {/* Background soft ambient halo blur disc inside right column container */}
      <div 
        id="network-glow-disc" 
        className="absolute w-[70%] h-[70%] rounded-full opacity-60 z-0 bg-[radial-gradient(circle,var(--ui-accent-primary-dim)_0%,transparent_70%)] pointer-events-none"
      />
      
      {loading && (
        <div id="canvas-loader" className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10 pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Compiling Nodes...</span>
        </div>
      )}

      {/* The effect appends its <canvas> in here; React keeps this node empty. */}
      <div ref={canvasHostRef} className="relative z-10 w-full h-full" />
    </div>
  );
};
