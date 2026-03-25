import { motion } from 'framer-motion'

interface WeatherOverlayProps {
  mood: number // 1-5
}

export default function WeatherOverlay({ mood }: WeatherOverlayProps) {
  switch (mood) {
    case 1: return <StormyOverlay />
    case 2: return <RainyOverlay />
    case 3: return <CloudyOverlay />
    case 4: return <SunnyOverlay />
    case 5: return <RainbowOverlay />
    default: return null
  }
}

function SunnyOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(250,199,117,0.3) 0%, transparent 70%)',
        }}
      />
      {/* Light rays */}
      <svg className="absolute top-0 right-0 w-48 h-48 opacity-20" viewBox="0 0 100 100">
        {[0, 30, 60, 90, 120, 150].map((angle) => (
          <line
            key={angle}
            x1="80" y1="20" x2={80 + 40 * Math.cos((angle * Math.PI) / 180)} y2={20 + 40 * Math.sin((angle * Math.PI) / 180)}
            stroke="#FAC775" strokeWidth="1" strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  )
}

function RainbowOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] h-32 opacity-25" viewBox="0 0 400 100">
        {[
          { color: '#E8A0B4', r: 90 },
          { color: '#FAC775', r: 82 },
          { color: '#97C459', r: 74 },
          { color: '#85B7EB', r: 66 },
          { color: '#AFA9EC', r: 58 },
        ].map(({ color, r }, i) => (
          <path
            key={i}
            d={`M ${200 - r} 95 A ${r} ${r} 0 0 1 ${200 + r} 95`}
            fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          />
        ))}
      </svg>
      {/* Sunny bg too */}
      <div
        className="absolute -top-20 -right-20 w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(250,199,117,0.2) 0%, transparent 70%)' }}
      />
    </div>
  )
}

function CloudyOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-6 left-[15%]"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="120" height="50" viewBox="0 0 120 50" opacity="0.2">
          <ellipse cx="60" cy="30" rx="50" ry="18" fill="#8B7E6A" />
          <ellipse cx="40" cy="25" rx="35" ry="15" fill="#9B8E7A" />
          <ellipse cx="80" cy="28" rx="30" ry="13" fill="#8B7E6A" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute top-12 right-[20%]"
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="90" height="40" viewBox="0 0 90 40" opacity="0.15">
          <ellipse cx="45" cy="22" rx="40" ry="14" fill="#8B7E6A" />
          <ellipse cx="30" cy="18" rx="28" ry="12" fill="#9B8E7A" />
        </svg>
      </motion.div>
    </div>
  )
}

function RainyOverlay() {
  const drops = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 5 + (i * 4.5) + Math.random() * 2,
    delay: Math.random() * 2,
    duration: 1 + Math.random() * 0.5,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-water/5" />
      {/* Clouds */}
      <svg className="absolute top-2 left-[10%] opacity-25" width="140" height="50" viewBox="0 0 140 50">
        <ellipse cx="70" cy="28" rx="60" ry="18" fill="#6B7E8A" />
        <ellipse cx="45" cy="22" rx="40" ry="14" fill="#7B8E9A" />
        <ellipse cx="95" cy="25" rx="35" ry="13" fill="#6B7E8A" />
      </svg>
      {/* Rain drops */}
      <svg className="absolute inset-0 w-full h-full">
        {drops.map((drop) => (
          <motion.line
            key={drop.id}
            x1={`${drop.x}%`} y1="0%"
            x2={`${drop.x}%`} y2="3%"
            stroke="#85B7EB" strokeWidth="1" strokeLinecap="round" opacity="0.4"
            animate={{ y1: ['0%', '100%'], y2: ['3%', '103%'] }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

function StormyOverlay() {
  const drops = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: 3 + (i * 3.2) + Math.random() * 1.5,
    delay: Math.random() * 1.5,
    duration: 0.7 + Math.random() * 0.3,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Darker overlay */}
      <div className="absolute inset-0 bg-brown/10" />
      {/* Lightning flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: [0, 0, 0, 0.15, 0, 0.08, 0, 0, 0, 0, 0, 0, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      {/* Heavy clouds */}
      <svg className="absolute top-0 left-[5%] opacity-30" width="160" height="55" viewBox="0 0 160 55">
        <ellipse cx="80" cy="30" rx="70" ry="20" fill="#4A5560" />
        <ellipse cx="55" cy="24" rx="45" ry="16" fill="#5A6570" />
        <ellipse cx="105" cy="27" rx="40" ry="15" fill="#4A5560" />
      </svg>
      {/* Heavy rain */}
      <svg className="absolute inset-0 w-full h-full">
        {drops.map((drop) => (
          <motion.line
            key={drop.id}
            x1={`${drop.x}%`} y1="0%"
            x2={`${drop.x - 1}%`} y2="4%"
            stroke="#6B8EA0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"
            animate={{ y1: ['0%', '100%'], y2: ['4%', '104%'] }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  )
}
