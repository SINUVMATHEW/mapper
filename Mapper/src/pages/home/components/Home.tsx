import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import { Table, DataType, RelationSelection } from "../interfaces/interfaces";
import { Select, MenuItem, Box, SelectChangeEvent, Button } from "@mui/material";
import TableEditForm from "./TableEditForm";
import AddRelationPopUp from "./AddRelationPopUp";
// import RelationVisualization from "./RelationVisualization";
// import MermaidChart from "./MermaidChart";

const Home = () => {
  const [data, setData] = useState<DataType | null>(null);
  const [selectedKeyspace, setSelectedKeyspace] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("schema.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setSelectedKeyspace(jsonData.Keyspaces[0]?.name || "");
        setSelectedTable(jsonData.Keyspaces[0]?.tables[0]?.name || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <Box>Loading...</Box>;
  }

  const currentKeyspace = data.Keyspaces.find(
    (Keyspace) => Keyspace.name === selectedKeyspace
  );

  const currentTable = currentKeyspace?.tables.find((table) => table.name === selectedTable);

  const handleKeyspaceChange = (event: SelectChangeEvent<string>) => {
    const KeyspaceName = event.target.value;
    setSelectedKeyspace(KeyspaceName);
    const Keyspace = data.Keyspaces.find((ns) => ns.name === KeyspaceName);
    if (Keyspace && Keyspace.tables.length > 0) {
      setSelectedTable(Keyspace.tables[0].name);
    }
  };

  const handleTableChange = (event: SelectChangeEvent<string>) => {
    setSelectedTable(event.target.value as string);
  };

  const handleFormSubmit = (updatedTableData: Table) => {
    const updatedData = { ...data };
    const Keyspace = updatedData.Keyspaces.find((ns) => ns.name === selectedKeyspace);

    if (Keyspace) {
      const tableIndex = Keyspace.tables.findIndex((table) => table.name === selectedTable);
      if (tableIndex !== -1) {
        Keyspace.tables[tableIndex] = updatedTableData;
        setData(updatedData);
      }
    }
  };

  const handleAddRelation = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleRelationFormSubmit = (from: RelationSelection, to: RelationSelection) => {
    const updatedData = { ...data };
    const fromKeyspace = updatedData.Keyspaces.find((ns) => ns.name === from.Keyspace);
    const toKeyspace = updatedData.Keyspaces.find((ns) => ns.name === to.Keyspace);

    if (fromKeyspace && toKeyspace) {
      fromKeyspace.relations.push({
        fromTable: from.table,
        fromColumn: from.column,
        toTable: to.table,
        toColumn: to.column,
      });

      toKeyspace.relations.push({
        fromTable: to.table,
        fromColumn: to.column,
        toTable: from.table,
        toColumn: from.column,
      });

      setData(updatedData);
    } else {
      console.error("One or both Keyspaces not found");
    }

    setOpenPopup(false);
  };

  return (
  <ThemeProvider theme={theme}>
    <Box sx={{ p: 2 }}>
      {/* Select Menus */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          pb: 3,
          justifyContent: "space-between",
        }}
      >
        <Select
          value={selectedKeyspace}
          onChange={handleKeyspaceChange}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ flex: 1 }}
        >
          {data.Keyspaces.map((Keyspace) => (
            <MenuItem key={Keyspace.name} value={Keyspace.name}>
              {Keyspace.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedTable}
          onChange={handleTableChange}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ flex: 1 }}
        >
          {currentKeyspace?.tables.map((table) => (
            <MenuItem key={table.name} value={table.name}>
              {table.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* TableEditForm for selected table */}
      {currentTable && (
        <Box sx={{ pb: 3 }}>
          <TableEditForm tableData={currentTable} onSubmit={handleFormSubmit} />
        </Box>
      )}

      {/* Relations Visualization */}
      {/* <Box sx={{ pb: 3 }}>
        <MermaidChart />
      </Box> */}

      {/* Button and Popup for Adding Relations */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleAddRelation}
        >
          Add Relation
        </Button>
        {openPopup && (
          <AddRelationPopUp
            data={data}
            onClose={handleClosePopup}
            onSave={handleRelationFormSubmit}
          />
        )}
      </Box>
    </Box>
  </ThemeProvider>
);
};

export default Home;
