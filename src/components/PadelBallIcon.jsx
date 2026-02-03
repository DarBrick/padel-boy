export function PadelBallIcon({ className = "w-16 h-16", animate = true }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Padel Ball */}
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="#D4FF00"
        stroke="#1F2937"
        strokeWidth="2"
      />
      
      {/* Ball texture lines */}
      <path
        d="M 30 35 Q 50 40 70 35"
        stroke="#000000"
        strokeWidth="1.5"
        fill="none"
        opacity="0.2"
      />
      <path
        d="M 30 65 Q 50 60 70 65"
        stroke="#000000"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      
      {/* Pulse Line */}
      <g>
        <path
          id="pulsePath"
          d="M 10 50 L 30 50 L 35 40 L 40 60 L 45 45 L 50 50 L 70 50"
          stroke="#FF0066"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Glow effect */}
        <path
          d="M 10 50 L 30 50 L 35 40 L 40 60 L 45 45 L 50 50 L 70 50"
          stroke="#FF0066"
          strokeWidth="6"
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
              path="M 10 50 L 30 50 L 35 40 L 40 60 L 45 45 L 50 50 L 70 50"
            />
          </circle>
        )}
      </g>
    </svg>
  )
}
