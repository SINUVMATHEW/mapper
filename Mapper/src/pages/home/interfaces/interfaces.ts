export interface Keyspace {
  name: string;
  tables: Table[];
  relations: Relation[];
}

export interface Table {
  name: string;
  note: string;
  tag: string[];
  columns: Column[];
}

export interface Column {
  name: string;
  type: string;
  clusteringOrder: string;
  kind: string;
  position : number
  note: string;
  tag: string[];
}

export interface Relation {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}


export interface DataType {
  Keyspaces: Keyspace[];
}

export interface TableEditFormProps {
  tableData: Table;
  onSubmit: (updatedTableData: Table) => void;
}

export interface RelationSelection {
  Keyspace: string | undefined;
  table: string;
  column: string;
}

export interface AddRelationPopUpProps {
  data: DataType;
  onClose: () => void;
  onSave: (from: RelationSelection, to: RelationSelection) => void;
}

export interface RelationVisualizationProps {
  currentKeyspace: Keyspace;
}

export interface Row {
  name: string;
}
export interface Params {
  row: Row;
}

export interface ChipInputProps {
  chipData: string[];
  onAddChip: (chip: string) => void;
  onDeleteChip: (chip: string) => void;
  placeholder?: string;
}
