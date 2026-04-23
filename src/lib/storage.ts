import { ProposalForm } from './types';

const STORAGE_KEY = 'proposal-projects';
const DRAFT_KEY = 'proposal-draft';
const MAX_SAVED = 20;

export interface SavedProject {
  id: string;
  name: string;
  data: ProposalForm;
  savedAt: string;
}

export interface Draft {
  data: ProposalForm;
  savedAt: string;
}

/* ========== 保存済みプロジェクト ========== */

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

/** プロジェクトの名前を変更 */
export function renameProject(id: string, newName: string): SavedProject[] {
  const projects = loadProjects();
  const trimmed = newName.trim();
  if (!trimmed) return projects;
  const updated = projects.map((p) =>
    p.id === id ? { ...p, name: trimmed } : p
  );
  saveProjects(updated);
  return updated;
}

/* ========== 自動保存ドラフト ========== */

export function saveDraft(form: ProposalForm): void {
  if (typeof window === 'undefined') return;
  try {
    const draft: Draft = { data: form, savedAt: new Date().toISOString() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // quota exceeded or blocked - silently fail
  }
}

export function loadDraft(): Draft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // silently fail
  }
}

export { MAX_SAVED };
