// Cabeçalho e rodapé compartilhados
document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"><link rel="icon" href="img/logo.svg">');
const qs = new URLSearchParams(location.search);
const pag = location.pathname.split('/').pop() || 'index.html';
const here = pag + (qs.get('tipo') ? '?tipo=' + qs.get('tipo') : '');
const links = [['blog.html?tipo=estudo', '~/estudos'], ['blog.html?tipo=pratica', '~/na-pratica'], ['temas.html', '~/temas'], ['certificacoes.html', '~/certificacoes'], ['sobre.html', '~/sobre']];
document.body.insertAdjacentHTML('afterbegin', `<header class="top"><div class="wrap wide"><nav>
<a class="brand" href="index.html"><img src="img/logo.svg" alt="JJ DBA"></a>
${links.map(([h, t]) => `<a href="${h}" class="${h === here ? 'on' : ''}">${t}</a>`).join('')}</nav></div></header>`);
document.body.insertAdjacentHTML('beforeend', `<footer><div class="wrap wide" style="display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between">
<span>© 2026 jj_dba · Johnny Jefferson Jr.</span>
<span><a href="blog.html">posts</a> · <a href="https://www.linkedin.com/in/johnny-jeffersonjr/">linkedin</a></span></div></footer>`);
