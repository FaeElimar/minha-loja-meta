import { Injectable } from '@angular/core';

export interface ProdutoMeta {
  id: string;
  title: string;
  description: string;
  availability: 'in stock' | 'out of stock';
  condition: 'new' | 'refurbished' | 'used';
  price: string;
  link: string;
  image_link: string;
  brand: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  produtos: ProdutoMeta[] = [
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

  constructor() {}

  getProdutos(): ProdutoMeta[] {
    return this.produtos;
  }
}