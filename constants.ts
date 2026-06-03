import { Module, GradingSystem } from './types';

export const ENGLISH_TEMPLATE_MODULES: Omit<Module, 'id'>[] = [
  { name: "Grammar", td: "", exam: "", coef: "2", tdOnly: false },
  { name: "Written Expression", td: "", exam: "", coef: "2", tdOnly: false },
  { name: "Oral Expression", td: "", exam: "", coef: "2", tdOnly: false },
  { name: "Linguistics and Phonetics", td: "", exam: "", coef: "2", tdOnly: false },
  { name: "Study Skills", td: "", exam: "", coef: "2", tdOnly: false },
  { name: "Civilizations", td: "", exam: "", coef: "2", tdOnly: false },
  { name: "Literature", td: "", exam: "", coef: "1", tdOnly: false },
  { name: "Text Study", td: "", exam: "", coef: "2", tdOnly: true },
  { name: "Digital Literacy/ICT", td: "", exam: "", coef: "1", tdOnly: true },
  { name: "French", td: "", exam: "", coef: "1", tdOnly: true },
];

export const MAJORS: Record<string, Omit<Module, 'id'>[]> = {
  "English": ENGLISH_TEMPLATE_MODULES,
  // Add more majors here in the future
  // "Computer Science": [...],
};

export const DEFAULT_GRADING_SYSTEM: GradingSystem = {
  type: '40-60',
  tdWeight: 40,
  examWeight: 60,
};

export const INITIAL_MODULE: Omit<Module, 'id'> = {
  name: "",
  td: "",
  exam: "",
  coef: "1",
  tdOnly: false
};