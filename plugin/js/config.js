/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/config.js":
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
/***/ (() => {

eval("(function (PLUGIN_ID) {\n  const formEl = document.querySelector('.js-submit-settings');\n  const cancelButtonEl = document.querySelector('.js-cancel-button');\n  const dateTimeRowEl = document.querySelector('.js-datetime-row');\n  if (!(formEl && cancelButtonEl && dateTimeRowEl)) {\n    throw new Error('Required elements do not exist.');\n  }\n\n  const config = kintone.plugin.app.getConfig(PLUGIN_ID);\n  if (config.message) {\n    messageEl.value = config.message;\n  }\n\n  let appId = kintone.app.getId();\n  let selectMenu = document.createElement('select');\n  selectMenu.id = 'field-selection';\n  selectMenu.className = 'field-selection';\n  \n  //日時項目の取得\n  kintone.api('/k/v1/form', 'GET', {app: appId}, function(resp) {\n\n    for (let key in resp.properties) {\n      let field = resp.properties[key];\n\n      //field-selectionへの格納\n      if (field.type === 'DATETIME') {\n        let option = document.createElement('option'); // 新しい<option>エレメントを作成\n        option.value = field.code;  // <option>のvalueを設定\n        option.textContent = field.label;  // <option>のテキストを設定\n        if (field.code === config.triggerField) {\n          option.selected = true;  // <option>を選択済みにする\n        }\n        selectMenu.appendChild(option);  // <select>メニューに<option>を追加\n      }\n    }\n\n    // <select>メニューをconfig画面の適切な場所に追加\n    formEl.querySelector('.field-selection-area').appendChild(selectMenu);\n\n  }, function(error) {\n      console.error('フォーム情報の取得に失敗しました。:', error);\n  });\n\n  // 初期表示の設定\n  if (document.querySelector('.radio-1').checked) {\n    dateTimeRowEl.style.display = 'block';\n  } else {\n    dateTimeRowEl.style.display = 'none';\n  }\n\n  // field-selection_subtableのselect要素が変更されたときの処理\n  formEl.addEventListener('change', (e) => {\n    // イベントが発生した要素が<select>でない場合は処理を終了\n    if (e.target.matches(\"#radio-0\")) {\n      dateTimeRowEl.style.display = 'none';\n    }\n\n    if (e.target.matches(\"#radio-1\")) {\n      dateTimeRowEl.style.display = 'block';\n    }\n  });\n\n  formEl.addEventListener('submit', (e) => {\n    e.preventDefault();\n    let channelAccessToken = formEl.querySelector('.kintoneplugin-input-text').value;\n    let radio1 = formEl.querySelector('.radio-1').value;\n    let triggrType = \"0\"\n    let triggerField = formEl.querySelector('.field-selection-area select').value;\n    if (radio1.checked) {\n      triggrType = \"1\"\n      triggerField = formEl.querySelector('.field-selection-area').value;\n    } else {\n      triggerField = \"none\"\n    }\n    \n    kintone.plugin.app.setConfig({ channelAccessToken: channelAccessToken, triggrType: triggrType, triggerField: triggerField }, () => {      \n      swal({\n        title: '更新しました。',\n        text: '変更した設定を反映するには、「アプリの設定」画面に戻り 「アプリの更新」ボタンをクリックします。',\n        icon: 'success',\n        button: 'OK'\n      }).then(() => {\n        // ダイアログクローズ後の処理\n        window.location.href = '../../flow?app=' + kintone.app.getId();\n      });\n    });\n  });\n\n  cancelButtonEl.addEventListener('click', () => {\n    window.location.href = '../../' + kintone.app.getId() + '/plugin/';\n  });\n})(kintone.$PLUGIN_ID);\n\n\n//# sourceURL=webpack://linenotice/./src/js/config.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/config.js"]();
/******/ 	
/******/ })()
;