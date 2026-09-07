const fs = require("fs");
const path = "C:/Users/27364/Documents/Codex/2026-09-07/mvp/resume-tool/index.html";
let content = fs.readFileSync(path, "utf-8");

// In the file, the IMPORT_PROMPT uses literal \n (two chars), not actual newlines
const oldSections = '"sections": [\\n    {\\n      \"type\": \"education\",\\n      \"title\": \"教育背景\",\\n      \"items\": [\\n        {\"title\": \"学校名称\", \"subtitle\": \"学历/专业\", \"startDate\": \"开始时间\", \"endDate\": \"结束时间\", \"description\": \"在校经历\"}\\n      ]\\n    },\\n    {\\n      \"type\": \"practical_experience\",\\n      \"title\": \"实践经验\",\\n      \"items\": [\\n        {\"title\": \"公司/组织名称\", \"subtitle\": \"职位\", \"startDate\": \"开始时间\", \"endDate\": \"结束时间\", \"description\": \"工作描述\"}\\n      ]\\n    },\\n    {\\n      \"type\": \"campus_experience\",\\n      \"title\": \"校园经历\",\\n      \"items\": [\\n        {\"title\": \"组织/社团名称\", \"subtitle\": \"职位\", \"startDate\": \"开始时间\", \"endDate\": \"结束时间\", \"description\": \"经历描述\"}\\n      ]\\n    },\\n    {\\n      \"type\": \"projects\",\\n      \"title\": \"项目经历\",\\n      \"items\": [\\n        {\"title\": \"项目名称\", \"subtitle\": \"角色\", \"startDate\": \"开始时间\", \"endDate\": \"结束时间\", \"description\": \"项目描述\"}\\n      ]\\n    },\\n    {\\n      \"type\": \"other\",\\n      \"title\": \"其他\",\\n      \"items\": [\\n        {\"title\": \"技能\", \"description\": \"具体技能\"},\\n        {\"title\": \"兴趣爱好\", \"description\": \"兴趣爱好内容\"}\\n      ]\\n    }';

const newSections = '"sections": [\\n    {\\n      \"type\": \"education\",\\n      \"title\": \"教育背景\",\\n      \"items\": [\\n        {\"title\": \"学校名称\", \"subtitle\": \"学历/专业\", \"startDate\": \"开始时间\", \"endDate\": \"结束时间\", \"description\": \"在校经历\"}\\n      ]\\n    },\\n    {\\n      \"type\": \"practical_experience\",\\n      \"title\": \"实践经验\",\\n      \"items\": [\\n        {\"title\": \"公司/组织名称\", \"subtitle\": \"职位\", \"startDate\": \"开始时间\", \"endDate\": \"结束时间\", \"description\": \"工作描述\"}\\n      ]\\n    },\\n    {\\n      \"type\": \"projects\",\\n      \"title\": \"项目经历\",\\n      \"items\": [\\n        {\"title\": \"项目名称\", \"subtitle\": \"角色\", \"startDate\": \"开始时间\", \"endDate\": \"结束时间\", \"description\": \"项目描述\"}\\n      ]\\n    },\\n    {\\n      \"type\": \"campus_experience\",\\n      \"title\": \"校园经历\",\\n      \"items\": [\\n        {\"title\": \"组织/社团名称\", \"subtitle\": \"职位\", \"startDate\": \"开始时间\", \"endDate\": \"结束时间\", \"description\": \"经历描述\"}\\n      ]\\n    },\\n    {\\n      \"type\": \"honors\",\\n      \"title\": \"荣誉奖项\",\\n      \"items\": [\\n        {\"title\": \"奖项名称\", \"subtitle\": \"颁发机构\", \"startDate\": \"获得时间\", \"description\": \"奖项描述\"}\\n      ]\\n    },\\n    {\\n      \"type\": \"other\",\\n      \"title\": \"其他\",\\n      \"items\": [\\n        {\"title\": \"技能\", \"description\": \"具体技能\"},\\n        {\"title\": \"兴趣爱好\", \"description\": \"兴趣爱好内容\"}\\n      ]\\n    }';

if (content.includes(oldSections)) {
  content = content.replace(oldSections, newSections);
  fs.writeFileSync(path, content, "utf-8");
  console.log("Replaced successfully");
} else {
  console.log("Old sections not found");
  const idx = content.indexOf('"sections": [');
  console.log("At", idx, ":", JSON.stringify(content.slice(idx, idx+200)));
}
