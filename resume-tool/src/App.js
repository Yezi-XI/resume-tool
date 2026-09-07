import { createElement as e, useState, useMemo } from 'react';
import { useResumeStore, SECTION_LABELS } from './store.js';
import { Plus, Trash2, ChevronUp, ChevronDown, Download, Briefcase, GraduationCap, Zap, FolderGit, User, Puzzle, Eye, EyeOff } from 'lucide-react';

// ── Icons ──
const ICONS = { experience: Briefcase, education: GraduationCap, skills: Zap, projects: FolderGit, summary: User, custom: Puzzle };

// ── Field configs ──
const FIELDS = {
  experience: [
    { key: 'title', label: '公司名称', ph: 'XX科技有限公司' },
    { key: 'subtitle', label: '职位', ph: '高级前端工程师' },
    { key: 'startDate', label: '开始时间', ph: '2020.06' },
    { key: 'endDate', label: '结束时间', ph: '2023.06' },
    { key: 'description', label: '工作描述', ph: '描述你的工作职责和成果...', area: true },
  ],
  education: [
    { key: 'title', label: '学校名称', ph: 'XX大学' },
    { key: 'subtitle', label: '学历/专业', ph: '本科 / 计算机科学与技术' },
    { key: 'startDate', label: '开始时间', ph: '2016.09' },
    { key: 'endDate', label: '结束时间', ph: '2020.06' },
    { key: 'description', label: '在校经历', ph: 'GPA、获奖情况等...', area: true },
  ],
  projects: [
    { key: 'title', label: '项目名称', ph: '电商平台重构' },
    { key: 'subtitle', label: '角色', ph: '前端负责人' },
    { key: 'startDate', label: '开始时间', ph: '2022.03' },
    { key: 'endDate', label: '结束时间', ph: '2022.08' },
    { key: 'description', label: '项目描述', ph: '描述项目背景、技术栈、贡献...', area: true },
  ],
  skills: [
    { key: 'title', label: '技能分类', ph: '前端技术' },
    { key: 'description', label: '具体技能', ph: 'React, TypeScript, Vue.js...', area: true },
  ],
  summary: [
    { key: 'description', label: '自我评价', ph: '简要描述你的职业优势...', area: true },
  ],
  custom: [
    { key: 'title', label: '标题', ph: '标题' },
    { key: 'subtitle', label: '副标题', ph: '副标题' },
    { key: 'startDate', label: '开始时间', ph: '2020.01' },
    { key: 'endDate', label: '结束时间', ph: '2020.12' },
    { key: 'description', label: '描述', ph: '详细描述...', area: true },
  ],
};

const DENSITY = [
  { value: 'compact', label: '紧凑' },
  { value: 'normal', label: '标准' },
  { value: 'spacious', label: '宽松' },
];

const TYPE_OPTS = ['experience', 'education', 'skills', 'projects', 'summary', 'custom'];

// ── PersonalInfoEditor ──
function PersonalInfoEditor() {
  const info = useResumeStore(function (s) { return s.resume.personalInfo; });
  const update = useResumeStore(function (s) { return s.updatePersonalInfo; });
  const fields = [
    { key: 'name', label: '姓名', ph: '张三' },
    { key: 'title', label: '求职意向', ph: '前端开发工程师' },
    { key: 'phone', label: '电话', ph: '138-0000-0000' },
    { key: 'email', label: '邮箱', ph: 'zhangsan@example.com' },
    { key: 'location', label: '所在地', ph: '北京' },
    { key: 'website', label: '个人网站', ph: 'https://github.com/zhangsan' },
  ];
  return e('div', null,
    e('h3', { className: 'section-heading' }, '基本信息'),
    fields.map(function (f) {
      return e('div', { className: 'form-group', key: f.key },
        e('label', { className: 'form-label' }, f.label),
        e('input', { className: 'form-input', placeholder: f.ph, value: info[f.key] || '', onChange: function (ev) { update({ [f.key]: ev.target.value }); } }),
      );
    }),
  );
}

// ── SectionItemEditor ──
function SectionItemEditor({ item, index, total, sectionType, onChange, onRemove, onMoveUp, onMoveDown }) {
  const fields = FIELDS[sectionType] || FIELDS.custom;
  return e('div', { className: 'item-card' },
    e('div', { className: 'item-header' },
      e('span', { className: 'item-index' }, '#' + (index + 1)),
      e('div', { style: { display: 'flex', gap: 2, marginLeft: 'auto' } },
        e('button', { className: 'icon-btn', onClick: onMoveUp, disabled: index === 0, title: '上移' }, e(ChevronUp, { size: 14 })),
        e('button', { className: 'icon-btn', onClick: onMoveDown, disabled: index === total - 1, title: '下移' }, e(ChevronDown, { size: 14 })),
        e('button', { className: 'icon-btn danger', onClick: onRemove, title: '删除' }, e(Trash2, { size: 14 })),
      ),
    ),
    fields.map(function (f) {
      const val = item[f.key] || '';
      return e('div', { className: 'form-group', key: f.key, style: { marginBottom: 6 } },
        e('label', { className: 'form-label' }, f.label),
        f.area
          ? e('textarea', { className: 'form-textarea', placeholder: f.ph, value: val, rows: 3, onChange: function (ev) { onChange({ [f.key]: ev.target.value }); } })
          : e('input', { className: 'form-input', placeholder: f.ph, value: val, onChange: function (ev) { onChange({ [f.key]: ev.target.value }); } }),
      );
    }),
  );
}

// ── SectionEditor ──
function SectionEditor() {
  const sections = useResumeStore(function (s) { return s.resume.sections; });
  const store = useResumeStore();
  const [showAdd, setShowAdd] = useState(false);
  return e('div', null,
    e('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 } },
      e('h3', { className: 'section-heading' }, '内容模块'),
      e('button', { className: 'icon-btn', onClick: function () { setShowAdd(!showAdd); }, title: '添加模块' }, e(Plus, { size: 16 })),
    ),
    showAdd && e('div', { className: 'add-section-area' },
      TYPE_OPTS.map(function (type) {
        const Icon = ICONS[type] || Puzzle;
        return e('button', { key: type, className: 'add-section-btn', style: { marginBottom: 6 }, onClick: function () { store.addSection(type); setShowAdd(false); } },
          e(Icon, { size: 14 }),
          ' ' + SECTION_LABELS[type],
        );
      }),
    ),
    sections.length === 0 && e('div', { className: 'empty-state' }, '暂无内容模块，点击 + 添加'),
    sections.map(function (section, secIdx) {
      const Icon = ICONS[section.type] || Puzzle;
      return e('div', { className: 'section-card', key: section.id },
        e('div', { className: 'section-header' },
          e(Icon, { size: 14, className: 'section-type-icon' }),
          e('input', { className: 'section-title-input', value: section.title, placeholder: SECTION_LABELS[section.type], onChange: function (ev) { store.updateSectionTitle(section.id, ev.target.value); } }),
          e('div', { className: 'section-actions' },
            e('button', { className: 'icon-btn', onClick: function () { store.moveSection(section.id, 'up'); }, disabled: secIdx === 0, title: '上移' }, e(ChevronUp, { size: 14 })),
            e('button', { className: 'icon-btn', onClick: function () { store.moveSection(section.id, 'down'); }, disabled: secIdx === sections.length - 1, title: '下移' }, e(ChevronDown, { size: 14 })),
            e('button', { className: 'icon-btn danger', onClick: function () { store.removeSection(section.id); }, title: '删除' }, e(Trash2, { size: 14 })),
          ),
        ),
        e('div', { className: 'section-items' },
          section.items.map(function (item, itemIdx) {
            return e(SectionItemEditor, {
              key: item.id, item, index: itemIdx, total: section.items.length, sectionType: section.type,
              onChange: function (updates) { store.updateSectionItem(section.id, item.id, updates); },
              onRemove: function () { store.removeSectionItem(section.id, item.id); },
              onMoveUp: function () { store.moveSectionItem(section.id, item.id, 'up'); },
              onMoveDown: function () { store.moveSectionItem(section.id, item.id, 'down'); },
            });
          }),
          e('button', { className: 'add-item-btn', onClick: function () { store.addSectionItem(section.id); } },
            e(Plus, { size: 12 }), ' 添加条目',
          ),
        ),
      );
    }),
  );
}

// ── VersionManager ──
function VersionManager() {
  const resume = useResumeStore(function (s) { return s.resume; });
  const versions = useResumeStore(function (s) { return s.versions; });
  const activeVersionId = useResumeStore(function (s) { return s.activeVersionId; });
  const store = useResumeStore();
  const [newName, setNewName] = useState('');
  const [newJob, setNewJob] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);

  function handleCreate() {
    if (!newName.trim()) return;
    store.createVersion(newName.trim(), newJob.trim());
    setNewName(''); setNewJob(''); setShowForm(false);
  }

  return e('div', null,
    e('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 } },
      e('h3', { className: 'section-heading' }, '版本管理'),
      e('button', { className: 'icon-btn', onClick: function () { setShowForm(!showForm); }, title: '新建版本' }, e(Plus, { size: 16 })),
    ),
    activeVersionId === null && e('div', { style: { marginBottom: 12, padding: '8px 12px', background: 'var(--accent-subtle)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--accent)' } },
      '当前正在编辑主简历。创建版本后可以针对不同岗位进行定制。'),
    showForm && e('div', { className: 'version-create' },
      e('input', { className: 'form-input', placeholder: '版本名称，如：字节跳动-前端', value: newName, onChange: function (ev) { setNewName(ev.target.value); } }),
      e('input', { className: 'form-input', placeholder: '目标岗位（可选）', value: newJob, onChange: function (ev) { setNewJob(ev.target.value); } }),
      e('div', { className: 'version-create-actions' },
        e('button', { className: 'btn-sm btn-ghost', onClick: function () { setShowForm(false); } }, '取消'),
        e('button', { className: 'btn-sm btn-primary', onClick: handleCreate }, '创建'),
      ),
    ),
    e('div', { className: 'version-card' + (activeVersionId === null ? ' active' : ''), onClick: function () { store.setActiveVersion(null); } },
      e('div', { className: 'version-card-header' }, e('span', { className: 'version-name' }, '主简历')),
      e('div', { className: 'version-job' }, '所有版本的基础模板'),
    ),
    versions.length === 0 && !showForm && e('div', { className: 'empty-state' }, '暂无版本，点击 + 创建针对特定岗位的简历变体'),
    versions.map(function (v) {
      const isExpanded = expanded === v.id;
      const isActive = activeVersionId === v.id;
      return e('div', { key: v.id, className: 'version-card' + (isActive ? ' active' : ''),
        onClick: function () {
          if (isActive) { setExpanded(isExpanded ? null : v.id); }
          else { store.setActiveVersion(v.id); }
        } },
        e('div', { className: 'version-card-header' },
          e('span', { className: 'version-name' }, v.name),
          e('button', { className: 'icon-btn danger', onClick: function (ev) { ev.stopPropagation(); store.deleteVersion(v.id); }, title: '删除' }, e(Trash2, { size: 14 })),
        ),
        v.targetJob && e('div', { className: 'version-job' }, '目标岗位：' + v.targetJob),
        isExpanded && isActive && e('div', { className: 'version-overrides' },
          e('div', { style: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 } }, '模块可见性'),
          resume.sections.map(function (sec) {
            const hidden = (v.sectionOverrides[sec.id] || {}).hidden || false;
            return e('div', { className: 'override-row', key: sec.id },
              e('label', { onClick: function (ev) { ev.stopPropagation(); } },
                e('input', { type: 'checkbox', checked: !hidden, onChange: function () { store.toggleSectionHidden(v.id, sec.id); } }),
                e('span', { style: { marginLeft: 6 } },
                  hidden ? e(EyeOff, { size: 12, style: { verticalAlign: 'middle' } }) : e(Eye, { size: 12, style: { verticalAlign: 'middle' } }),
                  ' ' + (sec.title || SECTION_LABELS[sec.type] || sec.type),
                ),
              ),
            );
          }),
        ),
      );
    }),
  );
}

// ── ResumePreview ──
const DENSITY_CSS = {
  compact: { fontSize: '9pt', lineHeight: 1.3, sectionGap: 8, itemGap: 4, titleSize: '12pt', nameSize: '20pt' },
  normal: { fontSize: '10pt', lineHeight: 1.5, sectionGap: 12, itemGap: 6, titleSize: '14pt', nameSize: '22pt' },
  spacious: { fontSize: '11pt', lineHeight: 1.7, sectionGap: 16, itemGap: 10, titleSize: '16pt', nameSize: '24pt' },
};

function ResumePreview() {
  const store = useResumeStore();
  const resume = store.getMergedResume();
  const density = store.density;
  const version = store.activeVersionId ? store.versions.find(function (v) { return v.id === store.activeVersionId; }) : null;
  const cfg = DENSITY_CSS[density];
  const { personalInfo, sections } = resume;
  const contacts = [personalInfo.phone, personalInfo.email, personalInfo.location, personalInfo.website].filter(Boolean);

  return e('div', { id: 'resume-preview', style: { width: '210mm', minHeight: '297mm', padding: '15mm 18mm', background: '#fff', fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', fontSize: cfg.fontSize, lineHeight: cfg.lineHeight, color: '#1a1a1a', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' } },
    // Header
    e('div', { style: { marginBottom: cfg.sectionGap + 4, borderBottom: '2px solid #1a1a1a', paddingBottom: cfg.sectionGap } },
      personalInfo.name
        ? e('div', { style: { fontSize: cfg.nameSize, fontWeight: 700, marginBottom: 4 } }, personalInfo.name)
        : e('div', { style: { fontSize: cfg.nameSize, fontWeight: 700, marginBottom: 4, color: '#ccc' } }, '姓名'),
      personalInfo.title && e('div', { style: { fontSize: cfg.titleSize, color: '#555', marginBottom: 6 } }, personalInfo.title),
      contacts.length > 0 && e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '9pt', color: '#666' } },
        contacts.map(function (c, i) { return e('span', { key: i }, c); }),
      ),
    ),
    // Sections
    sections.map(function (section) {
      return e('div', { key: section.id, style: { marginBottom: cfg.sectionGap } },
        e('div', { style: { fontSize: cfg.titleSize, fontWeight: 700, borderBottom: '1px solid #ddd', paddingBottom: 3, marginBottom: cfg.itemGap + 2 } },
          section.title || SECTION_LABELS[section.type] || section.type),
        section.type === 'summary'
          ? section.items.map(function (item) { return e('div', { key: item.id, style: { color: '#444' } }, item.description); })
          : section.type === 'skills'
            ? section.items.map(function (item) {
                return e('div', { key: item.id, style: { marginBottom: cfg.itemGap } },
                  item.title && e('div', { style: { fontWeight: 700, marginBottom: 2 } }, item.title),
                  e('div', { style: { color: '#444' } }, item.description),
                );
              })
            : section.items.map(function (item) {
                return e('div', { key: item.id, style: { marginBottom: cfg.itemGap } },
                  e('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 2 } },
                    e('div', { style: { flex: 1 } },
                      item.title && e('div', { style: { fontWeight: 700, fontSize: 'calc(' + cfg.fontSize + ' + 0.5pt)' } }, item.title),
                      item.subtitle && e('div', { style: { color: '#555' } }, item.subtitle),
                    ),
                    (item.startDate || item.endDate) && e('div', { style: { fontSize: '9pt', color: '#888', whiteSpace: 'nowrap' } },
                      (item.startDate || '') + (item.startDate && item.endDate ? ' - ' : '') + (item.endDate || '')),
                  ),
                  item.description && e('div', { style: { color: '#444' } }, item.description),
                );
              }),
      );
    }),
  );
}

function handlePrint() {
  const preview = document.getElementById('resume-preview');
  if (!preview) return;
  const w = window.open('', '_blank', 'width=800,height=600');
  w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>简历</title><style>body{margin:0;display:flex;justify-content:center;background:#e8e8e8;padding:20px;}@media print{body{background:#fff;padding:0;}}</style></head><body>');
  w.document.body.appendChild(preview.cloneNode(true));
  w.document.close();
  setTimeout(function () { w.print(); }, 300);
}

// ── App ──
export default function App() {
  const [tab, setTab] = useState('info');
  const density = useResumeStore(function (s) { return s.density; });
  const setDensity = useResumeStore(function (s) { return s.setDensity; });
  const activeVersionId = useResumeStore(function (s) { return s.activeVersionId; });
  const versions = useResumeStore(function (s) { return s.versions; });
  const version = activeVersionId ? versions.find(function (v) { return v.id === activeVersionId; }) : null;

  const tabs = [['info', '个人信息'], ['sections', '内容模块'], ['versions', '版本管理']];

  return e('div', { className: 'app-layout' },
    // Sidebar
    e('aside', { className: 'sidebar' },
      e('div', { className: 'editor-panel' },
        e('div', { className: 'editor-tabs' },
          tabs.map(function ([key, label]) {
            return e('button', { key, className: 'editor-tab' + (tab === key ? ' active' : ''), onClick: function () { setTab(key); } }, label);
          }),
        ),
        e('div', { className: 'editor-body' },
          tab === 'info' && e(PersonalInfoEditor),
          tab === 'sections' && e(SectionEditor),
          tab === 'versions' && e(VersionManager),
        ),
        e('div', { className: 'editor-footer' },
          e('span', { className: 'density-label' }, '排版密度'),
          e('div', { className: 'density-controls' },
            DENSITY.map(function (opt) {
              return e('button', { key: opt.value, className: 'density-btn' + (density === opt.value ? ' active' : ''), onClick: function () { setDensity(opt.value); } }, opt.label);
            }),
          ),
        ),
      ),
    ),
    // Main
    e('main', { className: 'main' },
      e('div', { className: 'preview-toolbar' },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          e('span', { className: 'preview-title' }, '简历预览'),
          version && e('span', { className: 'preview-badge' }, version.name),
        ),
        e('button', { className: 'export-btn', onClick: handlePrint },
          e(Download, { size: 14 }), ' 导出 PDF',
        ),
      ),
      e('div', { className: 'preview-container' },
        e(ResumePreview),
      ),
    ),
  );
}
