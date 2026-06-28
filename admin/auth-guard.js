/**
 * auth-guard.js
 * すべての管理ページの <head> に以下を追加してください:
 *   <script src="config.js"></script>
 *   <script src="auth-guard.js"></script>
 *
 * セッションが無効 or 期限切れなら自動でログイン画面に飛ばします。
 */
(function() {
  function getSession() {
    try {
      const raw = sessionStorage.getItem('admin_session');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function isValid(session) {
    return session && session.email && session.expiresAt && Date.now() < session.expiresAt;
  }

  const session = getSession();
  if (!isValid(session)) {
    const expired = session && !isValid(session);
    window.location.href = 'index.html' + (expired ? '?error=expired' : '');
  }

  // グローバルに公開（各ページから利用可）
  window.ADMIN_SESSION = session;

  // ログアウト関数
  window.adminLogout = function() {
    sessionStorage.removeItem('admin_session');
    window.location.href = 'index.html';
  };
})();
