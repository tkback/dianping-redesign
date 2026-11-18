import { Float } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useInView, useReducedMotion } from 'framer-motion'
import { useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import * as THREE from 'three'
import type { World } from './data'

type IntentWorldProps = {
  world: World
  variant?: 'hero' | 'explorer'
}

type OrbProps = IntentWorldProps & {
  reduced: boolean
}

function Orb({ world, variant = 'hero', reduced }: OrbProps) {
  const group = useRef<THREE.Group>(null)
  const surface = useRef<THREE.MeshPhysicalMaterial>(null)
  const { pointer } = useThree()
  const targetColor = useMemo(() => new THREE.Color(world.color), [world.color])
  const scale = variant === 'explorer' ? 1.08 : 0.92

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(120 * 3)
    for (let index = 0; index < 120; index += 1) {
      const angle = index * 2.39996
      const radius = 2.3 + ((index * 37) % 100) / 85
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = Math.sin(angle * 1.37) * radius * 0.8
      positions[index * 3 + 2] = Math.sin(angle) * 0.9 - 0.6
    }
    return positions
  }, [])

  useFrame((_, delta) => {
    if (group.current && !reduced) {
      group.current.rotation.y += delta * 0.1
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        pointer.y * 0.12,
        0.035,
      )
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        -pointer.x * 0.08,
        0.035,
      )
    }
    if (surface.current) {
      surface.current.color.lerp(targetColor, Math.min(delta * 3, 1))
    }
  })

  return (
    <group ref={group} scale={scale} rotation={[0.1, -0.35, -0.08]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={world.secondary} size={0.018} transparent opacity={0.62} sizeAttenuation />
      </points>

      <mesh>
        <sphereGeometry args={[1.7, 64, 64]} />
        <meshPhysicalMaterial
          ref={surface}
          color={world.color}
          roughness={0.14}
          metalness={0.04}
          transmission={0.16}
          thickness={1.7}
          clearcoat={1}
          clearcoatRoughness={0.12}
          iridescence={0.7}
          iridescenceIOR={1.3}
          transparent
          opacity={0.96}
        />
      </mesh>

      <mesh scale={1.007}>
        <sphereGeometry args={[1.7, 32, 20]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.075} />
      </mesh>

      <mesh position={[-0.45, 0.28, 0.25]} scale={0.82}>
        <sphereGeometry args={[1.25, 48, 48]} />
        <meshStandardMaterial
          color={world.secondary}
          emissive={world.secondary}
          emissiveIntensity={0.12}
          roughness={0.42}
        />
      </mesh>

      <mesh rotation={[1.13, 0.25, 0.35]}>
        <torusGeometry args={[2.08, 0.012, 8, 160]} />
        <meshBasicMaterial color={world.secondary} transparent opacity={0.75} />
      </mesh>
      <mesh rotation={[0.45, 0.85, -0.32]}>
        <torusGeometry args={[2.32, 0.006, 8, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.34} />
      </mesh>

      <Float speed={reduced ? 0 : 1.5} rotationIntensity={0.35} floatIntensity={0.65}>
        <mesh position={[2.05, 0.85, 0.35]}>
          <sphereGeometry args={[0.19, 24, 24]} />
          <meshStandardMaterial color={world.secondary} roughness={0.2} />
        </mesh>
      </Float>
      <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.25} floatIntensity={0.55}>
        <mesh position={[-1.95, 1.35, -0.1]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.18} />
        </mesh>
      </Float>
      <Float speed={reduced ? 0 : 1.7} rotationIntensity={0.4} floatIntensity={0.7}>
        <mesh position={[1.15, -1.9, 0.5]}>
          <octahedronGeometry args={[0.2, 1]} />
          <meshStandardMaterial color={world.color} roughness={0.25} />
        </mesh>
      </Float>
    </group>
  )
}

export default function IntentWorld({ world, variant = 'hero' }: IntentWorldProps) {
  const container = useRef<HTMLDivElement>(null)
  const inView = useInView(container, { amount: 0.05 })
  const reduced = Boolean(useReducedMotion())

  return (
    <div
      ref={container}
      className={`intent-world intent-world--${variant}`}
      style={{ '--world-color': world.color, '--world-secondary': world.secondary } as CSSProperties}
      aria-hidden="true"
    >
      <div className="world-static" />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        frameloop={!inView || reduced ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 5, 6]} intensity={3.2} color="#ffffff" />
        <pointLight position={[-4, -2, 3]} intensity={34} color={world.secondary} />
        <pointLight position={[4, 1, -2]} intensity={26} color={world.color} />
        <Orb world={world} variant={variant} reduced={reduced} />
      </Canvas>
    </div>
  )
}
