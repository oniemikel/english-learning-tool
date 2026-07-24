# UI画面設計一覧

本ディレクトリは、要件定義書・基本設計書を優先して作成したフロントエンド画面設計である。実装前レビューの対象とし、API未実装箇所はMockで表示・遷移できる設計とする。

## 共通方針

- PCはHeader + Sidebar + Main、MobileはHeader + Main + Bottom Navigationを採用する。
- Apple / Notion / Linear / Ankiを参照した、余白・控えめな境界・カード中心のUIとする。
- 角丸は12px、操作要素は8px、シャドウは必要な浮動要素にのみ使用する。
- Light / Darkテーマ、キーボード操作、十分なコントラスト、フォーカスリングを必須とする。
- 保護画面は未認証時に`/?callbackUrl=...`へ遷移する。

## ルート補完

基本設計書の`/decks/[id]`、`/words/[id]`を維持し、閲覧と編集を分離する必要がある画面では`?mode=edit`を使用する。作成画面は`/decks/new`、`/words/new`とする。

## 設計書

- login / dashboard
- decks / deck-detail / deck-create / deck-edit / csv-import
- words / word-detail / word-create / word-edit
- public-decks / public-deck-detail
- study-start / study-en-ja / study-ja-en / study-listening / study-pronunciation / study-result
- history / statistics / settings
