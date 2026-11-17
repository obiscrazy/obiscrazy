// functions/api/confirm.js : vérifie auprès de PayDunya qu'un paiement est bien confirmé
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestGet({ request, env }) {
  const token = new URL(request.url).searchParams.get('token') || '';
  if (!/^[\w-]{5,80}$/.test(token)) return json({ error: 'bad_token' }, 400);
  if (!env.PD_MASTER_KEY || !env.PD_PRIVATE_KEY || !env.PD_TOKEN) return json({ error: 'config' }, 500);
  const base = env.PD_MODE === 'live' ? 'https://app.paydunya.com/api/v1' : 'https://app.paydunya.com/sandbox-api/v1';
  const res = await fetch(`${base}/checkout-invoice/confirm/${token}`, {
    headers: {
      'PAYDUNYA-MASTER-KEY': env.PD_MASTER_KEY,
      'PAYDUNYA-PRIVATE-KEY': env.PD_PRIVATE_KEY,
      'PAYDUNYA-TOKEN': env.PD_TOKEN
    }
  });
  const d = await res.json().catch(() => ({}));
  return json({ status: d.status || 'unknown', name: d.custom_data?.name || '', order: d.custom_data?.order || '' });
}
