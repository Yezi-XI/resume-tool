import { useResumeStore } from '../../store/useResumeStore';

export default function PersonalInfoEditor() {
  const { personalInfo } = useResumeStore((s) => s.resume);
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo);

  const fields: { key: keyof typeof personalInfo; label: string; placeholder: string }[] = [
    { key: 'name', label: '姓名', placeholder: '张三' },
    { key: 'title', label: '求职意向', placeholder: '前端开发工程师' },
    { key: 'phone', label: '电话', placeholder: '138-0000-0000' },
    { key: 'email', label: '邮箱', placeholder: 'zhangsan@example.com' },
    { key: 'location', label: '所在地', placeholder: '北京' },
    { key: 'website', label: '个人网站', placeholder: 'https://github.com/zhangsan' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        基本信息
      </h3>
      {fields.map(({ key, label, placeholder }) => (
        <div className="form-group" key={key}>
          <label className="form-label">{label}</label>
          <input
            className="form-input"
            placeholder={placeholder}
            value={personalInfo[key]}
            onChange={(e) => updatePersonalInfo({ [key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
