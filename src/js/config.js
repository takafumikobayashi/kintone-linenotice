(function (PLUGIN_ID) {
  const formEl = document.querySelector('.js-submit-settings');
  const cancelButtonEl = document.querySelector('.js-cancel-button');
  const dateTimeRowEl = document.querySelector('.js-datetime-row');
  if (!(formEl && cancelButtonEl && dateTimeRowEl)) {
    throw new Error('Required elements do not exist.');
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (config.message) {
    messageEl.value = config.message;
  }

  let appId = kintone.app.getId();
  let selectMenu = document.createElement('select');
  selectMenu.id = 'field-selection';
  selectMenu.className = 'field-selection';
  
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
    }

    // <select>メニューをconfig画面の適切な場所に追加
    formEl.querySelector('.field-selection-area').appendChild(selectMenu);

  }, function(error) {
      console.error('フォーム情報の取得に失敗しました。:', error);
  });

  // 初期表示の設定
  if (document.querySelector('.radio-1').checked) {
    dateTimeRowEl.style.display = 'block';
  } else {
    dateTimeRowEl.style.display = 'none';
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
    let radio1 = formEl.querySelector('.radio-1').value;
    let triggrType = "0"
    let triggerField = formEl.querySelector('.field-selection-area select').value;
    if (radio1.checked) {
      triggrType = "1"
      triggerField = formEl.querySelector('.field-selection-area').value;
    } else {
      triggerField = "none"
    }
    
    kintone.plugin.app.setConfig({ channelAccessToken: channelAccessToken, triggrType: triggrType, triggerField: triggerField }, () => {      
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
})(kintone.$PLUGIN_ID);
