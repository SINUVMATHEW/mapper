import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import { Table, RelationSelection } from "../interfaces/interfaces";
import {
  Select,
  MenuItem,
  Box,
  Button,
  Autocomplete,
  TextField,
  Typography,
  Skeleton,
} from "@mui/material";
import TableEditForm from "./TableEditForm";
import AddRelationPopUp from "./AddRelationPopUp";
import NestedFlow from "../../flowchart/flowchartbase";
import { IoMdCloudUpload } from "react-icons/io";
import Example from "./GlobalSearch";
const Home = () => {
  const [keyspaces, setKeyspaces] = useState([]);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedKeyspace, setSelectedKeyspace] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const search_parameters = Object.keys(Object.assign({}, ...searchData));

  // fetching keyspaces
  useEffect(() => {
    const fetchKeyspaces = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/keyspace_names");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setKeyspaces(jsonData);
        if (jsonData.length > 0) {
          const firstKeyspace = jsonData[0];
          setSelectedKeyspace(firstKeyspace);
          setLoading(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching keyspaces: ${error.message}`);
          console.log(error.message);
          setLoading(true);
        } else {
          setError("An unexpected error occurred.");
        }
      } 
    };
    fetchKeyspaces();
  }, []);

  // fetching tables
  useEffect(() => {
    const fetchTableNames = async () => {
      if (!selectedKeyspace) return;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/table_names?keyspace_name=${selectedKeyspace}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setTables(jsonData);
        if (jsonData.length > 0) {
          setSelectedTable(jsonData[0]);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching tables: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTableNames();
  }, [selectedKeyspace]);

  if (!keyspaces) {
    return <Box>Loading...</Box>;
  }

  const handleTableChange = (event: React.SyntheticEvent, value: string | null) => {
    setSelectedTable(value);
  };

  const handleFormSubmit = (updatedTableData: Table) => {
    // const updatedData = { ...data };
    // const Keyspace = updatedData.Keyspaces.find((ns) => ns.name === selectedKeyspace);
    // if (Keyspace) {
    //   const tableIndex = Keyspace.tables.findIndex((table) => table.name === selectedTable);
    //   if (tableIndex !== -1) {
    //     Keyspace.tables[tableIndex] = updatedTableData;
    //     setData(updatedData);
    //   }
    // }
  };

  const handleAddRelation = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleRelationFormSubmit = (from: RelationSelection, to: RelationSelection) => {
    // const updatedData = { ...data };
    // const fromKeyspace = updatedData.Keyspaces.find((ns) => ns.name === from.Keyspace);
    // const toKeyspace = updatedData.Keyspaces.find((ns) => ns.name === to.Keyspace);

    // if (fromKeyspace && toKeyspace) {
    //   fromKeyspace.relations.push({
    //     fromTable: from.table,
    //     fromColumn: from.column,
    //     toTable: to.table,
    //     toColumn: to.column,
    //   });

    //   toKeyspace.relations.push({
    //     fromTable: to.table,
    //     fromColumn: to.column,
    //     toTable: from.table,
    //     toColumn: from.column,
    //   });

    //   setData(updatedData);
    // } else {
    //   console.error("One or both Keyspaces not found");
    // }

    setOpenPopup(false);
  };
  console.log(error);

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <Box>
          <Typography align="center">{error}</Typography>
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Skeleton variant="rectangular" width={"40%"} height={40} />
            <Skeleton variant="rectangular" width={"40%"} height={40} />
            <Skeleton variant="rectangular" width={"10%"} height={40} />

          </Box>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton variant="rectangular" width={"100%"} height={200} />

          {/* <CircularProgress color="primary" /> */}
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
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
              onChange={(e) => setSelectedKeyspace(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ flex: 1 }}
            >
              {keyspaces.map((keyspace) => (
                <MenuItem key={keyspace} value={keyspace}>
                  {keyspace}
                </MenuItem>
              ))}
            </Select>

            <Autocomplete
              value={selectedTable}
              onChange={handleTableChange}
              options={tables}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Table"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              )}
              size="small"
              fullWidth
              sx={{ flex: 1 }}
            />

            <Button
              component="label"
              variant="contained"
              startIcon={<IoMdCloudUpload />}
              tabIndex={-1}
            >
              Upload files
              <input
                type="file"
                hidden
                // onChange={handleFileChange}
              />
            </Button>
          </Box>
          {/* globalsearch */}
          <Example />
          {/* TableEditForm for selected table */}
          {selectedKeyspace && (
            <Box sx={{ pb: 3 }}>
              <TableEditForm
                keyspace={selectedKeyspace}
                table={selectedTable}
                onSubmit={handleFormSubmit}
              />
            </Box>
          )}

          {/* Button and Popup for Adding Relations */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleAddRelation}
              sx={{ margin: 3 }}
            >
              Add Relation
            </Button>
            {openPopup && (
              <AddRelationPopUp onClose={handleClosePopup} onSave={handleRelationFormSubmit} />
            )}
          </Box>
          <NestedFlow />
        </Box>
      )}
      {/* Relations Visualization */}
    </ThemeProvider>
  );
};

export default Home;
