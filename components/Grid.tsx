import React, { useCallback, useRef } from 'react';
import { useWorkbook } from '../context/WorkbookContext';
import { FormulaEngine } from '../services/formulaEngine';
import clsx from 'clsx';

const COL_HEADER_HEIGHT = 28;
const ROW_HEADER_WIDTH = 46;
const DEFAULT_COL_WIDTH = 100;
const DEFAULT_ROW_HEIGHT = 24;

const ROWS = 100;
const COLS = 26; // A-Z for demo

export const Grid: React.FC = () => {
  const { state, selectCell, updateCell, activeSheet } = useWorkbook();

  // Generate headers
  const cols = Array.from({ length: COLS }, (_, i) => FormulaEngine.indexToCol(i));
  const rows = Array.from({ length: ROWS }, (_, i) => i + 1);

  const handleCellClick = (address: string, e: React.MouseEvent) => {
    selectCell(address, e.shiftKey);
  };

  const handleDoubleClick = (address: string) => {
    // In a full implementation, this switches 'mode' to 'edit' and renders an input inside the cell
    console.log("Edit mode triggered for", address);
  };

  return (
    <div className="flex-1 overflow-auto relative bg-gray-100" style={{ height: 'calc(100vh - 110px)' }}>
      <div className="inline-block bg-white shadow-sm m-1 relative">
        {/* Corner */}
        <div 
          className="absolute top-0 left-0 bg-gray-100 border-r border-b border-gray-300 z-10"
          style={{ width: ROW_HEADER_WIDTH, height: COL_HEADER_HEIGHT }}
        />

        {/* Column Headers */}
        <div className="flex absolute top-0 z-0" style={{ left: ROW_HEADER_WIDTH }}>
           {cols.map(col => (
             <div 
               key={col}
               className="flex items-center justify-center bg-gray-100 border-r border-b border-gray-300 text-xs font-semibold text-gray-600 select-none"
               style={{ width: DEFAULT_COL_WIDTH, height: COL_HEADER_HEIGHT }}
             >
               {col}
             </div>
           ))}
        </div>

        {/* Row Headers */}
        <div className="absolute left-0 z-0" style={{ top: COL_HEADER_HEIGHT }}>
           {rows.map(row => (
             <div 
                key={row}
                className="flex items-center justify-center bg-gray-100 border-b border-r border-gray-300 text-xs font-semibold text-gray-600 select-none"
                style={{ width: ROW_HEADER_WIDTH, height: DEFAULT_ROW_HEIGHT }}
             >
               {row}
             </div>
           ))}
        </div>

        {/* Cells Grid */}
        <div className="relative bg-white" style={{ marginTop: COL_HEADER_HEIGHT, marginLeft: ROW_HEADER_WIDTH }}>
           {rows.map(row => (
             <div key={row} className="flex">
               {cols.map(col => {
                 const address = `${col}${row}`;
                 const cellData = activeSheet.cells[address];
                 const isActive = state.activeCell === address;
                 const isSelected = false; // Simplified selection logic for demo

                 return (
                   <div
                     key={address}
                     className={clsx(
                       "border-r border-b border-gray-200 text-sm flex items-center px-1 truncate cursor-cell select-none",
                       isActive && "outline outline-2 outline-blue-500 z-10 bg-blue-50",
                       !isActive && "hover:bg-gray-50"
                     )}
                     style={{ 
                       width: DEFAULT_COL_WIDTH, 
                       height: DEFAULT_ROW_HEIGHT,
                       textAlign: cellData?.style?.align || 'left',
                       fontWeight: cellData?.style?.bold ? 'bold' : 'normal',
                       fontStyle: cellData?.style?.italic ? 'italic' : 'normal',
                       textDecoration: cellData?.style?.underline ? 'underline' : 'none',
                     }}
                     onClick={(e) => handleCellClick(address, e)}
                     onDoubleClick={() => handleDoubleClick(address)}
                   >
                     {cellData?.computed ?? ''}
                   </div>
                 );
               })}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};