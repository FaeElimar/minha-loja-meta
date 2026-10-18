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
    },
    // ESPAÇOS PARA OS 12 NOVOS PRODUTOS
    { id: 'NAT-003', title: 'Produto Natalino 03', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-003', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-004', title: 'Produto Natalino 04', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-004', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-005', title: 'Produto Natalino 05', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-005', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-006', title: 'Produto Natalino 06', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-006', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-007', title: 'Produto Natalino 07', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-007', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-008', title: 'Produto Natalino 08', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-008', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-009', title: 'Produto Natalino 09', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-009', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-010', title: 'Produto Natalino 10', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-010', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-011', title: 'Produto Natalino 11', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-011', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-012', title: 'Produto Natalino 12', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-012', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-013', title: 'Produto Natalino 13', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-013', image_link: '', brand: 'Studio Elimar' },
    { id: 'NAT-014', title: 'Produto Natalino 14', description: 'Descrição da arte em breve...', availability: 'in stock', condition: 'new', price: '0.00 BRL', link: 'https://seusite.com.br/produto/nat-014', image_link: '', brand: 'Studio Elimar' }
  ];

  constructor() {}

  getProdutos(): ProdutoMeta[] {
    return this.produtos;
  }
}