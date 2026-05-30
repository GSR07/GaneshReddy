export default function SolderingPCB() {
  return (
    <div className="section-robot experience-solder" aria-hidden="true">
      <div className="solder-arm experience-arm">
        <div className="omni-shoulder">
          <div className="omni-link1">
            <div className="omni-elbow">
              <div className="omni-link2">
                <div className="omni-wrist jitter">
                  <div className="solder-tip" />
                  <div className="smoke-puff sp1" /><div className="smoke-puff sp2" /><div className="smoke-puff sp3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pcb-board exp-pcb">
        <div className="pcb-ic ic1"><span>ESP32</span></div>
        <div className="pcb-ic ic2"><span>MCU</span></div>
        <div className="pcb-cap cap1" /><div className="pcb-cap cap2" /><div className="pcb-cap cap3" />
        <div className="pcb-res res1" /><div className="pcb-res res2" /><div className="pcb-res res3" /><div className="pcb-res res4" />
        <div className="pcb-led led-active" />
        <div className="pcb-trace tr1" /><div className="pcb-trace tr2" /><div className="pcb-trace tr3" />
        <div className="pcb-solder-pt" />
      </div>
      <div className="spark-shower">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`spark p${i + 1}`} />
        ))}
      </div>
    </div>
  )
}
