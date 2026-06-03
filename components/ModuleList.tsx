import React, { useState, useRef, useEffect } from 'react';
import { Module, CalculationError } from '../types';
import { MAJORS } from '../constants';

interface ModuleListProps {
  modules: Module[];
  onChange: (id: string, field: keyof Module, value: string | boolean) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSelectMajor: (majorName: string, templates: Omit<Module, 'id'>[]) => void;
  errors: CalculationError[];
}

const ModuleList: React.FC<ModuleListProps> = ({ modules, onChange, onDelete, onAdd, onSelectMajor, errors }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getErrorClass = (fieldId: string) => {
     const hasError = errors.some(e => e.field === fieldId);
     return hasError 
       ? 'border-red-500 ring-2 ring-red-200 dark:ring-red-900/30 bg-red-50 dark:bg-red-900/10 z-10 text-red-900 dark:text-red-100 placeholder-red-300' 
       : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-[#111722] text-slate-900 dark:text-white';
  };

  return (
    <section className="px-4 pb-4 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Your Modules
          <span className="bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
            {modules.length}
          </span>
        </h2>
      </div>

      {/* Action Chips */}
      <div className="flex gap-3 overflow-x-visible pb-4 no-scrollbar">
        <button 
          onClick={onAdd}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-white border-2 border-black text-black dark:bg-transparent dark:border-white dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-full shadow-lg transition-all shrink-0 active:scale-95 group"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px] group-hover:rotate-90 transition-transform">add</span>
          <span className="text-xs sm:text-sm font-bold">Add Module</span>
        </button>

        {/* Major Selection Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-white border-2 border-black text-black dark:bg-transparent dark:border-white dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-full shadow-lg transition-all shrink-0 active:scale-95 group"
            title="Select your major to auto-fill modules"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">school</span>
            <span className="text-xs sm:text-sm font-bold">Choose Major</span>
            <span className={`material-symbols-outlined text-[16px] sm:text-[18px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up">
              <div className="py-1">
                {Object.keys(MAJORS).map((major) => (
                  <button
                    key={major}
                    onClick={() => {
                      onSelectMajor(major, MAJORS[major]);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-primary transition-colors flex items-center justify-between group"
                  >
                    {major}
                    <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 text-primary">arrow_forward</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 mt-2">
        {modules.map((module, index) => (
          <div 
            key={module.id}
            className="bg-white dark:bg-surface-dark rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700/50 relative group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Card Content - Compact Layout */}
            <div className="flex flex-col gap-2">
              
              {/* Row 1: Number + Name + Delete */}
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary font-bold text-xs shrink-0">
                  #{index + 1}
                </span>
                <input 
                  id={`name-${module.id}`}
                  type="text"
                  value={module.name}
                  onChange={(e) => onChange(module.id, 'name', e.target.value)}
                  placeholder="Subject Name"
                  className={`flex-1 bg-transparent border-none font-bold placeholder-slate-400 focus:ring-0 p-0 text-base transition-colors rounded-sm ${
                    errors.some(e => e.field === `name-${module.id}`) 
                      ? 'text-red-500 placeholder-red-300 underline decoration-red-500 decoration-wavy' 
                      : 'text-slate-900 dark:text-white'
                  }`}
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(module.id);
                  }}
                  className="shrink-0 text-red-500 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 relative z-10"
                  title="Delete Module"
                >
                  <span className="material-symbols-outlined text-[22px]">delete</span>
                </button>
              </div>

              {/* Row 2: Inputs in Single Horizontal Row */}
              <div className="flex gap-2">
                 <div className="flex-1 space-y-0.5">
                   <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase">TD</label>
                   <input 
                    id={`td-${module.id}`}
                    type="number" 
                    inputMode="decimal"
                    value={module.td}
                    onChange={(e) => onChange(module.id, 'td', e.target.value)}
                    placeholder="0-20"
                    min="0"
                    max="20"
                    step="0.25"
                    className={`w-full border rounded-lg px-2 py-2 text-center font-bold text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${getErrorClass(`td-${module.id}`)}`}
                  />
                 </div>

                 {!module.tdOnly && (
                   <div className="flex-1 space-y-0.5 animate-fade-in">
                     <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase">Exam</label>
                     <input 
                      id={`exam-${module.id}`}
                      type="number" 
                      inputMode="decimal"
                      value={module.exam}
                      onChange={(e) => onChange(module.id, 'exam', e.target.value)}
                      placeholder="0-20"
                      min="0"
                      max="20"
                      step="0.25"
                      className={`w-full border rounded-lg px-2 py-2 text-center font-bold text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${getErrorClass(`exam-${module.id}`)}`}
                    />
                   </div>
                 )}

                 <div className="flex-1 space-y-0.5 max-w-[80px]">
                   <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase">Coeff</label>
                   <input 
                    id={`coef-${module.id}`}
                    type="number" 
                    inputMode="decimal"
                    value={module.coef}
                    onChange={(e) => onChange(module.id, 'coef', e.target.value)}
                    placeholder="1"
                    min="0.1"
                    step="0.5"
                    className={`w-full border rounded-lg px-2 py-2 text-center font-bold text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${getErrorClass(`coef-${module.id}`)}`}
                  />
                 </div>
              </div>

              <div className="flex items-center justify-end">
                <label className="inline-flex items-center cursor-pointer group select-none">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={module.tdOnly}
                      onChange={(e) => onChange(module.id, 'tdOnly', e.target.checked)}
                    />
                    <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </div>
                  <span className="ml-2 text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">TD Only</span>
                </label>
              </div>

            </div>
            
            {/* Error Indicator */}
            {errors.some(e => e.field.endsWith(`-${module.id}`)) && (
              <div className="absolute top-2 right-10 pointer-events-none">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
            )}
          </div>
        ))}
        {modules.length === 0 && (
          <div className="text-center py-10 bg-white/50 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
             <p className="text-slate-500 dark:text-slate-400 font-medium">No modules added yet.</p>
             <button onClick={onAdd} className="text-primary font-bold mt-2 hover:underline">Click here to add one</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleList;