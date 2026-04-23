import { ProposalForm, Page, Plan, SchedulePhase } from './types';

const STORAGE_KEY = 'proposal-projects';
const DRAFT_KEY = 'proposal-draft';
const CUSTOM_TEMPLATES_KEY = 'proposal-custom-templates';
const MAX_SAVED = 20;
const MAX_CUSTOM_TEMPLATES = 30;

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

/* ========== カスタムテンプレート ========== */

export interface CustomTemplate {
  id: string;
  name: string;
  createdAt: string;
  data: {
    siteType: string;
    overview: string;
    purpose: string;
    features: string[];
    pages: Page[];
    plans: Plan[];
    schedule: SchedulePhase[];
  };
}

export function loadCustomTemplates(): CustomTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomTemplates(templates: CustomTemplate[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
  } catch {
    // silently fail
  }
}

/** 現在のフォーム内容からカスタムテンプレートを作成して保存 */
export function addCustomTemplate(
  name: string,
  form: ProposalForm
): CustomTemplate[] {
  const trimmed = name.trim();
  if (!trimmed) return loadCustomTemplates();

  const template: CustomTemplate = {
    id: Date.now().toString(),
    name: trimmed,
    createdAt: new Date().toISOString(),
    data: {
      siteType: form.siteType,
      overview: form.overview,
      purpose: form.purpose,
      features: [...form.features],
      pages: form.pages.map((p) => ({ ...p, children: [...p.children] })),
      plans: JSON.parse(JSON.stringify(form.plans)),
      schedule: form.schedule.map((s) => ({ ...s })),
    },
  };
  const existing = loadCustomTemplates();
  const updated = [template, ...existing].slice(0, MAX_CUSTOM_TEMPLATES);
  saveCustomTemplates(updated);
  return updated;
}

export function deleteCustomTemplate(id: string): CustomTemplate[] {
  const updated = loadCustomTemplates().filter((t) => t.id !== id);
  saveCustomTemplates(updated);
  return updated;
}

export { MAX_SAVED, MAX_CUSTOM_TEMPLATES };
