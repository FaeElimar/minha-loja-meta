const fs = require('fs');
const path = require('path');

const produtos = [
  {
    id: 'NAT-001',
    title: 'Presépio Sagrada Família - Miniatura 3D Colecionável',
    description: 'Presépio exclusivo em 3D, finalizado com pintura em aerografia e detalhes em dourado. Peça resistente, ideal para decoração natalina de destaque.',
    availability: 'in stock',
    condition: 'new',
    price: '280.00 BRL',
    link: 'https://seusite.com.br/produto/nat-001',
    image_link: 'https://seusite.com.br/imagens/nat-001.jpg',
    brand: 'Studio Elimar'
  },
  {
    id: 'NAT-002',
    title: 'Kit Bolas de Natal com Caligrafia em Nanquim',
    description: 'Conjunto de 4 bolas de Natal personalizadas à mão com bico de pena e nanquim. Letras clássicas e desenhos minimalistas para uma árvore sofisticada.',
    availability: 'in stock',
    condition: 'new',
    price: '150.00 BRL',
    link: 'https://seusite.com.br/produto/nat-002',
    image_link: 'https://seusite.com.br/imagens/nat-002.jpg',
    brand: 'Studio Elimar'
  }
];

let xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Catálogo da Loja</title>
    <link>https://seusite.com.br</link>
    <description>Catálogo de produtos integrado ao Instagram/Facebook</description>
`;

produtos.forEach(p => {
  xml += `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.title}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:availability>${p.availability}</g:availability>
      <g:condition>${p.condition}</g:condition>
      <g:price>${p.price}</g:price>
      <g:link>${p.link}</g:link>
      <g:image_link>${p.image_link}</g:image_link>
      <g:brand><![CDATA[${p.brand}]]></g:brand>
    </item>`;
});

xml += `
  </channel>
</rss>`;

// Salva o arquivo XML dentro da pasta public
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)){
    fs.mkdirSync(publicDir);
}

const caminhoArquivo = path.join(publicDir, 'feed.xml');
fs.writeFileSync(caminhoArquivo, xml);

console.log('✅ Catálogo XML gerado com sucesso em: public/feed.xml');