// TEMPORAIRE : diagnostic des clés (n'affiche aucune clé). À supprimer ensuite.
const info = v => {
  const s = String(v || '');
  return { defini: !!s, longueur: s.length, longueur_sans_espaces_aux_bords: s.trim().length, espace_ou_saut_de_ligne_dedans: /\s/.test(s.trim()), commence_par_test_ou_live: /^(test|live)_/.test(s) };
};
export async function onRequestGet({ env }) {
  const body = {
    mode: env.PD_MODE || 'test (par defaut)',
    PD_MASTER_KEY: info(env.PD_MASTER_KEY),
    PD_PRIVATE_KEY: { ...info(env.PD_PRIVATE_KEY), debut: String(env.PD_PRIVATE_KEY || '').slice(0, 13) },
    PD_TOKEN: info(env.PD_TOKEN)
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json' } });
}
