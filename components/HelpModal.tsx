import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[380px] rounded-2xl bg-white border-2 border-black p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <h2 className="mb-6 text-center text-2xl font-bold leading-tight tracking-tight text-black flex items-center justify-center gap-2">
           <span className="material-symbols-outlined text-black">school</span>
           How to Use
        </h2>

        <div className="flex flex-col gap-6">
          {[
            { id: 1, title: "Grading System", desc: "Choose your school's scale. Default is 40/60." },
            { id: 2, title: "Add Modules", desc: "Input your course names, grades, and coefficients." },
            { id: 3, title: "Choose Major", desc: "Select your major (e.g. English) to auto-fill modules." },
            { id: 4, title: "Calculate", desc: "Tap to see your semester average and details." },
            { id: 5, title: "Export Results", desc: "Download a professional PDF grade report." }
          ].map((step) => (
            <div key={step.id} className="group flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white shadow-md shadow-black/20">
                {step.id}
              </div>
              <div className="flex flex-col justify-center pt-0.5">
                <p className="text-base font-bold leading-tight text-black transition-colors">
                  {step.title}
                </p>
                <p className="mt-1 text-sm font-normal leading-normal text-neutral-600">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-black text-white hover:bg-neutral-800 py-3.5 text-base font-bold shadow-lg transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">check</span>
          <span>Got it!</span>
        </button>
      </div>
    </div>
  );
};

export default HelpModal;