import React from 'react';
import { MiniMap, Controls, Background, addEdge, Connection, Edge, Node,ReactFlow } from '@xyflow/react';
// import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Node' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Middle Node' },
    position: { x: 250, y: 150 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'End Node' },
    position: { x: 250, y: 300 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

const FlowChart = () => {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  const onConnect = (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds));
  const onNodesChange = (changes: Node[]) => setNodes((nds) => nds.map((n) => ({ ...n, ...changes })));
  const onEdgesChange = (changes: Edge[]) => setEdges((eds) => eds.map((e) => ({ ...e, ...changes })));

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FlowChart;
