import { Canvas, useThree, useFrame } from "@react-three/fiber"
import React, { useEffect, useRef, useState, Suspense, useLayoutEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import QHtml from "./QHtml"

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

function HyperCube({ position = [0,0,0], sv = [1,1,1], rt}){
  const origin = useRef([
    [[0,0,0,0],[0,0,0,1],[0,0,1,0],[0,0,1,1]],
    [[0,1,0,0],[0,1,0,1],[0,1,1,0],[0,1,1,1]],
    [[1,0,0,0],[1,0,0,1],[1,0,1,0],[1,0,1,1]],
    [[1,1,0,0],[1,1,0,1],[1,1,1,0],[1,1,1,1]]
  ].map(i => i.map(rw => rw.map(n => n - 0.5))))

  const [hyper_points, setHyper_Points] = useState(origin.current)
  useFrame((state) => {
    const angle = rt.current * 0.1 * state.clock.getElapsedTime()
    setHyper_Points(origin.current.map((layer) =>
      layer.map((point) => {
        const [x, y, z, w] = point
        const newX = x * Math.cos(angle) - w * Math.sin(angle)
        const newW = x * Math.sin(angle) + w * Math.cos(angle)

        const newY = y * Math.cos(angle) - z * Math.sin(angle)
        const newZ = y * Math.sin(angle) + z * Math.cos(angle)
        
        const scale = 1 / (2 - newW)
        
        return [newX * scale + position[0], newY * scale + position[1], newZ * scale + position[2], newW]
      })
    ))
  })

  const mappedPoints = map3(hyper_points).flat().map((rw) => {return rw.map((n, index) => {return n * sv[index]})})
  return <group>
  {mappedPoints.map((coords: any, index:any, arr:any) => (
    <Point key={index} position={coords} size={0.5} color={`rgb(${Math.round((arr.length - index) / arr.length * 255) * (index % 2)}, ${Math.round(index / arr.length * 255)}, ${Math.round((arr.length - index) / arr.length * 255) * ((index + 1) % 2)})`}/>
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

  <QHtml points={[mappedPoints[0], mappedPoints[4], mappedPoints[12], mappedPoints[8]]} rt={rt}>
      <div style={{ width: "100%", height: "100%", background: "red", padding: "50px", color: "white", borderRadius: "75px"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[13], mappedPoints[5], mappedPoints[1]]} rt={rt}>
      <div style={{ width: "100%", height: "100%", background: "blue", padding: "50px", color: "white", borderRadius: "75px"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[12], mappedPoints[13], mappedPoints[5], mappedPoints[4]]} rt={rt}>
      <div style={{ width: "100%", height: "100%", background: "green", padding: "50px", color: "white", borderRadius: "75px"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[8], mappedPoints[0], mappedPoints[1]]} rt={rt}>
      <div style={{ width: "100%", height: "100%", background: "cyan", padding: "50px", color: "white", borderRadius: "75px"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[8], mappedPoints[12], mappedPoints[13]]} rt={rt}>
      <div style={{ width: "100%", height: "100%", background: "yellow", padding: "50px", color: "white", borderRadius: "75px"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[4], mappedPoints[0], mappedPoints[1], mappedPoints[5]]} rt={rt}>
      <div style={{ width: "100%", height: "100%", background: "orange", padding: "50px", color: "white", borderRadius: "75px"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[6], mappedPoints[4], mappedPoints[0], mappedPoints[2]]} rt={rt}>
      <div style={{ width: "100%", height: "100%", background: "magenta", padding: "50px", color: "white", borderRadius: "75px"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[7], mappedPoints[3], mappedPoints[1], mappedPoints[5]]} rt={rt}>
      <div style={{ width: "100%", height: "100%", background: "black", padding: "50px", color: "white", borderRadius: "75px"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
  </group>
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

function FPSLimiter({ fps }) {
  const set = useThree((state) => state.set);
  const get = useThree((state) => state.get);
  const advance = useThree((state) => state.advance);
  const frameloop = useThree((state) => state.frameloop);

  useLayoutEffect(() => {
      const initFrameloop = get().frameloop;

      return () => {
          set({ frameloop: initFrameloop });
      };
  }, []);

  useFrame((state) => {
      if (state.get().blocked) return;
      state.set({ blocked: true });

      setTimeout(() => {
          state.set({ blocked: false });

          state.advance();
      }, Math.max(0, 1000 / fps - state.clock.getDelta()));
  });

  useEffect(() => {
      if (frameloop !== 'never') {
          set({ frameloop: 'never' });
          advance();
      }
  }, [frameloop]);

  return null;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <script>window.location.reload()</script>
    }

    return this.props.children;
  }
}

function App() {
  
  const canvasRef = useRef()


  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault()
      console.log("WebGL context lost, reloading the page.")
      throw("error")
    }

    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext('webgl2')
      if (!gl) {
        console.error("WebGL2 context not available, falling back to WebGL1.")
      } else {
        console.log("WebGL2 context created successfully.")
      }

      canvas.addEventListener('webglcontextlost', handleContextLost)
    }

    return () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost)
      }
    }
  }, [])

  const rt = useRef(0)
  
  return (
    <div className="w-full h-screen">
      <div className="absolute top-2 left-1/2 z-50 p-2 text-center rounded-xl -translate-x-1/2 bg-neutral-300">
      <p className="md">This is a hypercube!<br /> Chris2Rich: <a className="text-blue-500 underline" href="https://github.com/chris2rich">Github</a><br /></p>
      <button className="p-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transition-all hover:text-yellow-400 hover:scale-105" onClick={() => {rt.current = (rt.current == 0)}}>Toggle Rotation</button>
      </div>
      <div className="absolute bottom-2 left-1/2 z-50 p-2 text-center rounded-xl -translate-x-1/2 bg-neutral-300"><p className="md">Left Mouse: Rotate Camera<br /> Right Mouse: Move Camera</p></div>
      <Suspense>
        <ErrorBoundary>
        <Canvas camera={{ position: [3, 3, 3], fov: 75 }} style={{ background: "#212121" }} frameloop={"demand"} ref={canvasRef}>
        <FPSLimiter fps={30} />
        <CameraController />
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} />
        <HyperCube sv={[25,25,25]} position={[.5,.5,.5]} rt={rt}/>
        </Canvas>
      </ErrorBoundary>
      </Suspense>
    </div>
  )
}


export default App
