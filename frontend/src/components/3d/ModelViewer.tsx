import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'
import { RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import './ModelViewer.css'

// ============================================================
// Procedural Models
// ============================================================

function CoreInsertModel() {
  const meshRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })
  return (
    <group ref={meshRef}>
      {/* Main cylindrical body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.65, 2.2, 48, 1]} />
        <meshStandardMaterial
          color="#B8C8D8"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      {/* Top chamfer */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.6, 0.4, 48]} />
        <meshStandardMaterial color="#C5D3E3" metalness={0.75} roughness={0.2} />
      </mesh>
      {/* Ejector pin groove */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.62, 0.04, 8, 48]} />
        <meshStandardMaterial color="#5A6678" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Cooling channel indicator */}
      <mesh position={[0, -0.6, 0]}>
        <torusGeometry args={[0.62, 0.04, 8, 48]} />
        <meshStandardMaterial color="#5A6678" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Bottom flange */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.3, 48]} />
        <meshStandardMaterial color="#6A7D92" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

function CavityPlateModel() {
  const meshRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25
    }
  })
  return (
    <group ref={meshRef}>
      {/* Main plate body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.6, 2.0]} />
        <meshStandardMaterial color="#8A9BB0" metalness={0.88} roughness={0.18} />
      </mesh>
      {/* Cavity depression */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.6, 0.15, 1.2]} />
        <meshStandardMaterial color="#2A3A4F" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Guide pin holes */}
      {[[-1.1, 0.35, 0.7], [1.1, 0.35, 0.7], [-1.1, 0.35, -0.7], [1.1, 0.35, -0.7]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
          <meshStandardMaterial color="#1A2535" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
      {/* Surface finish lines (decorative) */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.32, 0]}>
          <boxGeometry args={[0.02, 0.02, 1.9]} />
          <meshStandardMaterial color="#4A9EFF" metalness={0.5} roughness={0.5} opacity={0.3} transparent />
        </mesh>
      ))}
    </group>
  )
}

function MouldingToolModel() {
  const meshRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
    }
  })
  return (
    <group ref={meshRef} position={[0, -0.3, 0]}>
      {/* Bottom plate */}
      <mesh position={[0, -0.85, 0]} castShadow>
        <boxGeometry args={[3.0, 0.5, 2.2]} />
        <meshStandardMaterial color="#7A8FA5" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Core side */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.8, 0.7, 2.0]} />
        <meshStandardMaterial color="#8A9BB0" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Cavity side */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[2.8, 0.7, 2.0]} />
        <meshStandardMaterial color="#6A7D92" metalness={0.88} roughness={0.2} />
      </mesh>
      {/* Parting line */}
      <mesh position={[0, 0.355, 0]}>
        <boxGeometry args={[2.85, 0.02, 2.05]} />
        <meshStandardMaterial color="#4A9EFF" metalness={0.5} roughness={0.5} opacity={0.5} transparent />
      </mesh>
      {/* Guide pillars */}
      {[[-1.1, 0, 0.7], [1.1, 0, 0.7], [-1.1, 0, -0.7], [1.1, 0, -0.7]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.1, 0.1, 1.6, 16]} />
          <meshStandardMaterial color="#C7CED6" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

function CaseCoverModel() {
  const meshRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.28
    }
  })
  return (
    <group ref={meshRef}>
      {/* Main cover plate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.15, 1.8]} />
        <meshStandardMaterial color="#8A9BB0" metalness={0.9} roughness={0.12} />
      </mesh>
      {/* Edge flanges */}
      {[
        { pos: [0, -0.2, 0.87] as [number, number, number], size: [2.5, 0.4, 0.06] },
        { pos: [0, -0.2, -0.87] as [number, number, number], size: [2.5, 0.4, 0.06] },
        { pos: [1.22, -0.2, 0] as [number, number, number], size: [0.06, 0.4, 1.8] },
        { pos: [-1.22, -0.2, 0] as [number, number, number], size: [0.06, 0.4, 1.8] },
      ].map((f, i) => (
        <mesh key={i} position={f.pos} castShadow>
          <boxGeometry args={f.size as [number, number, number]} />
          <meshStandardMaterial color="#7A8FA5" metalness={0.88} roughness={0.2} />
        </mesh>
      ))}
      {/* Mounting holes */}
      {[[-0.9, 0.08, 0.6], [0.9, 0.08, 0.6], [-0.9, 0.08, -0.6], [0.9, 0.08, -0.6]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.2, 16]} />
          <meshStandardMaterial color="#1A2535" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function ToolingComponentModel() {
  const meshRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35
    }
  })
  return (
    <group ref={meshRef}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.6, 6]} />
        <meshStandardMaterial color="#8A9BB0" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 0.3, 6]} />
        <meshStandardMaterial color="#7A8FA5" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#C7CED6" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.9, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.25, 6]} />
        <meshStandardMaterial color="#6A7D92" metalness={0.88} roughness={0.22} />
      </mesh>
    </group>
  )
}

const MODELS: Record<string, React.ComponentType> = {
  'core-insert': CoreInsertModel,
  'cavity-plate': CavityPlateModel,
  'moulding-tool': MouldingToolModel,
  'case-cover': CaseCoverModel,
  'tooling-component': ToolingComponentModel,
}

// ============================================================
// Scene Lighting
// ============================================================
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#F0F6FF"
      />
      <directionalLight position={[-5, 4, -3]} intensity={1.4} color="#88B8FF" />
      <directionalLight position={[0, -2, 5]} intensity={1.0} color="#E0E8F5" />
      <pointLight position={[3, 4, 3]} intensity={1.6} color="#FFFFFF" />
      <spotLight
        position={[0, 6, 0]}
        angle={0.6}
        penumbra={0.8}
        intensity={1.5}
        castShadow
        color="#FFFFFF"
      />
    </>
  )
}

function WireframeController({ wireframe }: { wireframe: boolean }) {
  const { scene } = useThree()
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material
        if (Array.isArray(mat)) {
          mat.forEach((m) => {
            m.wireframe = wireframe
          })
        } else {
          mat.wireframe = wireframe
        }
      }
    })
  }, [wireframe, scene])
  return null
}

// ============================================================
// Main Viewer
// ============================================================
interface ModelViewerProps {
  modelKey?: string
  height?: number
  showLabel?: boolean
  autoRotate?: boolean
  label?: string
}

export default function ModelViewer({
  modelKey = 'core-insert',
  height = 400,
  showLabel = true,
  autoRotate = false,
  label,
}: ModelViewerProps) {
  const controlsRef = useRef<any>(null)
  const [wireframe, setWireframe] = useState(false)

  const ModelComponent = MODELS[modelKey] || CoreInsertModel

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  return (
    <div className="model-viewer" style={{ height }}>
      {/* WebGL Canvas */}
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={45} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.5}
          maxDistance={8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          makeDefault
        />
        <SceneLighting />
        <WireframeController wireframe={wireframe} />
        <Suspense fallback={null}>
          <ModelComponent />
        </Suspense>
        {/* Grid */}
        <gridHelper args={[6, 20, '#1A2535', '#0F1822']} position={[0, -1.5, 0]} />
        {/* Label */}
        {showLabel && label && (
          <Text
            position={[0, -1.8, 0]}
            fontSize={0.18}
            color="#7A8899"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        )}
      </Canvas>

      {/* Overlay controls */}
      <div className="model-controls" aria-label="3D model controls">
        <button
          className="model-control-btn"
          onClick={resetCamera}
          aria-label="Reset camera"
          title="Reset camera"
        >
          <RotateCcw size={14} />
        </button>
        <button
          className={`model-control-btn${wireframe ? ' active' : ''}`}
          onClick={() => setWireframe(!wireframe)}
          aria-label="Toggle wireframe"
          title="Toggle wireframe"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
            <line x1="12" y1="2" x2="12" y2="22"/>
            <line x1="2" y1="8.5" x2="22" y2="8.5"/>
            <line x1="2" y1="15.5" x2="22" y2="15.5"/>
          </svg>
        </button>
      </div>

      {/* Hint */}
      <div className="model-hint" aria-hidden="true">
        Drag to rotate · Scroll to zoom
      </div>

      {/* Illustrative label */}
      <div className="model-illustrative-badge" aria-label="This is a concept visualisation">
        Concept Visualisation
      </div>
    </div>
  )
}
