import { lineBotAction } from "./linebotaction";

(function (PLUGIN_ID) {
  kintone.events.on(['mobile.app.record.detail.show'], function(event) {
    const record = event.record;
    let headerSpace = kintone.mobile.app.getHeaderSpaceElement() // ヘッダースペースを取得（モバイル）

    // 既に追加されたボタンがあるかチェック
    let existingButton = document.getElementById('lineBotActionButton');
    if (existingButton) {
        return event; // 既にボタンがある場合は何もしない
    }

    //appIdの取得
    let appId = kintone.mobile.app.getId();

    // configで設定したフィールドコードを取得
    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    const channelAccessToken = config.channelAccessToken
    const triggerType = config.triggerType
    const triggerField = config.triggerField
    const lineMessage = config.lineMessage
    const processedField = config.processedField
    const titleField = config.titleField
    const addStamp = config.addStamp

    // 通知済であれば何もしない
    if (record[processedField].value == "はい"){
      return event;
    }

    // トリガータイプを判定
    switch (triggerType) {
      case "0":   // ボタン起動

        // 新しいボタンを作成
        let button = document.createElement('button');
        button.id = 'lineBotActionButton';
        button.innerText = 'LINE通知実行';
        button.className = 'kintoneplugin-button-normal'; // Kintoneのデフォルトボタンスタイル
        button.style.marginLeft = '20px'; // 右に隙間を作る
        button.style.marginRight = '20px'; // 右に隙間を作る

        // ヘッダースペースにボタンを追加
        headerSpace.appendChild(button);

        // ボタンのクリックイベントを設定
        button.onclick = function() {
          swal({
              title: '以下のメッセージでLINE通知をします。よろしいですか？',
              text:  lineMessage,
              icon: 'info',
              buttons: {
                  cancel: "いいえ",
                  catch: {
                      text: "はい",
                      value: "execute",
                  }
              },
          })
          .then((value) => {
              switch (value) {
                  case "execute":
                      lineBotAction(channelAccessToken, lineMessage, processedField, record, titleField, addStamp, appId);
                      break;
                  default:
                      console.log('LINE通知がキャンセルされました。');
              }
          });
        };
        
        break;
    
      case "1":   // 時間起動
        
        // 対象となる日付項目を取得
        let targetDateTime = record[triggerField].value
        let targetDate = new Date(targetDateTime);
        const today = new Date();

        // 現在日時との比較、経過の場合は通知処理を開始
        if (today > targetDate) {
          swal({
            title: '以下のメッセージでLINE通知をします。よろしいですか？',
            text:  lineMessage,
            icon: 'info',
            buttons: {
                cancel: "いいえ",
                catch: {
                    text: "はい",
                    value: "execute",
                }
            },
        })
        .then((value) => {
            switch (value) {
                case "execute":
                    lineBotAction(channelAccessToken, lineMessage, processedField, record, titleField, addStamp, appId);
                    break;
                default:
                    console.log('LINE通知がキャンセルされました。');
            }
        });
        }

        break;
    }

    return event;
  });
})(kintone.$PLUGIN_ID);
