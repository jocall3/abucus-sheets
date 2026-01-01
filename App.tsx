import React, { useState } from 'react';
import { WorkbookProvider } from './context/WorkbookContext';
import { Toolbar } from './components/Toolbar';
import { FormulaBar } from './components/FormulaBar';
import { Grid } from './components/Grid';
import { AISidebar } from './components/AISidebar';
import { Sheet, Menu, Sparkles, Share2, Download, Settings } from 'lucide-react';

const Header = ({ onToggleAI }: { onToggleAI: () => void }) => (
  <header className="flex items-center justify-between px-4 h-12 bg-white border-b border-gray-200 z-30 relative">
    <div className="flex items-center space-x-3">
      <div className="p-1.5 bg-green-600 rounded text-white">
        <Sheet size={20} />
      </div>
      <div>
        <h1 className="text-sm font-semibold text-gray-800">Untitled Spreadsheet</h1>
        <div className="flex space-x-2 text-xs text-gray-500">
          <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">File</span>
          <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Edit</span>
          <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">View</span>
          <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Insert</span>
          <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Format</span>
          <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Data</span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center space-x-2">
      <button 
        onClick={onToggleAI}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
      >
        <Sparkles size={16} />
        <span>Abacus AI</span>
      </button>
      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
        <Share2 size={18} />
      </button>
       <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
         JS
       </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="h-8 bg-gray-50 border-t border-gray-200 flex items-center px-2 space-x-1">
     <button className="px-4 py-1 bg-white text-sm font-medium text-green-700 border-b-2 border-green-600 shadow-sm">
       Sheet1
     </button>
     <button className="p-1 hover:bg-gray-200 rounded text-gray-500">
       <div className="text-xl leading-none font-bold">+</div>
     </button>
  </footer>
);

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <WorkbookProvider>
      <div className="flex flex-col h-screen bg-white overflow-hidden font-sans text-gray-900">
        <Header onToggleAI={() => setAiOpen(!aiOpen)} />
        <Toolbar />
        <FormulaBar />
        <div className="flex-1 flex relative overflow-hidden">
          <Grid />
          <AISidebar isOpen={aiOpen} onClose={() => setAiOpen(false)} />
        </div>
        <Footer />
      </div>
    </WorkbookProvider>
  );
}