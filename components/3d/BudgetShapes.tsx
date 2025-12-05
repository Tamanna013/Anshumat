"use client";

import { useRef, useMemo } from "react";
import { Mesh, Color } from "three";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

interface ShapeData {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  rotationSpeed: [number, number, number];
  shape: "cube" | "sphere" | "cone" | "torus" | "cylinder";
}

export function BudgetShapes() {
  const shapesRef = useRef<Mesh[]>([]);

  // Different shapes representing budget categories
  const shapes: ShapeData[] = useMemo(
    () => [
      // Income (Golden sphere)
      {
        position: [-4, 2, -2],
        scale: 1,
        color: "#FBBF24",
        speed: 0.5,
        rotationSpeed: [0.01, 0.02, 0],
        shape: "sphere",
      },

      // Bills (Blue cube)
      {
        position: [3, 1, -4],
        scale: 0.8,
        color: "#3B82F6",
        speed: 0.3,
        rotationSpeed: [0.02, 0, 0.01],
        shape: "cube",
      },

      // Food (Green torus)
      {
        position: [-2, -1, -6],
        scale: 0.6,
        color: "#10B981",
        speed: 0.4,
        rotationSpeed: [0, 0.02, 0.01],
        shape: "torus",
      },

      // Transport (Red cone)
      {
        position: [5, -2, -3],
        scale: 0.7,
        color: "#EF4444",
        speed: 0.6,
        rotationSpeed: [0.01, 0.01, 0.02],
        shape: "cone",
      },

      // Subscriptions (Purple cylinder)
      {
        position: [0, 3, -5],
        scale: 0.5,
        color: "#8B5CF6",
        speed: 0.7,
        rotationSpeed: [0.02, 0.02, 0],
        shape: "cylinder",
      },

      // Savings (Teal dodecahedron)
      {
        position: [-3, -3, -7],
        scale: 0.9,
        color: "#06B6D4",
        speed: 0.8,
        rotationSpeed: [0.01, 0, 0.02],
        shape: "sphere",
      },
    ],
    []
  );

  useFrame((state) => {
    shapesRef.current.forEach((mesh, i) => {
      if (mesh) {
        const shape = shapes[i];
        mesh.rotation.x += shape.rotationSpeed[0];
        mesh.rotation.y += shape.rotationSpeed[1];
        mesh.rotation.z += shape.rotationSpeed[2];

        // Subtle floating animation
        mesh.position.y =
          shape.position[1] +
          Math.sin(state.clock.elapsedTime * shape.speed) * 0.3;
      }
    });
  });

  const renderShape = (shapeType: ShapeData["shape"], props: any) => {
    switch (shapeType) {
      case "cube":
        return <boxGeometry args={[1, 1, 1]} />;
      case "sphere":
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case "cone":
        return <coneGeometry args={[0.5, 1, 32]} />;
      case "torus":
        return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
      case "cylinder":
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <>
      {shapes.map((shape, i) => (
        <Float
          key={i}
          speed={shape.speed}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <mesh
            ref={(el) => {
              if (el) shapesRef.current[i] = el;
            }}
            position={shape.position}
            scale={shape.scale}
          >
            {renderShape(shape.shape, shape)}
            <meshStandardMaterial
              color={new Color(shape.color)}
              emissive={new Color(shape.color)}
              emissiveIntensity={0.2}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}
