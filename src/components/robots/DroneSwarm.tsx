export default function DroneSwarm() {
  return (
    <div className="section-robot drone-swarm" aria-hidden="true">
      {(['d1', 'd2', 'd3'] as const).map((cls, i) => (
        <div key={cls} className={`swarm-drone ${cls}`}>
          <div className="dr-body" />
          <div className="dr-prop p1" /><div className="dr-prop p2" />
          <div className="dr-prop p3" /><div className="dr-prop p4" />
          <div className="dr-scanner">
            <div className="dr-scan-beam" style={{ animationDelay: `${i * 0.4}s` }} />
            <div className="dr-scan-line" style={{ animationDelay: `${i * 0.4}s` }} />
            <div className="dr-scan-dot" style={{ animationDelay: `${i * 0.4}s` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
