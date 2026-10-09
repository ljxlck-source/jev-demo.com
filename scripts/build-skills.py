"""Build the two static skills directories from local project data; no network required."""
from pathlib import Path
import html
import json
import re
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = json.loads((ROOT / 'content/skills.json').read_text())
CATEGORIES = {
    'route': ('Model & skill routing', '模型与技能路由'),
    'guard': ('Agent guardrails', '智能体安全检查'),
    'review': ('Code review', '代码审查'),
    'browser': ('Browser & web', '浏览器与网页'),
    'write': ('Writing & content', '写作与内容'),
    'office': ('Workflows & data', '工作流与数据'),
    'context': ('Context management', '上下文管理'),
    'fun': ('Games & experiments', '游戏与实验'),
    'eval': ('Evaluation', '评估'),
    'open': ('Independent models', '独立模型'),
}
COPY = {
 'en': dict(title='Jev GitHub Skills: Repositories & Projects | JEV Demo', description='Browse Jev-related GitHub repositories, agent skills and community experiments. Filter by use case, search projects and open their original source code.', lead='Find Jev-related repositories, agent skills and community experiments. Choose a use case to explore the code behind a project.', all='All projects', filtered='Filtered projects', empty='No matching projects', empty_text='Try another search, category or link type.', categories='Use cases', search='Search projects, tasks or repositories', kind='Link type', any_kind='All links', repo='GitHub repository', demo='Demo / report', sort='Sort', source_order='Directory order', name_order='Name A–Z', reset='Clear filters', visit_repo='View on GitHub', visit_demo='View demo / report', note='Includes applications and experiments as well as installable skills. Independent models are listed separately.', footer='Descriptions are based on the source directory. Check each project’s README, license and requirements before use.', source='Source: Jev Directory', next='Start with a project', next_text='Use the repository documentation for installation. For the TypeSafe integration skill and a first decision workflow, follow the resources below.', guide='How to use Jev', demos='Watch Jev demos', official='TypeSafe skills on GitHub', skip='Skip to projects'),
 'zh': dict(title='Jev GitHub Skills：代码仓库与社区项目 | JEV Demo', description='按模型路由、智能体安全、代码审查、浏览器自动化等用途浏览 Jev GitHub 仓库与社区项目，搜索相关工具并访问源码。', lead='浏览 Jev 相关代码仓库、智能体技能与社区实验。按用途筛选项目，直接查看背后的源码。', all='全部项目', filtered='筛选结果', empty='没有符合条件的项目', empty_text='试试其他关键词、分类或链接类型。', categories='用途分类', search='搜索项目、用途或仓库', kind='链接类型', any_kind='全部链接', repo='GitHub 仓库', demo='演示 / 报告', sort='排序', source_order='目录顺序', name_order='名称 A–Z', reset='清除筛选', visit_repo='查看 GitHub 仓库', visit_demo='查看演示 / 报告', note='这里包括应用、实验和可安装的技能；独立模型另设分类。', footer='项目说明依据来源目录整理，使用前请查看各仓库的 README、许可证和运行要求。', source='来源：Jev Directory', next='开始使用项目', next_text='安装方法以各仓库文档为准。TypeSafe 集成技能和入门工作流可参考以下资源。', guide='如何使用 Jev', demos='观看 Jev 案例', official='TypeSafe GitHub 技能仓库', skip='跳转到项目'),
}
e = html.escape
for language, copy in COPY.items():
    zh = language == 'zh'
    prefix = '/zh' if zh else ''
    route = prefix + '/jev-github-skills/'
    template = (ROOT / ('zh/' if zh else '') / 'how-to-use-jev/index.html').read_text()
    head = template.split('</head>')[0]
    old_title = re.search(r'<title>(.*?)</title>', head).group(1)
    old_desc = re.search(r'<meta name="description" content="(.*?)">', head).group(1)
    head = head.replace(old_title, e(copy['title'])).replace(old_desc, e(copy['description']))
    head = head.replace('/how-to-use-jev/', '/jev-github-skills/').replace('/guide.css', '/skills.css')
    schema = {'@context':'https://schema.org','@type':'CollectionPage','name':'Jev GitHub Skills','description':copy['description'],'url':'https://jev-demo.com'+route,'inLanguage':'zh-CN' if zh else 'en'}
    head = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda _: '<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script>', head, flags=re.S)
    head += '<script src="/skills.js" defer></script>\n</head>\n'
    buttons = f'<button class="category active" type="button" data-skill-category="all" aria-pressed="true">{copy["all"]}</button>'
    for key, names in CATEGORIES.items():
        buttons += f'<button class="category" type="button" data-skill-category="{key}" aria-pressed="false">{e(names[zh])}</button>'
    cards = []
    for project in PROJECTS:
        url = project['url']
        parsed = urlparse(url)
        assert parsed.scheme == 'https' and parsed.hostname in ('github.com','x.com'), url
        kind = 'repo' if parsed.hostname == 'github.com' else 'demo'
        description = project['descriptionZh'] if zh else project['description']
        link = copy['visit_'+kind]
        cards.append(f'''<article class="card skills-card" data-category="{project['category']}" data-kind="{kind}" data-name="{e(project['name'])}"><div class="card-body"><span class="tag">{e(CATEGORIES[project['category']][zh])}</span><h2><a class="title" href="{e(url)}" target="_blank" rel="noopener noreferrer">{e(project['name'])}</a></h2><p class="summary">{e(description)}</p></div><div class="card-meta"><span class="skills-kind">{copy[kind]}</span><a href="{e(url)}" target="_blank" rel="noopener noreferrer" aria-label="{e(link+': '+project['name'])}">{link} ↗</a></div></article>''')
    body = f'''<body data-locales="en,zh">
<a class="skills-skip" href="#skills-grid">{copy['skip']}</a>
<header><a class="brand" href="{prefix}/" aria-label="JEV Demo"><img class="brand-logo" src="/logo.svg" alt="" width="42" height="42"><strong>JEV <span>Demo</span></strong></a><nav class="header-nav" aria-label="{'主导航' if zh else 'Main navigation'}"><a href="{prefix}/">{copy['demos']}</a><a href="{prefix}/calculator/">tokens calculator</a><a href="{prefix}/how-to-use-jev/">{copy['guide']}</a><a class="language-link" href="{'/jev-github-skills/' if zh else '/zh/jev-github-skills/'}">{'English' if zh else '中文'}</a></nav></header>
<main class="skills-page" data-all="{copy['all']}" data-filtered="{copy['filtered']}" data-empty="{copy['empty']}">
<section class="intro"><h1>Jev GitHub Skills</h1><p class="lede">{copy['lead']}</p></section>
<div class="workspace"><aside><div data-skills-controls hidden><p class="side-heading">{copy['categories']}</p><div id="categories" role="group" aria-label="{copy['categories']}">{buttons}</div></div><p class="side-note">{copy['note']}</p></aside>
<section class="results" aria-label="{copy['all']}"><div class="toolbar" data-skills-controls hidden><label class="search"><span aria-hidden="true">⌕</span><input id="skills-search" type="search" placeholder="{copy['search']}" aria-label="{copy['search']}"></label><label class="filter">{copy['kind']}<select id="skills-kind"><option value="all">{copy['any_kind']}</option><option value="repo">{copy['repo']}</option><option value="demo">{copy['demo']}</option></select></label><label class="filter">{copy['sort']}<select id="skills-sort"><option value="source">{copy['source_order']}</option><option value="name">{copy['name_order']}</option></select></label></div>
<div class="result-meta"><span id="skills-status" role="status">{copy['all']}</span><button class="skills-reset" type="button" data-skills-reset data-skills-controls hidden>{copy['reset']}</button></div><div class="grid" id="skills-grid">{''.join(cards)}</div><div class="empty" id="skills-empty" hidden><h2>{copy['empty']}</h2><p>{copy['empty_text']}</p><button type="button" class="primary" data-skills-reset>{copy['reset']}</button></div></section></div>
<section class="skills-resources"><h2>{copy['next']}</h2><p>{copy['next_text']}</p><nav aria-label="{'相关资源' if zh else 'Related resources'}"><a href="{prefix}/how-to-use-jev/">{copy['guide']}</a><a href="{prefix}/">{copy['demos']}</a><a href="https://github.com/typesafe-ai/skills" target="_blank" rel="noopener noreferrer">{copy['official']} ↗</a></nav></section>
<footer><span>{copy['footer']}</span><a class="source" href="https://jevai.it.com/" target="_blank" rel="noopener noreferrer">{copy['source']} ↗</a></footer></main><script src="/languages.js" defer></script></body></html>'''
    body = body.replace(f'<a href="{prefix}/calculator/">tokens calculator</a>', f'<a href="{prefix}/tools/">'+('工具' if zh else 'Tools')+'</a>'+f'<a href="{prefix}/blog/">'+('博客' if zh else 'Blog')+'</a>')
    output = ROOT / route.strip('/') / 'index.html'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(head+body+'\n')
    print(output.relative_to(ROOT))
