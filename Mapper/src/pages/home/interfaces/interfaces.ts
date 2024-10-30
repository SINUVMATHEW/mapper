export interface PrimaryKey {
    name: string;
}

export interface Table {
    name: string;
    note: string;
    tag: string;
    columns: Column[];
    primaryKeys: string[];
}

export interface Namespace {
    name: string;
    tables: Table[];
    relations: Relation[];
}

export interface Relation {
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
}

export interface Column {
    name: string;
    type: string;
    note: string;
    tag: string;
}

export  interface DataType {
    namespaces: Namespace[];
}
  
export interface TableEditFormProps {
  tableData: Table;
  onSubmit: (updatedTableData: Table) => void;
}

export interface RelationSelection {
  namespace: string | undefined;
  table: string;
  column: string;
}

export interface AddRelationPopUpProps {
  data: DataType
  onClose: () => void;
  onSave: (from: RelationSelection, to: RelationSelection) => void;
}