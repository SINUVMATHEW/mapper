import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Box } from "@mui/material";
import { EdgeBase } from "@xyflow/system";

//  interface Connection{

//   source: string;
//   target: string;
//   sourceHandle: string;
//   targetHandle: string;

// }

const initialNodes = [
  {
    id: "educator.active_course",
    data: { label: "educator.active_course" },
    position: { x: 100, y: 100 },
    className: "light",
    style: { backgroundColor: "rgba(100, 100, 255, 0.4)", width: 170, height: 300 },
  },
  {
    id: "educator.active_course.accountid",
    data: { label: "accountid" },
    position: { x: 10, y: 50 },
    parentId: "educator.active_course",
  },
  {
    id: "educator.active_course.city",
    data: { label: "city" },
    position: { x: 10, y: 100 },
    parentId: "educator.active_course",
  },
  {
    id: "educator.active_course.closedreason",
    data: { label: "closedreason" },
    position: { x: 10, y: 150 },
    parentId: "educator.active_course",
  },

  {
    id: "educator.active_course.closedtime",
    data: { label: "closedtime" },
    position: { x: 10, y: 200 },
    parentId: "educator.active_course",
  },

  {
    id: "educator.active_course.costcenter",
    data: { label: "costcenter" },
    position: { x: 10, y: 250 },
    parentId: "educator.active_course",
  },


  {
    id: "educator.archive_course",
    data: { label: "educator.archive_course" },
    position: { x: 300, y: 100 },
    className: "light",
    style: { backgroundColor: "rgba(100, 100, 255, 0.4)", width: 170, height: 250 },
  },
  
  {
    id: "educator.archive_course.city",
    data: { label: "city" },
    position: { x: 10, y: 50 },
    className: "light",
    parentId: "educator.archive_course",
  },
  {
    id: "educator.archive_course.closedreason",
    data: { label: "closedreason" },
    position: { x: 10, y: 100 },
    className: "light",
    parentId: "educator.archive_course",
  },
  {
    id: "educator.archive_course.closedtime",
    data: { label: "closedtime" },
    position: { x: 10, y: 150 },
    className: "light",
    parentId: "educator.archive_course",
  },
  {
    id: "educator.archive_course.country",
    data: { label: "country" },
    position: { x: 10, y: 200 },
    className: "light",
    parentId: "educator.archive_course",
  },


  {
    id: "pw2_0_secureeducator.educator_account",
    data: { label: "pw2_0_secureeducator.educator_account" },
    position: { x: 500, y: 100 },
    className: "light",
    style: { backgroundColor: "rgba(100, 100, 255, 0.4)", width: 250
    , height: 250 },
  },
  {
    id: "pw2_0_secureeducator.educator_account.accountname",
    data: { label: "accountname" },
    position: { x: 50, y: 50 },
    className: "light",
    parentId: "pw2_0_secureeducator.educator_account",
  },
  {
    id: "pw2_0_secureeducator.educator_account.admin",
    data: { label: "admin" },
    position: { x: 50, y: 100 },
    className: "light",
    parentId: "pw2_0_secureeducator.educator_account",
  },
  {
    id: "pw2_0_secureeducator.educator_account.bucket",
    data: { label: "bucket" },
    position: { x: 50, y: 150 },
    className: "light",
    parentId: "pw2_0_secureeducator.educator_account",
  },
  {
    id: "pw2_0_secureeducator.educator_account.description",
    data: { label: "description" },
    position: { x: 50, y: 200 },
    className: "light",
    parentId: "pw2_0_secureeducator.educator_account",
  },
];

const initialEdges = [
  { id: "ecity-city", source: "educator.active_course.city", target: "educator.archive_course.city", animated: true },
  { id: "ecity-bucket", source: "educator.archive_course.country", target: "pw2_0_secureeducator.educator_account.description" },
];

const NestedFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  console.log(setNodes)

  const onConnect: OnConnect = (connection: import("@xyflow/system").Connection) => {
    const newEdge: EdgeBase = {
      id: `edge-${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle ?? "",
      targetHandle: connection.targetHandle ?? "",
      animated: true,
    };

    setEdges((eds) => addEdge(newEdge, eds));
  };

  return (
    <Box sx={{ width: "80%", height: "500px", marginX:10, border:1, borderRadius:2 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="react-flow-subflows-example"
        fitView
        style={{ height: "600px", width: "100%" }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </Box>
  );
};

export default NestedFlow;
