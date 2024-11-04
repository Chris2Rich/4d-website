import { Canvas, useThree, useFrame, addEffect } from "@react-three/fiber"
import { useEffect, useRef, useState, Suspense } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { Html } from "@react-three/drei"

const d4 = 2

function map3(tesseract: any) {
  
  const res = Array(4).fill().map(() => Array(4).fill().map(() => Array(3).fill(0)))

  for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
          const point4D = tesseract[i][j]
          
          const x = point4D[0] - 0.5
          const y = point4D[1] - 0.5
          const z = point4D[2] - 0.5
          const w = point4D[3] - 0.5
          
          const s = 1 / (d4 - w)
          
          res[i][j] = [
              x * s,
              y * s,
              z * s
          ]
      }
  }
  
  return res
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
  const material = new THREE.LineBasicMaterial({ color: color }) 

  return <line geometry={geometry} material={material} />
}

function HyperCube({ position = [0,0,0], scale = [1,1,1]}){
  const origin = useRef([
    [[0,0,0,0],[0,0,0,1],[0,0,1,0],[0,0,1,1]],
    [[0,1,0,0],[0,1,0,1],[0,1,1,0],[0,1,1,1]],
    [[1,0,0,0],[1,0,0,1],[1,0,1,0],[1,0,1,1]],
    [[1,1,0,0],[1,1,0,1],[1,1,1,0],[1,1,1,1]]
  ].map(i => i.map(rw => rw.map(n => n - 0.5))))

  const [hyper_points, setHyper_Points] = useState(origin.current)
  useFrame((state, delta) => {
    const angle = 0.1 * state.clock.getElapsedTime()
    setHyper_Points(origin.current.map((layer) =>
      layer.map((point) => {
        const [x, y, z, w] = point
        const newX = x * Math.cos(angle) - w * Math.sin(angle)
        const newW = x * Math.sin(angle) + w * Math.cos(angle)

        const newY = y * Math.cos(angle) - z * Math.sin(angle)
        const newZ = y * Math.sin(angle) + z * Math.cos(angle)
        
        const scale = 1 / (2 - newW)
        
        return [newX * scale , newY * scale, newZ * scale, newW]
      })
    ))
  })

  const mappedPoints = map3(hyper_points).flat().map((rw) => {return rw.map((n, index) => {return n * sv[index]})})
  return <group position={new THREE.Vector3(...position)} scale={(new THREE.Vector3(...scale))}>
  {mappedPoints.map((coords: any, index:any, arr:any) => (
    <Point key={index} position={coords} size={Math.sqrt(1) / 25} color={`rgb(${Math.round((arr.length - index) / arr.length * 255) * (index % 2)}, ${Math.round(index / arr.length * 255)}, ${Math.round((arr.length - index) / arr.length * 255) * ((index + 1) % 2)})`}/>
  ))}
  <Line start={mappedPoints[0]} end={mappedPoints[1]}/>
  <Line start={mappedPoints[0]} end={mappedPoints[2]}/>
  <Line start={mappedPoints[0]} end={mappedPoints[4]}/>
  <Line start={mappedPoints[0]} end={mappedPoints[8]}/>
  <Line start={mappedPoints[2]} end={mappedPoints[10]}/>
  <Line start={mappedPoints[2]} end={mappedPoints[6]}/>
  <Line start={mappedPoints[2]} end={mappedPoints[3]}/>
  <Line start={mappedPoints[4]} end={mappedPoints[6]}/>
  <Line start={mappedPoints[4]} end={mappedPoints[5]}/>
  <Line start={mappedPoints[6]} end={mappedPoints[7]}/>
  <Line start={mappedPoints[8]} end={mappedPoints[10]}/>
  <Line start={mappedPoints[8]} end={mappedPoints[12]}/>
  <Line start={mappedPoints[8]} end={mappedPoints[9]}/>
  <Line start={mappedPoints[10]} end={mappedPoints[11]}/>
  <Line start={mappedPoints[10]} end={mappedPoints[14]}/>
  <Line start={mappedPoints[12]} end={mappedPoints[13]}/>
  <Line start={mappedPoints[12]} end={mappedPoints[14]}/>
  <Line start={mappedPoints[12]} end={mappedPoints[4]}/>
  <Line start={mappedPoints[14]} end={mappedPoints[6]}/>
  <Line start={mappedPoints[14]} end={mappedPoints[15]}/>
  <Line start={mappedPoints[7]} end={mappedPoints[5]}/>
  <Line start={mappedPoints[7]} end={mappedPoints[3]}/>
  <Line start={mappedPoints[7]} end={mappedPoints[15]}/>
  <Line start={mappedPoints[5]} end={mappedPoints[13]}/>
  <Line start={mappedPoints[5]} end={mappedPoints[1]}/>
  <Line start={mappedPoints[15]} end={mappedPoints[13]}/>
  <Line start={mappedPoints[15]} end={mappedPoints[11]}/>
  <Line start={mappedPoints[11]} end={mappedPoints[9]}/>
  <Line start={mappedPoints[9]} end={mappedPoints[1]}/>
  <Line start={mappedPoints[1]} end={mappedPoints[3]}/>
  <Line start={mappedPoints[9]} end={mappedPoints[13]}/>
  <Line start={mappedPoints[11]} end={mappedPoints[3]}/>

  <QuadHTML points={[mappedPoints[0], mappedPoints[1], mappedPoints[4], mappedPoints[8]]}>
      <div style={{ width: '100%', height: '100%', background: 'white', padding: '20px' }}>
        <h1>Hunnit band hunnit band</h1>
        <p>This content will fit the quad!</p>
      </div>
    </QuadHTML>
  </group>
}

function QuadHTML({ points, children }) {
  const htmlRef = useRef()
  
  useEffect(() => {
    if (!htmlRef.current) return
    
    
    const [topLeft, topRight, bottomLeft, bottomRight] = points
    
    
    
    const transform = getPerspectiveTransform(
      
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      
      { x: topLeft[0], y: topLeft[1] },
      { x: topRight[0], y: topRight[1] },
      { x: bottomLeft[0], y: bottomLeft[1] },
      { x: bottomRight[0], y: bottomRight[1] }
    )
    
    
    htmlRef.current.style.transform = `matrix3d(${transform.join(',')})`
  }, [points])

  return (
    <Html
      ref={htmlRef}
      transform
      style={{
        transformOrigin: '0 0',
        width: '100%',
        height: '100%'
      }}
    >
      {children}
    </Html>
  )
}


function getPerspectiveTransform(
  src0, src1, src2, src3,
  dst0, dst1, dst2, dst3
) {
  
  const [a, b, c, d, e, f, g, h] = computeProjectiveCoefficients(
    src0, src1, src2, src3,
    dst0, dst1, dst2, dst3
  )
  
  
  return [
    a, b, 0, 0,
    c, d, 0, 0,
    0, 0, 1, 0,
    e, f, 0, 1
  ]
}

function computeProjectiveCoefficients(src0, src1, src2, src3, dst0, dst1, dst2, dst3) {
  
  
  const x0 = src0.x, y0 = src0.y,
        x1 = src1.x, y1 = src1.y,
        x2 = src2.x, y2 = src2.y,
        x3 = src3.x, y3 = src3.y

  const X0 = dst0.x, Y0 = dst0.y,
        X1 = dst1.x, Y1 = dst1.y,
        X2 = dst2.x, Y2 = dst2.y,
        X3 = dst3.x, Y3 = dst3.y

  
  const matA = [
    [x0, y0, 1, 0, 0, 0, -X0*x0, -X0*y0],
    [0, 0, 0, x0, y0, 1, -Y0*x0, -Y0*y0],
    [x1, y1, 1, 0, 0, 0, -X1*x1, -X1*y1],
    [0, 0, 0, x1, y1, 1, -Y1*x1, -Y1*y1],
    [x2, y2, 1, 0, 0, 0, -X2*x2, -X2*y2],
    [0, 0, 0, x2, y2, 1, -Y2*x2, -Y2*y2],
    [x3, y3, 1, 0, 0, 0, -X3*x3, -X3*y3],
    [0, 0, 0, x3, y3, 1, -Y3*x3, -Y3*y3]
  ]

  const matB = [X0, Y0, X1, Y1, X2, Y2, X3, Y3]

  
  
  const solution = solveMatrix(matA, matB)
  
  return solution
}


function solveMatrix(A, b) {
  
  
  
  return [...Array(8)].map((_, i) => i < b.length ? b[i] : 0)
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

function FrameLimit({ fps = 30 }) {
  useEffect(() => {
    const interval = 1000 / fps
    let then = performance.now()
    
    const unsubscribe = addEffect(() => {
      const now = performance.now()
      const delta = now - then
      if (delta < interval) return false
      then = now - (delta % interval)
      return true
    })
    
    return () => unsubscribe()
  }, [fps])
  
  return null
}

function App() {
  
  return (
    <div className="w-full h-screen">
      <Suspense>
      <Canvas camera={{ position: [3, 3, 3], fov: 75 }} style={{ background: "#212121" }} frameloop={"demand"}>
        <FrameLimit fps={30} />
        <CameraController />
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} />
        <HyperCube scale={[5,5,5]} position={[.5,.5,.5]}/>
      </Canvas>
      </Suspense>
    </div>
  )
}


export default App
