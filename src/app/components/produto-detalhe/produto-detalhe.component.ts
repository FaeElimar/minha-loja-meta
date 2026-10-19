import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // NOVO: RouterLink
import { ProdutoService, ProdutoMeta } from '../../services/produto';
import { CarrinhoService } from '../../services/carrinho.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink], // NOVO: RouterLink ativado
  templateUrl: './produto-detalhe.component.html',
  styleUrls: ['./produto-detalhe.component.css']
})

export class ProdutoDetalheComponent implements OnInit {
  produto: ProdutoMeta | undefined;
  valorFrete: string = '';
  opcoesFrete: any[] = [];
  quantidade: number = 1;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService, // NOVO: Injetamos o Carrinho aqui
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.produto = this.produtoService.getProdutos().find(p => p.id === id);
  }

  async calcularFrete(cep: string): Promise<void> {
    if (!cep) return;
    const cepLimpo = cep.replace(/\D/g, '');
    this.opcoesFrete = [];
    if (cepLimpo.length !== 8) {
      this.valorFrete = 'CEP inválido. Digite os 8 números corretamente.';
      this.cdr.detectChanges();
      return;
    }
    this.valorFrete = 'A procurar localização...';
    this.cdr.detectChanges();
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await resposta.json();
      if (dados.erro) {
        this.valorFrete = 'CEP não encontrado. Tente novamente.';
      } else {
        this.valorFrete = `Opções de envio para ${dados.localidade} - ${dados.uf}:`;
        this.opcoesFrete = [
          { tipo: 'PAC', prazo: '6 a 8 dias úteis', valor: '28.50 BRL' },
          { tipo: 'SEDEX', prazo: '2 a 3 dias úteis', valor: '45.90 BRL' },
          { tipo: 'SEDEX 10', prazo: 'Até às 10h do dia seguinte', valor: '78.00 BRL' }
        ];
      }
    } catch (erro) {
      this.valorFrete = 'Erro ao consultar o CEP. Verifique a sua ligação.';
    }
    this.cdr.detectChanges();
  }

  aumentarQuantidade(): void {
    this.quantidade++;
  }

  diminuirQuantidade(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  adicionarCarrinho(): void {
    if (this.produto) {
      // Guarda de facto a obra e a quantidade na memória
      this.carrinhoService.adicionar(this.produto, this.quantidade);
      alert(`${this.quantidade}x ${this.produto.title} guardado(s) no carrinho! Pode continuar a comprar.`);
    }
  }

  comprar(): void {
    if (!this.produto) return;
    const numeroWhatsApp = '5548999999999';
    const mensagem = `Olá, 3DDesigner! Tenho interesse em adquirir:\n\n*Obra:* ${this.produto.title}\n*Quantidade:* ${this.quantidade}\n*Valor Unitário:* ${this.produto.price}\n\nPodemos fechar o pedido?`;
    const textoCodificado = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;
    window.open(url, '_blank');
  }
}