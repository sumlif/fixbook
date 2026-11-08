(() => {
  const search = document.querySelector('#search');
  const cards = [...document.querySelectorAll('.card')];
  let filter = 'all';
  function update() {
    const term = (search?.value || '').trim().toLowerCase();
    let count = 0;
    cards.forEach(card => {
      const show = (filter === 'all' || card.dataset.app === filter) && card.dataset.search.toLowerCase().includes(term);
      card.hidden = !show;
      if (show) count++;
    });
    const empty = document.querySelector('#empty');
    if (empty) empty.hidden = count > 0;
    const status = document.querySelector('#result-status');
    if (status) status.textContent = `${count} notes found`;
  }
  search?.addEventListener('input', update);
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    update();
  }));
  document.querySelectorAll('.copy').forEach(button => button.addEventListener('click', async () => {
    const content = button.parentElement.querySelector('code');
    try {
      await navigator.clipboard.writeText(content.textContent);
      button.textContent = 'Copied!';
      setTimeout(() => { button.textContent = 'Copy'; }, 1800);
    } catch (_) {
      const range = document.createRange(); range.selectNodeContents(content);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      button.textContent = 'Selected — press Ctrl+C';
    }
  }));
  const embedded = document.querySelector('#fixbook-config');
  const script = document.currentScript;
  const configuration = embedded ? Promise.resolve(JSON.parse(embedded.textContent)) :
    (script?.src ? fetch(new URL('config.json', script.src)).then(r => { if (!r.ok) throw Error('Config unavailable'); return r.json(); }) : Promise.resolve({}));
  configuration.then(config => {
    if (/^G-[A-Z0-9]+$/.test(config.google_analytics_id || '')) {
      const measurementId = config.google_analytics_id;
      const preferenceKey = 'fixbook.google-analytics.v1';
      let preference = null;
      try {
        const saved = JSON.parse(localStorage.getItem(preferenceKey));
        if (saved && ['granted', 'denied'].includes(saved.value) && Date.now() - saved.time < 180 * 86400000) preference = saved.value;
      } catch (_) {}
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
      let googleLoaded = false;
      function loadGoogle() {
        if (googleLoaded) return;
        googleLoaded = true;
        window['ga-disable-' + measurementId] = false;
        window.gtag('consent', 'update', {analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {allow_google_signals: false, allow_ad_personalization_signals: false, cookie_prefix: 'fixbook', cookie_path: '/fixbook/', cookie_domain: 'none', page_location: location.origin + location.pathname});
        const google = document.createElement('script');
        google.async = true;
        google.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
        document.head.append(google);
      }
      const panel = document.createElement('section');
      panel.className = 'consent-panel'; panel.setAttribute('aria-label', 'Google Analytics preferences');
      panel.innerHTML = '<div><strong>Help improve this notebook?</strong><p>Allow Google Analytics cookies to measure visits and article engagement. You can change this later. <a href="privacy.html">Privacy details</a></p></div><div class="consent-actions"><button type="button" data-choice="denied">Reject Google Analytics</button><button type="button" data-choice="granted">Accept Google Analytics</button></div><span class="sr-only" aria-live="polite" id="consent-status"></span>';
      document.body.append(panel);
      panel.hidden = preference !== null;
      const settings = document.querySelector('.privacy-settings');
      if (settings) {
        settings.hidden = false;
        settings.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); });
      }
      panel.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
        const value = button.dataset.choice;
        try { localStorage.setItem(preferenceKey, JSON.stringify({value, time: Date.now()})); } catch (_) {}
        panel.hidden = true;
        if (value === 'granted') { preference = value; loadGoogle(); }
        else {
          window['ga-disable-' + measurementId] = true;
          document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(name => name.startsWith('fixbook')).forEach(name => {
            for (const path of ['/fixbook/', '/']) {
              document.cookie = name + '=; Max-Age=0; path=' + path + '; SameSite=Lax';
              document.cookie = name + '=; Max-Age=0; path=' + path + '; domain=' + location.hostname + '; SameSite=Lax';
            }
          });
          if (googleLoaded) location.reload();
          preference = value;
        }
        settings?.focus();
      }));
      if (preference === 'granted') loadGoogle();
    }
    if (config.comments && document.querySelector('#comments')) {
      const comments = document.createElement('script');
      comments.src = 'https://utteranc.es/client.js';
      comments.setAttribute('repo', config.repo);
      comments.setAttribute('issue-term', 'pathname');
      comments.setAttribute('theme', 'github-light');
      comments.crossOrigin = 'anonymous'; comments.async = true;
      document.querySelector('#comments').append(comments);
    }
    if (/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(config.analytics_endpoint)) {
      const analytics = document.createElement('script');
      analytics.src = 'https://gc.zgo.at/count.js';
      analytics.setAttribute('data-goatcounter', config.analytics_endpoint);
      analytics.async = true; document.head.append(analytics);
    }
  }).catch(() => {});
})();
