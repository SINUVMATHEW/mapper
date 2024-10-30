import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import { Table, DataType, RelationSelection } from "../interfaces/interfaces";
import { Select, MenuItem, Box, SelectChangeEvent, Button } from "@mui/material";
import TableEditForm from "./TableEditForm";
import AddRelationPopUp from "./AddRelationPopUp";
import RelationVisualization from "./RelationVisualization";

const Home = () => {
  const [data, setData] = useState<DataType | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState("");
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
        setSelectedNamespace(jsonData.namespaces[0]?.name || "");
        setSelectedTable(jsonData.namespaces[0]?.tables[0]?.name || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <Box>Loading...</Box>;
  }

  const currentNamespace = data.namespaces.find(
    (namespace) => namespace.name === selectedNamespace
  );

  const currentTable = currentNamespace?.tables.find((table) => table.name === selectedTable);

  const handleNamespaceChange = (event: SelectChangeEvent<string>) => {
    const namespaceName = event.target.value;
    setSelectedNamespace(namespaceName);
    const namespace = data.namespaces.find((ns) => ns.name === namespaceName);
    if (namespace && namespace.tables.length > 0) {
      setSelectedTable(namespace.tables[0].name);
    }
  };

  const handleTableChange = (event: SelectChangeEvent<string>) => {
    setSelectedTable(event.target.value as string);
  };

  const handleFormSubmit = (updatedTableData: Table) => {
    const updatedData = { ...data };
    const namespace = updatedData.namespaces.find((ns) => ns.name === selectedNamespace);

    if (namespace) {
      const tableIndex = namespace.tables.findIndex((table) => table.name === selectedTable);
      if (tableIndex !== -1) {
        namespace.tables[tableIndex] = updatedTableData;
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
    const fromNamespace = updatedData.namespaces.find((ns) => ns.name === from.namespace);
    const toNamespace = updatedData.namespaces.find((ns) => ns.name === to.namespace);

    if (fromNamespace && toNamespace) {
      fromNamespace.relations.push({
        fromTable: from.table,
        fromColumn: from.column,
        toTable: to.table,
        toColumn: to.column,
      });

      toNamespace.relations.push({
        fromTable: to.table,
        fromColumn: to.column,
        toTable: from.table,
        toColumn: from.column,
      });

      setData(updatedData);
    } else {
      console.error("One or both namespaces not found");
    }

    setOpenPopup(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            gap: 2,
            pb: 4,
          }}
        >
          <Select value={selectedNamespace} onChange={handleNamespaceChange} fullWidth>
            {data.namespaces.map((namespace) => (
              <MenuItem key={namespace.name} value={namespace.name}>
                {namespace.name}
              </MenuItem>
            ))}
          </Select>
          <Select value={selectedTable} onChange={handleTableChange} fullWidth>
            {currentNamespace?.tables.map((table) => (
              <MenuItem key={table.name} value={table.name}>
                {table.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* TableEditForm for selected table */}

        {currentTable && <TableEditForm tableData={currentTable} onSubmit={handleFormSubmit} />}
      </Box>

      {/* Relations Visualisation  */}

      {currentNamespace && <RelationVisualization currentNamespace={currentNamespace} />}

      {/* Popup for adding relations */}

      <Button variant="contained" color="secondary" onClick={handleAddRelation}>
        Add Relation
      </Button>

      {openPopup && (
        <AddRelationPopUp
          data={data}
          onClose={handleClosePopup}
          onSave={handleRelationFormSubmit}
        />
      )}
    </ThemeProvider>
  );
};

export default Home;
