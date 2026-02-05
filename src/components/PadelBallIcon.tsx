interface PadelBallIconProps {
  className?: string
  animate?: boolean
}

export function PadelBallIcon({ className = "w-16 h-16", animate = true }: PadelBallIconProps) {
  return (
    <div className={`padel-ball-icon ${className}`}>
      <div className="padel-ball" />
      {/* Pulse Line Overlay */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M 0 50 L 25 50 L 30 38 L 35 62 L 40 42 L 45 50 L 70 50"
            stroke="#FF0066"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Glow effect */}
          <path
            d="M 0 50 L 25 50 L 30 38 L 35 62 L 40 42 L 45 50 L 70 50"
            stroke="#FF0066"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          {/* Animated pulse dot */}
          {animate && (
            <circle r="3" fill="#FFFFFF">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path="M 0 50 L 25 50 L 30 38 L 35 62 L 40 42 L 45 50 L 70 50"
              />
            </circle>
          )}
        </g>
      </svg>
    </div>
  )
}
