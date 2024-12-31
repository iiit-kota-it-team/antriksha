"use client";
import { extend } from "@react-three/fiber";
import React, { Suspense } from "react";
import * as THREE from "three"; // Import the entire THREE.js namespace
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Extend the THREE namespace to include BoxGeometry
extend({ BoxGeometry: THREE.BoxGeometry });

export default function Page() {
  return (
    <main style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          {/* Using BoxGeometry */}
          <mesh>
            <boxGeometry args={[2, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </main>
  );
}
