import axios from "axios";
import { baseUrl } from "./BaseUrl";

export const fetchKeyspaces = async () => {
  try {
    const response = await axios.get(baseUrl + "/keyspace_names");
    const keyspaces = response.data;
    return keyspaces;
  } catch (error) {
    console.error("Error fetching keyspaces", error);
    throw new Error("Error fetching keyspaces");
  }
};

export const fetchTables = async (selectedKeyspace :string) => {
  try {
    const response = await axios.get(baseUrl + `/table_names?keyspace_name=${selectedKeyspace}`);
    const tables = response.data;
    return tables;
  } catch (error) {
    console.error("Error fetching tables", {keyspace: selectedKeyspace, error: error});
    throw new Error(`Error fetching tables for keyspace: ${selectedKeyspace}`);
  }
};

export const fetchTableData = async (from_keyspace :string, from_table:string) => {
  try {
    const tableData = await axios.get(baseUrl + `/get_columns?keyspace_name=${from_keyspace}&table_name=${from_table}`);
    return tableData;
  } catch (error) {
    console.error("Error fetching table data", {keyspace: from_keyspace, table:from_table ,error: error});
    throw new Error(`Error fetching tables for table: ${from_keyspace}.${from_table}`);
  }
};

