import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  OnConnect,
  SmoothStepEdge,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Box } from "@mui/material";
import { EdgeBase } from "@xyflow/system";
import { useEffect, useState } from "react";
import { Column } from "../home/interfaces/interfaces";
import "@xyflow/react/dist/style.css";
import styled from "@emotion/styled";
import { fetchTableData } from "../../services/api/CommonApi";
import CustomNode from "./CustomeNode";
import { baseUrl } from "../../services/api/BaseUrl";

const ControlsStyled = styled(Controls)`
  button {
    background-color: #6565bb;
    color: #ffffff
`;
interface NestedFlowProps {
  keyspace: string;
  table: string;
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
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  // const [relations, setRelations] = useState<Relation[]>([]);
  const [uniqueFromKeyspaceTables, setUniqueFromKeyspaceTables] = useState<string[] | null>();

  const nodeTypes = {
    customNode: CustomNode,
  };

  useEffect(() => {
    // create base node for from table
    const getColumnData = async () => {
      try {
        const tableData = await fetchTableData(keyspace, table);
        // to set the id of parent node
        const parentId = `${keyspace}.${table}`;
        // to set the height of parent table node dynamically
        const variableHeight = (tableData: Column[]) => {
          return tableData.length * 50 + 50;
        };

        // Create from table parent node
        const parentNode = {
          id: parentId,
          type: "customNode",
          data: { label1: keyspace, label2: table },
          position: { x: 100, y: 100 },
          className: "light",
          style: {
            backgroundColor: "rgba(200, 50, 50, 0.4)",
            width: 170,
            height: variableHeight(tableData.data),
          },
        };
        // Create from table child nodes
        const childNodes = tableData.data.map((column: Column, index: number) => ({
          id: `${keyspace}.${table}.${column.column_name}`,
          data: { label: column.column_name },
          position: { x: 10, y: 50 + index * 50 },
          parentId: parentId,
          sourcePosition: "right",
        }));
        setNodes([parentNode, ...childNodes]);
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };
    getColumnData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyspace, table]);

  useEffect(() => {
    // Fetch the relations
    const fetchRelations = async () => {
      try {
        const response = await fetch(
          baseUrl + `/get_relations?from_keyspace=${keyspace}&from_table=${table}`
        );
        const data = await response.json();
        let uniqueFromKeyspaceTables: string[] | null = null;
        // Check if the response contains a "message" key indicating no relations
        if (data.message) {
          console.log(data.message);
          // setRelations([]);
          uniqueFromKeyspaceTables = null;
        } else {
          // setRelations(data);
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

          // Build the edges
          const newEdges = data.map((relation: Relation) => {
            return {
              id: `${relation.from_keyspace}.${relation.from_table}.${relation.from_column}
              -to-${relation.to_keyspace}.${relation.to_table}.${relation.to_column}`,
              source: `${relation.from_keyspace}.${relation.from_table}.${relation.from_column}`,
              target: `${relation.to_keyspace}.${relation.to_table}.${relation.to_column}`,
              style: { stroke: "#000000" },
              // type: "smoothstep", //edge making styles
              zIndex: 15,
              color: "#ff0000",
              animated: "true",
              selected: false,
              selectable: false,
            };
          });
          setEdges((prevEdges) => [...prevEdges, ...newEdges]);
        }
        // Use uniqueFromKeyspaceTables as needed
        setUniqueFromKeyspaceTables(uniqueFromKeyspaceTables);
        console.log("UniqueFromKeyspaceTables:", uniqueFromKeyspaceTables);
      } catch (error) {
        console.error("Error fetching relations:", error);
      }
    };
    fetchRelations();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyspace, table]);

  useEffect(() => {
    const fetchNodesForRelations = async () => {
      try {
        if (!uniqueFromKeyspaceTables) return;
        const newNodes: Node[] = [];
        const xOffset = 200;
        let currentXPosition = 300;
        for (const uniqueKeyspaceTable of uniqueFromKeyspaceTables) {
          const [toKeyspace, toTable] = uniqueKeyspaceTable.split(".");
          const toTableData = await fetchTableData(toKeyspace, toTable);
          // Create the parent node
          const parentId = `${toKeyspace}.${toTable}`;
          const variableHeight = (toTableData: Column[]) => {
            return toTableData.length * 50 + 50;
          };
          const parentNode = {
            id: parentId,
            type: "customNode",
            data: { label1: toKeyspace, label2: toTable },
            position: { x: currentXPosition, y: 100 },
            // zIndex:10,
            className: "light",
            style: {
              backgroundColor: "rgba(100, 100, 255, 0.4)",
              width: 170,
              height: variableHeight(toTableData.data),
              zIndex: 10,
            },
          };
          newNodes.push(parentNode);

          // Update X position for the next parent node
          currentXPosition += xOffset;
          // Create child nodes
          const childNodes = toTableData.data.map((column: Column, index: number) => ({
            id: `${toKeyspace}.${toTable}.${column.column_name}`,
            data: {
              label: `${column.column_name}`,
            },
            position: { x: 10, y: 50 + index * 50 },
            parentId: parentId,
            targetPosition: "left",
            zIndex: 12,
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
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueFromKeyspaceTables]);

  const onConnect: OnConnect = (connection: import("@xyflow/system").Connection) => {
    const newEdge: EdgeBase = {
      id: `edge-${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle ?? "",
      targetHandle: connection.targetHandle ?? "",
    };

    setEdges((eds) => addEdge(newEdge, eds));
  };

  return (
    <Box sx={{ width: "80%", height: "500px", marginX: 10, border: 1, borderRadius: 2 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={{
          smoothstep: SmoothStepEdge,
        }}
        className="react-flow-subflows-example"
        // fitView
        style={{ height: "600px", width: "100%" }}
      >
        <MiniMap />
        <Controls />
        <Background />
        <ControlsStyled />
      </ReactFlow>
    </Box>
  );
};

export default NestedFlow;
