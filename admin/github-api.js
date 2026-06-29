/**
 * admin/github-api.js
 * Cloudflare Worker経由でGitHub Contents APIを叩く共通ライブラリ
 */

const GitHubAPI = (() => {

  function workerUrl() {
    if (typeof BLOG_CONFIG === 'undefined' || !BLOG_CONFIG.WORKER_URL ||
        BLOG_CONFIG.WORKER_URL.includes('YOUR_WORKER')) {
      throw new Error('config.js の WORKER_URL を設定してください');
    }
    return BLOG_CONFIG.WORKER_URL.replace(/\/$/, '');
  }

  // ─── GET ──────────────────────────────────────────────────────────
  async function getFile(path) {
    const url = `${workerUrl()}/api/file?path=${encodeURIComponent(path)}`;
    // GETにContent-Typeを付けるとプリフライトが発生して失敗する環境があるため除外
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      let msg = `GET失敗 (${res.status})`;
      try { const d = await res.json(); msg = d.error || msg; } catch {}
      throw new Error(msg);
    }
    const data = await res.json();
    return data; // { content, sha }
  }

  // ─── PUT ──────────────────────────────────────────────────────────
  async function putFile(path, content, sha = null, message = null) {
    const body = { path, content, sha, message };
    const res = await fetch(`${workerUrl()}/api/file`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let msg = `PUT失敗 (${res.status})`;
      try { const d = await res.json(); msg = d.error || msg; } catch {}
      throw new Error(msg);
    }
    const data = await res.json();
    return data; // { ok, sha }
  }

  // ─── 記事 ─────────────────────────────────────────────────────────
  async function getArticles() {
    const { content, sha } = await getFile('data/articles.json');
    return { articles: (content && content.articles) ? content.articles : [], sha };
  }

  async function saveArticles(articles, sha = null) {
    const message = `記事を更新 (${new Date().toLocaleString('ja-JP')})`;
    return await putFile('data/articles.json', { articles }, sha, message);
  }

  // ─── プロフィール ──────────────────────────────────────────────────
  async function getProfile() {
    const { content, sha } = await getFile('data/profile.json');
    return { profile: content || {}, sha };
  }

  async function saveProfile(profile, sha = null) {
    const message = `プロフィールを更新 (${new Date().toLocaleString('ja-JP')})`;
    return await putFile('data/profile.json', profile, sha, message);
  }

  // ─── OGP取得 ──────────────────────────────────────────────────────
  async function fetchOgp(targetUrl) {
    const url = `${workerUrl()}/api/ogp?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      let msg = `OGP取得失敗 (${res.status})`;
      try { const d = await res.json(); msg = d.error || msg; } catch {}
      throw new Error(msg);
    }
    return await res.json(); // { url, title, desc, image, site }
  }

  return { getFile, putFile, getArticles, saveArticles, getProfile, saveProfile, fetchOgp };
})();
