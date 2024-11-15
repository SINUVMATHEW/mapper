import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import { Table, DataType, RelationSelection } from "../interfaces/interfaces";
import {
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
  Button,
  Autocomplete,
  TextField,
  Card,
  Grid,
  Typography,
} from "@mui/material";
import TableEditForm from "./TableEditForm";
import AddRelationPopUp from "./AddRelationPopUp";
import NestedFlow from "../../flowchart/flowchartbase";
import { IoMdCloudUpload } from "react-icons/io";

const Home = () => {
  const [data, setData] = useState<DataType | null>(null);
  const [selectedKeyspace, setSelectedKeyspace] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [query, setQuery] = useState("");
  
  const search_parameters = Object.keys(Object.assign({}, ...searchData));

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

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/keyspace_names');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();

        // Update state with fetched data
        setData(jsonData);

        // Set default selected keyspace and table if available
        if (jsonData.Keyspaces && jsonData.Keyspaces.length > 0) {
          setSelectedKeyspace(jsonData.Keyspaces[0]?.name || '');
          setSelectedTable(jsonData.Keyspaces[0]?.tables[0]?.name || '');
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);  // Set loading to false once the API call finishes
      }
    };

    fetchData();
  }, []);




  const fetchSearchData = () => {
    return fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())

      .then((d) => setSearchData(d));
  };

  useEffect(() => {
    fetchSearchData();
  }, []);
  

  function search(searchData: any) {
    return searchData.filter((searchData: any) =>
      search_parameters.some((parameter) =>
        searchData[parameter].toString().toLowerCase().includes(query)
      )
    );
  }

  if (!data) {
    return <Box>Loading...</Box>;
  }

  const currentKeyspace = data.Keyspaces.find((Keyspace) => Keyspace.name === selectedKeyspace);

  const currentTable = currentKeyspace?.tables.find((table) => table.name === selectedTable);

  const handleKeyspaceChange = (event: SelectChangeEvent<string>) => {
    const KeyspaceName = event.target.value;
    setSelectedKeyspace(KeyspaceName);
    const Keyspace = data.Keyspaces.find((ns) => ns.name === KeyspaceName);
    if (Keyspace && Keyspace.tables.length > 0) {
      setSelectedTable(Keyspace.tables[0].name);
    }
  };

  const handleTableChange = (_: React.SyntheticEvent, newValue: string | null) => {
    if (newValue) {
      setSelectedTable(newValue);
    }
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
          <Autocomplete
            value={selectedTable}
            onChange={(event, newValue) => handleTableChange(event, newValue)}
            options={currentKeyspace?.tables.map((table) => table.name) || []}
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

        {/* global search  */}
        <Box sx={{ marginTop: 2 }}>
          <TextField
            variant="outlined"
            type="search"
            id="search-form"
            name="search-form"
            fullWidth
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user"
          />
        </Box>

        <Box component="center" sx={{ marginTop: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            {search(searchData).map((dataObj: any) => (
              <Grid item xs={12} sm={6} md={4} key={dataObj.username}>
                <Card sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    @{dataObj.username}
                  </Typography>
                  <Typography variant="h6" component="div" gutterBottom>
                    {dataObj.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dataObj.email}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* TableEditForm for selected table */}
        {currentTable && (
          <Box sx={{ pb: 3 }}>
            <TableEditForm tableData={currentTable} onSubmit={handleFormSubmit} />
          </Box>
        )}

        {/* Button and Popup for Adding Relations */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Button variant="contained" color="secondary" size="small" onClick={handleAddRelation}>
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
      {/* Relations Visualization */}
      {/* Flowchart */}
      <NestedFlow />
    </ThemeProvider>
  );
};

export default Home;
