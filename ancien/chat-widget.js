/**
 * Chat widget for Julien Rabault's portfolio.
 * Floating bubble → chat panel. Bilingual (FR/EN).
 * Max 8 messages per session, connects to Cloudflare Worker proxy.
 */
(function () {
  'use strict';

  // ─── Config ───
  // TODO: replace with actual Cloudflare Worker URL after deployment
  var API_URL = 'https://jr-portfolio-chat.julienrabault.workers.dev';
  var CHAT_URL = API_URL + '/chat';
  var ANALYTICS_URL = API_URL + '/events';
  var MAX_MESSAGES = 8;
  var TRACKING_VERSION = 'v12';
  var isEN = document.documentElement.lang === 'en';

  var t = {
    intro: isEN
      ? "I know everything about Julien's career. Go ahead, try me."
      : "Je connais le parcours de Julien sur le bout des doigts. Allez-y, testez-moi.",
    nudge: isEN
      ? "Ask me about Julien!"
      : "Une question sur Julien ?",
    placeholder: isEN ? "Ask about Julien's profile..." : "Posez une question sur le profil...",
    title: "Ask JR.",
    limit: isEN ? "Message limit reached. Contact Julien directly!" : "Limite de messages atteinte. Contactez Julien directement !",
    error: isEN ? "Sorry, an error occurred. Try again." : "Désolé, une erreur est survenue. Réessayez.",
    sending: isEN ? "Thinking..." : "Réflexion...",
    privacy: isEN
      ? "Questions may be saved anonymously to improve the assistant."
      : "Les questions peuvent être enregistrées anonymement pour améliorer l'assistant.",
  };

  var messageCount = 0;
  var visitorId = getPersistentId('jr-visitor-id', 'v');
  var sessionId = getSessionId();
  var attribution = getAttribution();

  // Analytics helpers
  function createId(prefix) {
    var bytes = new Uint8Array(12);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (var i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }

    return prefix + '_' + Array.prototype.map.call(bytes, function (byte) {
      return byte.toString(16).padStart(2, '0');
    }).join('');
  }

  function getPersistentId(key, prefix) {
    try {
      var existing = localStorage.getItem(key);
      if (existing) return existing;

      var next = createId(prefix);
      localStorage.setItem(key, next);
      return next;
    } catch {
      return createId(prefix);
    }
  }

  function getSessionId() {
    try {
      var existing = sessionStorage.getItem('jr-session-id');
      if (existing) return existing;

      var next = createId('s');
      sessionStorage.setItem('jr-session-id', next);
      return next;
    } catch {
      return createId('s');
    }
  }

  function cleanParam(value) {
    if (!value) return '';
    return String(value).trim().slice(0, 160);
  }

  function getAttribution() {
    var params = new URLSearchParams(window.location.search);
    var current = {
      source: cleanParam(params.get('src') || params.get('utm_source')),
      medium: cleanParam(params.get('utm_medium')),
      campaign: cleanParam(params.get('utm_campaign')),
      content: cleanParam(params.get('utm_content')),
    };
    current.source = current.source || 'inconnu';
    var hasCurrent = current.source !== 'inconnu' || current.medium || current.campaign || current.content;

    try {
      if (hasCurrent) {
        sessionStorage.setItem('jr-attribution', JSON.stringify(current));
      }
    } catch {}

    return current;
  }

  function buildTrackingPayload(eventType, metadata) {
    return {
      eventType: eventType,
      visitorId: visitorId,
      sessionId: sessionId,
      pagePath: window.location.pathname + window.location.search,
      pageUrl: window.location.href.split('#')[0],
      referrer: document.referrer || '',
      source: attribution.source || 'inconnu',
      medium: attribution.medium || '',
      campaign: attribution.campaign || '',
      content: attribution.content || '',
      language: isEN ? 'en' : 'fr',
      metadata: Object.assign({ trackingVersion: TRACKING_VERSION }, metadata || {}),
    };
  }

  function sendBeaconPayload(payload) {
    if (navigator.sendBeacon) {
      try {
        return navigator.sendBeacon(
          ANALYTICS_URL,
          new Blob([payload], { type: 'text/plain;charset=UTF-8' })
        );
      } catch {
        return false;
      }
    }
    return false;
  }

  function sendAnalyticsEvent(eventType, metadata) {
    var payload = JSON.stringify(buildTrackingPayload(eventType, metadata));

    fetch(ANALYTICS_URL, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      keepalive: true,
      body: payload,
    })
      .then(function (response) {
        if (!response.ok) sendBeaconPayload(payload);
      })
      .catch(function () {
        sendBeaconPayload(payload);
      });
  }

  function getLinkUrl(link) {
    try {
      return new URL(link.href, window.location.href);
    } catch {
      return null;
    }
  }

  function getProjectName(link) {
    var projectRow = link.closest('.project-row');
    if (!projectRow) return '';
    var name = projectRow.querySelector('.project-name');
    return name ? name.textContent.trim() : link.textContent.trim().slice(0, 80);
  }

  function getLinkLabel(link) {
    return (link.getAttribute('aria-label') || link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
  }

  function buildLinkEvents(link) {
    var href = link.getAttribute('href') || '';
    var url = getLinkUrl(link);
    var events = [];
    var label = getLinkLabel(link);
    var projectName = getProjectName(link);

    if (link.hasAttribute('download') && /CV_JULIEN_RABAULT/i.test(href)) {
      events.push({
        type: 'cv_download',
        metadata: {
          file: href.split('/').pop(),
          label: label || 'CV PDF',
        },
      });
    }

    if (href === '#contact') {
      events.push({
        type: 'contact_click',
        metadata: {
          channel: 'contact_section',
          label: label || 'Contact',
        },
      });
    }

    if (/^mailto:/i.test(href)) {
      events.push({
        type: 'contact_click',
        metadata: {
          channel: 'email',
          label: label || href.replace(/^mailto:/i, ''),
        },
      });
    }

    if (url && /(^|\.)linkedin\.com$/i.test(url.hostname)) {
      events.push({
        type: 'contact_click',
        metadata: {
          channel: 'linkedin',
          label: label || 'LinkedIn',
          href: url.href,
        },
      });
    }

    if (projectName) {
      events.push({
        type: 'project_open',
        metadata: {
          project: projectName,
          href: url ? url.href : href,
        },
      });
    }

    if (url && /(^|\.)github\.com$/i.test(url.hostname)) {
      events.push({
        type: 'github_click',
        metadata: {
          project: projectName || '',
          label: label || 'GitHub',
          href: url.href,
        },
      });
    }

    return events;
  }

  var recentInteractionKeys = new Map();

  function trackLinkInteraction(link) {
    var items = buildLinkEvents(link);
    if (items.length === 0) return;

    items.forEach(function (item) {
      var key = item.type + ':' + (link.href || '') + ':' + JSON.stringify(item.metadata || {});
      var now = Date.now();
      var last = recentInteractionKeys.get(key) || 0;
      if (now - last > 1200) {
        recentInteractionKeys.set(key, now);
        sendAnalyticsEvent(item.type, item.metadata);
      }
    });
  }

  function installInteractionTracking() {
    document.addEventListener('pointerdown', function (event) {
      if (event.button != null && event.button > 1) return;
      var link = event.target.closest('a');
      if (link) trackLinkInteraction(link);
    }, true);

    document.addEventListener('auxclick', function (event) {
      var link = event.target.closest('a');
      if (link) trackLinkInteraction(link);
    }, true);

    document.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (link) trackLinkInteraction(link);
    }, true);

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var link = event.target.closest('a');
      if (link) trackLinkInteraction(link);
    });
  }

  // ─── Create DOM ───
  function createWidget() {
    // Bubble
    var bubble = document.createElement('button');
    bubble.id = 'chat-bubble';
    bubble.setAttribute('aria-label', t.title);
    bubble.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
    document.body.appendChild(bubble);

    // Panel
    var panel = document.createElement('div');
    panel.id = 'chat-panel';
    panel.innerHTML =
      '<div id="chat-header">' +
        '<span>' + t.title + '</span>' +
        '<button id="chat-close" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div id="chat-messages"></div>' +
      '<div id="chat-privacy">' + t.privacy + '</div>' +
      '<form id="chat-form">' +
        '<input id="chat-input" type="text" placeholder="' + t.placeholder + '" maxlength="500" autocomplete="off" />' +
        '<button type="submit" id="chat-send" aria-label="Send">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4z"/><path d="m22 2-11 11"/></svg>' +
        '</button>' +
      '</form>';
    document.body.appendChild(panel);

    // Add intro message
    addMessage('assistant', t.intro);
    sendAnalyticsEvent('page_view', {
      title: document.title,
      viewport: window.innerWidth + 'x' + window.innerHeight,
    });
    installInteractionTracking();

    // Nudge tooltip (first visit, then every 7 days if chat never opened)
    var nudgeTs = localStorage.getItem('chat-nudge-ts');
    var showNudge = !nudgeTs || Date.now() - parseInt(nudgeTs) > 2 * 24 * 60 * 60 * 1000;
    if (showNudge) {
      setTimeout(function () {
        if (!panel.classList.contains('open')) {
          var nudge = document.createElement('div');
          nudge.id = 'chat-nudge';
          nudge.textContent = t.nudge;
          document.body.appendChild(nudge);
          setTimeout(function () { nudge.classList.add('visible'); }, 50);
          setTimeout(function () {
            nudge.classList.remove('visible');
            setTimeout(function () { if (nudge.parentNode) nudge.remove(); }, 300);
          }, 5000);
          localStorage.setItem('chat-nudge-ts', String(Date.now()));
        }
      }, 3000);
    }

    // Events
    bubble.addEventListener('click', function () {
      var wasOpen = panel.classList.contains('open');
      panel.classList.toggle('open');
      bubble.classList.toggle('hidden');
      var nudgeEl = document.getElementById('chat-nudge');
      if (nudgeEl) nudgeEl.remove();
      if (!wasOpen && panel.classList.contains('open')) {
        sendAnalyticsEvent('chat_open', {});
        localStorage.setItem('chat-nudge-ts', String(Date.now()));
        document.getElementById('chat-input').focus();
      }
    });

    document.getElementById('chat-close').addEventListener('click', function () {
      panel.classList.remove('open');
      bubble.classList.remove('hidden');
    });

    document.getElementById('chat-form').addEventListener('submit', function (e) {
      e.preventDefault();
      handleSend();
    });
  }

  function addMessage(role, text) {
    var messages = document.getElementById('chat-messages');
    var div = document.createElement('div');
    div.className = 'chat-msg chat-' + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function handleSend() {
    var input = document.getElementById('chat-input');
    var msg = input.value.trim();
    if (!msg) return;

    if (messageCount >= MAX_MESSAGES) {
      addMessage('assistant', t.limit);
      input.disabled = true;
      return;
    }

    addMessage('user', msg);
    input.value = '';
    messageCount++;

    var thinkingDiv = addMessage('assistant', t.sending);

    fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg,
        visitorId: visitorId,
        sessionId: sessionId,
        pagePath: window.location.pathname + window.location.search,
        pageUrl: window.location.href.split('#')[0],
        referrer: document.referrer || '',
        source: attribution.source || '',
        medium: attribution.medium || '',
        campaign: attribution.campaign || '',
        content: attribution.content || '',
        language: isEN ? 'en' : 'fr',
      }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        thinkingDiv.textContent = data.reply || data.error || t.error;
      })
      .catch(function () {
        thinkingDiv.textContent = t.error;
      });
  }

  // ─── Inject styles ───
  function injectStyles() {
    var css = document.createElement('style');
    css.textContent = [
      '#chat-bubble {',
      '  position: fixed; bottom: 24px; right: 24px; z-index: 1000;',
      '  width: 52px; height: 52px; border-radius: 50%;',
      '  background: var(--accent, #d4a853); color: #000; border: none;',
      '  cursor: pointer; display: flex; align-items: center; justify-content: center;',
      '  box-shadow: 0 4px 16px rgba(0,0,0,0.3); transition: transform 0.2s ease, opacity 0.2s ease;',
      '}',
      '#chat-bubble:hover { transform: scale(1.08); }',
      '#chat-bubble.hidden { opacity: 0; pointer-events: none; transform: scale(0.8); }',
      '',
      '#chat-panel {',
      '  position: fixed; bottom: 24px; right: 24px; z-index: 1001;',
      '  width: 360px; max-width: calc(100vw - 32px); height: 480px; max-height: calc(100vh - 48px);',
      '  background: var(--bg, #141414); border: 1px solid var(--border, #2e2e2e);',
      '  border-radius: 12px; display: none; flex-direction: column;',
      '  box-shadow: 0 8px 32px rgba(0,0,0,0.4); overflow: hidden;',
      '}',
      '#chat-panel.open { display: flex; }',
      '',
      '#chat-header {',
      '  display: flex; align-items: center; justify-content: space-between;',
      '  padding: 12px 16px; border-bottom: 1px solid var(--border, #2e2e2e);',
      '  font-size: 13px; font-weight: 600; color: var(--text-primary, #e7dece);',
      '}',
      '#chat-close {',
      '  background: none; border: none; color: var(--text-muted, #978f84);',
      '  font-size: 20px; cursor: pointer; padding: 0 4px; line-height: 1;',
      '}',
      '#chat-close:hover { color: var(--text-primary, #e7dece); }',
      '',
      '#chat-messages {',
      '  flex: 1; overflow-y: auto; padding: 12px 16px;',
      '  display: flex; flex-direction: column; gap: 8px;',
      '}',
      '',
      '.chat-msg {',
      '  max-width: 85%; padding: 8px 12px; border-radius: 12px;',
      '  font-size: 13px; line-height: 1.5; word-wrap: break-word;',
      '}',
      '.chat-user {',
      '  align-self: flex-end; background: var(--accent, #d4a853); color: #000;',
      '  border-bottom-right-radius: 4px;',
      '}',
      '.chat-assistant {',
      '  align-self: flex-start; background: var(--bg-subtle, #1c1c1c);',
      '  color: var(--text-secondary, #c5bcad); border-bottom-left-radius: 4px;',
      '}',
      '',
      '#chat-privacy {',
      '  padding: 8px 12px 0; color: var(--text-muted, #978f84);',
      '  font-size: 10px; line-height: 1.4;',
      '}',
      '',
      '#chat-form {',
      '  display: flex; gap: 8px; padding: 12px; border-top: 1px solid var(--border, #2e2e2e);',
      '}',
      '#chat-input {',
      '  flex: 1; background: var(--bg-subtle, #1c1c1c); border: 1px solid var(--border, #2e2e2e);',
      '  border-radius: 8px; padding: 8px 12px; color: var(--text-primary, #e7dece);',
      '  font-size: 13px; outline: none;',
      '}',
      '#chat-input:focus { border-color: var(--accent, #d4a853); }',
      '#chat-input::placeholder { color: var(--text-muted, #978f84); }',
      '#chat-send {',
      '  background: var(--accent, #d4a853); color: #000; border: none;',
      '  border-radius: 8px; width: 36px; height: 36px; cursor: pointer;',
      '  display: flex; align-items: center; justify-content: center;',
      '  transition: opacity 0.15s ease;',
      '}',
      '#chat-send:hover { opacity: 0.85; }',
      '',
      '#chat-nudge {',
      '  position: fixed; bottom: 82px; right: 24px; z-index: 999;',
      '  background: var(--bg-card, #1e1e1e); color: var(--text-secondary, #c5bcad);',
      '  border: 1px solid var(--border, #2e2e2e); border-radius: 8px;',
      '  padding: 8px 14px; font-size: 12px; white-space: nowrap;',
      '  opacity: 0; transform: translateY(4px);',
      '  transition: opacity 0.3s ease, transform 0.3s ease;',
      '  pointer-events: none;',
      '}',
      '#chat-nudge.visible { opacity: 1; transform: translateY(0); }',
      '',
      '@media (max-width: 480px) {',
      '  #chat-panel { width: calc(100vw - 16px); right: 8px; bottom: 8px; height: 60vh; }',
      '  #chat-bubble { bottom: 16px; right: 16px; }',
      '}',
    ].join('\n');
    document.head.appendChild(css);
  }

  // ─── Init ───
  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
