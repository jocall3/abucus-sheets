import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WorkbookData, SheetData, CellData, AppState, SelectionRange } from '../types';
import { FormulaEngine } from '../services/formulaEngine';

interface WorkbookContextType {
  state: AppState;
  updateCell: (address: string, value: string) => void;
  selectCell: (address: string, multi?: boolean) => void;
  setCellStyle: (style: Partial<CellData['style']>) => void;
  evaluateAll: () => void;
  activeSheet: SheetData;
}

const defaultSheet: SheetData = {
  id: 'sheet1',
  name: 'Sheet1',
  cells: {},
  columnWidths: {},
  rowHeights: {},
};

const defaultWorkbook: WorkbookData = {
  id: 'wb1',
  title: 'Untitled Workbook',
  sheets: { 'sheet1': defaultSheet },
  activeSheetId: 'sheet1',
};

const WorkbookContext = createContext<WorkbookContextType | undefined>(undefined);

export const WorkbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    workbook: defaultWorkbook,
    selection: { start: 'A1', end: 'A1' },
    activeCell: 'A1',
    mode: 'view',
    formulaBarFocused: false,
  });

  const activeSheet = state.workbook.sheets[state.workbook.activeSheetId];

  const updateCell = useCallback((address: string, rawValue: string) => {
    setState(prev => {
      const wb = { ...prev.workbook };
      const sheet = wb.sheets[wb.activeSheetId];
      
      const newCell: CellData = {
        value: rawValue,
        type: isNaN(Number(rawValue)) ? (rawValue.startsWith('=') ? 'formula' : 'text') : 'number',
        computed: FormulaEngine.evaluate(sheet, address, rawValue),
        style: sheet.cells[address]?.style || {},
      };

      sheet.cells = { ...sheet.cells, [address]: newCell };
      
      // Basic dependency re-evaluation (Evaluates ALL for simplicity in this demo)
      // In a real app, use a topological sort graph from FormulaEngine
      Object.keys(sheet.cells).forEach(key => {
        if (key !== address && sheet.cells[key].type === 'formula') {
           sheet.cells[key].computed = FormulaEngine.evaluate(sheet, key, sheet.cells[key].value);
        }
      });

      return { ...prev, workbook: wb };
    });
  }, []);

  const selectCell = useCallback((address: string, multi = false) => {
    setState(prev => ({
      ...prev,
      activeCell: address,
      selection: multi && prev.activeCell ? { start: prev.activeCell, end: address } : { start: address, end: address }
    }));
  }, []);

  const setCellStyle = useCallback((newStyle: Partial<CellData['style']>) => {
    setState(prev => {
      const wb = { ...prev.workbook };
      const sheet = wb.sheets[wb.activeSheetId];
      const { start, end } = prev.selection || { start: 'A1', end: 'A1' };
      
      // Apply to range (simple loop)
      // This demo assumes start/end are corners, needs expansion logic for real range
      // We'll just apply to active cell for safety in this constrained demo or expand if simple
      const targetCells = [prev.activeCell || 'A1']; // Simplification
      
      targetCells.forEach(addr => {
        const cell = sheet.cells[addr] || { value: '', type: 'text', computed: '' };
        cell.style = { ...cell.style, ...newStyle };
        sheet.cells[addr] = cell;
      });

      return { ...prev, workbook: wb };
    });
  }, []);

  const evaluateAll = useCallback(() => {
    // Force re-render/re-calc if needed
  }, []);

  return (
    <WorkbookContext.Provider value={{ state, updateCell, selectCell, setCellStyle, evaluateAll, activeSheet }}>
      {children}
    </WorkbookContext.Provider>
  );
};

export const useWorkbook = () => {
  const context = useContext(WorkbookContext);
  if (!context) throw new Error('useWorkbook must be used within a WorkbookProvider');
  return context;
};