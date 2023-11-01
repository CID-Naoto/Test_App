enchant();

window.onload = function() {

	//縦スクロールor横スクロールフラグ
	var flag = true;	//true=縦スクロール、false=横スクロール

	//画面サイズを指定してインスタンス作成
	var game = new Game(320, 320);
	//キャラクター画像読み込み
	//game.preload("chara1.gif");		//１枚だけ！
	game.preload("space3.gif","bg.jpg");	//複数！（キャラチップ，背景）

	// ラベルを作成
	var myLabel = new Label("［作った人：おざわ＠高崎校］");
	myLabel.font = "8px cursive";
	myLabel.x = 210;	// X座標
	myLabel.y = 305;	// Y座標

	//↓起動時に実行される処理↓
	game.onload = function() {

		// 背景画像を設定
		var bg1 = new Sprite(320, 320);
		bg1.image = game.assets["bg.jpg"];
		game.rootScene.addChild(bg1);

		//***** 主人公 *****
		var bear = new Sprite(32, 32);		//スプライトに幅と高さを指定
		bear.image = game.assets["space3.gif"];	//スプライトに画像を指定
		bear.x = 144;				//初期X座標
		bear.y = 144;				//初期Y座標
		bear.frame = 0;				//主人公の画像種類(※0-20で設定！一部使用不可)
		var fin = false;			//ゲームオーバーフラグ

		//***** ルートシーンのイベントを監視 *****
		game.rootScene.addEventListener("touchmove", function(e) {
			if(fin) return;
			bear.x = Math.min(Math.max(e.x, 1), 288);	//主人公のX座標
			bear.y = Math.min(Math.max(e.y, 1), 288);	//主人公のY座標
		});

		var tl = new TimeLabel;	//残り時間表示用ラベル
		var speed = 3;		//敵の加速値はどうしよう？
		var span = 10;		//敵の出現率はどうしよう？
		var frame = 0;

		//***** 毎フレーム開始時に呼び出される処理を登録 *****
		game.rootScene.addEventListener("enterframe", function() {

			if(frame % span === 0) {
				var enemy = new Sprite(32, 32);			//スプライトに幅と高さを指定
				enemy.image = game.assets["space3.gif"];	//スプライトに画像を指定
				enemy.frame = 8;				//敵の画像種類(※0-20で設定！一部使用不可)
				enemy.rotation = 0;				//敵の回転処理初期値

				//縦スクロールor横スクロール
				if(flag){
					//縦スクロール時の初期位置！
					enemy.x = (320 - 32) * Math.random();		//敵のX座標をランダムに！
					enemy.y = -32;					//敵のY座標はどうしよう？
				}else{
					//横スクロール時の初期位置！
					enemy.x = 50;					//敵のX座標をランダムに！
					enemy.y = (320 - 32) * Math.random();		//敵のY座標はどうしよう？
				
				}


				enemy.addEventListener("enterframe", function() {
					//縦スクロールor横スクロール
					if(flag){
						enemy.y += speed;	//y座標を加算（上から下に移動））
					}else{
						enemy.x -= speed;	//x座標を減算（右から左に移動））
					}
					
					//当たり判定！
					if(enemy.within(bear, 16)) {		//数値は２キャラの中心間の距離♪
						game.end(tl.time, tl.time + "秒避けた！！");
						fin = true;			//ゲームオーバー
					}

					//enemy.rotation += 10;			//敵の回転角度加算！（※スマホ非対応！残念！！）

					//画面外の敵は用済みなので削除…
					if(enemy.y > 320)
						enemy.scene.removeChild(enemy);	//画面の一番下まで行ったら消す！
				});

				//スプライトをルートシーンに追加（登録）
				game.rootScene.addChild(enemy);	//敵

			}

			//時間経過と共に敵を加速！
			if(frame % 90 === 89) {
				speed *= 1.2;			//加速率はどうしよう？
				span = Math.max(span - 1, 1);	//出現率の調整
			}
			frame += 1;
		});

		//スプライトをルートシーンに追加（登録）
		game.rootScene.addChild(bear);		//主人公
		game.rootScene.addChild(tl);		//残り時間
		game.rootScene.addChild(myLabel);	//作者

	}
	//↑起動時に実行される処理↑

	//ゲーム起動！！
	game.start();
}
