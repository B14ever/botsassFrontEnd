"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 190;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle nodes configuration
    const particleCount = 120;
    const maxDistance = 42;
    const coords = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    const radius = 120;
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * Math.cbrt(Math.random());

      coords[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      coords[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      coords[i * 3 + 2] = r * Math.cos(phi) * 0.85;

      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.12,
          (Math.random() - 0.5) * 0.12,
          (Math.random() - 0.5) * 0.12
        )
      );
    }

    // Node Points
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(coords, 3));

    // Refined subtle node glow texture
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      gradient.addColorStop(0, "rgba(240, 240, 245, 1)");
      gradient.addColorStop(0.3, "rgba(200, 210, 230, 0.7)");
      gradient.addColorStop(0.7, "rgba(140, 150, 180, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xe2e8f0,
      size: 4,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointCloud);

    // Connecting Lines
    const maxLines = (particleCount * (particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    linesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineSegments = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lineSegments);

    // Mouse Tracking with smooth interpolation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 30;
      targetY = (e.clientY / window.innerHeight - 0.5) * -30;
    };

    const onScroll = () => {
      targetScrollY = window.scrollY * 0.04;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera motion
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;
      scrollY += (targetScrollY - scrollY) * 0.05;

      camera.position.x = mouseX * 0.5;
      camera.position.y = mouseY * 0.5;
      camera.position.z = 190 + Math.sin(elapsedTime * 0.3) * 4;
      camera.lookAt(0, 0, 0);

      // Rotate point cloud gently
      pointCloud.rotation.y = elapsedTime * 0.03 + scrollY * 0.01;
      pointCloud.rotation.x = Math.sin(elapsedTime * 0.015) * 0.08;
      lineSegments.rotation.y = pointCloud.rotation.y;
      lineSegments.rotation.x = pointCloud.rotation.x;

      // Update node positions
      const positions = pointsGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        positions[i3 + 2] += velocities[i].z;

        // Bounce back if exceeding bounding sphere
        const dist = Math.hypot(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        if (dist > radius) {
          velocities[i].negate();
        }
      }
      pointsGeometry.attributes.position.needsUpdate = true;

      // Rebuild lines between close particles
      let lineIndex = 0;
      let colorIndex = 0;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x1 = positions[i3];
        const y1 = positions[i3 + 1];
        const z1 = positions[i3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const x2 = positions[j3];
          const y2 = positions[j3 + 1];
          const z2 = positions[j3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = Math.pow(1 - dist / maxDistance, 2) * 0.45;

            // Subtle monochrome pulse along lines
            const pulse = (Math.sin(elapsedTime * 2 + (i + j) * 0.4) + 1) * 0.5;
            const r = (0.7 + pulse * 0.25) * alpha;
            const g = (0.75 + pulse * 0.2) * alpha;
            const b = (0.85 + pulse * 0.15) * alpha;

            linePositions[lineIndex++] = x1;
            linePositions[lineIndex++] = y1;
            linePositions[lineIndex++] = z1;
            linePositions[lineIndex++] = x2;
            linePositions[lineIndex++] = y2;
            linePositions[lineIndex++] = z2;

            lineColors[colorIndex++] = r;
            lineColors[colorIndex++] = g;
            lineColors[colorIndex++] = b;
            lineColors[colorIndex++] = r;
            lineColors[colorIndex++] = g;
            lineColors[colorIndex++] = b;
          }
        }
      }

      linesGeometry.setDrawRange(0, lineIndex / 3);
      linesGeometry.attributes.position.needsUpdate = true;
      linesGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      texture.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ?? "fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50 dark:opacity-40"}
      aria-hidden="true"
      style={{
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 90%)",
      }}
    />
  );
}
