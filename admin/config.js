// ========================================================
// ★ ここだけ書き換えれば動きます
// ========================================================

const BLOG_CONFIG = {
  // Google OAuthクライアントID
  // Google Cloud Console → 認証情報 → OAuth 2.0クライアントID
  GOOGLE_CLIENT_ID: '397689264617-36pe13a2tifj1re997q0i1gtvaqrfd3h.apps.googleusercontent.com',

  // GitHubユーザー名（例: tanaka）
  GITHUB_USERNAME: 'seven-starside-blog',

  // GitHubリポジトリ名（例: my-blog）
  GITHUB_REPO: 'seven-starside-blog',

  // 許可するGoogleアカウントのメールアドレス（自分のアカウントだけ）
  ALLOWED_EMAIL: 'seven.starside.admin@gmail.com',
};

// ベースURL（自動計算 - 変更不要）
BLOG_CONFIG.BASE_URL = `https://${BLOG_CONFIG.GITHUB_USERNAME}.github.io/${BLOG_CONFIG.GITHUB_REPO}`;
BLOG_CONFIG.REDIRECT_URI = `${BLOG_CONFIG.BASE_URL}/admin/callback.html`;
