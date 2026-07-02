// Content script — handles DOM recording, inspection, and element highlighting

(function() {
  'use strict';
  if (window.__pasContentLoaded) return;
  window.__pasContentLoaded = true;

  let isRecording = false;
  let isPaused = false;
  let isInspecting = false;
  let highlightOverlay = null;
  let recordedActions = [];

  // --- Element Highlighting ---
  function createOverlay() {
    if (highlightOverlay) return;
    highlightOverlay = document.createElement('div');
    highlightOverlay.id = '__pas-highlight';
    Object.assign(highlightOverlay.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '2147483647',
      border: '2px solid #00d4aa', background: 'rgba(0,212,170,0.1)',
      borderRadius: '3px', transition: 'all 0.1s ease', display: 'none'
    });
    const label = document.createElement('div');
    label.id = '__pas-label';
    Object.assign(label.style, {
      position: 'absolute', top: '-24px', left: '0', background: '#00d4aa',
      color: '#000', fontSize: '11px', fontFamily: 'monospace', padding: '2px 6px',
      borderRadius: '3px 3px 0 0', whiteSpace: 'nowrap', maxWidth: '300px', overflow: 'hidden'
    });
    highlightOverlay.appendChild(label);
    document.body.appendChild(highlightOverlay);
  }

  function highlightElement(el) {
    if (!highlightOverlay) createOverlay();
    const rect = el.getBoundingClientRect();
    Object.assign(highlightOverlay.style, {
      display: 'block', top: rect.top + 'px', left: rect.left + 'px',
      width: rect.width + 'px', height: rect.height + 'px'
    });
    const label = document.getElementById('__pas-label');
    if (label) label.textContent = getBestLocatorText(el);
  }

  function hideHighlight() {
    if (highlightOverlay) highlightOverlay.style.display = 'none';
  }

  // --- Locator Generation ---
  function getBestLocatorText(el) {
    if (el.getAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;
    if (el.getAttribute('aria-label')) return `[aria-label="${el.getAttribute('aria-label')}"]`;
    if (el.getAttribute('placeholder')) return `placeholder: "${el.getAttribute('placeholder')}"`;
    if (el.id) return `#${el.id}`;
    if (el.getAttribute('name')) return `[name="${el.getAttribute('name')}"]`;
    const text = el.textContent?.trim().slice(0, 40);
    if (text) return `text: "${text}"`;
    return el.tagName.toLowerCase();
  }

  function getElementInfo(el) {
    const rect = el.getBoundingClientRect();
    const locators = [];

    if (el.getAttribute('data-testid')) locators.push({ strategy: 'data-testid', locator: `locator('[data-testid="${el.getAttribute('data-testid')}"]')`, score: 100 });
    if (el.getAttribute('aria-label')) locators.push({ strategy: 'aria-label', locator: `getByLabel('${el.getAttribute('aria-label')}')`, score: 85 });
    if (el.getAttribute('placeholder')) locators.push({ strategy: 'placeholder', locator: `getByPlaceholder('${el.getAttribute('placeholder')}')`, score: 70 });
    if (el.getAttribute('role')) {
      const name = el.textContent?.trim().slice(0, 50);
      locators.push({ strategy: 'role', locator: name ? `getByRole('${el.getAttribute('role')}', { name: '${name}' })` : `getByRole('${el.getAttribute('role')}')`, score: 90 });
    }
    if (el.id) locators.push({ strategy: 'id', locator: `locator('#${el.id}')`, score: 55 });
    if (el.getAttribute('name')) locators.push({ strategy: 'name', locator: `locator('[name="${el.getAttribute('name')}"]')`, score: 45 });
    const text = el.textContent?.trim().slice(0, 50);
    if (text && ['BUTTON','A','LABEL'].includes(el.tagName)) locators.push({ strategy: 'text', locator: `getByText('${text}')`, score: 60 });

    return {
      tag: el.tagName,
      id: el.id,
      text: el.textContent?.trim().slice(0, 100),
      ariaLabel: el.getAttribute('aria-label'),
      role: el.getAttribute('role'),
      type: el.getAttribute('type'),
      placeholder: el.getAttribute('placeholder'),
      dataTestId: el.getAttribute('data-testid'),
      html: el.outerHTML.slice(0, 500),
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      locators: locators.sort((a, b) => b.score - a.score)
    };
  }

  // --- Recording ---
  function recordAction(type, data) {
    if (!isRecording || isPaused) return;
    const action = { type, ...data, ts: Date.now(), url: location.href };
    recordedActions.push(action);
    chrome.runtime.sendMessage({ type: 'RECORDING_ACTION', action });
  }

  function onMouseMove(e) {
    if (isInspecting) highlightElement(e.target);
  }

  function onClick(e) {
    if (isInspecting) {
      e.preventDefault();
      e.stopPropagation();
      const info = getElementInfo(e.target);
      chrome.runtime.sendMessage({ type: 'ELEMENT_INSPECTED', elementInfo: info });
      return;
    }
    if (isRecording && !isPaused) {
      const info = getElementInfo(e.target);
      recordAction('click', { selector: getBestLocatorText(e.target), locator: info.locators[0]?.locator, elementInfo: info });
    }
  }

  function onInput(e) {
    if (isRecording && !isPaused && e.target.value !== undefined) {
      recordAction('fill', { selector: getBestLocatorText(e.target), locator: getElementInfo(e.target).locators[0]?.locator, value: e.target.value });
    }
  }

  function onKeyDown(e) {
    if (isRecording && !isPaused && ['Enter', 'Tab', 'Escape'].includes(e.key)) {
      recordAction('press', { key: e.key });
    }
  }

  // --- Message Handler ---
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch (msg.type) {
      case 'START_RECORDING':
        isRecording = true; isPaused = false; recordedActions = [];
        document.addEventListener('click', onClick, true);
        document.addEventListener('input', onInput, true);
        document.addEventListener('keydown', onKeyDown, true);
        sendResponse({ ok: true });
        break;

      case 'PAUSE_RECORDING':
        isPaused = true;
        sendResponse({ ok: true, actions: recordedActions });
        break;

      case 'RESUME_RECORDING':
        isPaused = false;
        sendResponse({ ok: true });
        break;

      case 'STOP_RECORDING':
        isRecording = false;
        document.removeEventListener('click', onClick, true);
        document.removeEventListener('input', onInput, true);
        document.removeEventListener('keydown', onKeyDown, true);
        sendResponse({ ok: true, actions: recordedActions });
        recordedActions = [];
        break;

      case 'START_INSPECT':
        isInspecting = true;
        createOverlay();
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('click', onClick, true);
        sendResponse({ ok: true });
        break;

      case 'STOP_INSPECT':
        isInspecting = false;
        hideHighlight();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('click', onClick, true);
        sendResponse({ ok: true });
        break;

      case 'GET_ELEMENT_AT':
        const el = document.elementFromPoint(msg.x, msg.y);
        sendResponse(el ? getElementInfo(el) : null);
        break;

      case 'GET_PAGE_INFO':
        sendResponse({ url: location.href, title: document.title, readyState: document.readyState });
        break;

      default:
        sendResponse({ error: `Unknown message: ${msg.type}` });
    }
    return true;
  });

  // Track navigation
  const origPush = history.pushState;
  history.pushState = function(...args) {
    origPush.apply(this, args);
    recordAction('navigate', { url: location.href });
  };

  console.log('[Playwright AI Studio] Content script loaded on', location.hostname);
})();
