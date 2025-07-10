// ==UserScript==
// @name         My ADs Killer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Kill Ads
// @author       Wang Yunpeng
// @match        *://*.yahoo.co.jp/*
// @match        *://*.xyg688.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function initDebugPanel() {
    let panel = document.createElement("div");
    panel.id = "debug-panel";
    panel.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        max-height: 300px;
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
    const panel = document.getElementById("debug-panel");
    if (!panel) return;
    const p = document.createElement("div");
    p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    panel.appendChild(p);
    panel.scrollTop = panel.scrollHeight;
  }

  // ----------------------
  // mainn code
  // ----------------------
  initDebugPanel();
  logToPanel("🟢 Script Loaded");

  const host = location.hostname;

  if (host.includes("yahoo.co.jp")) {
    logToPanel(`🔄 Run on yahoo.co.jp`);
    let adElems = document.querySelectorAll(
      '[id*="yads"], [id*="STREAMAD"], [id*="ad_"]'
    );
    adElems.forEach((el) => el.remove());
  } 
  else if (host.includes("xyg688")) {
    logToPanel(`🔄 Run on xyg688`);
    let adElems = document.querySelectorAll(
      '[id*="ads"], [class*="ads"], [id*="ad_"]'
);
    adElems.forEach((el) => el.remove());
  }
})();
