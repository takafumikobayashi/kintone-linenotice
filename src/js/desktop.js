(function (PLUGIN_ID) {
  kintone.events.on(['app.record.detail.show'], function(event) {
    const record = event.record;
    let headerSpace = kintone.app.record.getHeaderMenuSpaceElement(); // ヘッダースペースを取得

    // 既に追加されたボタンがあるかチェック
    let existingButton = document.getElementById('lineBotActionButton');
    if (existingButton) {
        return event; // 既にボタンがある場合は何もしない
    }

    // configで設定したフィールドコードを取得
    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    const channelAccessToken = config.channelAccessToken
    const triggerType = config.triggerType
    const triggerField = config.triggerField
    const lineMessage = config.lineMessage
    const processedField = config.processedField

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
                      lineBotAction(channelAccessToken, lineMessage, processedField, record);
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
                    lineBotAction(channelAccessToken, lineMessage, processedField, record);
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

  function lineBotAction(channelAccessToken, lineMessage, processedField, record

  ) {
    const appId = kintone.app.getId();
    const url = 'https://api.line.me/v2/bot/message/broadcast';
    const headers = {
      'Authorization': ' Bearer ' + '{' + channelAccessToken + '}',
      'Content-Type' : 'application/json'
    };
    const messagePayload = {
        messages: [
            {
                type: 'text',
                text: lineMessage
            }
        ]
    };

    kintone.proxy(url, 'POST', headers, messagePayload).then(function(args) {
      if (args[1] === 200) {

          //通知済フラグの更新
          let updateParams = {
            app: appId,
            id: record['$id'].value,
            record: {}
          };
          updateParams.record[processedField] = {
              value: ["はい"]
          };

          // レコードの更新
          kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', updateParams, function(updateArgs) {
            console.log('Record updated: ', updateArgs);
            swal({
                title: '成功しました。',
                text: 'LINEメッセージの送信と通知済フラグの更新が完了しました。',
                icon: 'success',
                button: 'OK'
            }).then(() => {
              // ダイアログクローズ後の処理
              location.reload(true);
            })
          }, function(updateError) {
              console.error('Update error: ', updateError);
              swal({
                  title: 'エラーが発生しました。',
                  text: 'LINEメッセージの送信は成功しましたが、通知済フラグの更新に失敗しました。',
                  icon: 'error',
                  button: 'OK'
              });
          });
          return;

      }else{
        console.error('LINESend error: ', args[0]);
        swal({
          title: 'エラーが発生しました。',
          text: 'LINEメッセージの送信に失敗しました。',
          icon: 'error',
          button: 'OK'
        });
        return;
      }
    }, function(error) {
      console.error('LINESend error: ', error);
      swal({
        title: 'エラーが発生しました。',
        text: 'LINEメッセージの送信に失敗しました。',
        icon: 'error',
        button: 'OK'
      });
        return;
    });
  }
})(kintone.$PLUGIN_ID);


