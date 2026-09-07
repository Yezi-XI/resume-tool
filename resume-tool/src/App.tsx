import { useState } from 'react';
import { useResumeStore } from './store/useResumeStore';
import AppLayout from './components/AppLayout';
import PersonalInfoEditor from './components/editor/PersonalInfoEditor';
import SectionEditor from './components/editor/SectionEditor';
import VersionManager from './components/editor/VersionManager';
import ResumePreview from './components/preview/ResumePreview';
import type { Density } from './types/resume';
import './App.css';

type EditorTab = 'info' | 'sections' | 'versions';

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: 'compact', label: '紧凑' },
  { value: 'normal', label: '标准' },
  { value: 'spacious', label: '宽松' },
];

export default function App() {
  const [tab, setTab] = useState<EditorTab>('info');
  const { density, setDensity } = useResumeStore();

  return (
    <AppLayout
      sidebar={
        <div className="editor-panel">
          <div className="editor-tabs">
            {([
              ['info', '个人信息'],
              ['sections', '内容模块'],
              ['versions', '版本管理'],
            ] as [EditorTab, string][]).map(([key, label]) => (
              <button
                key={key}
                className={`editor-tab ${tab === key ? 'active' : ''}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="editor-body">
            {tab === 'info' && <PersonalInfoEditor />}
            {tab === 'sections' && <SectionEditor />}
            {tab === 'versions' && <VersionManager />}
          </div>

          <div className="editor-footer">
            <span className="density-label">排版密度</span>
            <div className="density-controls">
              {DENSITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`density-btn ${density === opt.value ? 'active' : ''}`}
                  onClick={() => setDensity(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      main={<ResumePreview />}
    />
  );
}
