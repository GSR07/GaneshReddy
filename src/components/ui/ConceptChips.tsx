import { asset } from '../../lib/utils'

const CONCEPT_LABELS: Record<string, string> = {
  'ros2-nodes-topics-services': 'ROS 2 Nodes/Topics/Services',
  'slam': 'SLAM',
  'amcl': 'AMCL',
  'nav2': 'Nav2',
  'tf2': 'TF2',
  'moveit2': 'MoveIt2',
  'ros2-control': 'ros2_control',
  'behavior-trees': 'Behavior Trees',
  'p-controller': 'P-Control',
  'hsv-segmentation': 'HSV Segmentation',
  'dh-kinematics': 'D-H Kinematics',
  'path-planning': 'Path Planning',
  'q-learning': 'Q-Learning',
  'occupancy-grid': 'Occupancy Grids',
  'ble-rssi-trilateration': 'BLE RSSI Trilateration',
  'cnn-transfer-learning': 'CNN Transfer Learning',
  'ekf-ukf': 'EKF vs UKF',
  'int8-quantization': 'INT8 Quantization',
  'mqtt': 'MQTT',
}

export default function ConceptChips({ concepts }: { concepts?: string[] }) {
  if (!concepts || concepts.length === 0) return null

  return (
    <div className="concept-chips">
      <span className="concept-chips-label">CONCEPTS:</span>
      {concepts.map(slug => (
        <a
          key={slug}
          href={`${asset('/concepts.html')}#${slug}`}
          target="_blank"
          rel="noreferrer"
          className="concept-chip"
        >
          {CONCEPT_LABELS[slug] ?? slug}
        </a>
      ))}
    </div>
  )
}
