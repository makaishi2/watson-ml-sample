# Watson Machine Learning サンプルアプリ

## アプリケーションの目的
[Watson Machine Learing チュートリアルを試してみる](https://qiita.com/makaishi2/items/dd9eafcbe824ef9482fd)の記事で作ったWatson Machine Learningによる機械学習モデルのWebサービスを呼び出すサンプルアプリケーションです。

![](readme_images/screen-image.png)  

## 前提
Watson DSX, Watson MLの導入と、機械学習モデルの作成まで済んでいることを前提とします。

## 事前準備
Watson MLのインスタンス名を``machine-learning-1``に変更して下さい。インスタンス名の変更は、サービスの管理画面から行うことが可能です。
また、Watson ML上の機械学習モデルWebサービスのエンドポイントURLを事前に調べて、テキストエディタなどにコピペしておきます。
(注意)エンドポイントURLは一番最後に"/online"がつくことに注意して下さい。管理画面の表記には含まれていないです。

## 前提ソフトの導入
次の前提ソフトが導入されていることが前提です。

[gitコマンドラインツール][git]  
[Cloud Foundryコマンドラインツール][cloud_foundry]  
  
注意: Cloud Foundaryのバージョンは最新として下さい。 

## ソースのダウンロード
Githubからアプリケーションのソースをダウンロードします。  
カレントディレクトリのサブディレクトリにソースはダウンロードされるので、あらかじめ適当なサブディレクトリを作り、そこにcdしてから下記のコマンドを実行します。  
ダウンロード後、できたサブディレクトリにcdします。
 

```sh
$ cd (適当なサブディレクトリ)
$ git clone https://github.com/makaishi2/watson-ml-sample.git
$ cd watson-ml-sample
```

## CFコマンドでログイン
CFコマンドでbluemix環境にログインします。ログイン名、パスワードはBluemixアカウント登録で登録したものを利用します。  
ログインに成功すると、次のような画面となります。  

```
$ cf api https://api.ng.bluemix.net
$ cf login
```

![](readme_images/cf-login.png)  

## アプリケーションのデプロイ

次のコマンドを実行します。
\<service_name\>はなんでもいいのですが、インターネット上のURLの一部となるので、ユニークな名前を指定します。  
(例) ml-sample-aka1

```
$ cf push <service_name>
```

## 環境変数の設定
次のコマンドで機械学習モデルのエンドポイントURLを設定します。

```
$ cf set-env <service_name> WML_ENDPOINT_URL https://ibm-watson-ml.mybluemix.net/v3/..
$ cf restage <service_name>
```

## アプリケーションのURLと起動

デプロイには数分かかります。デプロイが正常に完了したらアプリケーションを起動できます。  
次のURLをブラウザから指定して下さい。

```
https://<service_name>.mybluemix.net/
```

## アプリケーションを修正する場合

導入手順中、git cloneコマンドでダウンロードしたローカルリポジトリにアプリケーションのソースコードが入っています。アプリケーションを修正したい場合は、ローカルのソースを修正し、再度 "cf push \<service_name\>"コマンドを実行すると、Bluemix上のアプリケーションが更新されます。  

## ローカルで起動する場合

アプリケーションを修正する時は、ローカルでもテストできる方が便利です。そのための手順は以下の通りです。

* Node.jsの導入  
ローカルにNode.jsを導入する必要があります。
[Node.jsダウンロード][node_js]からダウンロードして下さい。
* 認証情報の確認  
BluemixダッシュボードからDiscoveryサービスの管理画面を開き、接続用のurl, username, passwordを調べてテキストエディタなどにコピーします。
* local.envファイルの設定
次のコマンドでlocal.envファイルの雛形からlocal.envをコピーし、エディタで調べたusername, passwordを設定します。

```sh
$ cp local.env.sample local.env
```

```sh
WML_SERVICE_CREDENTIALS_URL=xxxxx
WML_SERVICE_CREDENTIALS_USERNAME=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
WML_SERVICE_CREDENTIALS_PASSWORD=xxxxxxxxxxxx
```

* Node.jsアプリケーションの導入、実行  
以下のコマンドでアプリケーションの導入、実行を行います。

```sh
$ npm install
$ npm start
```

[cloud_foundry]: https://github.com/cloudfoundry/cli#downloads
[git]: https://git-scm.com/downloads
[sign_up]: https://bluemix.net/registration
[node_js]: https://nodejs.org/ja/download/
