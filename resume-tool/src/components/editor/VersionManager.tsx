import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

export default function VersionManager() {
  const { resume, versions, activeVersionId } = useResumeStore();
  const {
    createVersion,
    deleteVersion,
    setActiveVersion,
    toggleSectionHidden,
  } = useResumeStore();
  const [newName, setNewName] = useState('');
  const [newJob, setNewJob] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createVersion(newName.trim(), newJob.trim());
    setNewName('');
    setNewJob('');
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          版本管理
        </h3>
        <button className="icon-btn" onClick={() => setShowForm(!showForm)} title="新建版本">
          <Plus size={16} />
        </button>
      </div>

      {activeVersionId === null && (
        <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--accent-subtle)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--accent)' }}>
          当前正在编辑主简历。创建版本后可以针对不同岗位进行定制。
        </div>
      )}

      {showForm && (
        <div className="version-create">
          <input
            className="form-input"
            placeholder="版本名称，如：字节跳动-前端"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="form-input"
            placeholder="目标岗位（可选），如：高级前端工程师"
            value={newJob}
            onChange={(e) => setNewJob(e.target.value)}
          />
          <div className="version-create-actions">
            <button className="btn-sm btn-ghost" onClick={() => setShowForm(false)}>取消</button>
            <button className="btn-sm btn-primary" onClick={handleCreate}>创建</button>
          </div>
        </div>
      )}

      {/* Main resume entry */}
      <div
        className={`version-card ${activeVersionId === null ? 'active' : ''}`}
        onClick={() => setActiveVersion(null)}
      >
        <div className="version-card-header">
          <span className="version-name">主简历</span>
        </div>
        <div className="version-job">所有版本的基础模板</div>
      </div>

      {versions.length === 0 && !showForm && (
        <div className="empty-state">暂无版本，点击 + 创建针对特定岗位的简历变体</div>
      )}

      {versions.map((version) => {
        const isExpanded = expandedVersion === version.id;
        const isActive = activeVersionId === version.id;
        return (
          <div
            key={version.id}
            className={`version-card ${isActive ? 'active' : ''}`}
            onClick={() => {
              if (isActive) {
                setExpandedVersion(isExpanded ? null : version.id);
              } else {
                setActiveVersion(version.id);
              }
            }}
          >
            <div className="version-card-header">
              <span className="version-name">{version.name}</span>
              <button
                className="icon-btn danger"
                onClick={(e) => { e.stopPropagation(); deleteVersion(version.id); }}
                title="删除版本"
              >
                <Trash2 size={14} />
              </button>
            </div>
            {version.targetJob && (
              <div className="version-job">目标岗位：{version.targetJob}</div>
            )}

            {isExpanded && isActive && (
              <div className="version-overrides">
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                  模块可见性
                </div>
                {resume.sections.map((sec) => {
                  const hidden = version.sectionOverrides[sec.id]?.hidden ?? false;
                  return (
                    <div className="override-row" key={sec.id}>
                      <label onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={!hidden}
                          onChange={() => toggleSectionHidden(version.id, sec.id)}
                        />
                        <span style={{ marginLeft: 6 }}>
                          {hidden ? <EyeOff size={12} style={{ verticalAlign: 'middle' }} /> : <Eye size={12} style={{ verticalAlign: 'middle' }} />}
                          {' '}{sec.title || sec.type}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
