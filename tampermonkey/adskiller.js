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
    const panelId = "debug-panel-wang";

    // 如果 style 已经存在，就不重复加
    if (!document.getElementById("debug-panel-style")) {
      const style = document.createElement("style");
      style.id = "debug-panel-style";
      style.textContent = `
      #${panelId} {
        position: fixed;
        bottom: 0;
        right: 0;
        max-height: 150px;
        width: 300px;
        background: rgba(0, 0, 0, 0.5);
        color: lime;
        font-family: monospace;
        font-size: 12px;
        overflow-y: auto;
        z-index: 99999;
        padding: 10px;
        transition: background 0.3s ease, opacity 0.3s ease;
        transform-origin: bottom right;
        transition: transform 0.5s ease;
      }

      #${panelId}:hover {
        background: #1e1e1e;
        opacity: 1;
        transform: scale(1.5);
      }
    `;
      document.head.appendChild(style);
    }

    const panel = document.createElement("div");
    panel.id = panelId;
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
    let idle = false;

    if (host.includes("yahoo.co.jp")) {
      killAdsMain("yahoo.co.jp", '[id*="yads"], [id*="STREAMAD"], [id*="ad_"]');
    } else if (host.includes("xyg688")) {
      killAdsMain("xyg688", '[id*="ads"], [class*="ads"], [id*="ad_"]');
    } else if (host.includes("youtube")) {
      killAdsMain(
        "youtube",
        '[class*="-ad-"], [class*="ADHeader"], [class*="ytwAD"]'
      );
    } else {
      logToPanel(`💡 Idle for current site`);
      idle = true;
    }
    return idle;
  }

  // ----------------------
  // main code
  // ----------------------
  initDebugPanel();
  logToPanel("🟢 Script Loaded");
  let idleFlag = runScript();

  if (!idleFlag) {
    let handler = setInterval(() => {
      runScript();
    }, 3000);

    setTimeout(() => {
      clearInterval(handler);
      document.getElementById("debug-panel-wang").remove();
    }, 30000);
  }
})();
