import type { LagrangeConnection } from "@/utils/types";

interface MapEdgeProps {
  connection: LagrangeConnection;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isHighlighted?: boolean;
}

export function MapEdge({
  connection,
  sourceX,
  sourceY,
  targetX,
  targetY,
  isHighlighted = false
}: MapEdgeProps) {
  // Calculate control points for curved line
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Control point offset based on connection type
  const offset = connection.tipo === 'refuerza' ? distance * 0.3 :
                 connection.tipo === 'contradice' ? -distance * 0.2 : 0;

  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // Perpendicular vector
  const perpX = -dy / distance * offset;
  const perpY = dx / distance * offset;

  const controlX = midX + perpX;
  const controlY = midY + perpY;

  // Stroke properties based on connection type
  const strokeColor = connection.tipo === 'refuerza' ? '#10b981' :
                     connection.tipo === 'contradice' ? '#ef4444' : '#6b7280';

  const strokeWidth = isHighlighted ? 4 : Math.max(1, connection.fuerza * 2);
  const strokeDasharray = connection.tipo === 'contradice' ? '5,5' : 'none';

  return (
    <g>
      {/* Main connection line */}
      <path
        d={`M ${sourceX} ${sourceY} Q ${controlX} ${controlY} ${targetX} ${targetY}`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={strokeDasharray}
        className="transition-all duration-200"
        opacity={isHighlighted ? 1 : 0.7}
      />

      {/* Arrow head */}
      <polygon
        points={`${targetX},${targetY} ${targetX - 8},${targetY - 4} ${targetX - 8},${targetY + 4}`}
        fill={strokeColor}
        transform={`rotate(${Math.atan2(dy, dx) * 180 / Math.PI}, ${targetX}, ${targetY})`}
      />

      {/* Connection label */}
      {isHighlighted && (
        <text
          x={controlX}
          y={controlY - 10}
          textAnchor="middle"
          fontSize="10"
          fill={strokeColor}
          fontWeight="bold"
        >
          {connection.tipo}
        </text>
      )}
    </g>
  );
}