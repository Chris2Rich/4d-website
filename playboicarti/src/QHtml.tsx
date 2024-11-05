import React, { useRef, useMemo, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"

export default function QHtml({ points, children }) {
  const groupRef = useRef()
  const htmlRef = useRef()
  const [euler, setEuler] = useState(new THREE.Euler())
  const [scale, setScale] = useState(1)

    const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const vertices = new Float32Array(points.flat())
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
    g.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
    g.setIndex(new THREE.BufferAttribute(indices, 1))
    g.computeVertexNormals()
    return g
  }, [points])

    const center = useMemo(() => {
    const x = points.reduce((sum, point) => sum + point[0], 0) / 4
    const y = points.reduce((sum, point) => sum + point[1], 0) / 4
    const z = points.reduce((sum, point) => sum + point[2], 0) / 4
    return new THREE.Vector3(x, y, z);
  }, [points])

    const normal = useMemo(() => {
    const v1 = new THREE.Vector3(...points[1]).sub(new THREE.Vector3(...points[0]))
    const v2 = new THREE.Vector3(...points[3]).sub(new THREE.Vector3(...points[0]))
    return new THREE.Vector3().crossVectors(v1, v2).normalize()
  }, [points])

    useFrame((state) => {
    if (groupRef.current && htmlRef.current) {
            groupRef.current.position.copy(center)

            const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.lookAt(center, center.clone().add(normal), new THREE.Vector3(0, 1, 0))
      const scale = new THREE.Vector3()
      const position = new THREE.Vector3()
      const t_euler = new THREE.Euler()
      rotationMatrix.decompose(position, t_euler, scale)
      setEuler(t_euler)

      setScale(Math.pow(1 * Math.max(Math.cos(0.2 * state.clock.getElapsedTime()), 0), 2))
    }
  })

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
      </mesh>

      <group ref={groupRef}>

        <Html
          ref={htmlRef}
          transform
          distanceFactor={1}
          position={[0, 0, 0]}
          rotation={euler}
          scale={scale}
          style={{
            width: "400px",
            height: "400px",
            transformOrigin: "center center",
            pointerEvents: "auto",
          }}
        >
          {children}
        </Html>
      </group>
    </group>
  )
}
