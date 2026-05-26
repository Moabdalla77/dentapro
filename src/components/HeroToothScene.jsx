import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroToothScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return undefined;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.25, 5.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Lightweight abstract tooth: one enamel body plus two soft roots.
    const enamel = new THREE.MeshPhysicalMaterial({
      color: '#fff7ea',
      roughness: 0.34,
      metalness: 0,
      clearcoat: 0.55,
      transmission: 0.08,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: '#d9f2f0',
      roughness: 0.35,
      metalness: 0.08,
    });

    const crown = new THREE.Mesh(new THREE.SphereGeometry(1.05, 48, 48), enamel);
    crown.scale.set(1.05, 0.92, 0.82);
    crown.position.y = 0.52;
    group.add(crown);

    const rootGeometry = new THREE.CapsuleGeometry(0.34, 1.1, 8, 24);
    const leftRoot = new THREE.Mesh(rootGeometry, enamel);
    leftRoot.position.set(-0.32, -0.58, 0);
    leftRoot.rotation.z = 0.18;
    group.add(leftRoot);

    const rightRoot = new THREE.Mesh(rootGeometry, enamel);
    rightRoot.position.set(0.32, -0.58, 0);
    rightRoot.rotation.z = -0.18;
    group.add(rightRoot);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.018, 12, 96), accent);
    ring.rotation.x = Math.PI / 2.15;
    group.add(ring);

    scene.add(new THREE.AmbientLight('#ffffff', 1.45));
    const keyLight = new THREE.DirectionalLight('#fffdf6', 2.2);
    keyLight.position.set(2.2, 3.5, 4);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight('#2aa7a0', 1.2, 8);
    fillLight.position.set(-2, -1, 2);
    scene.add(fillLight);

    let frameId;
    const animate = () => {
      group.rotation.y += 0.006;
      group.rotation.x = Math.sin(Date.now() * 0.001) * 0.06;
      ring.rotation.z += 0.004;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      crown.geometry.dispose();
      leftRoot.geometry.dispose();
      rightRoot.geometry.dispose();
      ring.geometry.dispose();
      enamel.dispose();
      accent.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero-tooth-scene" aria-hidden="true" />;
}
