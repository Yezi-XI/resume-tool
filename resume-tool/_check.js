try {
  globalThis.document = { 
    createElement: () => ({ style: {}, appendChild: () => {}, addEventListener: () => {}, setAttribute: () => {} }),
    createTextNode: () => ({}),
    getElementById: () => ({ innerHTML: '', style: {}, addEventListener: () => {}, appendChild: () => {}, querySelectorAll: () => [] }),
    querySelectorAll: () => [],
    addEventListener: () => {}
  };
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  globalThis.window = globalThis;
  
// ── SVG Icons ──
const I = {
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  up: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>',
  down: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  briefcase: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  grad: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/></svg>',
  zap: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  folder: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  puzzle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.611a2.404 2.404 0 0 1-1.705.706 2.404 2.404 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.404 2.404 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.611a2.404 2.404 0 0 1 1.705-.706c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.969a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/></svg>',
  eye: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeoff: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',
};

// ── Data ──
const SECTION_LABELS = { experience:'工作经历', education:'教育背景', skills:'技能特长', projects:'项目经验', summary:'自我评价', custom:'自定义模块' };
const SECTION_ICONS = { experience:'briefcase', education:'grad', skills:'zap', projects:'folder', summary:'user', custom:'puzzle' };
const TYPE_OPTS = ['experience','education','skills','projects','summary','custom'];

let nextId = 100;
function uid() { return 'id-' + (nextId++) + '-' + Date.now().toString(36); }
function newItem(ov) { return { id:uid(), title:'', subtitle:'', startDate:'', endDate:'', description:'', ...ov }; }

const DEFAULT = {
  personalInfo: { name:'', title:'', phone:'', email:'', location:'', website:'' },
  sections: [
    { id:'sec-summary', type:'summary', title:'自我评价', letterSpacing:0, lineHeight:null, items:[newItem({id:'item-summary-1'})] },
    { id:'sec-exp', type:'experience', title:'工作经历', letterSpacing:0, lineHeight:null, items:[newItem({id:'item-exp-1'})] },
    { id:'sec-edu', type:'education', title:'教育背景', letterSpacing:0, lineHeight:null, items:[newItem({id:'item-edu-1'})] },
    { id:'sec-skills', type:'skills', title:'技能特长', letterSpacing:0, lineHeight:null, items:[newItem({id:'item-skill-1'})] },
    { id:'sec-proj', type:'projects', title:'项目经验', letterSpacing:0, lineHeight:null, items:[newItem({id:'item-proj-1'})] },
  ],
};

const FIELDS = {
  experience: [
    { key:'title', label:'公司名称', ph:'XX科技有限公司' },
    { key:'subtitle', label:'职位', ph:'高级前端工程师' },
    { key:'startDate', label:'开始时间', ph:'2020.06' },
    { key:'endDate', label:'结束时间', ph:'2023.06' },
    { key:'description', label:'工作描述', ph:'描述你的工作职责和成果...', area:true },
  ],
  education: [
    { key:'title', label:'学校名称', ph:'XX大学' },
    { key:'subtitle', label:'学历/专业', ph:'本科 / 计算机科学与技术' },
    { key:'startDate', label:'开始时间', ph:'2016.09' },
    { key:'endDate', label:'结束时间', ph:'2020.06' },
    { key:'description', label:'在校经历', ph:'GPA、获奖情况等...', area:true },
  ],
  projects: [
    { key:'title', label:'项目名称', ph:'电商平台重构' },
    { key:'subtitle', label:'角色', ph:'前端负责人' },
    { key:'startDate', label:'开始时间', ph:'2022.03' },
    { key:'endDate', label:'结束时间', ph:'2022.08' },
    { key:'description', label:'项目描述', ph:'描述项目背景、技术栈、贡献...', area:true },
  ],
  skills: [
    { key:'title', label:'技能分类', ph:'前端技术' },
    { key:'description', label:'具体技能', ph:'React, TypeScript, Vue.js...', area:true },
  ],
  summary: [
    { key:'description', label:'自我评价', ph:'简要描述你的职业优势...', area:true },
  ],
  custom: [
    { key:'title', label:'标题', ph:'标题' },
    { key:'subtitle', label:'副标题', ph:'副标题' },
    { key:'startDate', label:'开始时间', ph:'2020.01' },
    { key:'endDate', label:'结束时间', ph:'2020.12' },
    { key:'description', label:'描述', ph:'详细描述...', area:true },
  ],
};

const DENSITY_CFG = {
  compact: { fs:'9pt', lh:1.3, sg:8, ig:4, ts:'12pt', ns:'20pt' },
  normal: { fs:'10pt', lh:1.5, sg:12, ig:6, ts:'14pt', ns:'22pt' },
  spacious: { fs:'11pt', lh:1.7, sg:16, ig:10, ts:'16pt', ns:'24pt' },
};

// ── State ──
const STORE_KEY = 'resume-tool-data';
let state = { resume: DEFAULT, versions: [], activeVersionId: null, density: 'normal' };
try { const raw = localStorage.getItem(STORE_KEY); if (raw) state = JSON.parse(raw); } catch(e) {}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch(e) {} }

function getMerged() {
  const { resume, versions, activeVersionId } = state;
  if (!activeVersionId) return resume;
  const v = versions.find(function(x) { return x.id === activeVersionId; });
  if (!v) return resume;
  const secs = resume.sections
    .filter(function(s) { return !(v.sectionOverrides[s.id] || {}).hidden; })
    .map(function(s) {
      const ov = v.sectionOverrides[s.id] || {};
      if (!ov.itemOverrides) return s;
      return { ...s, items: s.items.map(function(it) { return ov.itemOverrides[it.id] ? { ...it, ...ov.itemOverrides[it.id] } : it; }) };
    });
  return { ...resume, sections: secs };
}

// ── Render helpers ──
function el(tag, attrs, ...children) {
  const e = document.createElement(tag);
  if (attrs) { for (const k in attrs) { if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]); else if (k === 'style' && typeof attrs[k] === 'object') Object.assign(e.style, attrs[k]); else if (k === 'className') e.className = attrs[k]; else if (k === 'innerHTML') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); } }
  for (const c of children) { if (c == null) continue; if (typeof c === 'string') { if (c.startsWith('<')) { const span = document.createElement('span'); span.style.display='inline-flex'; span.style.alignItems='center'; span.innerHTML = c; e.appendChild(span); } else e.appendChild(document.createTextNode(c)); } else e.appendChild(c); }
  return e;
}

function h(tag, attrs, ...children) { return el(tag, attrs, ...children); }

// ── Editor: PersonalInfo ──
function renderInfo() {
  const body = document.getElementById('editor-body');
  body.innerHTML = '';
  const info = state.resume.personalInfo;
  const fields = [
    { key:'name', label:'姓名', ph:'张三' },
    { key:'title', label:'求职意向', ph:'前端开发工程师' },
    { key:'phone', label:'电话', ph:'138-0000-0000' },
    { key:'email', label:'邮箱', ph:'zhangsan@example.com' },
    { key:'location', label:'所在地', ph:'北京' },
    { key:'website', label:'个人网站', ph:'https://github.com/zhangsan' },
  ];
  body.appendChild(h('h3', { className:'sh' }, '基本信息'));
  fields.forEach(function(f) {
    const grp = h('div', { className:'fg' },
      h('label', { className:'fl' }, f.label),
      h('input', { className:'fi', placeholder:f.ph, value:info[f.key]||'', oninput: function(e) { info[f.key] = e.target.value; save(); renderPreview(); } }),
    );
    body.appendChild(grp);
  });
}

// ── Editor: Item ──
function renderItem(item, idx, total, sectionType, sectionId) {
  const fields = FIELDS[sectionType] || FIELDS.custom;
  const card = h('div', { className:'ic' });

  const hdr = h('div', { className:'ihd' });
  hdr.appendChild(h('span', { className:'idx' }, '#' + (idx + 1)));
  const acts = h('div', { style:{ display:'flex', gap:'2px', marginLeft:'auto' } });
  acts.appendChild(h('button', { className:'ib', title:'上移', disabled:idx===0, onclick:function() { moveItem(sectionId, item.id, 'up'); } }, I.up));
  acts.appendChild(h('button', { className:'ib', title:'下移', disabled:idx===total-1, onclick:function() { moveItem(sectionId, item.id, 'down'); } }, I.down));
  acts.appendChild(h('button', { className:'ib danger', title:'删除', onclick:function() { removeItem(sectionId, item.id); } }, I.trash));
  hdr.appendChild(acts);
  card.appendChild(hdr);

  fields.forEach(function(f) {
    const val = item[f.key] || '';
    const grp = h('div', { className:'fg', style:{ marginBottom:'6px' } },
      h('label', { className:'fl' }, f.label),
    );
    if (f.area) {
      grp.appendChild(h('textarea', { className:'ft', placeholder:f.ph, value:val, rows:'3', oninput:function(e) { item[f.key] = e.target.value; save(); renderPreview(); } }));
    } else {
      grp.appendChild(h('input', { className:'fi', placeholder:f.ph, value:val, oninput:function(e) { item[f.key] = e.target.value; save(); renderPreview(); } }));
    }
    card.appendChild(grp);
  });
  return card;
}

// ── Editor: Sections ──
function renderSections() {
  const body = document.getElementById('editor-body');
  body.innerHTML = '';

  const hdr = h('div', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' } });
  hdr.appendChild(h('h3', { className:'sh', style:{ marginBottom:0 } }, '内容模块'));
  hdr.appendChild(h('button', { className:'ib', title:'添加模块', onclick: toggleAddSection }, I.plus));
  body.appendChild(hdr);

  const addArea = h('div', { id:'add-section-area', style:{ display:'none' } });
  TYPE_OPTS.forEach(function(type) {
    addArea.appendChild(h('button', { className:'asbtn', onclick:function() { addSection(type); } },
      I[SECTION_ICONS[type]] || I.puzzle, ' ' + SECTION_LABELS[type],
    ));
  });
  body.appendChild(addArea);

  const secs = state.resume.sections;
  if (secs.length === 0) {
    body.appendChild(h('div', { className:'es' }, '暂无内容模块，点击 + 添加'));
  }

  secs.forEach(function(sec, secIdx) {
    const card = h('div', { className:'sc' });
    const shd = h('div', { className:'shd' });
    shd.innerHTML = I[SECTION_ICONS[sec.type]] || I.puzzle;
    const inp = h('input', { className:'sin', value:sec.title, placeholder:SECTION_LABELS[sec.type], oninput:function(e) { sec.title = e.target.value; save(); renderPreview(); } });
    shd.appendChild(inp);
    const sac = h('div', { className:'sac' });
    sac.appendChild(h('button', { className:'ib', title:'上移', disabled:secIdx===0, onclick:function() { moveSection(sec.id, 'up'); } }, I.up));
    sac.appendChild(h('button', { className:'ib', title:'下移', disabled:secIdx===secs.length-1, onclick:function() { moveSection(sec.id, 'down'); } }, I.down));
    sac.appendChild(h('button', { className:'ib danger', title:'删除', onclick:function() { removeSection(sec.id); } }, I.trash));
    shd.appendChild(sac);
    card.appendChild(shd);

        // Spacing controls
    const spCfg = h('div', { className:'sec-spacing-cfg' });
    const lsLabel = h('label', {}, '字间距');
    const lsInp = h('input', { className:'sec-spacing-inp', type:'number', value:sec.letterSpacing||0, step:'0.5', min:'-5', max:'20', placeholder:'0', oninput:function(e) { sec.letterSpacing = parseFloat(e.target.value)||0; save(); renderPreview(); } });
    const lhLabel = h('label', {}, '行间距');
    const lhInp = h('input', { className:'sec-spacing-inp', type:'number', value:sec.lineHeight||'', step:'0.1', min:'0.5', max:'3', placeholder:'默认', oninput:function(e) { var v = parseFloat(e.target.value); sec.lineHeight = v ? v : null; save(); renderPreview(); } });
    spCfg.appendChild(lsLabel); spCfg.appendChild(lsInp);
    spCfg.appendChild(lhLabel); spCfg.appendChild(lhInp);
    card.appendChild(spCfg);

    const sit = h('div', { className:'sit' });
    sec.items.forEach(function(item, itemIdx) {
      sit.appendChild(renderItem(item, itemIdx, sec.items.length, sec.type, sec.id));
    });
    sit.appendChild(h('button', { className:'abtn', onclick:function() { addItem(sec.id); } }, I.plus, ' 添加条目'));
    card.appendChild(sit);
    body.appendChild(card);
  });
}

function toggleAddSection() {
  const area = document.getElementById('add-section-area');
  area.style.display = area.style.display === 'none' ? 'block' : 'none';
}

function addSection(type) {
  state.resume.sections.push({ id:uid(), type, title:'', letterSpacing:0, lineHeight:null, items:[newItem()] });
  save(); renderSections(); renderPreview();
}

function removeSection(id) {
  state.resume.sections = state.resume.sections.filter(function(s) { return s.id !== id; });
  save(); renderSections(); renderPreview();
}

function moveSection(id, dir) {
  const secs = state.resume.sections;
  const idx = secs.findIndex(function(s) { return s.id === id; });
  if (idx < 0) return;
  const tgt = dir === 'up' ? idx - 1 : idx + 1;
  if (tgt < 0 || tgt >= secs.length) return;
  [secs[idx], secs[tgt]] = [secs[tgt], secs[idx]];
  save(); renderSections(); renderPreview();
}

function addItem(sectionId) {
  const sec = state.resume.sections.find(function(s) { return s.id === sectionId; });
  if (!sec) return;
  sec.items.push(newItem());
  save(); renderSections(); renderPreview();
}

function removeItem(sectionId, itemId) {
  const sec = state.resume.sections.find(function(s) { return s.id === sectionId; });
  if (!sec) return;
  sec.items = sec.items.filter(function(it) { return it.id !== itemId; });
  save(); renderSections(); renderPreview();
}

function moveItem(sectionId, itemId, dir) {
  const sec = state.resume.sections.find(function(s) { return s.id === sectionId; });
  if (!sec) return;
  const idx = sec.items.findIndex(function(it) { return it.id === itemId; });
  if (idx < 0) return;
  const tgt = dir === 'up' ? idx - 1 : idx + 1;
  if (tgt < 0 || tgt >= sec.items.length) return;
  [sec.items[idx], sec.items[tgt]] = [sec.items[tgt], sec.items[idx]];
  save(); renderSections(); renderPreview();
}

// ── Editor: Versions ──
function renderVersions() {
  const body = document.getElementById('editor-body');
  body.innerHTML = '';

  const hdr = h('div', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' } });
  hdr.appendChild(h('h3', { className:'sh', style:{ marginBottom:0 } }, '版本管理'));
  hdr.appendChild(h('button', { className:'ib', title:'新建版本', onclick: toggleVersionForm }, I.plus));
  body.appendChild(hdr);

  if (!state.activeVersionId) {
    body.appendChild(h('div', { className:'tip' }, '当前正在编辑主简历。创建版本后可以针对不同岗位进行定制。'));
  }

  const vf = h('div', { id:'version-form', style:{ display:'none' }, className:'vcf' });
  const ni = h('input', { className:'fi', placeholder:'版本名称，如：字节跳动-前端', id:'vname' });
  const ji = h('input', { className:'fi', placeholder:'目标岗位（可选）', id:'vjob' });
  vf.appendChild(ni);
  vf.appendChild(ji);
  const va = h('div', { className:'vca' });
  va.appendChild(h('button', { className:'bs bg', onclick: toggleVersionForm }, '取消'));
  va.appendChild(h('button', { className:'bs bp', onclick: createVersion }, '创建'));
  vf.appendChild(va);
  body.appendChild(vf);

  // Main resume
  const mc = h('div', { className:'vc' + (state.activeVersionId === null ? ' on' : ''), onclick:function() { state.activeVersionId = null; save(); renderVersions(); renderPreview(); } });
  mc.appendChild(h('div', { className:'vch' }, h('span', { className:'vn' }, '主简历')));
  mc.appendChild(h('div', { className:'vj' }, '所有版本的基础模板'));
  body.appendChild(mc);

  if (state.versions.length === 0) {
    body.appendChild(h('div', { className:'es' }, '暂无版本，点击 + 创建针对特定岗位的简历变体'));
  }

  state.versions.forEach(function(v) {
    const isActive = state.activeVersionId === v.id;
    const vc = h('div', { className:'vc' + (isActive ? ' on' : ''), onclick:function() { state.activeVersionId = v.id; save(); renderVersions(); renderPreview(); } });
    const vch = h('div', { className:'vch' });
    vch.appendChild(h('span', { className:'vn' }, v.name));
    vch.appendChild(h('button', { className:'ib danger', title:'删除', onclick:function(ev) { ev.stopPropagation(); deleteVersion(v.id); } }, I.trash));
    vc.appendChild(vch);
    if (v.targetJob) vc.appendChild(h('div', { className:'vj' }, '目标岗位：' + v.targetJob));

    // Overrides
    if (isActive) {
      const vo = h('div', { className:'vo' });
      vo.appendChild(h('div', { style:{ fontSize:'11px', fontWeight:600, color:'var(--t3)', marginBottom:'6px' } }, '模块可见性'));
      state.resume.sections.forEach(function(sec) {
        const hidden = (v.sectionOverrides[sec.id] || {}).hidden || false;
        const row = h('div', { className:'vor' });
        const lbl = h('label', { onclick:function(ev) { ev.stopPropagation(); } });
        const cb = h('input', { type:'checkbox' });
        cb.checked = !hidden;
        cb.onchange = function() { toggleSectionHidden(v.id, sec.id); };
        lbl.appendChild(cb);
        lbl.appendChild(h('span', { style:{ marginLeft:'6px' }, innerHTML: (hidden ? I.eyeoff : I.eye) + ' ' + (sec.title || SECTION_LABELS[sec.type] || sec.type) }));
        row.appendChild(lbl);
        vo.appendChild(row);
      });
      vc.appendChild(vo);
    }
    body.appendChild(vc);
  });
}

function toggleVersionForm() {
  const vf = document.getElementById('version-form');
  vf.style.display = vf.style.display === 'none' ? 'flex' : 'none';
}

function createVersion() {
  const name = document.getElementById('vname').value.trim();
  if (!name) return;
  const job = document.getElementById('vjob').value.trim();
  state.versions.push({ id:uid(), name, targetJob:job, sectionOverrides:{} });
  state.activeVersionId = state.versions[state.versions.length - 1].id;
  document.getElementById('vname').value = '';
  document.getElementById('vjob').value = '';
  save(); renderVersions(); renderPreview();
}

function deleteVersion(id) {
  state.versions = state.versions.filter(function(v) { return v.id !== id; });
  if (state.activeVersionId === id) state.activeVersionId = null;
  save(); renderVersions(); renderPreview();
}

function toggleSectionHidden(versionId, sectionId) {
  const v = state.versions.find(function(x) { return x.id === versionId; });
  if (!v) return;
  const cur = v.sectionOverrides[sectionId] || {};
  v.sectionOverrides[sectionId] = { ...cur, hidden: !cur.hidden };
  if (!v.sectionOverrides[sectionId].hidden && !v.sectionOverrides[sectionId].itemOverrides) delete v.sectionOverrides[sectionId];
  save(); renderVersions(); renderPreview();
}

// ── Preview ──
function renderPreview() {
  const container = document.getElementById('preview-container');
  const resume = getMerged();
  const cfg = DENSITY_CFG[state.density];
  const { personalInfo, sections } = resume;
  const contacts = [personalInfo.phone, personalInfo.email, personalInfo.location, personalInfo.website].filter(Boolean);

  const pv = h('div', { className:'pview', id:'resume-preview' });
  pv.style.fontSize = cfg.fs;
  pv.style.lineHeight = cfg.lh;

  // Header
  const hd = h('div', { className:'pshd', style:{ marginBottom: cfg.sg + 4 + 'px', paddingBottom: cfg.sg + 'px' } });
  hd.appendChild(h('div', { className:'pname', style:{ fontSize:cfg.ns } }, personalInfo.name || '姓名'));
  if (personalInfo.title) hd.appendChild(h('div', { className:'ptitle', style:{ fontSize:cfg.ts } }, personalInfo.title));
  if (contacts.length) {
    const cr = h('div', { className:'pcontact' });
    contacts.forEach(function(c) { cr.appendChild(h('span', {}, c)); });
    hd.appendChild(cr);
  }
  pv.appendChild(hd);

  // Sections
  sections.forEach(function(sec) {
        const secStyle = { marginBottom: cfg.sg + 'px' };
    if (sec.letterSpacing) secStyle.letterSpacing = sec.letterSpacing + 'px';
    if (sec.lineHeight) secStyle.lineHeight = sec.lineHeight;
    const sdiv = h('div', { className:'psec', style: secStyle });
        const stDiv = h('div', { className:'pstitle', style:{ fontSize:cfg.ts } });
    stDiv.appendChild(h('span', { className:'pstitle-name' }, sec.title || SECTION_LABELS[sec.type] || sec.type));
    if (sec.letterSpacing || sec.lineHeight) {
      const spBadge = h('span', { className:'psec-spacing' });
      if (sec.letterSpacing) spBadge.appendChild(h('span', {}, '字距:' + sec.letterSpacing + 'px'));
      if (sec.lineHeight) spBadge.appendChild(h('span', {}, '行高:' + sec.lineHeight));
      stDiv.appendChild(spBadge);
    }
    sdiv.appendChild(stDiv);

    if (sec.type === 'summary') {
      sec.items.forEach(function(item) {
        sdiv.appendChild(h('div', { className:'pidesc' }, item.description));
      });
    } else if (sec.type === 'skills') {
      sec.items.forEach(function(item) {
        const idiv = h('div', { className:'pitem', style:{ marginBottom: cfg.ig + 'px' } });
        if (item.title) idiv.appendChild(h('div', { className:'pititle', style:{ marginBottom:'2px' } }, item.title));
        idiv.appendChild(h('div', { className:'pidesc' }, item.description));
        sdiv.appendChild(idiv);
      });
    } else {
      sec.items.forEach(function(item) {
        const idiv = h('div', { className:'pitem', style:{ marginBottom: cfg.ig + 'px' } });
        const ihd = h('div', { className:'pihead' });
        const il = h('div', { style:{ flex:1 } });
        if (item.title) il.appendChild(h('div', { className:'pititle' }, item.title));
        if (item.subtitle) il.appendChild(h('div', { className:'pisub' }, item.subtitle));
        ihd.appendChild(il);
        if (item.startDate || item.endDate) {
          ihd.appendChild(h('div', { className:'pidate' }, (item.startDate||'') + (item.startDate&&item.endDate?' - ':'') + (item.endDate||'')));
        }
        idiv.appendChild(ihd);
        if (item.description) idiv.appendChild(h('div', { className:'pidesc' }, item.description));
        sdiv.appendChild(idiv);
      });
    }
    pv.appendChild(sdiv);
  });

  container.innerHTML = '';
  container.appendChild(pv);

  // Version badge
  const badge = document.getElementById('version-badge');
  if (state.activeVersionId) {
    const v = state.versions.find(function(x) { return x.id === state.activeVersionId; });
    badge.textContent = v ? v.name : '';
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}

// ── Density ──
function renderDensity() {
  const container = document.getElementById('density-btns');
  container.innerHTML = '';
  ['compact','normal','spacious'].forEach(function(d) {
    const labels = { compact:'紧凑', normal:'标准', spacious:'宽松' };
    container.appendChild(h('button', { className:'dbtn' + (state.density === d ? ' on' : ''), onclick:function() { state.density = d; save(); renderDensity(); renderPreview(); } }, labels[d]));
  });
}

// ── Tabs ──
let currentTab = 'info';
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(function(t) { t.classList.toggle('on', t.dataset.tab === tab); });
  if (tab === 'info') renderInfo();
  else if (tab === 'sections') renderSections();
  else if (tab === 'versions') renderVersions();
}

document.getElementById('tabs').addEventListener('click', function(e) {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  switchTab(tab.dataset.tab);
});

// ── PDF Export ──
function exportPDF() {
  const pv = document.getElementById('resume-preview');
  if (!pv) return;
  const w = window.open('', '_blank', 'width=800,height=600');
  w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>简历</title><style>body{margin:0;display:flex;justify-content:center;background:#e8e8e8;padding:20px;font-family:"PingFang SC","Microsoft YaHei",sans-serif}@media print{body{background:#fff;padding:0}}.pview{width:210mm;min-height:297mm;padding:15mm 18mm;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.15)}.pname{font-weight:700;margin-bottom:4px}.ptitle{color:#555;margin-bottom:6px}.pcontact{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:9pt;color:#666}.pshd{border-bottom:2px solid #1a1a1a;padding-bottom:8px}.pstitle{font-weight:700;border-bottom:1px solid #ddd;padding-bottom:3px;margin-bottom:4px;display:flex;align-items:baseline;gap:6px}.pstitle-name{flex:1}.psec-spacing{display:flex;align-items:center;gap:4px;font-size:8pt;color:#bbb;font-weight:400}.psec-spacing span{white-space:nowrap}.pitem{margin-bottom:4px}.pihead{display:flex;justify-content:space-between;margin-bottom:2px}.pititle{font-weight:700}.pisub{color:#555}.pidate{font-size:9pt;color:#888;white-space:nowrap}.pidesc{color:#444}.pstitle{display:flex;align-items:baseline;gap:6px}.pstitle-name{flex:1}.psec-spacing{display:flex;align-items:center;gap:4px;font-size:8pt;color:#bbb;font-weight:400}.psec-spacing span{white-space:nowrap}@media print{.pview{box-shadow:none!important;width:100%;min-height:auto;padding:0}}</style></head><body>');
  w.document.body.appendChild(pv.cloneNode(true));
  w.document.close();
  setTimeout(function() { w.print(); }, 300);
}

// ── Init ──
renderDensity();
switchTab('info');
renderPreview();

  console.log('SYNTAX OK');
} catch(e) {
  console.log('ERROR:', e.message);
}