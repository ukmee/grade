import React, { useRef, useState } from 'react';
import { CalculationResult, GradingSystem } from '../types';
import { track_pdf_export } from '../utils/analytics';

interface ResultsProps {
  result: CalculationResult | null;
  majorName?: string;
  gradingSystem: GradingSystem;
  onRecalculate: () => void;
  onAddMore: () => void;
  resultRef: React.RefObject<HTMLDivElement>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const Results: React.FC<ResultsProps> = ({ result, majorName, gradingSystem, onRecalculate, onAddMore, resultRef, addToast }) => {
  const [isExporting, setIsExporting] = useState(false);
  const contentToPrintRef = useRef<HTMLDivElement>(null);

  if (!result) return null;

  const handleExportPDF = async () => {
    // Track Export Event
    track_pdf_export();

    if (typeof window.html2pdf === 'undefined') {
      addToast('error', "PDF library not loaded. Check internet.");
      return;
    }

    setIsExporting(true);
    const originalElement = contentToPrintRef.current;
    
    if (!originalElement) {
      setIsExporting(false);
      return;
    }

    // Clone the element to manipulate styles for PDF without affecting UI
    const clone = originalElement.cloneNode(true) as HTMLElement;
    
    // Ensure the clone has proper print styles
    clone.style.width = '100%';
    clone.style.maxWidth = '800px';
    clone.style.margin = '0 auto';
    clone.style.height = 'auto';
    clone.style.overflow = 'visible';
    clone.style.backgroundColor = '#ffffff'; // Ensure white background
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '0';
    container.style.width = '800px'; // Fixed width for consistent PDF
    container.style.zIndex = '-1';
    
    // Ensure container forces light mode styles if needed, or simply append
    container.className = 'light'; // Force light mode class if app uses it
    container.appendChild(clone);
    document.body.appendChild(container);

    // Show signature in PDF
    const signatures = clone.getElementsByClassName('print-signature');
    for (let i = 0; i < signatures.length; i++) {
      (signatures[i] as HTMLElement).style.display = 'block';
    }

    const opt = {
      margin: [10, 10], // top/bottom, left/right
      filename: `GradeCalc_Pro_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await window.html2pdf().set(opt).from(clone).save();
      addToast('success', "PDF Downloaded successfully!");
    } catch (e) {
      console.error("PDF generation failed", e);
      addToast('error', "Failed to generate PDF.");
    } finally {
      document.body.removeChild(container);
      setIsExporting(false);
    }
  };

  return (
    <div ref={resultRef} className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <header className="flex items-center px-4 py-3 justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-neutral-200 dark:border-neutral-800">
        <button 
          onClick={onRecalculate}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-neutral-900 dark:text-white" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h2 className="text-neutral-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">
          Calculation Result
        </h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 max-w-3xl mx-auto w-full scrollbar-hide">
        {/* Printable Content Container */}
        <div ref={contentToPrintRef} className="bg-background-light dark:bg-background-dark p-4">
          
          {/* Hero Score Card */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl bg-black dark:bg-black p-8 shadow-xl shadow-neutral-900/10 dark:border dark:border-neutral-800 overflow-hidden mb-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
            
            <p className="relative z-10 text-neutral-400 text-sm font-bold tracking-[0.2em] uppercase mb-2">Semester Average</p>
            <h1 className="relative z-10 text-white text-7xl font-extrabold tracking-tight mb-3 drop-shadow-sm">
              {result.average.toFixed(2)}
            </h1>
            <div className="relative z-10 flex flex-col items-center gap-1">
               {majorName && (
                  <span className="text-white font-bold text-sm tracking-wide bg-white/20 px-3 py-0.5 rounded-full mb-1">{majorName}</span>
               )}
               <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 backdrop-blur-sm border border-white/10">
                  <span className="text-neutral-300 text-xs font-semibold">Total Coeff: {result.totalCoef}</span>
               </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-neutral-900 dark:text-white text-lg font-bold">Detailed Breakdown</h3>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-x-auto">
            <div className="min-w-[340px]">
              {/* Header */}
              <div className="grid grid-cols-[2fr_0.8fr_1fr_1fr_1fr] gap-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-3">
                <div className="text-left text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Module</div>
                <div className="text-center text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Coeff</div>
                <div className="text-center text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">TD</div>
                <div className="text-center text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Exam</div>
                <div className="text-center text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Final</div>
              </div>
              
              {/* Rows */}
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {result.breakdown.map((item) => (
                  <div key={item.id} className="grid grid-cols-[2fr_0.8fr_1fr_1fr_1fr] gap-2 items-center px-4 py-3.5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                    <div className="text-sm font-bold text-neutral-900 dark:text-white truncate pr-2">{item.name}</div>
                    <div className="text-center text-sm text-neutral-400 dark:text-neutral-500">{item.coef}</div>
                    <div className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">{item.td.toFixed(2)}</div>
                    <div className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      {item.exam !== null ? item.exam.toFixed(2) : '--'}
                    </div>
                    <div className="flex justify-center">
                      <span className={`text-center text-xs font-bold px-2 py-1 rounded min-w-[3rem] ${
                        item.final >= 10 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {item.final.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signature for PDF */}
          <div className="mt-8 text-center hidden print-signature">
            <p className="text-neutral-400 text-xs font-medium">Generated by GradeCalc Pro • Developed by Abdou</p>
          </div>
        </div>
        
        <div className="h-6"></div>
      </main>

      {/* Sticky Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 max-w-3xl mx-auto w-full z-20">
        <div className="flex flex-col gap-3">
           <button 
             onClick={handleExportPDF}
             disabled={isExporting}
             className="w-full bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white font-bold h-12 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {isExporting ? (
               <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
             ) : (
               <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
             )}
             <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
           </button>

          <div className="flex gap-3">
            <button 
              onClick={onRecalculate}
              className="flex-1 flex items-center justify-center rounded-xl bg-white border-2 border-black text-black dark:bg-transparent dark:border-white dark:text-white hover:bg-neutral-50 dark:hover:bg-white/10 h-12 px-4 text-base font-bold shadow-lg transition active:scale-[0.98]"
            >
              Re-calculate
            </button>
            <button 
               onClick={onAddMore}
               className="flex-1 flex items-center justify-center rounded-xl bg-white border-2 border-black text-black dark:bg-transparent dark:border-white dark:text-white hover:bg-neutral-50 dark:hover:bg-white/10 h-12 px-4 text-base font-bold shadow-lg transition active:scale-[0.98]"
            >
              Add Modules
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .print-signature { display: none; }
      `}</style>
    </div>
  );
};

export default Results;