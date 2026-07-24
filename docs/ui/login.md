# ログイン

## 目的

Google認証を開始し、認証済み利用者をダッシュボードへ案内する。

## URL

`/`

## 利用者

未認証利用者。認証済みの場合は`/dashboard`へリダイレクトする。

## レイアウト構成

- ヘッダー: ロゴのみ。サイドバー・フッターは表示しない。
- メインコンテンツ: 中央配置のログインカード、サービス説明、Googleログインボタン。
- レスポンシブ時: 幅を最大400pxに保ち、Mobileでは余白24pxとする。

## コンポーネント一覧

| コンポーネント | 役割 | 状態 |
| --- | --- | --- |
| AuthCard | 認証導線 | idle / signing-in / error |
| GoogleSignInButton | OAuth開始 | loading / disabled |
| ThemeToggle | テーマ切替 | light / dark / system |

## 表示項目

サービス名、短い価値説明、プライバシー注意、認証エラー文。

## 入力項目

入力なし。認証はGoogle OAuthへ委譲する。

## ボタン

| ボタン | 押下時の処理 |
| --- | --- |
| Googleでログイン | Auth.jsのGoogle認証を開始し、成功時はcallbackUrlまたは`/dashboard`へ遷移 |

## ダイアログ

なし。外部OAuth画面へ遷移する。

## エラー表示

認証拒否・設定不備をカード内Alertで表示し、再試行を可能にする。

## ローディング表示

ボタン内Spinner。二重送信を防止する。

## 空データ表示

該当なし。

## API

| 利用API | HTTPメソッド | レスポンス |
| --- | --- | --- |
| `/api/auth/signin/google` | GET | Auth.jsによるOAuthリダイレクト |

## 状態管理

React State: 認証開始中・エラー。Zustand: テーマ。URL Parameter: `callbackUrl`。

## 画面遷移

```mermaid
flowchart TD
  Login[ログイン] --> Google[Google OAuth]
  Google -->|成功| Dashboard[/dashboard]
  Google -->|失敗| Login
```

## レスポンシブ仕様

PC: 中央カード。Tablet: 同構成。Mobile: 全幅カード、固定要素なし。
