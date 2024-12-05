// defaultColumn constants
export const defaultColumn = {
  column_name: "",
  type: "",
  clusteringOrder: "none",
  kind: "regular",
  position: -1,
  note: "",
  tag: [],
};
// column table constants
export const columns = [
  { field: "column_name", headerName: "Column Name", width: 150 },
  { field: "type", headerName: "Column Type", width: 130 },
  { field: "clustering_order", headerName: "Clustering Order", width: 140 },
  { field: "kind", headerName: "kind", width: 200 },
  { field: "position", headerName: "Position", width: 90 },
  { field: "note", headerName: "Note", width: 220 },
  { field: "tag", headerName: "Tag", width: 200 },
];
// column table pagination Model constants
export const paginationModel = { page: 0, pageSize: 5 };
