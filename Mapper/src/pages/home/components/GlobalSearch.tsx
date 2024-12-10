import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table";
import { Box, TextField } from "@mui/material";
import { baseUrl } from "../../../services/api/BaseUrl";
type CustomData = {
  clustering_order: string;
  column_name: string;
  column_name_bytes: string;
  keyspace_name: string;
  kind: string;
  position: number;
  table_name: string;
  type: string;
  note: string;
  tag: string[];
};

const GlobalSearch = () => {
  const [data, setData] = useState<CustomData[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsRefetching(true);
      try {
        const url = new URL(baseUrl + "/filtered_data");
        url.searchParams.set("search", globalFilter || "");
        const response = await fetch(url.href);
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }
        const json = await response.json();
        if (json && Array.isArray(json)) {
          setData(json);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setData([]);
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    };
    fetchData();
  }, [globalFilter]);

  const columns = useMemo<MRT_ColumnDef<CustomData>[]>(
    () => [
      { accessorKey: "keyspace_name", header: "Keyspace Name" },
      { accessorKey: "table_name", header: "Table Name" },
      { accessorKey: "column_name", header: "Column Name" },
      { accessorKey: "note", header: "Note" },
      { accessorKey: "tag", header: "Tag" },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,

    getRowId: (row) => row.column_name_bytes,
    manualFiltering: true,
    positionGlobalFilter: "left",
    manualPagination: false, //to prevent from fetching on each pagination
    manualSorting: true,
    enableTopToolbar: false,
    enableGlobalFilter: false, //to disable inbuild filter button
    muiSearchTextFieldProps: {
      placeholder: "Global Search",
      sx: { minWidth: "300px" },
      variant: "outlined",
    },
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#e2e2e2",
        color: "#000",
        fontWeight: "normal",
      },
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        const { keyspace_name, table_name } = row.original;
        const openInNewTab = (keyspace: string, table: string) => {
          const url = `/dashboard/${keyspace}/${table}`;
          window.open(url, "_blank", "noopener,noreferrer");
        };

        openInNewTab(keyspace_name, table_name);
      },
      style: { cursor: "pointer" },
    }),
  });

  return (
    <>
      {isLoading && <div>Loading...</div>}

      <TextField
        variant="outlined"
        type="search"
        id="search-form"
        name="search-form"
        autoFocus
        fullWidth
        size="small"
        value={globalFilter}
        onChange={(e) => {
          const value = e.target.value;
          setGlobalFilter(value);
          setIsSearchActive(value !== "");
        }}
        // onFocus={() => setIsSearchActive(true)}
        placeholder="Global Search"
        sx={{ paddingBottom: 3 }}
      />

      {isSearchActive && (
        <Box style={{ height: "500px", overflowY: "auto", paddingBottom: 10 }}>
          <MaterialReactTable table={table} />
        </Box>
      )}

      {isError && <div>Error occurred. Please try again later.</div>}
    </>
  );
};

export default GlobalSearch;
