/* OBIS CRAZY — app.js */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const audio = $('#audio');
const GENRES = ['Afrobeats', 'Drill', 'Trap', 'Hoodtrap', 'Hip-hop'];
const FALLBACK = 'assets/logo.png';
const ICON = {
  play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>'
};

const LICENCES = [
  { id: 'basic',
    fr: { name: 'Basic Lease', feats: ['Fichier MP3', "Jusqu'à 100 000 streams", 'Droits non exclusifs', 'Crédit « Prod. obiscrazy » obligatoire'] },
    en: { name: 'Basic Lease', feats: ['MP3 file', 'Up to 100,000 streams', 'Non-exclusive rights', '"Prod. obiscrazy" credit required'] } },
  { id: 'premium',
    fr: { name: 'Premium Lease', feats: ['MP3 + WAV', "Jusqu'à 500 000 streams", 'Utilisation en clip vidéo', 'Usage commercial', 'Crédit obligatoire'] },
    en: { name: 'Premium Lease', feats: ['MP3 + WAV', 'Up to 500,000 streams', 'Music video use', 'Commercial use', 'Credit required'] } },
  { id: 'unlimited',
    fr: { name: 'Unlimited Lease', feats: ['MP3 + WAV + Stems', 'Streams illimités', 'Diffusion radio', 'Clip vidéo et usage commercial', 'Crédit obligatoire'] },
    en: { name: 'Unlimited Lease', feats: ['MP3 + WAV + Stems', 'Unlimited streams', 'Radio broadcasting', 'Music video and commercial use', 'Credit required'] } },
  { id: 'exclusive', exclusive: true,
    fr: { name: 'Exclusive', feats: ['Tous les fichiers + projet source', 'Transfert de propriété', 'Tout illimité', 'Aucun crédit requis', 'Beat retiré du store'] },
    en: { name: 'Exclusive', feats: ['All files + project source', 'Full ownership transfer', 'Unlimited everything', 'No credit required', 'Beat removed from store'] } }
];

const I18N = {
  fr: {
    'nav.beats': 'Beats', 'nav.licences': 'Licences', 'nav.custom': 'Sur mesure', 'nav.studio': 'Studio', 'nav.contact': 'Contact',
    'hero.eyebrow': 'Beats premium · Licences instantanées',
    'hero.title': 'The crazy<br><span class="gold-text">beatmaker.</span>',
    'hero.sub': 'Afrobeats, Drill, Trap, Hoodtrap et Hip-hop. Paiement par Orange Money, Moov Money, Wave, carte ou PayPal.',
    'hero.cta1': 'Écouter les beats', 'hero.cta2': 'Voir les licences',
    'hero.stat1': 'Beats', 'hero.stat2': 'Genres', 'hero.stat3': 'Licences',
    'feat.label': 'À la une',
    'store.eyebrow': 'Catalogue', 'store.title': 'Tous les beats', 'store.search': 'Rechercher un beat, un style, un type beat…',
    'store.empty': 'Aucun beat trouvé.', 'store.all': 'Tous', 'store.from': 'dès', 'store.licence': 'Licence',
    'lic.eyebrow': 'Licences', 'lic.title': 'Choisis tes droits',
    'lic.sub': 'Paiement unique. Fichiers et contrat envoyés dès la confirmation du paiement.',
    'lic.once': 'paiement unique', 'lic.cta': 'Choisir un beat', 'lic.best': 'Exclusif',
    'custom.eyebrow': 'Sur mesure', 'custom.title': 'Un beat fait pour toi',
    'custom.sub': 'Décris ton projet : on crée une instru unique, à ton image.',
    'custom.name': "Nom d'artiste", 'custom.genre': 'Style', 'custom.refs': 'Références (artistes, sons)',
    'custom.budget': 'Budget (FCFA)', 'custom.deadline': 'Délai souhaité', 'custom.msg': 'Ton idée', 'custom.send': 'Envoyer la demande',
    'studio.eyebrow': 'Studio', 'studio.title': 'Réserve ta session',
    'studio.sub': 'Enregistrement, mix, mastering ou production en direct. Choisis ton créneau, on te confirme sur WhatsApp.',
    'studio.name': "Nom d'artiste", 'studio.phone': 'Téléphone', 'studio.date': 'Date', 'studio.time': 'Heure',
    'studio.duration': 'Durée', 'studio.type': 'Type de session', 'studio.t1': 'Enregistrement', 'studio.t2': 'Mix & mastering',
    'studio.t3': 'Production en direct', 'studio.notes': 'Infos utiles', 'studio.send': 'Réserver',
    'footer.tag': 'Beats premium pour artistes sérieux.', 'footer.rights': 'Tous droits réservés.',
    'player.buy': 'Acheter', 'modal.eyebrow': 'Choisir une licence', 'modal.add': 'Ajouter au panier',
    'cart.title': 'Panier', 'cart.empty': 'Ton panier est vide.', 'cart.total': 'Total', 'cart.remove': 'Retirer',
    'cart.name': "Nom d'artiste", 'cart.email': 'Email (pour recevoir tes fichiers)',
    'cart.momo': 'Payer en Mobile Money (WhatsApp)', 'cart.paypal': 'Payer avec PayPal',
    'cart.note': 'Orange Money, Moov Money ou Wave : on te répond sur WhatsApp avec le numéro de paiement, puis on t\'envoie tes fichiers et ton contrat.',
    'cart.added': 'Ajouté au panier', 'cart.need': 'Indique ton nom et ton email.', 'cart.nopaypal': 'PayPal bientôt disponible.',
    'msg.order': 'Bonjour obiscrazy, je souhaite acheter :', 'msg.total': 'Total', 'msg.name': 'Nom', 'msg.email': 'Email', 'msg.pay': 'Paiement',
    'msg.custom': 'Bonjour obiscrazy, demande de beat sur mesure :', 'msg.studio': 'Bonjour obiscrazy, je veux réserver une session studio :',
    'msg.nopreview': 'Preview indisponible'
  },
  en: {
    'nav.beats': 'Beats', 'nav.licences': 'Licenses', 'nav.custom': 'Custom', 'nav.studio': 'Studio', 'nav.contact': 'Contact',
    'hero.eyebrow': 'Premium beats · Instant licensing',
    'hero.title': 'The crazy<br><span class="gold-text">beatmaker.</span>',
    'hero.sub': 'Afrobeats, Drill, Trap, Hoodtrap and Hip-hop. Pay with Orange Money, Moov Money, Wave, card or PayPal.',
    'hero.cta1': 'Listen to beats', 'hero.cta2': 'See licenses',
    'hero.stat1': 'Beats', 'hero.stat2': 'Genres', 'hero.stat3': 'Licenses',
    'feat.label': 'Featured',
    'store.eyebrow': 'Catalog', 'store.title': 'All beats', 'store.search': 'Search a beat, a style, a type beat…',
    'store.empty': 'No beats found.', 'store.all': 'All', 'store.from': 'from', 'store.licence': 'License',
    'lic.eyebrow': 'Licenses', 'lic.title': 'Pick your rights',
    'lic.sub': 'One-time payment. Files and contract sent as soon as payment is confirmed.',
    'lic.once': 'one-time', 'lic.cta': 'Pick a beat', 'lic.best': 'Exclusive',
    'custom.eyebrow': 'Custom', 'custom.title': 'A beat made for you',
    'custom.sub': 'Describe your project: we build a unique instrumental that fits you.',
    'custom.name': 'Artist name', 'custom.genre': 'Style', 'custom.refs': 'References (artists, songs)',
    'custom.budget': 'Budget (FCFA)', 'custom.deadline': 'Deadline', 'custom.msg': 'Your idea', 'custom.send': 'Send request',
    'studio.eyebrow': 'Studio', 'studio.title': 'Book your session',
    'studio.sub': 'Recording, mixing, mastering or live production. Pick your slot, we confirm on WhatsApp.',
    'studio.name': 'Artist name', 'studio.phone': 'Phone', 'studio.date': 'Date', 'studio.time': 'Time',
    'studio.duration': 'Duration', 'studio.type': 'Session type', 'studio.t1': 'Recording', 'studio.t2': 'Mix & mastering',
    'studio.t3': 'Live production', 'studio.notes': 'Details', 'studio.send': 'Book',
    'footer.tag': 'Premium beats for serious artists.', 'footer.rights': 'All rights reserved.',
    'player.buy': 'Buy', 'modal.eyebrow': 'Choose a license', 'modal.add': 'Add to cart',
    'cart.title': 'Cart', 'cart.empty': 'Your cart is empty.', 'cart.total': 'Total', 'cart.remove': 'Remove',
    'cart.name': 'Artist name', 'cart.email': 'Email (to receive your files)',
    'cart.momo': 'Pay with Mobile Money (WhatsApp)', 'cart.paypal': 'Pay with PayPal',
    'cart.note': 'Orange Money, Moov Money or Wave: we reply on WhatsApp with the payment number, then send your files and contract.',
    'cart.added': 'Added to cart', 'cart.need': 'Enter your name and email.', 'cart.nopaypal': 'PayPal coming soon.',
    'msg.order': 'Hello obiscrazy, I want to buy:', 'msg.total': 'Total', 'msg.name': 'Name', 'msg.email': 'Email', 'msg.pay': 'Payment',
    'msg.custom': 'Hello obiscrazy, custom beat request:', 'msg.studio': 'Hello obiscrazy, I want to book a studio session:',
    'msg.nopreview': 'Preview unavailable'
  }
};

function detectCurrency() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  if (/Bamako|Dakar|Abidjan|Ouagadougou|Niamey|Lome|Porto-Novo|Bissau/.test(tz)) return 'XOF';
  if (tz.startsWith('Europe/')) return 'EUR';
  if (tz.startsWith('Africa/')) return 'XOF';
  return 'USD';
}

const state = {
  beats: [], site: {}, list: [], queue: [], qi: -1, feat: null, pick: null, pickLic: 'premium',
  lang: localStorage.getItem('oc_lang') || 'fr',
  currency: localStorage.getItem('oc_cur') || detectCurrency(),
  genre: 'all', q: '',
  cart: JSON.parse(localStorage.getItem('oc_cart') || '[]')
};

const t = k => I18N[state.lang]?.[k] ?? I18N.fr[k] ?? k;
const price = id => Number(state.site.prices?.[id] || 0);
const licName = id => LICENCES.find(l => l.id === id)?.[state.lang].name || id;
const total = () => state.cart.reduce((s, it) => s + price(it.lic), 0);
const fcfa = n => Math.round(n).toLocaleString('fr-FR') + ' FCFA';
const meta = b => [b.bpm ? b.bpm + ' BPM' : '', b.key, b.genre].filter(Boolean).map(esc).join(' · ');
const currentBeat = () => state.queue[state.qi];
const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';

function money(xof) {
  const r = state.site.rates || {};
  const loc = state.lang === 'fr' ? 'fr-FR' : 'en-US';
  if (state.currency === 'EUR') return (xof / (r.EUR || 655.957)).toLocaleString(loc, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  if (state.currency === 'USD') return (xof / (r.USD || 570)).toLocaleString(loc, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  return fcfa(xof);
}

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200);
}

function wa(text) {
  const num = String(state.site.whatsapp || '').replace(/\D/g, '');
  window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank');
}

/* ---------- Rendu ---------- */
function applyI18n() {
  document.documentElement.lang = state.lang;
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('[data-i18n-html]').forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
  $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $('#langBtn').textContent = state.lang === 'fr' ? 'EN' : 'FR';
}

function renderGenres() {
  $('#genres').innerHTML = ['all', ...GENRES].map(g =>
    `<button class="chip ${state.genre === g ? 'is-active' : ''}" data-genre="${esc(g)}">${g === 'all' ? t('store.all') : esc(g)}</button>`
  ).join('');
}

function filtered() {
  const q = state.q.trim().toLowerCase();
  return state.beats.filter(b =>
    (state.genre === 'all' || b.genre === state.genre) &&
    (!q || [b.title, b.genre, b.key, ...(b.tags || [])].join(' ').toLowerCase().includes(q)));
}

function renderTracks() {
  state.list = filtered();
  const cur = currentBeat();
  $('#tracklist').innerHTML = state.list.map((b, i) => `
    <div class="track ${cur === b ? 'is-playing' : ''}">
      <button class="track__play" data-play="${i}" aria-label="Play">${cur === b && !audio.paused ? ICON.pause : ICON.play}</button>
      <img class="track__cover" src="${esc(b.cover || FALLBACK)}" alt="" loading="lazy" onerror="this.src='${FALLBACK}'">
      <div class="track__info"><strong>${esc(b.title)}</strong><span>${meta(b)}</span></div>
      <div class="track__tags">${(b.tags || []).slice(0, 3).map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
      <div class="track__price"><small>${t('store.from')}</small> ${money(price('basic'))}</div>
      <button class="btn btn--dark btn--sm" data-lic="${i}">+ ${t('store.licence')}</button>
    </div>`).join('');
  $('#empty').hidden = state.list.length > 0;
}

function renderFeatured() {
  const b = state.feat = state.beats.find(x => x.featured) || state.beats[0];
  const el = $('#featured');
  if (!b) { el.innerHTML = ''; return; }
  const playing = currentBeat() === b && !audio.paused;
  el.innerHTML = `
    <div class="feature">
      <div class="feature__art">
        <img src="${esc(b.cover || FALLBACK)}" alt="" onerror="this.src='${FALLBACK}'">
        <button class="feature__play" id="featPlay" aria-label="Play">${playing ? ICON.pause : ICON.play}</button>
      </div>
      <div class="feature__body">
        <p class="eyebrow">${t('feat.label')}</p>
        <h3>${esc(b.title)}</h3>
        <p class="muted">${meta(b)}</p>
        <button class="btn btn--gold btn--sm" id="featBuy">${t('player.buy')} · ${money(price('basic'))}</button>
      </div>
    </div>`;
  $('#featPlay').onclick = () => playBeat(b, state.beats);
  $('#featBuy').onclick = () => openLicence(b);
}

function renderLicences() {
  $('#licenceGrid').innerHTML = LICENCES.map(l => {
    const L = l[state.lang];
    return `<article class="lic ${l.exclusive ? 'lic--ex' : ''}">
      ${l.exclusive ? `<span class="lic__badge">${t('lic.best')}</span>` : ''}
      <h3>${L.name}</h3>
      <p class="lic__price">${money(price(l.id))}</p>
      <p class="muted small">${t('lic.once')}</p>
      <ul>${L.feats.map(f => `<li>${f}</li>`).join('')}</ul>
      <a href="#beats" class="btn ${l.exclusive ? 'btn--gold' : 'btn--ghost'} btn--block">${t('lic.cta')}</a>
    </article>`;
  }).join('');
}

function renderCart() {
  $('#cartCount').textContent = state.cart.length;
  $('#cartItems').innerHTML = state.cart.length ? state.cart.map((it, i) => `
    <div class="cart-item">
      <img src="${esc(it.cover || FALLBACK)}" alt="" onerror="this.src='${FALLBACK}'">
      <div><strong>${esc(it.title)}</strong><span>${licName(it.lic)}</span></div>
      <b>${money(price(it.lic))}</b>
      <button class="x" data-remove="${i}" aria-label="${t('cart.remove')}">×</button>
    </div>`).join('') : `<p class="muted">${t('cart.empty')}</p>`;
  $('#cartTotal').textContent = money(total());
  localStorage.setItem('oc_cart', JSON.stringify(state.cart));
}

function renderFooter() {
  const s = state.site;
  const num = String(s.whatsapp || '').replace(/\D/g, '');
  const links = [
    ['Instagram', s.instagram], ['YouTube', s.youtube], ['TikTok', s.tiktok],
    ['WhatsApp', num ? `https://wa.me/${num}` : ''], ['Email', s.email ? `mailto:${s.email}` : '']
  ].filter(x => x[1]);
  $('#socials').innerHTML = links.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`).join('');
  $('#year').textContent = new Date().getFullYear();
}

function renderAll() {
  applyI18n(); renderGenres(); renderTracks(); renderFeatured(); renderLicences(); renderCart(); renderFooter();
  $('#statBeats').textContent = state.beats.length;
}

/* ---------- Lecteur ---------- */
function loadAndPlay(b) {
  if (!b.preview) { toast(t('msg.nopreview')); return; }
  audio.src = b.preview;
  audio.play().catch(() => {});
  $('#player').hidden = false;
  document.body.classList.add('has-player');
  $('#pCover').src = b.cover || FALLBACK;
  $('#pTitle').textContent = b.title;
  $('#pMeta').textContent = [b.bpm ? b.bpm + ' BPM' : '', b.genre].filter(Boolean).join(' · ');
}

function playBeat(b, list) {
  if (currentBeat() === b) { audio.paused ? audio.play() : audio.pause(); return; }
  state.queue = list; state.qi = list.indexOf(b);
  loadAndPlay(b);
}

function step(d) {
  if (!state.queue.length) return;
  state.qi = (state.qi + d + state.queue.length) % state.queue.length;
  loadAndPlay(state.queue[state.qi]);
}

function syncIcons() {
  $('#pPlay').innerHTML = audio.paused ? ICON.play : ICON.pause;
  const fp = $('#featPlay');
  if (fp) fp.innerHTML = currentBeat() === state.feat && !audio.paused ? ICON.pause : ICON.play;
  renderTracks();
}

/* ---------- Couches (modale, panier) ---------- */
function openLayer(sel) {
  const el = $(sel);
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}
function closeLayer(el) {
  el.classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => { el.hidden = true; }, 250);
}

function openLicence(b) {
  if (!b) return;
  state.pick = b; state.pickLic = 'premium';
  $('#mCover').src = b.cover || FALLBACK;
  $('#mTitle').textContent = b.title;
  renderLicOptions();
  openLayer('#licModal');
}

function renderLicOptions() {
  $('#mOptions').innerHTML = LICENCES.map(l => {
    const L = l[state.lang], on = state.pickLic === l.id;
    return `<label class="lic-opt ${on ? 'is-active' : ''}">
      <input type="radio" name="lic" value="${l.id}" ${on ? 'checked' : ''}>
      <div><strong>${L.name}</strong><span>${L.feats.slice(0, 2).join(' · ')}</span></div>
      <b>${money(price(l.id))}</b>
    </label>`;
  }).join('');
}

/* ---------- Commande ---------- */
function orderText(method) {
  const lines = state.cart.map(it => `• ${it.title} — ${licName(it.lic)} — ${fcfa(price(it.lic))}`);
  return [t('msg.order'), ...lines, '',
    `${t('msg.total')} : ${fcfa(total())}`,
    `${t('msg.name')} : ${$('#cName').value.trim()}`,
    `${t('msg.email')} : ${$('#cEmail').value.trim()}`,
    `${t('msg.pay')} : ${method}`].join('\n');
}

function checkCart() {
  if (!state.cart.length) return false;
  if (!$('#cName').value.trim() || !$('#cEmail').value.trim()) { toast(t('cart.need')); return false; }
  return true;
}

function formToWhatsApp(form, intro, prefix) {
  const lines = [...new FormData(form).entries()].filter(([, v]) => String(v).trim()).map(([k, v]) => `${t(prefix + k)} : ${v}`);
  wa([intro, ...lines].join('\n'));
}

/* ---------- Événements ---------- */
function bind() {
  $('#langBtn').onclick = () => {
    state.lang = state.lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('oc_lang', state.lang);
    renderAll();
  };
  $('#currency').onchange = e => {
    state.currency = e.target.value;
    localStorage.setItem('oc_cur', state.currency);
    renderAll();
  };
  $('#search').oninput = e => { state.q = e.target.value; renderTracks(); };
  $('#genres').onclick = e => {
    const g = e.target.closest('[data-genre]');
    if (g) { state.genre = g.dataset.genre; renderGenres(); renderTracks(); }
  };
  $('#tracklist').onclick = e => {
    const p = e.target.closest('[data-play]'), l = e.target.closest('[data-lic]');
    if (p) playBeat(state.list[+p.dataset.play], state.list);
    if (l) openLicence(state.list[+l.dataset.lic]);
  };

  $('#pPlay').onclick = () => audio.paused ? audio.play() : audio.pause();
  $('#pPrev').onclick = () => step(-1);
  $('#pNext').onclick = () => step(1);
  $('#pBuy').onclick = () => openLicence(currentBeat());
  $('#pBar').onclick = e => {
    const r = e.currentTarget.getBoundingClientRect();
    if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  };
  audio.addEventListener('play', syncIcons);
  audio.addEventListener('pause', syncIcons);
  audio.addEventListener('ended', () => step(1));
  audio.addEventListener('timeupdate', () => {
    $('#pFill').style.width = (audio.duration ? (audio.currentTime / audio.duration) * 100 : 0) + '%';
    $('#pCur').textContent = fmt(audio.currentTime);
    $('#pDur').textContent = fmt(audio.duration);
  });

  $('#mOptions').onchange = e => { state.pickLic = e.target.value; renderLicOptions(); };
  $('#mAdd').onclick = () => {
    const b = state.pick;
    state.cart = state.cart.filter(x => x.title !== b.title);
    state.cart.push({ title: b.title, cover: b.cover, lic: state.pickLic });
    renderCart();
    closeLayer($('#licModal'));
    toast(t('cart.added'));
    setTimeout(() => openLayer('#cart'), 260);
  };

  $('#cartBtn').onclick = () => openLayer('#cart');
  $('#cartItems').onclick = e => {
    const r = e.target.closest('[data-remove]');
    if (r) { state.cart.splice(+r.dataset.remove, 1); renderCart(); }
  };
  $('#payMomo').onclick = () => { if (checkCart()) wa(orderText('Mobile Money (Orange / Moov / Wave)')); };
  $('#payPaypal').onclick = () => {
    if (!checkCart()) return;
    const user = state.site.paypal;
    if (!user) { toast(t('cart.nopaypal')); return; }
    const eur = (total() / (state.site.rates?.EUR || 655.957)).toFixed(2);
    window.open(`https://www.paypal.me/${encodeURIComponent(user)}/${eur}EUR`, '_blank');
    setTimeout(() => wa(orderText(`PayPal (${eur} €)`)), 400);
  };

  $$('.layer').forEach(layer => layer.addEventListener('click', e => {
    if (e.target === layer || e.target.closest('[data-close]')) closeLayer(layer);
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') $$('.layer.is-open').forEach(closeLayer);
  });

  $('#burger').onclick = () => $('#nav').classList.toggle('is-open');
  $$('#nav a').forEach(a => a.onclick = () => $('#nav').classList.remove('is-open'));

  $('#customForm').onsubmit = e => { e.preventDefault(); formToWhatsApp(e.target, t('msg.custom'), 'custom.'); };
  $('#studioForm').onsubmit = e => { e.preventDefault(); formToWhatsApp(e.target, t('msg.studio'), 'studio.'); };
}

/* ---------- Démarrage ---------- */
async function init() {
  try {
    const [beats, site] = await Promise.all([
      fetch('data/beats.json', { cache: 'no-cache' }).then(r => r.json()),
      fetch('data/site.json', { cache: 'no-cache' }).then(r => r.json())
    ]);
    state.beats = (Array.isArray(beats) ? beats : [])
      .filter(b => b && b.title && !b.sold)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    state.site = site || {};
  } catch (err) {
    console.error('Impossible de charger les données', err);
  }
  $('#currency').value = state.currency;
  bind();
  renderAll();
  syncIcons();
}
init();
