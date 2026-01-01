import React, { useState } from 'react';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useWorkbook } from '../context/WorkbookContext';

export const AISidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeSheet, updateCell, state } = useWorkbook();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResponse(null);

    // Simple heuristic: Does the user want a formula inserted?
    if (prompt.toLowerCase().includes('cell') && (prompt.toLowerCase().includes('put') || prompt.toLowerCase().includes('write'))) {
        const formula = await geminiService.generateFormula(prompt);
        if (formula) {
            setResponse(`I've generated a formula for you: ${formula}`);
            // Logic to auto-insert could go here if we parsed the intent deeply
            // For now, assume active cell
            if (state.activeCell) {
                updateCell(state.activeCell, formula);
            }
        } else {
            setResponse("I couldn't generate a valid formula.");
        }
    } else {
        // General analysis
        const result = await geminiService.analyzeData(activeSheet, prompt);
        setResponse(result);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col shadow-xl z-30 absolute right-0 top-0 bottom-0">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold">
           <Sparkles size={18} />
           <span>Abacus AI</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {response && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {response}
            </div>
        )}
        {isLoading && (
            <div className="flex justify-center py-8 text-indigo-500">
                <Loader2 className="animate-spin" size={24} />
            </div>
        )}
        {!response && !isLoading && (
            <div className="text-center py-10 text-gray-400 text-sm">
                Ask me to analyze your data or write a complex formula.
            </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            rows={3}
            placeholder="E.g., 'Sum column A if B is greater than 100'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
          />
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="absolute bottom-2 right-2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};