export default function TurtlebotScanner() {
  return (
    <div className="section-robot skills-scanner" aria-hidden="true">
      <div className="s-turtlebot scan-mode">
        <div className="tb-layer tb-base" />
        <div className="tb-layer tb-mid" />
        <div className="tb-layer tb-top" />
        <div className="tb-lidar"><div className="lidar-ray" /></div>
        <div className="v-scan-cone" />
        <div className="v-scan-cone v-scan-inner" />
      </div>
    </div>
  )
}
