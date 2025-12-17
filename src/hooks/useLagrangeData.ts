import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LagrangeAxis {
  id: string;
  label: string;
  color: string;
}

export interface LagrangeNode {
  id: string;
  titulo: string;
  episodio: number;
  eje: string;
  angulo: string;
  palabras_clave: string[];
  url: string | null;
  position_x: number;
  position_y: number;
}

export interface LagrangeConnection {
  id: string;
  from_node: string;
  to_node: string;
  tipo: string;
}

export function useLagrangeAxes() {
  return useQuery({
    queryKey: ["lagrange-axes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lagrange_axes")
        .select("*")
        .order("id");
      
      if (error) throw error;
      return data as LagrangeAxis[];
    },
  });
}

export function useLagrangeNodes() {
  return useQuery({
    queryKey: ["lagrange-nodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lagrange_nodes")
        .select("*")
        .order("episodio");
      
      if (error) throw error;
      return data as LagrangeNode[];
    },
  });
}

export function useLagrangeConnections() {
  return useQuery({
    queryKey: ["lagrange-connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lagrange_connections")
        .select("*");
      
      if (error) throw error;
      return data as LagrangeConnection[];
    },
  });
}

export function useLagrangeData() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["lagrange-map"],
    queryFn: async () => {
      const response = await fetch('/data/lagrange_map.json');
      if (!response.ok) throw new Error('Failed to load map data');
      return response.json();
    },
  });

  if (isLoading) return { axes: [], nodes: [], connections: [], isLoading: true, error: null };

  if (error) return { axes: [], nodes: [], connections: [], isLoading: false, error };

  const mapData = data;

  const nodes: LagrangeNode[] = mapData.nodes.map((n: any) => ({
    id: n.id,
    titulo: n.id,
    episodio: 1,
    eje: n.eje,
    angulo: "",
    palabras_clave: [],
    url: null,
    position_x: n.x,
    position_y: n.y,
  }));

  const connections: LagrangeConnection[] = mapData.edges.map((e: any) => ({
    id: e.id || `${e.from}-${e.to}`,
    from_node: e.from,
    to_node: e.to,
    tipo: e.tipo || "default",
  }));

  // Extract unique axes from nodes
  const axes: LagrangeAxis[] = [...new Set(nodes.map(n => n.eje))].map(eje => ({
    id: eje,
    label: eje,
    color: "#3b82f6", // default color
  }));

  return {
    axes,
    nodes,
    connections,
    isLoading: false,
    error: null,
  };
}
