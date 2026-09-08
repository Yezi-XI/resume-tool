import { useResumeStore } from '../../store/useResumeStore';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step, unit = 'px', onChange }: SliderProps) {
  return (
    <div className="form-group" style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span className="form-label" style={{ marginBottom: 0 }}>{label}</span>
        <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, minWidth: 48, textAlign: 'right' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent)' }}
      />
    </div>
  );
}

export default function StyleEditor() {
  const { contentStyle, updateContentStyle } = useResumeStore();

  const update = (key: string, value: number | boolean) => {
    updateContentStyle({ [key]: value } as any);
  };

  return (
    <div>
      <h3 className="section-heading">内容样式</h3>

      <Slider
        label="标题与正文间距"
        value={contentStyle.titleContentGap}
        min={0}
        max={30}
        step={1}
        onChange={(v) => update('titleContentGap', v)}
      />

      <Slider
        label="正文标题大小"
        value={contentStyle.contentTitleSize}
        min={8}
        max={20}
        step={0.5}
        unit="px"
        onChange={(v) => update('contentTitleSize', v)}
      />

      <Slider
        label="正文标题与内容间距"
        value={contentStyle.contentTitleGap}
        min={0}
        max={20}
        step={1}
        onChange={(v) => update('contentTitleGap', v)}
      />

      <Slider
        label="内容行间距"
        value={contentStyle.contentLineHeight}
        min={1}
        max={3}
        step={0.1}
        unit=""
        onChange={(v) => update('contentLineHeight', v)}
      />

      <Slider
        label="内容字间距"
        value={contentStyle.contentLetterSpacing}
        min={-2}
        max={5}
        step={0.5}
        unit="px"
        onChange={(v) => update('contentLetterSpacing', v)}
      />

      <Slider
        label="经历板块间距"
        value={contentStyle.itemBlockGap}
        min={0}
        max={20}
        step={1}
        onChange={(v) => update('itemBlockGap', v)}
      />

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>标题装饰</h4>

        <div className="form-group" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="form-label" style={{ marginBottom: 0 }}>标题竖杠</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={contentStyle.showVerticalBar}
                onChange={(e) => update('showVerticalBar', e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
              />
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                {contentStyle.showVerticalBar ? '开' : '关'}
              </span>
            </label>
          </div>
        </div>

        {contentStyle.showVerticalBar && (
          <div className="form-group" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="form-label" style={{ marginBottom: 0 }}>竖杠数量</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2].map((n) => (
                  <button
                    key={n}
                    onClick={() => update('verticalBarCount', n)}
                    style={{
                      padding: '2px 10px',
                      fontSize: 12,
                      border: `1px solid ${contentStyle.verticalBarCount === n ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 4,
                      background: contentStyle.verticalBarCount === n ? 'var(--accent)' : 'transparent',
                      color: contentStyle.verticalBarCount === n ? '#fff' : 'var(--text)',
                      cursor: 'pointer',
                    }}
                  >
                    {n}道
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>段落符号</h4>

        <div className="form-group" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="form-label" style={{ marginBottom: 0 }}>段落前加符号</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={contentStyle.showParagraphBullet}
                onChange={(e) => update('showParagraphBullet', e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
              />
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                {contentStyle.showParagraphBullet ? '开' : '关'}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}