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
  column_name: string;
  type: string;
  clustering_order: string;
  kind: string;
  position: number;
  note?: string | null;
  tag?: string[];
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
  keyspace: string;
  table: string;
}

export interface RelationSelection {
  Keyspace: string | undefined;
  table: string;
  column: string;
}

export interface AddRelationPopUpProps {
  // data: DataType;
  onClose: () => void;
  onSave: (isSuccess: boolean) => void;
}

export interface RelationVisualizationProps {
  currentKeyspace: Keyspace;
}

export interface Row {
  column_name: string;
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

export interface FormDataProps {
  name: string;
  note: string;
  tag: string[];
  columns: Column[];
}

export type tableDescriptionFormpProps = {
    keyspace_name: string;
    table_name: string;
    note: string;
    tags: string;
  };
