export default function EducationGears() {
  return (
    <div className="section-robot edu-gears" aria-hidden="true">
      <svg className="edu-gears-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <defs>
          <filter id="gnode-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g className="edu-gear-1">
          <circle cx="85" cy="130" r="30" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.7" />
          <circle cx="85" cy="130" r="11" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.5" />
          <line x1="74" y1="130" x2="96" y2="130" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.4" />
          <line x1="85" y1="119" x2="85" y2="141" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.4" />
          {[0,45,90,135,180,225,270,315].map(r => (
            <rect key={r} x="79" y="80" width="12" height="20" rx="3" fill="#0ea5e9" opacity="0.55" transform={`rotate(${r},85,130)`} />
          ))}
        </g>
        <g className="edu-gear-2">
          <circle cx="190" cy="72" r="20" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.7" />
          <circle cx="190" cy="72" r="7" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
          {[0,60,120,180,240,300].map(r => (
            <rect key={r} x="184" y="45" width="12" height="14" rx="2.5" fill="#6366f1" opacity="0.55" transform={`rotate(${r},190,72)`} />
          ))}
        </g>
        <g className="edu-gear-3">
          <circle cx="215" cy="192" r="14" fill="none" stroke="#64748b" strokeWidth="1.8" opacity="0.6" />
          <circle cx="215" cy="192" r="5" fill="none" stroke="#64748b" strokeWidth="1.2" opacity="0.4" />
          {[0,72,144,216,288].map(r => (
            <rect key={r} x="211" y="171" width="8" height="11" rx="2" fill="#64748b" opacity="0.5" transform={`rotate(${r},215,192)`} />
          ))}
        </g>
        <line x1="85" y1="130" x2="190" y2="72" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4,4" opacity="0.25" />
        <line x1="190" y1="72" x2="215" y2="192" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,4" opacity="0.2" />
        <circle cx="85" cy="130" r="4" fill="#0ea5e9" opacity="0.5" />
        <circle cx="190" cy="72" r="3" fill="#6366f1" opacity="0.5" />
        <circle cx="215" cy="192" r="2.5" fill="#64748b" opacity="0.45" />
        <path d="M115 130 L140 130 L140 110 L190 110" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.2" />
        <path d="M190 92 L190 130 L215 130 L215 178" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.18" />
      </svg>
    </div>
  )
}
