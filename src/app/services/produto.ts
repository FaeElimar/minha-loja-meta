import { Injectable } from '@angular/core';

export interface OpcaoProduto {
  label: string;
  price: string;
}

export interface ProdutoMeta {
  id: string;
  title: string;
  description: string;
  availability: string;
  condition: string;
  price: string;
  image_link: string;
  brand: string;
  link?: string;
  cores?: string[];
  opcoes?: OpcaoProduto[];
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private produtos: ProdutoMeta[] = [
    {
      id: 'natal-01',
      title: 'Tigela Formato Árvore de Natal',
      description: 'Tamanho: 18 x 15 x 3 cm',
      availability: 'in stock',
      condition: 'new',
      price: '30.00 BRL',
      image_link: 'imagens/tijelasarvores.jpg',
      brand: 'Coleção Natal',
      opcoes: [
        { label: 'Unidade', price: '30.00 BRL' },
        { label: 'Kit com 3', price: '75.00 BRL' },
        { label: 'Kit com 4', price: '95.00 BRL' },
        { label: 'Kit com 6', price: '120.00 BRL' }
      ],
      cores: ['Branca', 'Vermelha', 'Verde', 'Amarela']
    },
    {
      id: 'natal-02',
      title: 'Porta-Copos de Natal\n(Kit c/ 6 un.)',
      description: 'Conjunto decorativo com 6 porta-copos temáticos de Natal.',
      availability: 'in stock',
      condition: 'new',
      price: '45.00 BRL',
      image_link: 'imagens/portacopos.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-03',
      title: 'Anel de Guardanapo Árvore',
      description: 'Anel de guardanapo formato árvore.',
      availability: 'in stock',
      condition: 'new',
      price: '15.00 BRL',
      image_link: 'imagens/anelguardarvore.jpg',
      brand: 'Coleção Natal',
      opcoes: [
        { label: 'Unidade', price: '15.00 BRL' },
        { label: 'Kit com 4', price: '50.00 BRL' },
        { label: 'Kit com 6', price: '65.00 BRL' }
      ]
    },
    {
      id: 'natal-04',
      title: 'Anel de Guardanapo Papai Noel\n(Modelo 1)',
      description: 'Anel de guardanapo Papai Noel (Modelo 1).',
      availability: 'in stock',
      condition: 'new',
      price: '15.00 BRL',
      image_link: 'imagens/anelguardpn.jpg',
      brand: 'Coleção Natal',
      opcoes: [
        { label: 'Unidade', price: '15.00 BRL' },
        { label: 'Kit com 4', price: '50.00 BRL' },
        { label: 'Kit com 6', price: '65.00 BRL' }
      ]
    },
    {
      id: 'natal-05',
      title: 'Anel de Guardanapo Papai Noel\n(Modelo 2)',
      description: 'Anel de guardanapo Papai Noel (Modelo 2).',
      availability: 'in stock',
      condition: 'new',
      price: '10.00 BRL',
      image_link: 'imagens/anelguardpnum.jpg',
      brand: 'Coleção Natal',
      opcoes: [
        { label: 'Unidade', price: '10.00 BRL' },
        { label: 'Kit com 4', price: '35.00 BRL' },
        { label: 'Kit com 6', price: '50.00 BRL' }
      ]
    },
    {
      id: 'natal-06',
      title: 'Porta Guardanapo Papai Noel',
      description: 'Porta guardanapo de mesa decorativo com tema Papai Noel.',
      availability: 'in stock',
      condition: 'new',
      price: '55.00 BRL',
      image_link: 'imagens/portagusrdpapainoel.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-07',
      title: 'Porta Guardanapo Laço',
      description: 'Porta guardanapo de mesa decorativo com detalhe de laço natalino.',
      availability: 'in stock',
      condition: 'new',
      price: '55.00 BRL',
      image_link: 'imagens/portaguardlaco.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-08',
      title: 'Porta Guardanapo Árvore',
      description: 'Porta guardanapo de mesa em formato de árvore de Natal.',
      availability: 'in stock',
      condition: 'new',
      price: '35.00 BRL',
      image_link: 'imagens/portagusrdarvore.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-09',
      title: 'Casinha de Natal para Montar',
      description: 'Casinha natalina decorativa de montar.',
      availability: 'in stock',
      condition: 'new',
      price: '45.00 BRL',
      image_link: 'imagens/casinhamontar.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-10',
      title: 'Mini Presépio em PLA Madeira\n(3 Peças)',
      description: 'Conjunto com 3 peças em acabamento PLA Madeira.\nTamanhos: 5 x 6 x 5 cm / 5 x 6,5 x 5 cm / 5 x 7,5 x 6 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '55.00 BRL',
      image_link: 'imagens/Mini_Presepio.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-11',
      title: 'Presépio Minimalista Estrela',
      description: 'Presépio minimalista com estrela em PLA Madeira.\nTamanho: 16,5 x 7 x 17 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '85.00 BRL',
      image_link: 'imagens/minipresepest.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-12',
      title: 'Decoração Feliz Natal',
      description: 'Placa decorativa "Feliz Natal" com Papai Noel sentado.\nTamanho: 14 x 14 x 2 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '27.00 BRL',
      image_link: 'imagens/feliznatalpn.jpg',
      brand: 'Coleção Natal',
      cores: ['Amarelo', 'Vermelho', 'Branco', 'Verde']
    },
    {
      id: 'natal-13',
      title: 'Decoração Feliz Natal s/ Papai Noel',
      description: 'Placa decorativa "Feliz Natal".\nTamanho: 14 x 14 x 1,5 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '15.00 BRL',
      image_link: 'imagens/feliznatalspn.jpg',
      brand: 'Coleção Natal',
      cores: ['Amarelo', 'Vermelho', 'Branco', 'Verde']
    },
    {
      id: 'natal-14',
      title: 'Minis Papai Noéis\n(Sentado, em Pé e Deitado)',
      description: 'Modelos: Sentado, em Pé e Deitado.',
      availability: 'in stock',
      condition: 'new',
      price: '15.00 BRL',
      image_link: 'imagens/minispn.jpg',
      brand: 'Coleção Natal',
      opcoes: [
        { label: 'Unitário', price: '15.00 BRL' },
        { label: 'Kit com 3 modelos', price: '35.00 BRL' }
      ]
    },
    {
      id: 'natal-15',
      title: 'Tigela/Taça Papai Noel',
      description: 'Tigela/taça decorativa Papai Noel.',
      availability: 'in stock',
      condition: 'new',
      price: '85.00 BRL',
      image_link: 'imagens/tijelacorpopn.jpg',
      brand: 'Coleção Natal',
      opcoes: [
        { label: '15 x 15 x 12,5 cm', price: '85.00 BRL' },
        { label: '17 x 17 x 14 cm', price: '100.00 BRL' },
        { label: '20 x 20 x 16,7 cm', price: '120.00 BRL' },
        { label: 'Kit 3 peças', price: '240.00 BRL' }
      ]
    },
    {
      id: 'natal-16',
      title: 'Árvore de Natal\nModelo 01',
      description: 'Árvore de Natal decorativa (Modelo 01).',
      availability: 'in stock',
      condition: 'new',
      price: '20.00 BRL',
      image_link: 'imagens/arvoresmum.jpg',
      brand: 'Coleção Natal',
      opcoes: [
        { label: '9,5 x 9 x 13 cm', price: '20.00 BRL' },
        { label: '9,7 x 9,8 x 14,5 cm', price: '22.00 BRL' },
        { label: '11,5 x 11,5 x 17 cm', price: '29.00 BRL' },
        { label: 'Kit 3 Árvores (escolha as cores)', price: '53.00 BRL' }
      ],
      cores: ['Vermelha', 'Verde', 'Amarela', 'Branca']
    },
    {
      id: 'natal-17',
      title: 'Árvore de Natal\nModelo 02 (Kit 2 un.)',
      description: 'Kit com 2 árvores decorativas.\nTamanhos: 7 x 7 x 13 cm e 9 x 9 x 16 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '45.00 BRL',
      image_link: 'imagens/arvoresnatal2.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-18',
      title: 'Árvore de Natal\nModelo 03',
      description: 'Árvore decorativa unitária.\nTamanho: 6 x 6,5 x 15 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '35.00 BRL',
      image_link: 'imagens/arvoresnatal3.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-19',
      title: 'Porta Garrafa Natalino',
      description: 'Suporte decorativo para garrafas de vinho ou espumante.',
      availability: 'in stock',
      condition: 'new',
      price: '115.00 BRL',
      image_link: 'imagens/portagarrafaum.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-20',
      title: 'Enfeite para Árvore de Natal\nModelo 1 (Kit c/ 14 un.)',
      description: 'Kit com 14 unidades na cor branca.\nTamanho médio das peças: 6 x 6,5 x 2 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '35.00 BRL',
      image_link: 'imagens/enfeitearvoreum.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-21',
      title: 'Enfeite para Árvore de Natal\nModelo 2 (Kit c/ 12 un.)',
      description: 'Kit com 12 unidades em 2 cores (Vermelho e Branco).\nTamanho médio das peças: 4,5 x 5,5 x 2,5 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '45.00 BRL',
      image_link: 'imagens/enfeitearvdiversos.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-22',
      title: 'Enfeite para Árvore de Natal\nModelo 3 (Kit c/ 10 un.)',
      description: 'Kit com 10 unidades na cor branca.\nTamanho médio das peças: 5 x 5,5 x 1 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '20.00 BRL',
      image_link: 'imagens/enfeitearvoretres.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-23',
      title: 'Enfeite Laço para Árvore de Natal\nModelo 4',
      description: 'Tamanho: 5 x 7 x 1,7 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '15.00 BRL',
      image_link: 'imagens/enfeitearvorelaco.jpg',
      brand: 'Coleção Natal',
      opcoes: [
        { label: 'Unitário', price: '15.00 BRL' },
        { label: 'Kit com 3 un.', price: '35.00 BRL' }
      ]
    },
    {
      id: 'natal-24',
      title: 'Enfeite para Árvore de Natal Gorrinho\n(Kit c/ 6 un.)',
      description: 'Kit com 6 unidades em 2 cores (Vermelho e Branco).\nTamanho médio das peças: 4 x 4 x 4,5 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '35.00 BRL',
      image_link: 'imagens/minigorropn.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-25',
      title: 'Caixa de Presente Decorativa',
      description: 'Caixa decorativa de Natal.\nTamanho: 10,4 x 10,4 x 9 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '95.00 BRL',
      image_link: 'imagens/embalagemprescaixa.jpg',
      brand: 'Coleção Natal',
      cores: ['Caixa Vermelha c/ Fita Branca', 'Caixa Branca c/ Fita Vermelha']
    },
    {
      id: 'natal-26',
      title: 'Porta Panetone',
      description: 'Porta panetone decorativo de Natal.',
      availability: 'in stock',
      condition: 'new',
      price: '95.00 BRL',
      image_link: 'imagens/portapanetone.jpg',
      brand: 'Coleção Natal',
      cores: ['Caixa Vermelha c/ Fita Branca', 'Caixa Branca c/ Fita Vermelha']
    },
    {
      id: 'natal-27',
      title: 'Bandeja Tira Gostos Decoração Natal',
      description: 'Bandeja decorativa para petiscos.\nTamanho: 21 x 10 x 9,5 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '95.00 BRL',
      image_link: 'imagens/bandeijabranca.jpg',
      brand: 'Coleção Natal',
      cores: ['Branca', 'Vermelha', 'Amarela', 'Verde']
    },
    {
      id: 'natal-28',
      title: 'Bandeja Kit Decoração Natal',
      description: 'Bandeja kit decorativo de Natal.\nTamanho: 24,5 x 15 x 1,5 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '130.00 BRL',
      image_link: 'imagens/kitdecorarvpnrena.jpg',
      brand: 'Coleção Natal',
      cores: ['Branca', 'Vermelha', 'Amarela', 'Verde']
    },
    {
      id: 'natal-29',
      title: 'Mini Rena Estilo Crochê',
      description: 'Miniatura decorativa estilo crochê.\nTamanho: 3,3 x 4,9 x 7,5 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '18.00 BRL',
      image_link: 'imagens/minirena.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-30',
      title: 'Mini Papai Noel Estilo Crochê',
      description: 'Miniatura decorativa estilo crochê.\nTamanho: 3,3 x 4,9 x 7,5 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '18.00 BRL',
      image_link: 'imagens/minipn.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-31',
      title: 'Trenó Papai Noel Decoração',
      description: 'Trenó decorativo de Natal.\nTamanho: 22 x 11 x 11 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '90.00 BRL',
      image_link: 'imagens/treno.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-32',
      title: 'Kit Casinha Papai Noel',
      description: 'Conjunto completo com Casinha, Papai Noel e Árvore.',
      availability: 'in stock',
      condition: 'new',
      price: '65.00 BRL',
      image_link: 'imagens/kitcasinharvpn.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-33',
      title: 'Embalagem Árvore',
      description: 'Embalagem decorativa em formato de árvore.',
      availability: 'in stock',
      condition: 'new',
      price: '20.00 BRL',
      image_link: 'imagens/embalagemarvorekit.jpg',
      brand: 'Coleção Natal',
      opcoes: [
        { label: 'Árvore 03 (13 x 9,5 x 4 cm)', price: '20.00 BRL' },
        { label: 'Árvore 02 (15,5 x 11 x 5,3 cm)', price: '30.00 BRL' },
        { label: 'Árvore 01 (18,5 x 13 x 6 cm)', price: '45.00 BRL' },
        { label: 'Kit 3 un.', price: '65.00 BRL' }
      ]
    },
    {
      id: 'natal-34',
      title: 'Embalagem Gorro Papai Noel',
      description: 'Embalagem decorativa em formato de gorro.\nTamanho: 12,5 x 12,5 x 17 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '65.00 BRL',
      image_link: 'imagens/embalagemgorro.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-35',
      title: 'Embalagem Papai Noel',
      description: 'Embalagem decorativa temática Papai Noel.\nTamanho: 21,5 x 23,5 x 6 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '95.00 BRL',
      image_link: 'imagens/embalagempn.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-36',
      title: 'Porta Talheres Bota Papai Noel',
      description: 'Porta talheres decorativo para mesa posta.\nTamanho: 12 x 11 x 16 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '90.00 BRL',
      image_link: 'imagens/portatalheres.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-37',
      title: 'Enfeite de Árvore Mini Bengalas\n(Kit c/ 12 un.)',
      description: 'Kit com 12 mini bengalas natalinas.\nTamanho: 2,5 x 0,5 x 6 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '30.00 BRL',
      image_link: 'imagens/enfeitearvorebengala.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-38',
      title: 'Enfeite Quebra-Nozes\n(Kit 2 un.)',
      description: 'Par de quebra-nozes decorativos.\nTamanho: 7 x 5 x 21 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '70.00 BRL',
      image_link: 'imagens/quebranozes.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-39',
      title: 'Quebra-Nozes Branco\n(38 cm)',
      description: 'Peça decorativa de destaque em branco.\nAltura: 38 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '140.00 BRL',
      image_link: 'imagens/qubranozesbranco.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-40',
      title: 'Torre Giratória para Doces',
      description: 'Suporte giratório decorativo para doces e petiscos.\nTamanho: 24,3 x 24,3 x 48 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '195.00 BRL',
      image_link: 'imagens/suportedoces.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-41',
      title: 'Bandeja Segmentada para Petiscos',
      description: 'Bandeja com divisórias para petiscos.\nTamanho: 24 x 24 x 2,5 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '85.00 BRL',
      image_link: 'imagens/bandejasegmentada.jpg',
      brand: 'Coleção Natal'
    },
    {
      id: 'natal-42',
      title: 'Bandeja Formato Bengala para Petiscos',
      description: 'Bandeja decorativa em formato de bengala natalina.\nTamanho: 24 x 24 x 7 cm.',
      availability: 'in stock',
      condition: 'new',
      price: '80.00 BRL',
      image_link: 'imagens/bandejabengala.jpg',
      brand: 'Coleção Natal'
    }
  ];

  getProdutos(): ProdutoMeta[] {
    return this.produtos;
  }

  getProdutoPorId(id: string): ProdutoMeta | undefined {
    return this.produtos.find(p => p.id === id);
  }

  obterProdutos(): ProdutoMeta[] {
    return this.produtos;
  }

  obterProdutoPorId(id: string): ProdutoMeta | undefined {
    return this.produtos.find(p => p.id === id);
  }
}