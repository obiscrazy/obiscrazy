// functions/api/create-invoice.js : crée la facture PayDunya (prix relus côté serveur)
const LIC = { basic: 'Basic Lease', premium: 'Premium Lease', unlimited: 'Unlimited Lease' };
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const load = async (env, req, path) => (await env.ASSETS.fetch(new Request(new URL(path, req.url)))).json();

export async function onRequestPost(ctx) {
  try { return await handle(ctx); }
  catch (e) { console.error(e); return json({ error: 'server: ' + String(e.message || e).slice(0, 60) }, 500); }
}

async function handle({ request, env }) {
  if (!env.PD_MASTER_KEY || !env.PD_PRIVATE_KEY || !env.PD_TOKEN) return json({ error: 'config' }, 500);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_request' }, 400); }
  const name = String(body.name || '').trim().slice(0, 80);
  const email = String(body.email || '').trim().slice(0, 120);
  const items = Array.isArray(body.items) ? body.items.slice(0, 10) : [];
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !items.length) return json({ error: 'bad_request' }, 400);

  const [site, beats] = await Promise.all([load(env, request, '/data/site.json'), load(env, request, '/data/beats.json')]);
  const lines = [], seen = new Set();
  let total = 0;
  for (const it of items) {
    const beat = beats.find(b => b && b.title === it.title && !b.sold);
    const amount = Number(site.prices?.[it.lic]);
    // Exclusive absente de LIC : jamais de paiement direct
    if (!beat || !LIC[it.lic] || !(amount > 0) || seen.has(beat.title)) return json({ error: 'invalid_item' }, 400);
    seen.add(beat.title);
    total += amount;
    lines.push({ title: beat.title, lic: it.lic, amount });
  }

  const invoiceItems = {};
  lines.forEach((l, i) => {
    invoiceItems['item_' + i] = { name: `${l.title} - ${LIC[l.lic]}`, quantity: 1, unit_price: String(l.amount), total_price: String(l.amount), description: LIC[l.lic] };
  });
  const origin = new URL(request.url).origin;
  const base = env.PD_MODE === 'live' ? 'https://app.paydunya.com/api/v1' : 'https://app.paydunya.com/sandbox-api/v1';

  const res = await fetch(base + '/checkout-invoice/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'PAYDUNYA-MASTER-KEY': env.PD_MASTER_KEY.trim(),
      'PAYDUNYA-PRIVATE-KEY': env.PD_PRIVATE_KEY.trim(),
      'PAYDUNYA-TOKEN': env.PD_TOKEN.trim()
    },
    body: JSON.stringify({
      invoice: { items: invoiceItems, total_amount: total, description: 'Commande obiscrazy' },
      store: { name: 'obiscrazy' },
      actions: { return_url: origin + '/merci.html', cancel_url: origin + '/#beats' },
      custom_data: { name, email, order: lines.map(l => `${l.title} (${l.lic})`).join(', ') }
    })
  });
  const data = await res.json().catch(() => ({}));
  if (data.response_code !== '00' || !data.response_text) {
    console.error('PayDunya error', data.response_code, data.response_text);
    return json({ error: 'provider ' + data.response_code + ' ' + String(data.response_text || '').slice(0, 60) }, 502);
  }
  return json({ url: data.response_text, token: data.token });
}
