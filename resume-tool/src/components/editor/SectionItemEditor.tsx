import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { SectionItem, SectionType } from '../../types/resume';

interface SectionItemEditorProps {
  item: SectionItem;
  index: number;
  total: number;
  sectionType: SectionType;
  onChange: (updates: Partial<SectionItem>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const FIELD_CONFIGS: Record<SectionType, { key: string; label: string; placeholder: string; area?: boolean }[]> = {
  experience: [
    { key: 'title', label: '公司名称', placeholder: 'XX科技有限公司' },
    { key: 'subtitle', label: '职位', placeholder: '高级前端工程师' },
    { key: 'startDate', label: '开始时间', placeholder: '2020.06' },
    { key: 'endDate', label: '结束时间', placeholder: '2023.06' },
    { key: 'description', label: '工作描述', placeholder: '描述你的工作职责和成果...', area: true },
  ],
  education: [
    { key: 'title', label: '学校名称', placeholder: 'XX大学' },
    { key: 'subtitle', label: '学历/专业', placeholder: '本科 / 计算机科学与技术' },
    { key: 'startDate', label: '开始时间', placeholder: '2016.09' },
    { key: 'endDate', label: '结束时间', placeholder: '2020.06' },
    { key: 'description', label: '在校经历', placeholder: 'GPA、获奖情况、社团经历等...', area: true },
  ],
  projects: [
    { key: 'title', label: '项目名称', placeholder: '电商平台重构' },
    { key: 'subtitle', label: '角色', placeholder: '前端负责人' },
    { key: 'startDate', label: '开始时间', placeholder: '2022.03' },
    { key: 'endDate', label: '结束时间', placeholder: '2022.08' },
    { key: 'description', label: '项目描述', placeholder: '描述项目背景、技术栈、你的贡献...', area: true },
  ],
  skills: [
    { key: 'title', label: '技能分类', placeholder: '前端技术' },
    { key: 'description', label: '具体技能', placeholder: 'React, TypeScript, Vue.js, Webpack...', area: true },
  ],
  summary: [
    { key: 'description', label: '自我评价', placeholder: '简要描述你的职业优势和个人特点...', area: true },
  ],
  custom: [
    { key: 'title', label: '标题', placeholder: '标题' },
    { key: 'subtitle', label: '副标题', placeholder: '副标题' },
    { key: 'startDate', label: '开始时间', placeholder: '2020.01' },
    { key: 'endDate', label: '结束时间', placeholder: '2020.12' },
    { key: 'description', label: '描述', placeholder: '详细描述...', area: true },
  ],
};

export default function SectionItemEditor({
  item,
  index,
  total,
  sectionType,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SectionItemEditorProps) {
  const fields = FIELD_CONFIGS[sectionType] ?? FIELD_CONFIGS.custom;

  return (
    <div className="item-card">
      <div className="item-header">
        <span className="item-index">#{index + 1}</span>
        <div style={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
          <button className="icon-btn" onClick={onMoveUp} disabled={index === 0} title="上移">
            <ChevronUp size={14} />
          </button>
          <button className="icon-btn" onClick={onMoveDown} disabled={index === total - 1} title="下移">
            <ChevronDown size={14} />
          </button>
          <button className="icon-btn danger" onClick={onRemove} title="删除">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {fields.map(({ key, label, placeholder, area }) => {
        const value = (item as Record<string, string>)[key] ?? '';
        return (
          <div className="form-group" key={key} style={{ marginBottom: 6 }}>
            <label className="form-label">{label}</label>
            {area ? (
              <textarea
                className="form-textarea"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange({ [key]: e.target.value })}
                rows={3}
              />
            ) : (
              <input
                className="form-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange({ [key]: e.target.value })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
