import { Canvas } from "@react-three/fiber"
import { useLayoutEffect } from "react"

const hyper_points = [
  [[0,0,0,0],[0,0,0,1],[0,0,1,0],[0,0,1,1]],
  [[0,1,0,0],[0,1,0,1],[0,1,1,0],[0,1,1,1]],
  [[1,0,0,0],[1,0,0,1],[1,0,1,0],[1,0,1,1]],
  [[1,1,0,0],[1,1,0,1],[1,1,1,0],[1,1,1,1]]
]

function map3(points: any){
  return points.map((plane:any) => {
    return plane.map((point: any) => {
      return [
        point[0] / (0.5 - point[3]),
        point[1] / (0.5 - point[3]), 
        point[2] / (0.5 - point[3])
      ]
    })
  }).flat()
}

function Point ({position, color = "#ffffff", size = 0.1 }){
  return (
    <mesh position={position}>
      <sphereGeometry args={[size]} />
      <meshBasicMaterial  color={color} />
    </mesh>
  )
}

function Line({ start, end }) {
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
  }, [start, end])
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="hotpink" />
    </line>
  )
}

function App() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [3, 3, 3], fov: 75 }} style={{ background: "#212121" }}>
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} />
        
        {map3(hyper_points).map((coords:any, index:any) => (
          <>
          <Point key={index} position={coords}/>
          
          </>
        ))}
        
      </Canvas>
    </div>
  )
}

export default App
