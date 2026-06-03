import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import GradingSystemSelector from './components/GradingSystemSelector';
import ModuleList from './components/ModuleList';
import Results from './components/Results';
import HelpModal from './components/HelpModal';
import ContactModal from './components/ContactModal';
import Toast, { ToastMessage, ToastType } from './components/Toast';
import { Module, GradingSystem, CalculationResult, CalculationError } from './types';
import { DEFAULT_GRADING_SYSTEM, INITIAL_MODULE } from './constants';
import { track_calculation, track_contact_open } from './utils/analytics';

const App: React.FC = () => {
  // --- State Management with Persistence ---
  
  // Theme with persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gradecalc_theme');
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    }
    return 'light';
  });

  // Grading System with persistence
  const [gradingSystem, setGradingSystem] = useState<GradingSystem>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gradecalc_system');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return DEFAULT_GRADING_SYSTEM;
  });

  // Modules with persistence
  const [modules, setModules] = useState<Module[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gradecalc_modules');
      if (saved) {
        try { 
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) { console.error(e); }
      }
    }
    return [{ ...INITIAL_MODULE, id: crypto.randomUUID() }];
  });

  // Major Name State
  const [majorName, setMajorName] = useState<string>("");

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [errors, setErrors] = useState<CalculationError[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isHelpAnimating, setIsHelpAnimating] = useState(true);

  // Refs for smooth scrolling
  const resultRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  // --- Effects for Persistence ---
  useEffect(() => {
    localStorage.setItem('gradecalc_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('gradecalc_system', JSON.stringify(gradingSystem));
  }, [gradingSystem]);

  useEffect(() => {
    localStorage.setItem('gradecalc_modules', JSON.stringify(modules));
  }, [modules]);

  // Stop help animation after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHelpAnimating(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Toast Logic ---
  const addToast = (type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Module Handlers ---
  const handleAddModule = () => {
    setModules([...modules, { ...INITIAL_MODULE, id: crypto.randomUUID() }]);
    // Scroll to bottom after render
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleModuleChange = (id: string, field: keyof Module, value: string | boolean) => {
    setModules(prev => prev.map(m => {
      if (m.id === id) {
        if (field === 'tdOnly' && value === true) {
          return { ...m, [field]: value, exam: '' }; // Clear exam if TD Only
        }
        return { ...m, [field]: value };
      }
      return m;
    }));
    
    // Improved Error Clearing:
    // If user changes a field, we attempt to clear the error associated with it.
    if (errors.length > 0) {
      setErrors(prev => prev.filter(e => {
         // Identify which field is being edited
         const isFieldEdited = e.field === `${field}-${id}`;
         
         // If switching TD Only on, clear any exam errors for this module
         const isExamClearedByMode = field === 'tdOnly' && value === true && e.field === `exam-${id}`;

         // Return true to keep error, false to remove
         return !isFieldEdited && !isExamClearedByMode;
      }));
    }
  };

  const handleDeleteModule = (id: string) => {
    const moduleToDelete = modules.find(m => m.id === id);
    
    // Safety check
    if (!moduleToDelete) {
      setModules(prev => prev.filter(m => m.id !== id));
      return;
    }

    const rawName = moduleToDelete.name || "";
    const hasName = rawName.trim().length > 0;
    const displayName = hasName ? `"${rawName}"` : 'this module';

    if (window.confirm(`Are you sure you want to delete ${displayName}?`)) {
      setModules(prev => prev.filter(m => m.id !== id));
      if (errors.length > 0) {
        setErrors(prev => prev.filter(e => !e.field.endsWith(`-${id}`)));
      }
      addToast('info', 'Module deleted.');
    }
  };

  const handleSelectMajor = (name: string, templates: Omit<Module, 'id'>[]) => {
    const templateModules = templates.map(m => ({
      ...m,
      id: crypto.randomUUID()
    }));
    setModules(templateModules);
    setMajorName(name);
    setErrors([]);
    addToast('success', `${name} modules loaded!`);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data?")) {
        // Reset state
        setModules([{ ...INITIAL_MODULE, id: crypto.randomUUID() }]);
        setGradingSystem(DEFAULT_GRADING_SYSTEM);
        setResult(null);
        setErrors([]);
        setMajorName("");
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        addToast('info', 'All data reset.');
    }
  };

  const handleContactOpen = () => {
    setIsContactOpen(true);
    track_contact_open();
  };

  // --- Calculation Logic ---
  const calculateGrades = () => {
    const newErrors: CalculationError[] = [];

    // 1. Validation
    if (modules.length === 0) {
      addToast('error', "Please add at least one module.");
      return;
    }

    if (gradingSystem.type === 'custom' && Math.abs(gradingSystem.tdWeight + gradingSystem.examWeight - 100) > 0.01) {
      addToast('error', `Weights must sum to 100%. Currently: ${gradingSystem.tdWeight + gradingSystem.examWeight}%`);
      return;
    }

    modules.forEach(m => {
      // Check Name
      if (!m.name || !m.name.trim()) {
        newErrors.push({ field: `name-${m.id}`, message: 'Name required' });
      }
      
      // Check TD
      const tdVal = parseFloat(m.td);
      if (m.td === "" || isNaN(tdVal) || tdVal < 0 || tdVal > 20) {
        newErrors.push({ field: `td-${m.id}`, message: 'Invalid TD' });
      }

      // Check Coef
      const coefVal = parseFloat(m.coef);
      if (m.coef === "" || isNaN(coefVal) || coefVal <= 0) {
        newErrors.push({ field: `coef-${m.id}`, message: 'Invalid Coeff' });
      }

      // Check Exam (if not TD only)
      if (!m.tdOnly) {
        const examVal = parseFloat(m.exam);
        if (m.exam === "" || isNaN(examVal) || examVal < 0 || examVal > 20) {
          newErrors.push({ field: `exam-${m.id}`, message: 'Invalid Exam' });
        }
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      addToast('error', "Please correct the highlighted errors.");
      
      // Auto-scroll to first error
      setTimeout(() => {
        const firstErrorId = newErrors[0].field;
        const element = document.getElementById(firstErrorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
      return;
    }

    // 2. Start Calculation with Loading Effect
    setIsCalculating(true);

    // Simulate reliable processing time
    setTimeout(() => {
      let totalWeightedScore = 0;
      let totalCoef = 0;
      const breakdown = modules.map(m => {
        const td = parseFloat(m.td);
        const coef = parseFloat(m.coef);
        let final = 0;
        let exam: number | null = null;

        if (m.tdOnly) {
          final = td;
        } else {
          exam = parseFloat(m.exam);
          const tdW = gradingSystem.tdWeight / 100;
          const examW = gradingSystem.examWeight / 100;
          final = (td * tdW) + (exam * examW);
        }

        totalWeightedScore += final * coef;
        totalCoef += coef;

        return {
          id: m.id,
          name: m.name,
          td,
          exam,
          final,
          coef
        };
      });

      // Prevent division by zero
      const average = totalCoef > 0 ? totalWeightedScore / totalCoef : 0;

      // Track Calculation
      track_calculation(average, modules.length, average >= 10);

      setResult({
        average,
        totalCoef,
        breakdown
      });
      
      setIsCalculating(false);
      addToast('success', 'Calculation Successful!');
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen items-center relative">
      <div className="w-full max-w-lg md:max-w-3xl bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-300">
        
        <Header 
          isDarkMode={theme === 'dark'} 
          toggleTheme={toggleTheme}
          onReset={handleReset}
          onContactClick={handleContactOpen}
        />

        <main ref={mainContentRef} className="flex-1 flex flex-col overflow-y-auto pb-32 scroll-smooth">
          <GradingSystemSelector 
            system={gradingSystem} 
            onChange={setGradingSystem} 
          />
          
          <ModuleList 
            modules={modules}
            onChange={handleModuleChange}
            onDelete={handleDeleteModule}
            onAdd={handleAddModule}
            onSelectMajor={handleSelectMajor}
            errors={errors}
          />
        </main>

        {/* Floating Help Button */}
        <button 
          onClick={() => {
            setIsHelpOpen(true);
            setIsHelpAnimating(false);
          }}
          className={`absolute bottom-28 right-4 w-12 h-12 bg-surface-light dark:bg-surface-dark text-slate-600 dark:text-slate-300 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-transform active:scale-95 z-20 hover:text-primary ${isHelpAnimating ? 'animate-bounce' : ''}`}
          title="How to Use"
        >
          <span className="material-symbols-outlined text-[24px]">question_mark</span>
        </button>

        {/* Sticky Footer CTA */}
        <footer className="absolute bottom-0 w-full bg-surface-light dark:bg-[#111722] border-t border-gray-200 dark:border-gray-800 p-4 pb-8 z-30">
          <button 
            onClick={calculateGrades}
            disabled={isCalculating}
            className={`w-full bg-white border-2 border-black text-black dark:bg-transparent dark:border-white dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 font-bold py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] group ${isCalculating ? 'opacity-80 cursor-wait' : ''}`}
          >
            {isCalculating ? (
               <>
                 <span className="material-symbols-outlined animate-spin">progress_activity</span>
                 <span className="text-lg tracking-wide">CALCULATING...</span>
               </>
            ) : (
               <>
                 <span className="material-symbols-outlined group-hover:scale-110 transition-transform">calculate</span>
                 <span className="text-lg tracking-wide">CALCULATE GRADES</span>
               </>
            )}
          </button>
        </footer>

        {/* Result Overlay */}
        <Results 
          result={result}
          majorName={majorName}
          gradingSystem={gradingSystem}
          onRecalculate={() => setResult(null)}
          onAddMore={() => setResult(null)}
          resultRef={resultRef}
          addToast={addToast}
        />

        {/* Modals */}
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

        {/* Toasts */}
        <Toast toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
};

export default App;