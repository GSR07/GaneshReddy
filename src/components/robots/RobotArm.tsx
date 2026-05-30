export default function RobotArm() {
  return (
    <div className="section-robot about-arm-sim" aria-hidden="true">
      <div className="omni-arm pnp-mode">
        <div className="omni-base" />
        <div className="omni-shoulder">
          <div className="omni-link1">
            <div className="omni-elbow">
              <div className="omni-link2">
                <div className="omni-wrist">
                  <div className="omni-gripper" />
                  <div className="pnp-cube"><span className="pnp-q-char">?</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
