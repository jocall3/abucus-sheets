import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, PaintBucket } from 'lucide-react';
import { useWorkbook } from '../context/WorkbookContext';

const ToolbarButton: React.FC<{ icon: React.ReactNode; onClick?: () => void; active?: boolean }> = ({ icon, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
  >
    {icon}
  </button>
);

const ToolbarDivider = () => <div className="w-px h-6 bg-gray-300 mx-2" />;

export const Toolbar: React.FC = () => {
  const { setCellStyle } = useWorkbook();

  return (
    <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-white space-x-1 shadow-sm z-20 relative">
      <div className="flex items-center space-x-1">
         {/* History */}
         <button className="text-sm font-medium px-2 py-1 rounded hover:bg-gray-100">Undo</button>
         <button className="text-sm font-medium px-2 py-1 rounded hover:bg-gray-100">Redo</button>
      </div>
      <ToolbarDivider />
      <div className="flex items-center space-x-1">
        <ToolbarButton icon={<Bold size={18} />} onClick={() => setCellStyle({ bold: true })} />
        <ToolbarButton icon={<Italic size={18} />} onClick={() => setCellStyle({ italic: true })} />
        <ToolbarButton icon={<Underline size={18} />} onClick={() => setCellStyle({ underline: true })} />
        <ToolbarButton icon={<span className="line-through text-sm px-1">S</span>} />
      </div>
      <ToolbarDivider />
      <div className="flex items-center space-x-1">
        <ToolbarButton icon={<Type size={18} />} />
        <ToolbarButton icon={<PaintBucket size={18} />} />
      </div>
      <ToolbarDivider />
      <div className="flex items-center space-x-1">
        <ToolbarButton icon={<AlignLeft size={18} />} onClick={() => setCellStyle({ align: 'left' })} />
        <ToolbarButton icon={<AlignCenter size={18} />} onClick={() => setCellStyle({ align: 'center' })} />
        <ToolbarButton icon={<AlignRight size={18} />} onClick={() => setCellStyle({ align: 'right' })} />
      </div>
    </div>
  );
};