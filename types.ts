export type CellType = 'text' | 'number' | 'formula' | 'boolean' | 'error';

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  backgroundColor?: string;
  align?: 'left' | 'center' | 'right';
}

export interface CellData {
  value: string; // The raw input (e.g., "=SUM(A1:A5)" or "100")
  computed?: string | number | boolean; // The result
  type: CellType;
  style?: CellStyle;
  dependencies?: string[];
}

export interface SheetData {
  id: string;
  name: string;
  cells: Record<string, CellData>; // Keyed by address "A1", "B2"
  columnWidths: Record<string, number>;
  rowHeights: Record<string, number>;
}

export interface WorkbookData {
  id: string;
  title: string;
  sheets: Record<string, SheetData>;
  activeSheetId: string;
}

export interface SelectionRange {
  start: string; // "A1"
  end: string;   // "C5"
}

export interface AppState {
  workbook: WorkbookData;
  selection: SelectionRange | null;
  activeCell: string | null; // "A1"
  mode: 'view' | 'edit';
  formulaBarFocused: boolean;
}