/* =============================================
   app.js — 共通JS（記事データ読み込み・ヘッダー）
   ============================================= */

/**
 * リポジトリのベースパスを確実に返す
 * GitHub Pages: https://user.github.io/repo/ → "/repo"
 * ローカル:     http://localhost/             → ""
 */
const REPO_BASE = (() => {
  // BLOG_CONFIGがあればそちらを優先
  if (typeof BLOG_CONFIG !== 'undefined' && BLOG_CONFIG.GITHUB_REPO) {
    return '/' + BLOG_CONFIG.GITHUB_REPO;
  }
  // なければURLの第1セグメントをリポジトリ名として使う
  // 例: /seven-starside-blog/about.html → "/seven-starside-blog"
  //     /index.html                     → ""（ローカルやカスタムドメイン）
  const seg = location.pathname.split('/').filter(Boolean)[0];
  // admin配下のページは1つ上のセグメントが repo名
  if (location.pathname.includes('/admin/')) {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length >= 2 ? '/' + parts[0] : '';
  }
  // GitHub Pagesは必ず /reponame/ というパスになる
  // ただしルートデプロイ（user.github.io）は seg がファイル名になるため除外
  if (seg && !seg.includes('.')) {
    return '/' + seg;
  }
  return '';
})();

// 記事データをフェッチ（GitHub Pages上のJSONを読む）
async function fetchArticles() {
  try {
    const res = await fetch(`${REPO_BASE}/data/articles.json?_=${Date.now()}`);
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const json = await res.json();
    return (json.articles || []).filter(a => a.status === 'published');
  } catch(e) {
    console.warn('記事データの取得に失敗:', e);
    return [];
  }
}

// 日付フォーマット
function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ハンバーガーメニュー初期化
function initDrawer(activePage) {
  const pages = [
    { href: '', label: 'トップ', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
    { href: 'about.html', label: '自己紹介', icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
    { href: 'articles.html', label: '記事一覧', icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
    { href: 'privacy.html', label: 'プライバシーポリシー', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  ];

  const base = (typeof REPO_BASE !== 'undefined' ? REPO_BASE : '') + '/';

  document.body.insertAdjacentHTML('beforeend', `
    <div class="drawer-overlay" id="drawerOverlay"></div>
    <nav class="drawer" id="drawer" aria-label="メインメニュー">
      <div class="drawer-header">
        <span class="drawer-title">MENU</span>
        <button class="close-btn" id="drawerClose" aria-label="メニューを閉じる">✕</button>
      </div>
      <div class="drawer-nav">
        ${pages.map(p => `
          <a href="${base}${p.href}" class="${activePage === p.href ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p.icon}</svg>
            ${p.label}
          </a>`).join('')}

      </div>
      <div class="drawer-footer">© 2025 seven-starside-blog</div>
    </nav>
  `);

  const btn     = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('drawerOverlay');
  const drawer  = document.getElementById('drawer');
  const closeBtn= document.getElementById('drawerClose');

  function open()  { drawer.classList.add('open'); overlay.classList.add('open'); btn.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { drawer.classList.remove('open'); overlay.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow = ''; }

  btn.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
