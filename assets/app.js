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
