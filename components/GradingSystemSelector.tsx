import React, { useState, useEffect } from 'react';
import { GradingSystem, GradingType } from '../types';

interface GradingSystemSelectorProps {
  system: GradingSystem;
  onChange: (system: GradingSystem) => void;
}

const GradingSystemSelector: React.FC<GradingSystemSelectorProps> = ({ system, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customTD, setCustomTD] = useState(system.type === 'custom' ? system.tdWeight.toString() : '');
  const [customExam, setCustomExam] = useState(system.type === 'custom' ? system.examWeight.toString() : '');

  // Update local custom inputs if system changes externally (e.g. reset)
  useEffect(() => {
    if (system.type !== 'custom') {
      setCustomTD('');
      setCustomExam('');
    }
  }, [system]);

  const handleSelect = (type: GradingType) => {
    if (type === 'custom') {
      onChange({ type, tdWeight: Number(customTD) || 0, examWeight: Number(customExam) || 0 });
    } else {
      const parts = type.split('-');
      onChange({
        type,
        tdWeight: Number(parts[0]),
        examWeight: Number(parts[1])
      });
    }
  };

  const handleCustomChange = (field: 'td' | 'exam', value: string) => {
    const numVal = parseFloat(value);
    
    // Update local state immediately for input display
    if (field === 'td') setCustomTD(value);
    else setCustomExam(value);

    // Update parent state
    const newTd = field === 'td' ? (isNaN(numVal) ? 0 : numVal) : (Number(customTD) || 0);
    const newExam = field === 'exam' ? (isNaN(numVal) ? 0 : numVal) : (Number(customExam) || 0);

    onChange({
      type: 'custom',
      tdWeight: newTd,
      examWeight: newExam
    });
  };

  const getLabel = () => {
    if (system.type === 'custom') {
      return `Custom: ${system.tdWeight}% TD - ${system.examWeight}% Exam`;
    }
    return `Weight: ${system.tdWeight}% TD - ${system.examWeight}% Exam`;
  };

  return (
    <section className="px-4 py-6 max-w-2xl mx-auto w-full">
      <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
        Grading System Configuration
      </label>
      
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-surface-light dark:bg-surface-dark border ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-5 py-4 flex items-center justify-between transition-all duration-200 group hover:border-primary dark:hover:border-primary`}
        >
          <div className="flex flex-col items-start">
            <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {getLabel()}
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              {isOpen ? "Select a preset or configure custom weights" : "Click to change grading system"}
            </span>
          </div>
          <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
            expand_more
          </span>
        </button>

        {/* Dropdown Content */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
            {['40-60', '50-50', '33-67'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSelect(preset as GradingType)}
                className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${
                  system.type === preset
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/30'
                    : 'bg-white dark:bg-[#111722] border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="font-semibold">{preset.replace('-', '% TD - ')}% Exam</span>
              </button>
            ))}
            
            <button
              onClick={() => handleSelect('custom')}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${
                system.type === 'custom'
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/30'
                  : 'bg-white dark:bg-[#111722] border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="font-semibold">Custom Weights</span>
            </button>
          </div>

          {/* Custom Inputs */}
          <div className={`mt-3 grid grid-cols-2 gap-4 transition-all duration-300 ${system.type === 'custom' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none absolute'}`}>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">TD Weight (%)</label>
                <input 
                  type="number"
                  value={customTD}
                  onChange={(e) => handleCustomChange('td', e.target.value)}
                  className="w-full bg-white dark:bg-[#111722] border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="0-100"
                />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Exam Weight (%)</label>
                <input 
                  type="number"
                  value={customExam}
                  onChange={(e) => handleCustomChange('exam', e.target.value)}
                  className="w-full bg-white dark:bg-[#111722] border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="0-100"
                />
             </div>
             {(Number(customTD) + Number(customExam) !== 100) && (
               <div className="col-span-2 text-red-500 text-xs font-bold flex items-center gap-1 animate-pulse">
                 <span className="material-symbols-outlined text-[16px]">warning</span>
                 Weights must sum to 100% (Current: {Number(customTD) + Number(customExam)}%)
               </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GradingSystemSelector;
