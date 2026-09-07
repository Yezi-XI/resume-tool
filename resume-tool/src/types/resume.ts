export interface PersonalInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  website: string;
}

export type SectionType = 'experience' | 'education' | 'skills' | 'projects' | 'summary' | 'custom';

export interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: string[];
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  items: SectionItem[];
}

export interface Resume {
  id: string;
  personalInfo: PersonalInfo;
  sections: Section[];
}

export interface SectionOverride {
  hidden?: boolean;
  itemOverrides?: Record<string, Partial<SectionItem>>;
}

export interface ResumeVersion {
  id: string;
  name: string;
  targetJob: string;
  sectionOverrides: Record<string, SectionOverride>;
}

export type Density = 'compact' | 'normal' | 'spacious';

export const SECTION_LABELS: Record<SectionType, string> = {
  experience: '工作经历',
  education: '教育背景',
  skills: '技能特长',
  projects: '项目经验',
  summary: '自我评价',
  custom: '自定义模块',
};

export const SECTION_ICONS: Record<SectionType, string> = {
  experience: 'briefcase',
  education: 'graduation-cap',
  skills: 'zap',
  projects: 'folder-git',
  summary: 'user',
  custom: 'puzzle',
};
