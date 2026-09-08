import { create } from 'zustand';
import type { PersonalInfo, Section, SectionItem, SectionType, ResumeVersion, Density } from '../types/resume';
import type { ContentStyle } from '../types/resume';
import { DEFAULT_CONTENT_STYLE } from '../types/resume';
import { DEFAULT_RESUME } from '../data/defaults';

let nextId = 100;
function uid(): string {
  return `id-${nextId++}-${Date.now().toString(36)}`;
}

export interface ResumeStore {
  resume: typeof DEFAULT_RESUME;
  versions: ResumeVersion[];
  activeVersionId: string | null;
  density: Density;
  contentStyle: ContentStyle;

  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  updateSectionTitle: (id: string, title: string) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;

  addSectionItem: (sectionId: string) => void;
  removeSectionItem: (sectionId: string, itemId: string) => void;
  updateSectionItem: (sectionId: string, itemId: string, updates: Partial<SectionItem>) => void;
  moveSectionItem: (sectionId: string, itemId: string, direction: 'up' | 'down') => void;

  createVersion: (name: string, targetJob: string) => void;
  deleteVersion: (id: string) => void;
  setActiveVersion: (id: string | null) => void;

  toggleSectionHidden: (versionId: string, sectionId: string) => void;
  overrideItemField: (versionId: string, sectionId: string, itemId: string, field: string, value: string) => void;
  clearItemOverride: (versionId: string, sectionId: string, itemId: string, field: string) => void;

  setDensity: (density: Density) => void;
  updateContentStyle: (style: Partial<ContentStyle>) => void;

  getMergedResume: () => typeof DEFAULT_RESUME;
}

const STORAGE_KEY = 'resume-tool-data';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        resume: parsed.resume ?? DEFAULT_RESUME,
        versions: parsed.versions ?? [],
        activeVersionId: parsed.activeVersionId ?? null,
        density: parsed.density ?? 'normal',
        contentStyle: parsed.contentStyle ?? DEFAULT_CONTENT_STYLE,
      };
    }
  } catch { /* ignore */ }
  return {
    resume: DEFAULT_RESUME,
    versions: [] as ResumeVersion[],
        activeVersionId: null as string | null,
        density: 'normal' as Density,
        contentStyle: DEFAULT_CONTENT_STYLE,
      };
}

function persist(state: Pick<ResumeStore, 'resume' | 'versions' | 'activeVersionId' | 'density' | 'contentStyle'>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export const useResumeStore = create<ResumeStore>((set, get) => {
  const initial = loadState();

  return {
    ...initial,

    updatePersonalInfo: (info) => {
      set((s) => {
        const next = { ...s, resume: { ...s.resume, personalInfo: { ...s.resume.personalInfo, ...info } } };
        persist(next);
        return next;
      });
    },

    addSection: (type) => {
      set((s) => {
        const section: Section = {
          id: uid(),
          type,
          title: '',
          items: [{ id: uid(), title: '', subtitle: '', startDate: '', endDate: '', description: '', skills: [] }],
        };
        const next = { ...s, resume: { ...s.resume, sections: [...s.resume.sections, section] } };
        persist(next);
        return next;
      });
    },

    removeSection: (id) => {
      set((s) => {
        const next = { ...s, resume: { ...s.resume, sections: s.resume.sections.filter((sec) => sec.id !== id) } };
        persist(next);
        return next;
      });
    },

    updateSectionTitle: (id, title) => {
      set((s) => {
        const next = {
          ...s,
          resume: {
            ...s.resume,
            sections: s.resume.sections.map((sec) => (sec.id === id ? { ...sec, title } : sec)),
          },
        };
        persist(next);
        return next;
      });
    },

    moveSection: (id, direction) => {
      set((s) => {
        const idx = s.resume.sections.findIndex((sec) => sec.id === id);
        if (idx < 0) return s;
        const target = direction === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= s.resume.sections.length) return s;
        const sections = [...s.resume.sections];
        [sections[idx], sections[target]] = [sections[target], sections[idx]];
        const next = { ...s, resume: { ...s.resume, sections } };
        persist(next);
        return next;
      });
    },

    addSectionItem: (sectionId) => {
      set((s) => {
        const newItem: SectionItem = {
          id: uid(),
          title: '',
          subtitle: '',
          startDate: '',
          endDate: '',
          description: '',
          skills: [],
        };
        const next = {
          ...s,
          resume: {
            ...s.resume,
            sections: s.resume.sections.map((sec) =>
              sec.id === sectionId ? { ...sec, items: [...sec.items, newItem] } : sec
            ),
          },
        };
        persist(next);
        return next;
      });
    },

    removeSectionItem: (sectionId, itemId) => {
      set((s) => {
        const next = {
          ...s,
          resume: {
            ...s.resume,
            sections: s.resume.sections.map((sec) =>
              sec.id === sectionId
                ? { ...sec, items: sec.items.filter((it) => it.id !== itemId) }
                : sec
            ),
          },
        };
        persist(next);
        return next;
      });
    },

    updateSectionItem: (sectionId, itemId, updates) => {
      set((s) => {
        const next = {
          ...s,
          resume: {
            ...s.resume,
            sections: s.resume.sections.map((sec) =>
              sec.id === sectionId
                ? {
                    ...sec,
                    items: sec.items.map((it) =>
                      it.id === itemId ? { ...it, ...updates } : it
                    ),
                  }
                : sec
            ),
          },
        };
        persist(next);
        return next;
      });
    },

    moveSectionItem: (sectionId, itemId, direction) => {
      set((s) => {
        const next = {
          ...s,
          resume: {
            ...s.resume,
            sections: s.resume.sections.map((sec) => {
              if (sec.id !== sectionId) return sec;
              const idx = sec.items.findIndex((it) => it.id === itemId);
              if (idx < 0) return sec;
              const target = direction === 'up' ? idx - 1 : idx + 1;
              if (target < 0 || target >= sec.items.length) return sec;
              const items = [...sec.items];
              [items[idx], items[target]] = [items[target], items[idx]];
              return { ...sec, items };
            }),
          },
        };
        persist(next);
        return next;
      });
    },

    createVersion: (name, targetJob) => {
      set((s) => {
        const version: ResumeVersion = {
          id: uid(),
          name,
          targetJob,
          sectionOverrides: {},
        };
        const next = { ...s, versions: [...s.versions, version], activeVersionId: version.id };
        persist(next);
        return next;
      });
    },

    deleteVersion: (id) => {
      set((s) => {
        const versions = s.versions.filter((v) => v.id !== id);
        const activeVersionId = s.activeVersionId === id ? null : s.activeVersionId;
        const next = { ...s, versions, activeVersionId };
        persist(next);
        return next;
      });
    },

    setActiveVersion: (id) => {
      set((s) => {
        const next = { ...s, activeVersionId: id };
        persist(next);
        return next;
      });
    },

    toggleSectionHidden: (versionId, sectionId) => {
      set((s) => {
        const versions = s.versions.map((v) => {
          if (v.id !== versionId) return v;
          const current = v.sectionOverrides[sectionId];
          const sectionOverrides = {
            ...v.sectionOverrides,
            [sectionId]: {
              ...current,
              hidden: !current?.hidden,
            },
          };
          if (!sectionOverrides[sectionId].hidden && !sectionOverrides[sectionId].itemOverrides) {
            delete sectionOverrides[sectionId];
          }
          return { ...v, sectionOverrides };
        });
        const next = { ...s, versions };
        persist(next);
        return next;
      });
    },

    overrideItemField: (versionId, sectionId, itemId, field, value) => {
      set((s) => {
        const versions = s.versions.map((v) => {
          if (v.id !== versionId) return v;
          const sectionOverride = v.sectionOverrides[sectionId] ?? {};
          const itemOverrides = { ...sectionOverride.itemOverrides };
          const itemOverride = { ...itemOverrides[itemId] };
          (itemOverride as Record<string, string>)[field] = value;
          itemOverrides[itemId] = itemOverride;
          const sectionOverrides = {
            ...v.sectionOverrides,
            [sectionId]: { ...sectionOverride, itemOverrides },
          };
          return { ...v, sectionOverrides };
        });
        const next = { ...s, versions };
        persist(next);
        return next;
      });
    },

    clearItemOverride: (versionId, sectionId, itemId, field) => {
      set((s) => {
        const versions = s.versions.map((v) => {
          if (v.id !== versionId) return v;
          const sectionOverride = v.sectionOverrides[sectionId];
          if (!sectionOverride?.itemOverrides?.[itemId]) return v;
          const itemOverrides = { ...sectionOverride.itemOverrides };
          const itemOverride = { ...itemOverrides[itemId] };
          delete (itemOverride as Record<string, string>)[field];
          if (Object.keys(itemOverride).length === 0) {
            delete itemOverrides[itemId];
          } else {
            itemOverrides[itemId] = itemOverride;
          }
          const sectionOverrides = {
            ...v.sectionOverrides,
            [sectionId]: { ...sectionOverride, itemOverrides },
          };
          if (!sectionOverrides[sectionId].hidden && Object.keys(sectionOverrides[sectionId].itemOverrides ?? {}).length === 0) {
            delete sectionOverrides[sectionId];
          }
          return { ...v, sectionOverrides };
        });
        const next = { ...s, versions };
        persist(next);
        return next;
      });
    },

    setDensity: (density) => {
      set((s) => {
        const next = { ...s, density };
        persist(next);
        return next;
      });
    },

    updateContentStyle: (style) => {
      set((s) => {
        const next = { ...s, contentStyle: { ...s.contentStyle, ...style } };
        persist(next);
        return next;
      });
    },

    getMergedResume: () => {
      const { resume, versions, activeVersionId } = get();
      if (!activeVersionId) return resume;
      const version = versions.find((v) => v.id === activeVersionId);
      if (!version) return resume;

      const mergedSections = resume.sections
        .filter((sec) => !version.sectionOverrides[sec.id]?.hidden)
        .map((sec) => {
          const override = version.sectionOverrides[sec.id];
          if (!override?.itemOverrides) return sec;
          return {
            ...sec,
            items: sec.items.map((it) => {
              const itemOverride = override.itemOverrides?.[it.id];
              if (!itemOverride) return it;
              return { ...it, ...itemOverride };
            }),
          };
        });

      return { ...resume, sections: mergedSections };
    },
  };
});
