import React from 'react';
import { track_platform_click } from '../utils/analytics';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSocialClick = (platform: string, url: string) => {
    track_platform_click(platform);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-[320px] rounded-2xl bg-surface-light dark:bg-surface-dark p-6 shadow-2xl ring-1 ring-white/10 animate-slide-up flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
           <span className="material-symbols-outlined text-[28px]">support_agent</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">Contact Developer</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center -mt-2 mb-2">
          Have a question or suggestion? Reach out directly via:
        </p>

        <button 
          onClick={() => handleSocialClick('Facebook', 'https://www.facebook.com/uknowmeabdou')}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border-2 border-black text-black font-bold shadow-lg hover:bg-gray-50 transition-all active:scale-[0.98] dark:bg-transparent dark:border-white dark:text-white dark:hover:bg-white/10"
        >
          <span className="material-symbols-outlined">thumb_up</span>
          <span>Facebook</span>
        </button>

        <button 
          onClick={() => handleSocialClick('Telegram', 'https://t.me/uknowmeabdou')}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border-2 border-black text-black font-bold shadow-lg hover:bg-gray-50 transition-all active:scale-[0.98] dark:bg-transparent dark:border-white dark:text-white dark:hover:bg-white/10"
        >
          <span className="material-symbols-outlined">send</span>
          <span>Telegram</span>
        </button>

        <button 
          onClick={onClose}
          className="mt-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ContactModal;