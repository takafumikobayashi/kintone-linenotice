(function (PLUGIN_ID) {
  const formEl = document.querySelector('.js-submit-settings');
  const cancelButtonEl = document.querySelector('.js-cancel-button');
  const channelAccessTokenEl = document.querySelector('.kintoneplugin-input-text');
  const lineMessageEl = document.querySelector('.kintoneplugin-input-text-resizable');
  const dateTimeRowEl = document.querySelector('.js-datetime-row');
  if (!(formEl && cancelButtonEl && channelAccessTokenEl && lineMessageEl && dateTimeRowEl)) {
    throw new Error('Required elements do not exist.');
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (config.channelAccessToken) {
    channelAccessTokenEl.value = config.channelAccessToken;
  }
  if (config.lineMessage) {
    lineMessageEl.value = config.lineMessage
  }

  let appId = kintone.app.getId();

  // トリガーとなるフィールドの指定
  let selectMenu = document.createElement('select');
  selectMenu.id = 'field-selection';
  selectMenu.className = 'field-selection';

  // 通知済であることを判断するフィールドの指定
  let selectMenuProcessed = document.createElement('select');
  selectMenuProcessed.id = 'field-selection';
  selectMenuProcessed.className = 'field-selection';

  // タイトルとなるフィールドの指定
  let selectMenuTitle = document.createElement('select');
  selectMenuProcessed.id = 'field-selection';
  selectMenuProcessed.className = 'field-selection';
  // 「なし」の指定
  let option_0 = document.createElement('option'); // 新しい<option>エレメントを作成
  option_0.value = "none";  // <option>のvalueを設定
  option_0.textContent = "（指定しない）";  // <option>のテキストを設定
  selectMenuTitle.appendChild(option_0);  // <select>メニューに<option>を追加
  
  //日時項目の取得
  kintone.api('/k/v1/form', 'GET', {app: appId}, function(resp) {

    for (let key in resp.properties) {
      let field = resp.properties[key];

      //field-selectionへの格納
      if (field.type === 'DATETIME') {
        let option = document.createElement('option'); // 新しい<option>エレメントを作成
        option.value = field.code;  // <option>のvalueを設定
        option.textContent = field.label;  // <option>のテキストを設定
        if (field.code === config.triggerField) {
          option.selected = true;  // <option>を選択済みにする
        }
        selectMenu.appendChild(option);  // <select>メニューに<option>を追加
      }

      if (field.type === 'CHECK_BOX') {
        let option = document.createElement('option'); // 新しい<option>エレメントを作成
        option.value = field.code;  // <option>のvalueを設定
        option.textContent = field.label;  // <option>のテキストを設定
        if (field.code === config.processedField) {
          option.selected = true;  // <option>を選択済みにする
        }
        selectMenuProcessed.appendChild(option);  // <select>メニューに<option>を追加
      }

      const targetTypes = ['SINGLE_LINE_TEXT', 'MULTI_LINE_TEXT'];
      if (targetTypes.includes(field.type)) {
        let option = document.createElement('option'); // 新しい<option>エレメントを作成
        option.value = field.code;  // <option>のvalueを設定
        option.textContent = field.label;  // <option>のテキストを設定
        if (field.code === config.titleField) {
          option.selected = true;  // <option>を選択済みにする
        }
        selectMenuTitle.appendChild(option);  // <select>メニューに<option>を追加
      }

    }

    // <select>メニューをconfig画面の適切な場所に追加
    formEl.querySelector('.field-selection-area').appendChild(selectMenu);
    formEl.querySelector('.field-selection-area-processed').appendChild(selectMenuProcessed);
    formEl.querySelector('.field-selection-area-title').appendChild(selectMenuTitle);

  }, function(error) {
      console.error('フォーム情報の取得に失敗しました。:', error);
  });

  // 初期表示の設定
  if (config.triggerType == "0"){
    document.querySelector('.radio-0').checked = true
  } else if (config.triggerType == "1") {
    document.querySelector('.radio-1').checked = true
  }

  if (document.querySelector('.radio-1').checked) {
    dateTimeRowEl.style.display = 'block';
  } else {
    dateTimeRowEl.style.display = 'none';
  }

  if (config.addStamp == "1"){
    document.querySelector('.checkbox-0').checked = true
  } else {
    document.querySelector('.checkbox-0').checked = false
  }

  // field-selection_subtableのselect要素が変更されたときの処理
  formEl.addEventListener('change', (e) => {
    // イベントが発生した要素が<select>でない場合は処理を終了
    if (e.target.matches("#radio-0")) {
      dateTimeRowEl.style.display = 'none';
    }

    if (e.target.matches("#radio-1")) {
      dateTimeRowEl.style.display = 'block';
    }
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    let channelAccessToken = formEl.querySelector('.kintoneplugin-input-text').value;
    let radio1 = formEl.querySelector('.radio-1');
    let triggerType = "0"
    let triggerField = formEl.querySelector('.field-selection-area select').value;
    let lineMessage = formEl.querySelector('.kintoneplugin-input-text-resizable').value;
    let processedField = formEl.querySelector('.field-selection-area-processed select').value;
    if (radio1.checked) {
      triggerType = "1"
      triggerField = formEl.querySelector('.field-selection-area select').value;
    } else {
      triggerType = "0"
      triggerField = "none"
    }
    let titleField = formEl.querySelector('.field-selection-area-title select').value;
    let check0 = formEl.querySelector('.checkbox-0');
    let addStamp = "0"
    if (check0.checked) {
      addStamp = "1"
    }

    //チェック処理
    let lineChannelAccesstokenLength = 172
    if (channelAccessToken.length < lineChannelAccesstokenLength) {
      swal({
        title: 'エラー',
        text: 'チャンネルアクセストークンは半角英数字172文字以上になります。',
        icon: 'error',
        button: 'OK'
      })
      return;
    }

    if ((lineMessage === undefined) || (lineMessage === "")) {
      swal({
        title: 'エラー',
        text: '通知メッセージは必ず指定をしてください。',
        icon: 'error',
        button: 'OK'
      })
      return;
    }

    kintone.plugin.app.setConfig({ channelAccessToken: channelAccessToken, triggerType: triggerType, triggerField: triggerField, lineMessage: lineMessage, processedField: processedField, titleField: titleField, addStamp: addStamp }, () => {      
      swal({
        title: '更新しました。',
        text: '変更した設定を反映するには、「アプリの設定」画面に戻り 「アプリの更新」ボタンをクリックします。',
        icon: 'success',
        button: 'OK'
      }).then(() => {
        // ダイアログクローズ後の処理
        window.location.href = '../../flow?app=' + kintone.app.getId();
      });
    });
  });

  cancelButtonEl.addEventListener('click', () => {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });

  document.getElementById('toggleVisibilityIcon').addEventListener('click', function() {
    const input = document.getElementById('channelAccessToken');
    if (input.type === 'password') {
      input.type = 'text';
      this.textContent = 'visibility';
    } else {
      input.type = 'password';
      this.textContent = 'visibility_off';
    }
  });

})(kintone.$PLUGIN_ID);
