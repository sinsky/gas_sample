# GASのWebアプリサンプル

### Webアプリのデプロイ前に
1. code.gsの2行目のidを自分のスプレッドシートのIDに置き換えてください
1. Webアプリのデプロイ後にはまだシートが空白のため、手動でAppScript上で`qiitaCall`を実行してください

   →スプレッドシートに書き込まれることを確認してください

### Webアプリデプロイ後
1. 生成されたアプリケーションのURLにアクセスしてください。
   Reactで作ってるのでproductページとdevelopページに分けています。
   URLの`~~~/exec`の後に`?dev=true`をつけるとdevelop.htmlが呼び出されます
1. 読み込みボタンでスプレッドシートからデータを取ってきます

   (読み込み中とかは作る気力がなかった)
1. 整形で印刷用のスタイルを適用させようと思ったけど、

   GASでは無理だったので放置
