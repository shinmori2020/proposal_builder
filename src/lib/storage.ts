import { ProposalForm } from './types';

const STORAGE_KEY = 'proposal-projects';
const MAX_SAVED = 20;

export interface SavedProject {
  id: string;
  name: string;
  data: ProposalForm;
  savedAt: string;
}

export function loadProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: SavedProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // quota exceeded or blocked - silently fail
  }
}

export function makeSavedProject(form: ProposalForm): SavedProject {
  const name =
    form.projectName ||
    form.clientName ||
    `案件_${new Date().toLocaleDateString('ja-JP')}`;
  return {
    id: Date.now().toString(),
    name,
    data: form,
    savedAt: new Date().toISOString(),
  };
}

export { MAX_SAVED };
