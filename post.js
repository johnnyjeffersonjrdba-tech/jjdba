// Comportamento da página de um post. Funciona de dois jeitos:
// 1) página estática gerada (posts/<id>.html): o artigo já vem no HTML (article[data-id]);
// 2) link antigo post.html?id=<id>: no site publicado redireciona para a página estática;
//    no seu computador monta o artigo a partir de data/posts.json (inclusive rascunhos).
const art = document.getElementById('a');
const idPost = art.dataset.id || qs.get('id');

if (!art.dataset.id && idPost && location.hostname.endsWith('github.io')) {
  location.replace('posts/' + encodeURIComponent(idPost) + '.html');
}

dados.then(() => {
  const p = POSTS.find(x => x.id === idPost && (verRascunhos || art.dataset.id || (!x.rascunho && x.data <= hoje)));
  if (!art.dataset.id) {
    art.innerHTML = p
      ? `<span class="tag">${p.tipo === 'pratica' ? 'Na prática' : 'Estudo'}</span><span class="meta">${fmt(p.data)}<span id="visitas" hidden data-fmt=" · 👁 {n} visualizações"></span></span><h1>${p.titulo}</h1>${p.capa ? `<img class="capa-post" src="${p.capa}" alt="">` : ''}${p.temas.map(t => `<span class="chip">${t}</span>`).join('')}${marked.parse(p.md || '')}`
      : '<h1>Post não encontrado</h1>';
    if (p) document.title = p.titulo + ' · JJ DBA';
  }
  // tópicos oficiais do exame cobertos pelo post (lidos das marcações de cada seção)
  const tops = [...new Set([...document.querySelectorAll('article .topico-exame')].map(e => e.textContent.trim()))];
  if (tops.length && !document.querySelector('.topicos-post'))
    art.querySelector('h1').insertAdjacentHTML('afterend', `<div class="topicos-post"><span>Exam topics</span>${tops.map(t => `<i>${t}</i>`).join('')}</div>`);
  mostrarVisitas(document.getElementById('visitas'));
  document.querySelectorAll('article pre').forEach(pre => {
    const code = pre.querySelector('code'); const lang = (code && (code.className.match(/language-(\w+)/) || [])[1]) || '';
    if (lang) pre.insertAdjacentHTML('afterbegin', `<span class="pre-rot">${lang}</span>`);
    const b = document.createElement('button'); b.className = 'copiar'; b.type = 'button'; b.textContent = 'Copiar';
    b.onclick = async () => { const t = (code || pre).innerText.replace(/\n$/, ''); try { await navigator.clipboard.writeText(t); } catch (e) { const r = document.createRange(); r.selectNodeContents(code || pre); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand('copy'); getSelection().removeAllRanges(); } b.textContent = 'Copiado ✓'; b.classList.add('ok'); setTimeout(() => { b.textContent = 'Copiar'; b.classList.remove('ok'); }, 1800); };
    pre.appendChild(b);
  });
});
