// Carrega os dados do blog. Posts e certificações são editados pelo painel /admin/
// e ficam em data/posts.json e data/certs.json.
const TEMAS = ['DATAGUARD', 'DBA', 'LINUX', 'ODA', 'KVM', 'OCI', 'PL/SQL', 'RAC', 'RMAN', 'SQL', 'TUNING', 'CERTIFICAÇÃO'];
const CERT_ST = { ok: ['concluída', 'ok'], andamento: ['em preparação', ''], planejada: ['planejada', 'off'] };
const certImg = c => c.img ? `<img src="${c.img}" alt="${c.nome}" title="${c.nome} (${c.exame}) — ${CERT_ST[c.status][0]}" class="emb ${c.status}" loading="lazy">` : `<div class="emb hx ${c.status}" title="${c.nome} (${c.exame}) — ${CERT_ST[c.status][0]}"><b>${c.sigla}</b><span>${c.status === 'ok' ? 'Oracle Certified' : CERT_ST[c.status][0]}</span></div>`;
const hoje = new Date().toISOString().slice(0, 10);
const fmt = d => new Date(d + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
// Rascunhos só aparecem no seu computador (localhost), nunca no site publicado.
const verRascunhos = location.hostname === 'localhost' && new URLSearchParams(location.search).has('rascunhos');

let POSTS = [], CERTS = [], visiveis = [];
const dados = Promise.all(['data/posts.json', 'data/certs.json'].map(u => fetch(u, { cache: 'no-cache' }).then(r => r.json())))
  .then(([p, c]) => {
    POSTS = p.sort((a, b) => b.data.localeCompare(a.data));
    CERTS = c;
    visiveis = POSTS.filter(p => verRascunhos || (!p.rascunho && p.data <= hoje));
  });
