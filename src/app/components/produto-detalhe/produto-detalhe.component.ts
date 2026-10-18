import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutoService, ProdutoMeta } from '../../services/produto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produto-detalhe.component.html',
  styleUrls: ['./produto-detalhe.component.css'] 
})
export class ProdutoDetalheComponent implements OnInit {
  produto: ProdutoMeta | undefined;
  valorFrete: string = ''; 
  quantidade: number = 1; // Começa sempre com 1 unidade

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.produto = this.produtoService.getProdutos().find(p => p.id === id);
  }

  calcularFrete(cep: string): void {
    if (!cep) return;
    this.valorFrete = `Calculando envio de Florianópolis para o CEP ${cep}...`;
  }

  aumentarQuantidade(): void {
    this.quantidade++;
  }

  diminuirQuantidade(): void {
    if (this.quantidade > 1) {
      this.quantidade--; // Impede que o cliente compre 0 ou quantidades negativas
    }
  }

  adicionarCarrinho(): void {
    alert(`${this.quantidade}x ${this.produto?.title} adicionado(s) ao carrinho!`);
  }

  comprar(): void {
    alert(`A redirecionar para o pagamento de ${this.quantidade} unidade(s)...`);
  }
}