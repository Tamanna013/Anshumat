"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import { Suspense } from "react";
import { BudgetShapes } from "./BudgetShapes";

export function ThreeDBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4F46E5" />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#EC4899"
        />

        {/* Floating 3D Shapes */}
        <BudgetShapes />

        {/* Simple 3D Text without font file */}
        <Text
          position={[0, -3, -15]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          BUDGETBOX
        </Text>

        {/* Subtle orbit controls for interactivity */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

        {/* Fog for depth */}
        <fog attach="fog" args={["#000", 5, 20]} />
      </Suspense>
    </Canvas>
  );
}
