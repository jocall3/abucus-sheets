import React, { useEffect, useState } from 'react';
import { FunctionSquare } from 'lucide-react';
import { useWorkbook } from '../context/WorkbookContext';

export const FormulaBar: React.FC = () => {
  const { state, updateCell } = useWorkbook();
  const activeAddress = state.activeCell || '';
  const activeCell = state.workbook.sheets[state.workbook.activeSheetId].cells[activeAddress];
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(activeCell?.value || '');
  }, [activeCell, activeAddress]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateCell(activeAddress, value);
      e.currentTarget.blur(); // Remove focus after commit
    }
  };

  return (
    <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 z-20 relative">
       <div className="w-10 text-center text-sm font-bold text-gray-500 border-r border-gray-300 pr-2">
         {activeAddress}
       </div>
       <div className="px-3 text-gray-400">
         <FunctionSquare size={16} />
       </div>
       <div className="flex-1">
         <input 
           className="w-full text-sm py-1 px-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
           value={value}
           onChange={(e) => setValue(e.target.value)}
           onKeyDown={handleKeyDown}
           onBlur={() => updateCell(activeAddress, value)}
           placeholder="Enter value or formula"
         />
       </div>
    </div>
  );
};