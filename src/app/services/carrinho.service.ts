import { Injectable } from '@angular/core';
import { ProdutoMeta } from './produto';

// Define como cada item será guardado (a obra + a quantidade escolhida)
export interface ItemCarrinho {
  produto: ProdutoMeta;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private itens: ItemCarrinho[] = [];

  adicionar(produto: ProdutoMeta, quantidade: number): void {
    // Verifica se a obra já está no carrinho para apenas somar a quantidade
    const itemExistente = this.itens.find(i => i.produto.id === produto.id);
    
    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      this.itens.push({ produto, quantidade });
    }
  }

  obterItens(): ItemCarrinho[] {
    return this.itens;
  }

  // Conta o total de peças no carrinho para mostrar no cabeçalho
  obterTotalItens(): number {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }
}