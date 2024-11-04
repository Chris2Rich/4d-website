import React, { useRef, useMemo } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"

export default function QHtml ({ points, children }) {
    const g = new THREE.BufferGeometry()
    
    const vertices = new Float32Array(points.flat())
    
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
    
    g.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
    g.setIndex(new THREE.BufferAttribute(indices, 1))
    g.computeVertexNormals()

    const center = useMemo(() => {
      const x = points.reduce((sum, point) => sum + point[0], 0) / 4
      const y = points.reduce((sum, point) => sum + point[1], 0) / 4
      const z = points.reduce((sum, point) => sum + point[2], 0) / 4
      return [x, y, z]
    }, [points])
  
    const normal = useMemo(() => {
      const v1 = new THREE.Vector3().subVectors(
        new THREE.Vector3(...points[1]),
        new THREE.Vector3(...points[0])
      )
      const v2 = new THREE.Vector3().subVectors(
        new THREE.Vector3(...points[2]),
        new THREE.Vector3(...points[0])
      )
      return new THREE.Vector3().crossVectors(v1, v2).normalize()
    }, [points])
  
    return (
      <group>
        <mesh geometry={g}>
          <meshBasicMaterial color={"#FFF"} side={THREE.DoubleSide} />
        </mesh>
        <Html
          transform
          position={center}
          rotation={[0, Math.PI, 0]}
          style={{
            width: "100%",
            height: "100%",
            opacity: 1,
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}>
            {children}
          </div>
        </Html>
      </group>
    )
  }