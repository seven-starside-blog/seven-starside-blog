// ========================================================
// ★ ここだけ書き換えれば動きます
// ========================================================

const BLOG_CONFIG = {
  // Google OAuthクライアントID
  // Google Cloud Console → 認証情報 → OAuth 2.0クライアントID
  GOOGLE_CLIENT_ID: '397689264617-36pe13a2tifj1re997q0i1gtvaqrfd3h.apps.googleusercontent.com',

  // GitHubユーザー名
  GITHUB_USERNAME: 'seven-starside-blog',

  // GitHubリポジトリ名
  GITHUB_REPO: 'seven-starside-blog',

  // ★★ 必須：ここを自分のGmailに変えないとログイン制限が効きません ★★
  // ここが 'your-email@gmail.com' のままだと誰でもログインできてしまいます
  ALLOWED_EMAIL: 'seven.starside.admin@gmail.com',
};

  // ★★ Cloudflare WorkerのURL（デプロイ後に書き換え）
  // 例: 'https://blog-api.yourname.workers.dev'
  WORKER_URL: 'https://sss-blog.seven-starside-admin.workers.dev/',
};
 
// ベースURL（自動計算 - 変更不要）
BLOG_CONFIG.BASE_URL    = `https://${BLOG_CONFIG.GITHUB_USERNAME}.github.io/${BLOG_CONFIG.GITHUB_REPO}`;
BLOG_CONFIG.REDIRECT_URI = `${BLOG_CONFIG.BASE_URL}/admin/callback.html`;
