import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import type { LagrangeNode } from "@/utils/types";

interface MapNodeProps {
  node: LagrangeNode;
  x: number;
  y: number;
  isSelected?: boolean;
  onClick?: () => void;
  onHover?: (node: LagrangeNode | null) => void;
}

export function MapNode({ node, x, y, isSelected, onClick, onHover }: MapNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(node);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Node circle */}
      <circle
        r={isSelected ? 25 : isHovered ? 22 : 20}
        fill={`var(--${node.eje}-color)`}
        stroke={isSelected ? "#000" : "#fff"}
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-200"
      />

      {/* Node label */}
      <text
        textAnchor="middle"
        dy="0.35em"
        fontSize="12"
        fill="#fff"
        fontWeight="bold"
        pointerEvents="none"
      >
        {node.id}
      </text>

      {/* Hover tooltip */}
      {isHovered && (
        <foreignObject x="-100" y="-80" width="200" height="60">
          <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {node.eje}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {node.nivel}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {node.texto}
              </p>
            </CardContent>
          </Card>
        </foreignObject>
      )}
    </g>
  );
}