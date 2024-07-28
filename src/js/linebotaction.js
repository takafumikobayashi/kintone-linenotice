export function lineBotAction(channelAccessToken, lineMessage, processedField, record, titleField, addStamp, actionType) {
  
  let appId = kintone.app.getId();
  if (actionType == 'mobile') {
    appId = kintone.mobile.app.getId();
  }

  // 初期設定
  const url = 'https://api.line.me/v2/bot/message/broadcast';
  const headers = {
    'Authorization': ' Bearer ' + '{' + channelAccessToken + '}',
    'Content-Type' : 'application/json'
  };

  //テキストメッセージの設定
  let sendMessage = lineMessage
  if (titleField !== 'none') {
    sendMessage = record[titleField].value + '\n\n' + lineMessage
  }

  let messagePayload = {
      messages: [
        {
          type: 'text',
          text: sendMessage
        }
      ]
  };

  // スタンプの追加（設定選択時）
  if (addStamp == "1") {
    // ランダムスタンプ配列からランダムに選択
    const targetStamps = ['446/1988', '446/1989', '789/10856', '789/10857', '6136/10551394', '6325/10979914', '6359/11069853', '6359/11069868'];
    const randomIndex = Math.floor(Math.random() * targetStamps.length);
    const randomStamp = targetStamps[randomIndex]
    const [packageId, stickerId] = randomStamp.split('/');
    // メッセージオブジェクトに追加
    const addMessage = {
      type: "sticker",
      packageId: packageId,
      stickerId: stickerId
    }
    messagePayload.messages.push(addMessage);
  }

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