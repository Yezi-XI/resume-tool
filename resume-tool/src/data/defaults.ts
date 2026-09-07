import type { Resume, SectionItem } from '../types/resume';

function item(data: Partial<SectionItem> & { id: string }): SectionItem {
  return {
    title: '',
    subtitle: '',
    startDate: '',
    endDate: '',
    description: '',
    skills: [],
    ...data,
  };
}

export const DEFAULT_RESUME: Resume = {
  id: 'default',
  personalInfo: {
    name: '',
    title: '',
    phone: '',
    email: '',
    location: '',
    website: '',
  },
  sections: [
    {
      id: 'sec-summary',
      type: 'summary',
      title: '自我评价',
      items: [item({ id: 'item-summary-1', description: '' })],
    },
    {
      id: 'sec-experience',
      type: 'experience',
      title: '工作经历',
      items: [
        item({ id: 'item-exp-1' }),
      ],
    },
    {
      id: 'sec-education',
      type: 'education',
      title: '教育背景',
      items: [
        item({ id: 'item-edu-1' }),
      ],
    },
    {
      id: 'sec-skills',
      type: 'skills',
      title: '技能特长',
      items: [
        item({ id: 'item-skill-1' }),
      ],
    },
    {
      id: 'sec-projects',
      type: 'projects',
      title: '项目经验',
      items: [
        item({ id: 'item-proj-1' }),
      ],
    },
  ],
};
