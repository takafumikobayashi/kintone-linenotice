(()=>{var e;e=kintone.$PLUGIN_ID,kintone.events.on("app.record.index.show",(()=>{const n=kintone.app.getHeaderSpaceElement();if(null===n)throw new Error("The header element is unavailable on this page.");const t=document.createDocumentFragment(),a=document.createElement("h3"),i=document.createElement("p"),o=kintone.plugin.app.getConfig(e);i.textContent=o.message,i.classList.add("plugin-space-message"),a.textContent="Hello kintone plugin!",a.classList.add("plugin-space-heading"),t.appendChild(a),t.appendChild(i),n.appendChild(t)}))})();