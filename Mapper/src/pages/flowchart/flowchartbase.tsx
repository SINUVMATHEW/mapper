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
import { useEffect, useState } from "react";
import { Column } from "../home/interfaces/interfaces";


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
];

const initialEdges = [
  {
    id: "ecity-city",
    source: "educator.active_course.city",
    target: "pw2_0_secureeducator.educator_account.accountid",
    animated: true,
  },
];

interface NestedFlowProps {
  keyspace: string;
  table: string | null;
}
interface Relation {
  from_column: string;
  from_keyspace: string;
  from_table: string;
  is_published: string;
  to_column: string;
  to_keyspace: string;
  to_table: string;
}
const NestedFlow: React.FC<NestedFlowProps> = ({ keyspace, table }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [uniqueFromKeyspaceTables,setUniqueFromKeyspaceTables] = useState<string[] | null >();

  useEffect(() => {
    // create base node for from table
    const fetchColumns = async () => {
      try {
        console.log("fetching", keyspace, table);
        const response = await fetch(
          `http://127.0.0.1:5000/api/get_columns?keyspace_name=${keyspace}&table_name=${table}`
        );
        const data = await response.json();

        // Create from table parent node
        const parentId = `${keyspace}.${table}`;
        const variableHeight = (data: Column[]) => {
          return data.length * 50 + 50; // to set the height of parent node dynamically 
        };
        const parentNode = {
          id: parentId,
          data: { label: parentId },
          position: { x: 100, y: 100 },
          className: "light",
          style: {
            backgroundColor: "rgba(100, 100, 255, 0.4)",
            width: 170,
            height: variableHeight(data),
          },
        };
        // Create from table child nodes
        const childNodes = data.map((column: Column, index: number) => ({
          id: `${keyspace}.${table}.${column.column_name}`,
          data: { label: column.column_name },
          position: { x: 10, y: 50 + index * 50 },
          parentId: parentId,
        }));
        setNodes([parentNode, ...childNodes]);
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };
    fetchColumns();
  }, [keyspace, table]);

  useEffect(() => {
  // Fetch the relations 
  const fetchRelations = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/get_relations?from_keyspace=${keyspace}&from_table=${table}`
      );
      const data = await response.json();
      let uniqueFromKeyspaceTables: string[] | null = null;
      // Check if the response contains a "message" key indicating no relations
      if (data.message) {
        console.log(data.message);
        setRelations([]); // Set an empty array if no relations exist
        uniqueFromKeyspaceTables = null; // Set uniqueFromKeyspaceTables to null
      } else {
        // Set the fetched relations into state
        setRelations(data);
        console.log("Relations fetched", data);

        // Function to get unique from_keyspace.from_table combinations
        const getUniqueFromKeyspaceTable = (relations: Relation[]) => {
          const uniqueCombinations = new Set<string>();
          relations.forEach((relation: Relation) => {
            const combination = `${relation.to_keyspace}.${relation.to_table}`;
            uniqueCombinations.add(combination);
          });
          return Array.from(uniqueCombinations);
        };

        // Call the function with the fetched data
        uniqueFromKeyspaceTables = getUniqueFromKeyspaceTable(data);
        console.log("Unique combinations:", uniqueFromKeyspaceTables);

        // Build the edges dynamically
        const newEdges  = data.map((relation: Relation) => {
          return {
            id: `${relation.from_keyspace}.${relation.from_table}.${relation.from_column}-to-${relation.to_keyspace}.${relation.to_table}.${relation.to_column}`,
            source: `${relation.from_keyspace}.${relation.from_table}.${relation.from_column}`,
            target: `${relation.to_keyspace}.${relation.to_table}.${relation.to_column}`,
            animated: true,
          };
        });

        // Update edges state
        setEdges((prevEdges) => [...prevEdges, ...newEdges]);
        console.log("Edges created:", newEdges);
      }

      // Use uniqueFromKeyspaceTables as needed
      setUniqueFromKeyspaceTables(uniqueFromKeyspaceTables);
      console.log("UniqueFromKeyspaceTables:", uniqueFromKeyspaceTables);
    } catch (error) {
      console.error("Error fetching relations:", error);
    }
  };

  fetchRelations();
}, [keyspace, table]);



useEffect(() => {
  const fetchNodesForRelations = async () => {
    try {
      const newNodes: any[] = [];
      const xOffset = 200; // X position increment for each parent node
      let currentXPosition = 300; // Initial X position for the first parent node

      for (const uniqueKeyspaceTable of uniqueFromKeyspaceTables) {
        const [keyspace, table] = uniqueKeyspaceTable.split(".");

        console.log("Fetching data for", keyspace, table);

        const response = await fetch(
          `http://127.0.0.1:5000/api/get_columns?keyspace_name=${keyspace}&table_name=${table}`
        );
        const data = await response.json();

        // Create the parent node
        const parentId = `${keyspace}.${table}`;
        const variableHeight = (data: Column[]) => {
          return data.length * 50 + 50; // Multiply the number of rows by 50 for the height
        };
        const parentNode = {
          id: parentId,
          data: { label: parentId },
          position: { x: currentXPosition, y: 100 },
          className: "light",
          style: {
            backgroundColor: "rgba(100, 100, 255, 0.4)",
            width: 170,
            height: variableHeight(data),
          },
        };
        newNodes.push(parentNode);

        // Update X position for the next parent node
        currentXPosition += xOffset;

        // Create child nodes
        const childNodes = data.map((column: Column, index: number) => ({
          id: `${keyspace}.${table}.${column.column_name}`,
          data: { label: column.column_name },
          position: { x: 10, y: 50 + index * 50 },
          parentId: parentId,
        }));
        newNodes.push(...childNodes);
      }

      // Add the newly fetched nodes to the existing nodes
      setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    } catch (error) {
      console.error("Error fetching nodes:", error);
    }
  };

  fetchNodesForRelations();
}, [uniqueFromKeyspaceTables]);




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
    <Box sx={{ width: "80%", height: "500px", marginX: 10, border: 1, borderRadius: 2 }}>
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
