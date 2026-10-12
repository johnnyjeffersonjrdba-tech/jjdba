// =====================================================================
// POSTS DO BLOG
// Use a página "Escrever" (escrever.html) para montar um post e gerar o
// bloco pronto. Depois cole o bloco no topo da lista POSTS e salve.
//
// tipo:      'estudo'  -> aba Estudos (material de certificação)
//            'pratica' -> aba Na prática (projetos reais do trabalho)
// temas:     nomes da lista TEMAS (barra do topo)
// serie/parte: opcional, agrupa posts em um guia lido em ordem
// rascunho:  true -> não aparece no site (veja em blog.html?rascunhos)
// data:      AAAA-MM-DD; data futura = publicação agendada
// md:        conteúdo em Markdown
// =====================================================================
const TEMAS = ['DATAGUARD', 'DBA', 'LINUX', 'ODA', 'KVM', 'OCI', 'PL/SQL', 'RAC', 'RMAN', 'SQL', 'TUNING', 'CERTIFICAÇÃO'];

// Certificações. status: 'ok' (concluída) | 'andamento' | 'planejada'
// img: link da imagem do emblema (copie de MyLearn/CertView > seu badge > imagem). Sem img, aparece um hexágono.
const CERTS = [
  { sigla: 'OCI', nome: 'OCI Foundations Associate', exame: '1Z0-1085-26', data: 'ago/2026', status: 'ok' },
  { sigla: 'AAI', nome: 'Agentic AI Foundations Associate', exame: '1Z0-1157-26', data: 'ago/2026', status: 'ok' },
  { sigla: 'ARC', nome: 'OCI Architect Associate', exame: '1Z0-1072-26', data: 'set/2026', status: 'ok' },
  { sigla: 'OAI', nome: 'OCI AI Foundations Associate', exame: '1Z0-1122-26', data: 'set/2026', status: 'ok' },
  { sigla: 'ADB', nome: 'Oracle AI Database Foundations Associate', exame: '1Z0-1195-26', data: 'out/2026', status: 'ok' },
  { sigla: '082', nome: 'Oracle Database Administration I', exame: '1Z0-082', data: '18/11/2026', status: 'andamento', img: 'https://images.credly.com/size/340x340/images/3a265297-cfae-46aa-a4fe-9ebbb1cb957d/07_Oracle_Database_Admin_Professional__1_.png', obs: '082 + 083 = OCP Database Administration' },
  { sigla: 'PMI', nome: 'Certified Associate in Project Management', exame: 'PMI · CAPM', data: 'dez/2026', status: 'planejada' },
  { sigla: '083', nome: 'Oracle Database Administration II', exame: '1Z0-083', data: 'jan/2027', status: 'planejada', img: 'https://images.credly.com/size/340x340/images/3a265297-cfae-46aa-a4fe-9ebbb1cb957d/07_Oracle_Database_Admin_Professional__1_.png' },
  { sigla: '078', nome: 'RAC, ASM and Grid Infrastructure Administration', exame: '1Z0-078', data: 'mar/2027', status: 'planejada' },
  { sigla: '076', nome: 'Data Guard Administration', exame: '1Z0-076', data: 'mai/2027', status: 'planejada' },
  { sigla: '116', nome: 'Database Security Administration', exame: '1Z0-116', data: 'nov/2027', status: 'planejada' }
];
const CERT_ST = { ok: ['concluída', 'ok'], andamento: ['em preparação', ''], planejada: ['planejada', 'off'] };
const certImg = c => c.img ? `<img src="${c.img}" alt="${c.nome}" title="${c.nome} (${c.exame}) — ${CERT_ST[c.status][0]}" class="emb ${c.status}" loading="lazy">` : `<div class="emb hx ${c.status}" title="${c.nome} (${c.exame}) — ${CERT_ST[c.status][0]}"><b>${c.sigla}</b><span>${c.status === 'ok' ? 'Oracle Certified' : CERT_ST[c.status][0]}</span></div>`;
const certBadge = c => `<div class="badge"><div class="h ${CERT_ST[c.status][1]}">${c.sigla}</div><div><b>${c.nome}</b><br><span class="meta">${c.exame} · ${c.status === 'ok' ? '✔ ' : ''}${CERT_ST[c.status][0]} · ${c.data}</span></div></div>`;

const POSTS = [
  {
    id: 'migracao-oda-para-kvm-dataguard', tipo: 'pratica', rascunho: true,
    temas: ['ODA', 'KVM', 'DATAGUARD', 'LINUX'], data: '2026-10-19',
    titulo: 'Migrando bases não produtivas e Data Guard de um ODA para KVM',
    resumo: 'Do zero: preparação do ambiente KVM, instalação do Oracle, migração das bases não produtivas e recriação do Data Guard. O passo a passo e o que aprendi.',
    md: `> RASCUNHO — preencha cada seção depois de concluir o projeto.

## Cenário
- Origem: (modelo do ODA, versão, nº de bases)
- Destino: (KVM, SO, CPU/memória/storage)
- Objetivo e janela disponível

## Arquitetura antes × depois

## Passo a passo
### 1. Preparação do servidor KVM
\`\`\`bash
# comandos usados
\`\`\`
### 2. Instalação do Oracle Database
### 3. Migração das bases não produtivas
### 4. Recriação do Data Guard
### 5. Validação

## Problemas que encontrei e como resolvi

## Lições aprendidas

## Checklist para quem for fazer o mesmo
- [ ] item`
  },
  {
    id: 'arquitetura-oracle-instancia', tipo: 'estudo', rascunho: true, serie: '1Z0-082', parte: 1,
    temas: ['DBA', 'CERTIFICAÇÃO'], data: '2026-10-19',
    titulo: 'Arquitetura Oracle: instância, SGA, PGA e startup',
    resumo: '(escreva o resumo que aparece na lista)',
    md: `> RASCUNHO — estrutura sugerida para posts de estudo. Substitua pelo seu texto.

## O que você vai aprender

## Conceitos (com minhas palavras)

## Laboratório
\`\`\`sql
-- comandos que executei
\`\`\`

## Pegadinhas de prova

## Inglês da prova
| Termo | Significado |
|---|---|
| | |

## Resumo em 5 linhas`
  }
];

const hoje = new Date().toISOString().slice(0, 10);
const fmt = d => new Date(d + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
const verRascunhos = new URLSearchParams(location.search).has('rascunhos');
const visiveis = POSTS.filter(p => verRascunhos || (!p.rascunho && p.data <= hoje));
