import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"


function map3(points: any){
  return points.map((plane:any) => {
    return plane.map((point: any) => {
      return [
        point[0] / (.5 - point[3]),
        point[1] / (.5 - point[3]), 
        point[2] / (.5 - point[3])
      ]
    })
  })
}

function Point({ position, color = "#ffffff", size = 0.1 }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

function Line({ start, end, color="#0FF" }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: color }) // You can customize the color

  return <line geometry={geometry} material={material} />
}

function HyperCube(){
  const origin = useRef([
    [[0,0,0,0],[0,0,0,1],[0,0,1,0],[0,0,1,1]],
    [[0,1,0,0],[0,1,0,1],[0,1,1,0],[0,1,1,1]],
    [[1,0,0,0],[1,0,0,1],[1,0,1,0],[1,0,1,1]],
    [[1,1,0,0],[1,1,0,1],[1,1,1,0],[1,1,1,1]]
  ])

  const [hyper_points, setHyper_Points] = useState(origin.current)
  useFrame((state, delta) => {
    const angle = .0 * state.clock.getElapsedTime()
    setHyper_Points(origin.current.map((layer) =>
      layer.map((point) => {
        const [x, y, z, w] = point
        const newX = x * Math.cos(angle) - w * Math.sin(angle)
        const newW = x * Math.sin(angle) + w * Math.cos(angle)
        return [newX, y, z, newW]
      })
    ))
  })

  const mappedPoints = map3(hyper_points).flat()
  return <>
  {mappedPoints.map((coords: any, index:any, arr:any) => (
    <Point key={index} position={coords} size={Math.sqrt(index) / 25} color={`rgb(${Math.round((arr.length - index) / arr.length * 255) * (index % 2)}, ${Math.round(index / arr.length * 255)}, ${Math.round((arr.length - index) / arr.length * 255) * ((index + 1) % 2)})`}/>
  ))}

  
  </>
}

function CameraController() {
  const { camera, gl } = useThree()
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement)

      controls.minDistance = 3
      controls.maxDistance = 20
      return () => {
        controls.dispose()
      }
    },
    [camera, gl]
  )
  return null
}

function App() {
  
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [3, 3, 3], fov: 75 }} style={{ background: "#212121" }}>
        <CameraController />
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} />
        <HyperCube />
      </Canvas>
    </div>
  )
}


export default App
