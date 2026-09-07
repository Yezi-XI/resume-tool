import re

with open(r'C:\Users\27364\Documents\Codex\2026-09-07\mvp\resume-tool\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The old sections JSON (campus before projects, no honors)
old_sections = r'"sections": [\n    {\n      "type": "education",\n      "title": "教育背景",\n      "items": [\n        {"title": "学校名称", "subtitle": "学历/专业", "startDate": "开始时间", "endDate": "结束时间", "description": "在校经历"}\n      ]\n    },\n    {\n      "type": "practical_experience",\n      "title": "实践经验",\n      "items": [\n        {"title": "公司/组织名称", "subtitle": "职位", "startDate": "开始时间", "endDate": "结束时间", "description": "工作描述"}\n      ]\n    },\n    {\n      "type": "campus_experience",\n      "title": "校园经历",\n      "items": [\n        {"title": "组织/社团名称", "subtitle": "职位", "startDate": "开始时间", "endDate": "结束时间", "description": "经历描述"}\n      ]\n    },\n    {\n      "type": "projects",\n      "title": "项目经历",\n      "items": [\n        {"title": "项目名称", "subtitle": "角色", "startDate": "开始时间", "endDate": "结束时间", "description": "项目描述"}\n      ]\n    },\n    {\n      "type": "other",\n      "title": "其他",\n      "items": [\n        {"title": "技能", "description": "具体技能"},\n        {"title": "兴趣爱好", "description": "兴趣爱好内容"}\n      ]\n    }'

new_sections = r'"sections": [\n    {\n      "type": "education",\n      "title": "教育背景",\n      "items": [\n        {"title": "学校名称", "subtitle": "学历/专业", "startDate": "开始时间", "endDate": "结束时间", "description": "在校经历"}\n      ]\n    },\n    {\n      "type": "practical_experience",\n      "title": "实践经验",\n      "items": [\n        {"title": "公司/组织名称", "subtitle": "职位", "startDate": "开始时间", "endDate": "结束时间", "description": "工作描述"}\n      ]\n    },\n    {\n      "type": "projects",\n      "title": "项目经历",\n      "items": [\n        {"title": "项目名称", "subtitle": "角色", "startDate": "开始时间", "endDate": "结束时间", "description": "项目描述"}\n      ]\n    },\n    {\n      "type": "campus_experience",\n      "title": "校园经历",\n      "items": [\n        {"title": "组织/社团名称", "subtitle": "职位", "startDate": "开始时间", "endDate": "结束时间", "description": "经历描述"}\n      ]\n    },\n    {\n      "type": "honors",\n      "title": "荣誉奖项",\n      "items": [\n        {"title": "奖项名称", "subtitle": "颁发机构", "startDate": "获得时间", "description": "奖项描述"}\n      ]\n    },\n    {\n      "type": "other",\n      "title": "其他",\n      "items": [\n        {"title": "技能", "description": "具体技能"},\n        {"title": "兴趣爱好", "description": "兴趣爱好内容"}\n      ]\n    }'

if old_sections in content:
    content = content.replace(old_sections, new_sections)
    with open(r'C:\Users\27364\Documents\Codex\2026-09-07\mvp\resume-tool\index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Old sections not found in file")
    # Try to find what's there
    idx = content.find('"sections": [')
    if idx >= 0:
        print("Found at index:", idx)
        print("Context:", repr(content[idx:idx+200]))
