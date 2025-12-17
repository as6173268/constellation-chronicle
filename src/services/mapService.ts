import * as R from 'ramda';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import lagrangeMapData from '@/data/lagrange/lagrange_map.json';
import axesData from '@/data/lagrange/axes.json';

// Immutable data types
export interface LagrangeNode {
  readonly id: string;
  readonly eje: string;
  readonly nivel: string;
  readonly tension: string;
  readonly texto: string;
  readonly conexiones: readonly string[];
  readonly episodios: readonly string[];
}

export interface LagrangeConnection {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly tipo: string;
  readonly fuerza: number;
}

export interface LagrangeAxis {
  readonly id: string;
  readonly name: string;
  readonly chapters: readonly number[];
  readonly color: string;
}

export interface LagrangeMapData {
  readonly ejes: readonly LagrangeAxis[];
  readonly preguntas: readonly LagrangeNode[];
  readonly relaciones: readonly LagrangeConnection[];
}

// Immutable data store
const mapData: LagrangeMapData = lagrangeMapData;
const axes: readonly LagrangeAxis[] = axesData;

// Pure functions for data access
export const getMapData = (): LagrangeMapData => mapData;

export const getNodes = (): readonly LagrangeNode[] => mapData.preguntas;

export const getConnections = (): readonly LagrangeConnection[] => mapData.relaciones;

export const getAxes = (): readonly LagrangeAxis[] => axes;

export const getAxisById = (id: string): O.Option<LagrangeAxis> =>
  O.fromNullable(axes.find(axis => axis.id === id));

export const getNodeById = (id: string): O.Option<LagrangeNode> =>
  O.fromNullable(mapData.preguntas.find(node => node.id === id));

// Pure filtering functions
export const getNodesByAxis = (axisId: string): readonly LagrangeNode[] =>
  A.filter<LagrangeNode>(node => node.eje === axisId)(mapData.preguntas);

export const getNodesByEpisode = (episodeId: string): readonly LagrangeNode[] =>
  A.filter<LagrangeNode>(node => node.episodios.includes(episodeId))(mapData.preguntas);

export const getNodesByTension = (tension: string): readonly LagrangeNode[] =>
  A.filter<LagrangeNode>(node => node.tension === tension)(mapData.preguntas);

export const getNodesByLevel = (level: string): readonly LagrangeNode[] =>
  A.filter<LagrangeNode>(node => node.nivel === level)(mapData.preguntas);

// Pure function to get connected nodes
const getConnectionIds = (nodeId: string): readonly string[] =>
  R.pipe(
    A.filter<LagrangeConnection>(conn => conn.source === nodeId || conn.target === nodeId),
    A.map(conn => conn.source === nodeId ? conn.target : conn.source)
  )(mapData.relaciones);

export const getConnectedNodes = (nodeId: string): readonly LagrangeNode[] =>
  R.pipe(
    getConnectionIds,
    connectedIds => A.filter<LagrangeNode>(node => connectedIds.includes(node.id))(mapData.preguntas)
  )(nodeId);

// Pure search function
const createNodeSearchPredicate = (query: string) => (node: LagrangeNode) => {
  const lowerQuery = query.toLowerCase();
  return node.texto.toLowerCase().includes(lowerQuery) ||
         node.eje.toLowerCase().includes(lowerQuery);
};

export const searchNodes = (query: string): readonly LagrangeNode[] =>
  A.filter(createNodeSearchPredicate(query))(mapData.preguntas);

// Pure centrality calculation
export const getNodeCentrality = (nodeId: string): number =>
  A.size(
    A.filter<LagrangeConnection>(conn => conn.source === nodeId || conn.target === nodeId)(mapData.relaciones)
  );

// Pure function to get nodes with centrality
const addCentralityToNode = (node: LagrangeNode) => ({
  ...node,
  centrality: getNodeCentrality(node.id)
});

export const getMostConnectedNodes = (limit: number = 10): readonly (LagrangeNode & { centrality: number })[] =>
  R.pipe(
    A.map(addCentralityToNode),
    A.sort((a, b) => b.centrality - a.centrality),
    R.take(limit)
  )(mapData.preguntas);

// Functional composition for complex queries
export const getNodesByAxisAndTension = R.curry(
  (axisId: string, tension: string): readonly LagrangeNode[] =>
    R.pipe(
      getNodesByAxis,
      A.filter(node => node.tension === tension)
    )(axisId)
);

export const getNodeNetwork = (nodeId: string): {
  readonly node: LagrangeNode;
  readonly connections: readonly LagrangeConnection[];
  readonly connectedNodes: readonly LagrangeNode[];
} =>
  R.pipe(
    getNodeById,
    O.map(node => ({
      node,
      connections: A.filter<LagrangeConnection>(
        conn => conn.source === nodeId || conn.target === nodeId
      )(mapData.relaciones),
      connectedNodes: getConnectedNodes(nodeId)
    })),
    O.getOrElse(() => ({
      node: {} as LagrangeNode,
      connections: [],
      connectedNodes: []
    }))
  )(nodeId);

// Curried functions for flexible composition
export const filterNodesByProperty = R.curry(
  (property: keyof LagrangeNode, value: string, nodes: readonly LagrangeNode[]): readonly LagrangeNode[] =>
    A.filter(node => node[property] === value)(nodes)
);