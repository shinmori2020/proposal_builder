import { ProposalForm, Page, Plan, SchedulePhase } from './types';

const STORAGE_KEY = 'proposal-projects';
const DRAFT_KEY = 'proposal-draft';
const CUSTOM_TEMPLATES_KEY = 'proposal-custom-templates';
const VERSIONS_KEY = 'proposal-versions';
const MAX_SAVED = 20;
const MAX_CUSTOM_TEMPLATES = 30;
const MAX_SNAPSHOTS = 20;

export interface SavedProject {
  id: string;
  name: string;
  data: ProposalForm;
  savedAt: string;
  /** 分類用タグ。旧データには無いので optional。 */
  tags?: string[];
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

export function saveProjects(projects: SavedProject[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch {
    // quota exceeded or blocked
    return false;
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

/** プロジェクトのタグを更新（空白/重複を除去して保存） */
export function updateProjectTags(
  id: string,
  tags: string[]
): SavedProject[] {
  const projects = loadProjects();
  const cleaned = Array.from(
    new Set(tags.map((t) => t.trim()).filter(Boolean))
  );
  const updated = projects.map((p) =>
    p.id === id ? { ...p, tags: cleaned } : p
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

/* ========== バージョン履歴（手動保存時のスナップショット） ========== */

export interface VersionSnapshot {
  id: string;
  data: ProposalForm;
  savedAt: string;
}

export function loadSnapshots(): VersionSnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VERSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSnapshots(snapshots: VersionSnapshot[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(snapshots));
  } catch {
    // quota exceeded - silently fail
  }
}

/** 現在のフォーム内容を履歴に追加（最大20件、古いものから破棄） */
export function pushSnapshot(form: ProposalForm): VersionSnapshot[] {
  const snap: VersionSnapshot = {
    id: Date.now().toString(),
    data: form,
    savedAt: new Date().toISOString(),
  };
  const existing = loadSnapshots();
  const updated = [snap, ...existing].slice(0, MAX_SNAPSHOTS);
  saveSnapshots(updated);
  return updated;
}

export function deleteSnapshot(id: string): VersionSnapshot[] {
  const updated = loadSnapshots().filter((s) => s.id !== id);
  saveSnapshots(updated);
  return updated;
}

/* ========== localStorage 容量モニタ ========== */

/** ブラウザの一般的な localStorage 上限（保守的に 5MB） */
const STORAGE_QUOTA_BYTES = 5 * 1024 * 1024;

export interface StorageUsage {
  /** 本アプリで使用しているバイト数 */
  used: number;
  /** 想定上限バイト数（5MB） */
  quota: number;
  /** 使用率 0-100 */
  percent: number;
  /** 警告しきい値超過（80%以上） */
  warning: boolean;
  /** 上限近接（95%以上） */
  critical: boolean;
}

/**
 * 本アプリが使用している localStorage 容量を概算する。
 * 文字列の length は UTF-16 単位なので、1 文字 ≒ 2 バイト換算で計算。
 */
export function getStorageUsage(): StorageUsage {
  if (typeof window === 'undefined') {
    return {
      used: 0,
      quota: STORAGE_QUOTA_BYTES,
      percent: 0,
      warning: false,
      critical: false,
    };
  }
  const keys = [STORAGE_KEY, DRAFT_KEY, CUSTOM_TEMPLATES_KEY, VERSIONS_KEY];
  let used = 0;
  for (const key of keys) {
    try {
      const v = localStorage.getItem(key);
      if (v) {
        // key 名 + 値 の文字数 × 2 (UTF-16) でおおよその bytes
        used += (key.length + v.length) * 2;
      }
    } catch {
      // ignore
    }
  }
  const percent = Math.min(100, Math.round((used / STORAGE_QUOTA_BYTES) * 100));
  return {
    used,
    quota: STORAGE_QUOTA_BYTES,
    percent,
    warning: percent >= 80,
    critical: percent >= 95,
  };
}

/** バイト数を人間可読な形式（KB/MB）にフォーマット */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export { MAX_SAVED, MAX_CUSTOM_TEMPLATES, MAX_SNAPSHOTS };
