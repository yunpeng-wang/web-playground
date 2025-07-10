// ==UserScript==
// @name         My ADs Killer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Kill Ads
// @author       Wang Yunpeng
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function initDebugPanel() {
    let panel = document.createElement("div");
    panel.id = "debug-panel-wang";
    panel.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        max-height: 150px;
        width: 300px;
        background: rgba(0,0,0,0.5);
        color: lime;
        font-family: monospace;
        font-size: 12px;
        overflow-y: auto;
        z-index: 99999;
        padding: 10px;
    `;
    document.body.appendChild(panel);
  }

  function logToPanel(msg) {
    const panel = document.getElementById("debug-panel-wang");
    if (!panel) return;
    const p = document.createElement("div");
    p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    panel.appendChild(p);
    panel.scrollTop = panel.scrollHeight;
  }

  function killAdsMain(host_name, ads_search, white_list = []) {
    logToPanel(`🔄 Run on ${host_name}`);
    let adElems = document.querySelectorAll(ads_search);
    if (adElems.length > 0) {
      adElems.forEach((el) => {
        if (white_list) {
          let class_list = el.className.toLowerCase();
          let flag = false;
          for (let i of white_list) {
            flag = flag || class_list.includes(i);
            if (flag) {
              return; // skip deleting el in white list
            }
          }
        }
        el.remove();
      });
      logToPanel(`🟢 Killed ${adElems.length} Ads`);
    } else {
      logToPanel(`🔴 Failed to find Ads`);
    }
  }

  function runScript() {
    const host = location.hostname;

    if (host.includes("yahoo.co.jp")) {
      killAdsMain("yahoo.co.jp", '[id*="yads"], [id*="STREAMAD"], [id*="ad_"]');
    } else if (host.includes("xyg688")) {
      killAdsMain("xyg688", '[id*="ads"], [class*="ads"], [id*="ad_"]');
    } else if (host.includes("youtube")) {
      killAdsMain(
        "youtube",
        '[class*="-ad-"], [class*="ADHeader"], [class*="ytwAD"]'
      );
    }
    else {
      logToPanel(`💡 Idle for current site`);
    }
  }

  // ----------------------
  // main code
  // ----------------------
  initDebugPanel();
  logToPanel("🟢 Script Loaded");
  runScript();

  let handler = setInterval(() => {
    runScript();
  }, 5000);

  setTimeout(() => {
    clearInterval(handler);
    document.getElementById("debug-panel-wang").remove();
  }, 60000);
})();
