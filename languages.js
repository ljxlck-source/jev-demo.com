(() => {
  const locales = [
    { code: 'en', name: 'English', native: 'English', prefix: '' },
    { code: 'zh', name: 'Chinese', native: '中文', prefix: '/zh' },
    { code: 'ja', name: 'Japanese', native: '日本語', prefix: '/ja' },
    { code: 'ko', name: 'Korean', native: '한국어', prefix: '/ko' },
    { code: 'ar', name: 'Arabic', native: 'العربية', prefix: '/ar' },
    { code: 'es', name: 'Spanish', native: 'Español', prefix: '/es' },
    { code: 'ru', name: 'Russian', native: 'Русский', prefix: '/ru' },
  ];
  const labels = { en: 'Language', zh: '语言', ja: '言語', ko: '언어', ar: 'اللغة', es: 'Idioma', ru: 'Язык' };
  const path = location.pathname.replace(/\/$/, '') || '/';
  const active = locales.find(x => x.prefix && (path === x.prefix || path.startsWith(x.prefix + '/')));
  const locale = active || locales[0];
  const route = active ? path.slice(active.prefix.length) || '/' : path;
  if (locale.code === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }
  const nav = document.querySelector('.header-nav');
  if (!nav) return;
  nav.querySelector('.language-link')?.remove();
  const menu = document.createElement('details');
  menu.className = 'language-menu';
  const summary = document.createElement('summary');
  summary.textContent = labels[locale.code];
  menu.append(summary);
  const list = document.createElement('div');
  list.className = 'language-options';
  for (const item of locales) {
    const link = document.createElement('a');
    link.href = `${item.prefix}${route === '/' ? '/' : route}`;
    link.lang = item.code === 'zh' ? 'zh-CN' : item.code;
    link.hreflang = link.lang;
    link.textContent = item.native;
    if (item.code === locale.code) link.setAttribute('aria-current', 'page');
    list.append(link);
  }
  menu.append(list);
  nav.append(menu);
})();
