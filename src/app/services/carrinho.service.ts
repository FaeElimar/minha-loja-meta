import { Injectable } from '@angular/core';
import { ProdutoMeta } from './produto';

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
    const itemExistente = this.itens.find(i => i.produto.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      this.itens.push({ produto, quantidade });
    }
  }

  remover(produtoId: string): void {
    this.itens = this.itens.filter(i => i.produto.id !== produtoId);
  }

  obterItens(): ItemCarrinho[] {
    return this.itens;
  }

  obterTotalItens(): number {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }
}