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
    // No site público aparecem só as certificações concluídas; as demais ficam visíveis apenas no /admin.
    CERTS = c.filter(x => x.status === 'ok');
    visiveis = POSTS.filter(p => verRascunhos || (!p.rascunho && p.data <= hoje));
  });

// Cartão de post (imagem + temas + título + data + resumo). Sem capa, gera uma automática.
const capaAuto = p => `<div class="capa auto"><span class="sm">${p.tipo === 'pratica' ? '~/na-pratica' : '~/estudos'}</span><b>${p.titulo}</b><span class="sm">$ jj_dba</span></div>`;
// Endereço do post: página estática gerada na publicação (posts/<id>.html).
const urlPost = id => 'posts/' + encodeURIComponent(id) + '.html';
const cardPost = p => `<a class="pcard" href="${urlPost(p.id)}">
  <div class="pimg">${p.capa ? `<img src="${p.capa}" alt="" loading="lazy">` : capaAuto(p)}<span class="ptemas">${p.temas.slice(0, 2).join(', ')}</span></div>
  <div class="ptxt"><h3>${p.titulo}</h3><span class="meta">${fmt(p.data)}${p.rascunho ? ' · <b style="color:#ffb02e">RASCUNHO</b>' : ''}</span><p>${p.resumo}</p></div></a>`;

// ---------- Contador de visualizações (GoatCounter, sem cookies) ----------
const GOATCOUNTER = 'jjdba';   // código do site em goatcounter.com
const gcPath = () => {
  const id = new URLSearchParams(location.search).get('id');
  const est = location.pathname.match(/\/posts\/([^/]+)\.html$/);
  if (est) return '/post/' + decodeURIComponent(est[1]);
  return location.pathname.endsWith('post.html') && id ? '/post/' + id : (location.pathname.replace(/^\/jjdba/, '').replace(/index\.html$/, '') || '/');
};
const contarAqui = location.hostname.endsWith('github.io');   // não conta acessos do seu computador
if (contarAqui) {
  window.goatcounter = { path: gcPath };
  const s = document.createElement('script');
  s.async = true; s.src = '//gc.zgo.at/count.js'; s.dataset.goatcounter = `https://${GOATCOUNTER}.goatcounter.com/count`;
  document.head.appendChild(s);
}
// Busca o total de um caminho ('TOTAL' = site inteiro) e escreve em `el`. Se falhar, esconde.
function mostrarVisitas(el, path = gcPath()) {
  if (!el) return;
  const alvo = path === 'TOTAL' ? 'TOTAL' : encodeURIComponent(path);
  // O GoatCounter guarda a resposta por até 4h. Uma data de início (anterior ao blog) que muda a cada
  // 10 minutos gera uma consulta nova, então o número fica no máximo ~10 min atrasado.
  const slot = Math.floor(Date.now() / 6e5) % 3000;
  const inicio = new Date(Date.UTC(2015, 0, 1) + slot * 864e5).toISOString().slice(0, 10);
  fetch(`https://${GOATCOUNTER}.goatcounter.com/counter/${alvo}.json?start=${inicio}`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(j => { el.innerHTML = el.dataset.fmt.replace('{n}', j.count); el.hidden = false; })
    .catch(() => { el.hidden = true; });
}
