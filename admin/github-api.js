/**
 * admin/github-api.js
 * Cloudflare Worker経由でGitHub Contents APIを叩く共通ライブラリ
 * editor.html / dashboard.html から <script src="github-api.js"> で読み込む
 */

const GitHubAPI = (() => {
  function workerUrl() {
    if (typeof BLOG_CONFIG === 'undefined' || !BLOG_CONFIG.WORKER_URL ||
        BLOG_CONFIG.WORKER_URL.includes('YOUR_WORKER')) {
      throw new Error('config.js の WORKER_URL を設定してください');
    }
    return BLOG_CONFIG.WORKER_URL.replace(/\/$/, '');
  }

  /**
   * ファイルを取得する
   * @param {string} path  例: 'data/articles.json'
   * @returns {{ content: any, sha: string }}
   */
  async function getFile(path) {
    const res = await fetch(`${workerUrl()}/api/file?path=${encodeURIComponent(path)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `GET失敗 (${res.status})`);
    return data; // { content, sha }
  }

  /**
   * ファイルを保存する（新規・更新どちらも）
   * @param {string} path     例: 'data/articles.json'
   * @param {any}    content  保存するデータ（オブジェクトはJSON化される）
   * @param {string} [sha]    既存ファイルのSHA（更新時。省略時はWorker側で自動取得）
   * @param {string} [message] コミットメッセージ
   * @returns {{ ok: boolean, sha: string }}
   */
  async function putFile(path, content, sha = null, message = null) {
    const body = { path, content, sha, message };
    const res = await fetch(`${workerUrl()}/api/file`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `PUT失敗 (${res.status})`);
    return data; // { ok, sha }
  }

  /**
   * articles.json を取得する
   * @returns {{ articles: Array, sha: string }}
   */
  async function getArticles() {
    const { content, sha } = await getFile('data/articles.json');
    return { articles: content.articles || [], sha };
  }

  /**
   * articles.json を保存する
   * @param {Array}  articles 全記事配列
   * @param {string} [sha]    現在のSHA（省略可）
   */
  async function saveArticles(articles, sha = null) {
    const message = `記事を更新 (${new Date().toLocaleString('ja-JP')})`;
    return await putFile('data/articles.json', { articles }, sha, message);
  }

  /**
   * profile.json を取得する
   * @returns {{ profile: object, sha: string }}
   */
  async function getProfile() {
    const { content, sha } = await getFile('data/profile.json');
    return { profile: content, sha };
  }

  /**
   * profile.json を保存する
   * @param {object} profile
   * @param {string} [sha]
   */
  async function saveProfile(profile, sha = null) {
    const message = `プロフィールを更新 (${new Date().toLocaleString('ja-JP')})`;
    return await putFile('data/profile.json', profile, sha, message);
  }

  return { getFile, putFile, getArticles, saveArticles, getProfile, saveProfile };
})();
