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
  var MAX_MESSAGES = 8;
  var isEN = document.documentElement.lang === 'en';

  var t = {
    intro: isEN
      ? "Hi! I'm Julien's AI assistant. Ask me anything about his background, skills or availability."
      : "Bonjour ! Je suis l'assistant IA de Julien. Posez-moi une question sur son parcours, ses compétences ou sa disponibilité.",
    nudge: isEN
      ? "Ask me anything about Julien!"
      : "Une question sur Julien ?",
    placeholder: isEN ? "Ask about Julien's profile..." : "Posez une question sur le profil...",
    title: isEN ? "Chat with Julien's AI" : "Discuter avec l'IA de Julien",
    limit: isEN ? "Message limit reached. Contact Julien directly!" : "Limite de messages atteinte. Contactez Julien directement !",
    error: isEN ? "Sorry, an error occurred. Try again." : "Désolé, une erreur est survenue. Réessayez.",
    sending: isEN ? "Thinking..." : "Réflexion...",
  };

  var messageCount = 0;

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
      '<form id="chat-form">' +
        '<input id="chat-input" type="text" placeholder="' + t.placeholder + '" maxlength="500" autocomplete="off" />' +
        '<button type="submit" id="chat-send" aria-label="Send">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4z"/><path d="m22 2-11 11"/></svg>' +
        '</button>' +
      '</form>';
    document.body.appendChild(panel);

    // Add intro message
    addMessage('assistant', t.intro);

    // Nudge tooltip (first visit only)
    if (!localStorage.getItem('chat-nudge-seen')) {
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
          localStorage.setItem('chat-nudge-seen', '1');
        }
      }, 3000);
    }

    // Events
    bubble.addEventListener('click', function () {
      panel.classList.toggle('open');
      bubble.classList.toggle('hidden');
      var nudgeEl = document.getElementById('chat-nudge');
      if (nudgeEl) nudgeEl.remove();
      if (panel.classList.contains('open')) {
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

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
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
