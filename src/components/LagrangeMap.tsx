import { useState } from "react";
import { useLagrangeData, type LagrangeNode } from "@/hooks/useLagrangeData";

export function LagrangeMap() {
  const { axes, nodes, connections, isLoading, error } = useLagrangeData();
  const [activeAxis, setActiveAxis] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNodeById = (id: string) => nodes.find((n) => n.id === id);

  if (isLoading) {
    return (
      <div className="relative w-full aspect-[4/3] max-w-4xl mx-auto flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">
          Cargando constelación...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full aspect-[4/3] max-w-4xl mx-auto flex items-center justify-center">
        <div className="text-destructive">Error al cargar el mapa</div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] max-w-4xl mx-auto">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-xs">
        <h4 className="font-display text-sm font-semibold mb-3 text-primary">
          Ejes Narrativos
        </h4>
        <div className="space-y-2">
          {axes.map((axis) => (
            <button
              key={axis.id}
              className={`flex items-center gap-2 text-xs w-full text-left transition-all p-1.5 rounded ${
                activeAxis === axis.id
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onMouseEnter={() => setActiveAxis(axis.id)}
              onMouseLeave={() => setActiveAxis(null)}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: axis.color }}
              />
              <span className="truncate">{axis.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map */}
      <svg
        viewBox="0 0 1200 800"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))" }}
      >
        {/* Background glow */}
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        <g className="connections">
          {connections.map((conn) => {
            const fromNode = getNodeById(conn.from_node);
            const toNode = getNodeById(conn.to_node);
            if (!fromNode || !toNode) return null;

            const fromAxis = axes.find((a) => a.id === fromNode.eje);
            const isActive =
              activeAxis === fromNode.eje ||
              activeAxis === toNode.eje ||
              !activeAxis;

            // Calculate curved path
            const midX = (fromNode.position_x + toNode.position_x) / 2;
            const midY = (fromNode.position_y + toNode.position_y) / 2;
            const offsetX = (toNode.position_y - fromNode.position_y) * 0.2;
            const offsetY = (fromNode.position_x - toNode.position_x) * 0.2;

            return (
              <path
                key={conn.id}
                d={`M${fromNode.position_x} ${fromNode.position_y} Q${midX + offsetX} ${midY + offsetY} ${toNode.position_x} ${toNode.position_y}`}
                stroke={fromAxis?.color || "#777"}
                strokeWidth={isActive ? 2 : 1}
                fill="none"
                strokeDasharray={conn.tipo === "retroalimentacion" ? "4 2" : "none"}
                opacity={isActive ? 0.6 : 0.15}
                className="transition-all duration-300"
                filter={isActive ? "url(#glow)" : undefined}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            const axis = axes.find((a) => a.id === node.eje);
            const isActive = activeAxis === node.eje || !activeAxis;
            const isHovered = hoveredNode === node.id;

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  opacity: isActive ? 1 : 0.3,
                  transform: isHovered ? "scale(1.2)" : "scale(1)",
                  transformOrigin: `${node.position_x}px ${node.position_y}px`,
                }}
              >
                {/* Glow circle */}
                {isHovered && (
                  <circle
                    cx={node.position_x}
                    cy={node.position_y}
                    r={30}
                    fill="url(#nodeGlow)"
                    className="animate-pulse-slow"
                  />
                )}

                {/* Main node */}
                <circle
                  cx={node.position_x}
                  cy={node.position_y}
                  r={isHovered ? 14 : 10}
                  fill={axis?.color || "hsl(38, 92%, 50%)"}
                  stroke="hsl(222, 47%, 5%)"
                  strokeWidth={2}
                  filter="url(#glow)"
                  className="transition-all duration-200"
                  data-episodio={node.episodio}
                />

                {/* Node number */}
                <text
                  x={node.position_x}
                  y={node.position_y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="hsl(222, 47%, 5%)"
                  fontSize={isHovered ? "9" : "7"}
                  fontWeight="bold"
                  fontFamily="var(--font-display)"
                  className="pointer-events-none"
                >
                  {node.episodio}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredNode && (() => {
        const node = getNodeById(hoveredNode);
        if (!node) return null;
        const axis = axes.find((a) => a.id === node.eje);
        
        return (
          <div
            className="absolute z-20 bg-card border border-primary/40 rounded-lg p-4 shadow-lg max-w-xs pointer-events-none animate-scale-in"
            style={{
              left: `${(node.position_x / 12) + 2}%`,
              top: `${(node.position_y / 8)}%`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: axis?.color }}
              />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {axis?.label}
              </span>
            </div>
            <h4 className="font-display font-semibold text-sm mb-2">
              Ep. {node.episodio}: {node.titulo}
            </h4>
            <div className="flex flex-wrap gap-1">
              {node.palabras_clave.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 capitalize">
              Ángulo: {node.angulo}
            </p>
          </div>
        );
      })()}
    </div>
  );
}
