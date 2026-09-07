import { create } from 'zustand';

let nextId = 100;
function uid() {
  return 'id-' + (nextId++) + '-' + Date.now().toString(36);
}

function newItem(overrides) {
  return { id: uid(), title: '', subtitle: '', startDate: '', endDate: '', description: '', skills: [], ...overrides };
}

const DEFAULT_RESUME = {
  id: 'default',
  personalInfo: { name: '', title: '', phone: '', email: '', location: '', website: '' },
  sections: [
    { id: 'sec-summary', type: 'summary', title: '自我评价', items: [newItem({ id: 'item-summary-1' })] },
    { id: 'sec-experience', type: 'experience', title: '工作经历', items: [newItem({ id: 'item-exp-1' })] },
    { id: 'sec-education', type: 'education', title: '教育背景', items: [newItem({ id: 'item-edu-1' })] },
    { id: 'sec-skills', type: 'skills', title: '技能特长', items: [newItem({ id: 'item-skill-1' })] },
    { id: 'sec-projects', type: 'projects', title: '项目经验', items: [newItem({ id: 'item-proj-1' })] },
  ],
};

const STORAGE_KEY = 'resume-tool-data';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { resume: DEFAULT_RESUME, versions: [], activeVersionId: null, density: 'normal' };
}

function persist(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

export const useResumeStore = create(function (set, get) {
  const initial = loadState();

  return {
    ...initial,

    updatePersonalInfo: function (info) {
      set(function (s) {
        const next = { ...s, resume: { ...s.resume, personalInfo: { ...s.resume.personalInfo, ...info } } };
        persist(next);
        return next;
      });
    },

    addSection: function (type) {
      set(function (s) {
        const section = { id: uid(), type, title: '', items: [newItem()] };
        const next = { ...s, resume: { ...s.resume, sections: [...s.resume.sections, section] } };
        persist(next);
        return next;
      });
    },

    removeSection: function (id) {
      set(function (s) {
        const next = { ...s, resume: { ...s.resume, sections: s.resume.sections.filter(function (sec) { return sec.id !== id; }) } };
        persist(next);
        return next;
      });
    },

    updateSectionTitle: function (id, title) {
      set(function (s) {
        const next = { ...s, resume: { ...s.resume, sections: s.resume.sections.map(function (sec) { return sec.id === id ? { ...sec, title } : sec; }) } };
        persist(next);
        return next;
      });
    },

    moveSection: function (id, dir) {
      set(function (s) {
        const idx = s.resume.sections.findIndex(function (sec) { return sec.id === id; });
        if (idx < 0) return s;
        const target = dir === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= s.resume.sections.length) return s;
        const sections = [...s.resume.sections];
        [sections[idx], sections[target]] = [sections[target], sections[idx]];
        const next = { ...s, resume: { ...s.resume, sections } };
        persist(next);
        return next;
      });
    },

    addSectionItem: function (sectionId) {
      set(function (s) {
        const next = { ...s, resume: { ...s.resume, sections: s.resume.sections.map(function (sec) { return sec.id === sectionId ? { ...sec, items: [...sec.items, newItem()] } : sec; }) } };
        persist(next);
        return next;
      });
    },

    removeSectionItem: function (sectionId, itemId) {
      set(function (s) {
        const next = { ...s, resume: { ...s.resume, sections: s.resume.sections.map(function (sec) { return sec.id === sectionId ? { ...sec, items: sec.items.filter(function (it) { return it.id !== itemId; }) } : sec; }) } };
        persist(next);
        return next;
      });
    },

    updateSectionItem: function (sectionId, itemId, updates) {
      set(function (s) {
        const next = { ...s, resume: { ...s.resume, sections: s.resume.sections.map(function (sec) { return sec.id === sectionId ? { ...sec, items: sec.items.map(function (it) { return it.id === itemId ? { ...it, ...updates } : it; }) } : sec; }) } };
        persist(next);
        return next;
      });
    },

    moveSectionItem: function (sectionId, itemId, dir) {
      set(function (s) {
        const next = { ...s, resume: { ...s.resume, sections: s.resume.sections.map(function (sec) {
          if (sec.id !== sectionId) return sec;
          const idx = sec.items.findIndex(function (it) { return it.id === itemId; });
          if (idx < 0) return sec;
          const target = dir === 'up' ? idx - 1 : idx + 1;
          if (target < 0 || target >= sec.items.length) return sec;
          const items = [...sec.items];
          [items[idx], items[target]] = [items[target], items[idx]];
          return { ...sec, items };
        }) } };
        persist(next);
        return next;
      });
    },

    createVersion: function (name, targetJob) {
      set(function (s) {
        const version = { id: uid(), name, targetJob, sectionOverrides: {} };
        const next = { ...s, versions: [...s.versions, version], activeVersionId: version.id };
        persist(next);
        return next;
      });
    },

    deleteVersion: function (id) {
      set(function (s) {
        const versions = s.versions.filter(function (v) { return v.id !== id; });
        const next = { ...s, versions, activeVersionId: s.activeVersionId === id ? null : s.activeVersionId };
        persist(next);
        return next;
      });
    },

    setActiveVersion: function (id) {
      set(function (s) { const next = { ...s, activeVersionId: id }; persist(next); return next; });
    },

    toggleSectionHidden: function (versionId, sectionId) {
      set(function (s) {
        const versions = s.versions.map(function (v) {
          if (v.id !== versionId) return v;
          const current = v.sectionOverrides[sectionId] || {};
          const sectionOverrides = { ...v.sectionOverrides, [sectionId]: { ...current, hidden: !current.hidden } };
          if (!sectionOverrides[sectionId].hidden && !sectionOverrides[sectionId].itemOverrides) delete sectionOverrides[sectionId];
          return { ...v, sectionOverrides };
        });
        const next = { ...s, versions };
        persist(next);
        return next;
      });
    },

    setDensity: function (density) {
      set(function (s) { const next = { ...s, density }; persist(next); return next; });
    },

    getMergedResume: function () {
      const { resume, versions, activeVersionId } = get();
      if (!activeVersionId) return resume;
      const version = versions.find(function (v) { return v.id === activeVersionId; });
      if (!version) return resume;
      const mergedSections = resume.sections
        .filter(function (sec) { return !(version.sectionOverrides[sec.id] || {}).hidden; })
        .map(function (sec) {
          const override = version.sectionOverrides[sec.id] || {};
          if (!override.itemOverrides) return sec;
          return { ...sec, items: sec.items.map(function (it) { return override.itemOverrides[it.id] ? { ...it, ...override.itemOverrides[it.id] } : it; }) };
        });
      return { ...resume, sections: mergedSections };
    },
  };
});

export const SECTION_LABELS = {
  experience: '工作经历',
  education: '教育背景',
  skills: '技能特长',
  projects: '项目经验',
  summary: '自我评价',
  custom: '自定义模块',
};
