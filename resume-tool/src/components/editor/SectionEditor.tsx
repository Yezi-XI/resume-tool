import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Briefcase, GraduationCap, Zap, FolderGit, User, Puzzle } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { SECTION_LABELS, type SectionType } from '../../types/resume';
import SectionItemEditor from './SectionItemEditor';

const SECTION_TYPE_OPTIONS: { type: SectionType; icon: typeof Briefcase }[] = [
  { type: 'experience', icon: Briefcase },
  { type: 'education', icon: GraduationCap },
  { type: 'skills', icon: Zap },
  { type: 'projects', icon: FolderGit },
  { type: 'summary', icon: User },
  { type: 'custom', icon: Puzzle },
];

export default function SectionEditor() {
  const { sections } = useResumeStore((s) => s.resume);
  const {
    addSection,
    removeSection,
    updateSectionTitle,
    moveSection,
    addSectionItem,
    removeSectionItem,
    updateSectionItem,
    moveSectionItem,
  } = useResumeStore();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          内容模块
        </h3>
        <button
          className="icon-btn"
          onClick={() => setShowAdd(!showAdd)}
          title="添加模块"
        >
          <Plus size={16} />
        </button>
      </div>

      {showAdd && (
        <div className="add-section-area">
          {SECTION_TYPE_OPTIONS.map(({ type, icon: Icon }) => (
            <button
              key={type}
              className="add-section-btn"
              onClick={() => { addSection(type); setShowAdd(false); }}
              style={{ marginBottom: 6 }}
            >
              <Icon size={14} />
              {SECTION_LABELS[type]}
            </button>
          ))}
        </div>
      )}

      {sections.length === 0 && (
        <div className="empty-state">暂无内容模块，点击 + 添加</div>
      )}

      {sections.map((section, secIdx) => (
        <div className="section-card" key={section.id}>
          <div className="section-header">
            {(() => {
              const opt = SECTION_TYPE_OPTIONS.find((o) => o.type === section.type);
              const Icon = opt?.icon ?? Puzzle;
              return <Icon size={14} className="section-type-icon" />;
            })()}
            <input
              className="section-title-input"
              value={section.title}
              placeholder={SECTION_LABELS[section.type]}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
            />
            <div className="section-actions">
              <button
                className="icon-btn"
                onClick={() => moveSection(section.id, 'up')}
                disabled={secIdx === 0}
                title="上移"
              >
                <ChevronUp size={14} />
              </button>
              <button
                className="icon-btn"
                onClick={() => moveSection(section.id, 'down')}
                disabled={secIdx === sections.length - 1}
                title="下移"
              >
                <ChevronDown size={14} />
              </button>
              <button
                className="icon-btn danger"
                onClick={() => removeSection(section.id)}
                title="删除模块"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="section-items">
            {section.items.map((item, itemIdx) => (
              <SectionItemEditor
                key={item.id}
                item={item}
                index={itemIdx}
                total={section.items.length}
                sectionType={section.type}
                onChange={(updates) => updateSectionItem(section.id, item.id, updates)}
                onRemove={() => removeSectionItem(section.id, item.id)}
                onMoveUp={() => moveSectionItem(section.id, item.id, 'up')}
                onMoveDown={() => moveSectionItem(section.id, item.id, 'down')}
              />
            ))}
            <button
              className="add-item-btn"
              onClick={() => addSectionItem(section.id)}
            >
              <Plus size={12} />
              添加条目
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
