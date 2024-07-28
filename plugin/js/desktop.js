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

/***/ "./src/js/desktop.js":
/*!***************************!*\
  !*** ./src/js/desktop.js ***!
  \***************************/
/***/ (() => {

eval("(function (PLUGIN_ID) {\n  kintone.events.on(['app.record.detail.show'], function(event) {\n    const record = event.record;\n    let headerSpace = kintone.app.record.getHeaderMenuSpaceElement(); // ヘッダースペースを取得\n\n    // 既に追加されたボタンがあるかチェック\n    let existingButton = document.getElementById('lineBotActionButton');\n    if (existingButton) {\n        return event; // 既にボタンがある場合は何もしない\n    }\n\n    // configで設定したフィールドコードを取得\n    const config = kintone.plugin.app.getConfig(PLUGIN_ID);\n    const channelAccessToken = config.channelAccessToken\n    const triggerType = config.triggerType\n    const triggerField = config.triggerField\n    const lineMessage = config.lineMessage\n    const processedField = config.processedField\n\n    // 通知済であれば何もしない\n    if (record[processedField].value == \"はい\"){\n      return event;\n    }\n\n    // トリガータイプを判定\n    switch (triggerType) {\n      case \"0\":   // ボタン起動\n\n        // 新しいボタンを作成\n        let button = document.createElement('button');\n        button.id = 'lineBotActionButton';\n        button.innerText = 'LINE通知実行';\n        button.className = 'kintoneplugin-button-normal'; // Kintoneのデフォルトボタンスタイル\n        button.style.marginLeft = '20px'; // 右に隙間を作る\n        button.style.marginRight = '20px'; // 右に隙間を作る\n\n        // ヘッダースペースにボタンを追加\n        headerSpace.appendChild(button);\n\n        // ボタンのクリックイベントを設定\n        button.onclick = function() {\n          swal({\n              title: '以下のメッセージでLINE通知をします。よろしいですか？',\n              text:  lineMessage,\n              icon: 'info',\n              buttons: {\n                  cancel: \"いいえ\",\n                  catch: {\n                      text: \"はい\",\n                      value: \"execute\",\n                  }\n              },\n          })\n          .then((value) => {\n              switch (value) {\n                  case \"execute\":\n                      lineBotAction(channelAccessToken, lineMessage, processedField, record);\n                      break;\n                  default:\n                      console.log('LINE通知がキャンセルされました。');\n              }\n          });\n        };\n        \n        break;\n    \n      case \"1\":   // 時間起動\n        \n        // 対象となる日付項目を取得\n        let targetDateTime = record[triggerField].value\n        let targetDate = new Date(targetDateTime);\n        const today = new Date();\n\n        // 現在日時との比較、経過の場合は通知処理を開始\n        if (today > targetDate) {\n          swal({\n            title: '以下のメッセージでLINE通知をします。よろしいですか？',\n            text:  lineMessage,\n            icon: 'info',\n            buttons: {\n                cancel: \"いいえ\",\n                catch: {\n                    text: \"はい\",\n                    value: \"execute\",\n                }\n            },\n        })\n        .then((value) => {\n            switch (value) {\n                case \"execute\":\n                    lineBotAction(channelAccessToken, lineMessage, processedField, record);\n                    break;\n                default:\n                    console.log('LINE通知がキャンセルされました。');\n            }\n        });\n        }\n\n        break;\n    }\n\n    return event;\n  });\n\n  function lineBotAction(channelAccessToken, lineMessage, processedField, record\n\n  ) {\n    const appId = kintone.app.getId();\n    const url = 'https://api.line.me/v2/bot/message/broadcast';\n    const headers = {\n      'Authorization': ' Bearer ' + '{' + channelAccessToken + '}',\n      'Content-Type' : 'application/json'\n    };\n    const messagePayload = {\n        messages: [\n            {\n                type: 'text',\n                text: lineMessage\n            }\n        ]\n    };\n\n    kintone.proxy(url, 'POST', headers, messagePayload).then(function(args) {\n      if (args[1] === 200) {\n\n          //通知済フラグの更新\n          let updateParams = {\n            app: appId,\n            id: record['$id'].value,\n            record: {}\n          };\n          updateParams.record[processedField] = {\n              value: [\"はい\"]\n          };\n\n          // レコードの更新\n          kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', updateParams, function(updateArgs) {\n            console.log('Record updated: ', updateArgs);\n            swal({\n                title: '成功しました。',\n                text: 'LINEメッセージの送信と通知済フラグの更新が完了しました。',\n                icon: 'success',\n                button: 'OK'\n            }).then(() => {\n              // ダイアログクローズ後の処理\n              location.reload(true);\n            })\n          }, function(updateError) {\n              console.error('Update error: ', updateError);\n              swal({\n                  title: 'エラーが発生しました。',\n                  text: 'LINEメッセージの送信は成功しましたが、通知済フラグの更新に失敗しました。',\n                  icon: 'error',\n                  button: 'OK'\n              });\n          });\n          return;\n\n      }else{\n        console.error('LINESend error: ', args[0]);\n        swal({\n          title: 'エラーが発生しました。',\n          text: 'LINEメッセージの送信に失敗しました。',\n          icon: 'error',\n          button: 'OK'\n        });\n        return;\n      }\n    }, function(error) {\n      console.error('LINESend error: ', error);\n      swal({\n        title: 'エラーが発生しました。',\n        text: 'LINEメッセージの送信に失敗しました。',\n        icon: 'error',\n        button: 'OK'\n      });\n        return;\n    });\n  }\n})(kintone.$PLUGIN_ID);\n\n\n\n\n//# sourceURL=webpack://linenotice/./src/js/desktop.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/desktop.js"]();
/******/ 	
/******/ })()
;