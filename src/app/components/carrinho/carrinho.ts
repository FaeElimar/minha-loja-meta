import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho {
  private carrinhoService = inject(CarrinhoService);

  // Dados do cliente e entrega
  nomeCliente = '';
  cep = '';
  rua = '';
  numero = '';
  bairro = '';
  cidade = '';
  uf = '';

  frete = 0;
  freteCalculado = false;
  buscandoCep = false;
  erroNome = '';
  erroCep = '';

  get itens(): ItemCarrinho[] {
    return this.carrinhoService.obterItens();
  }

  // Converte "49.90 BRL" ou "R$ 49,90" em número
  converterPreco(precoTexto: string): number {
    const limpo = precoTexto.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(limpo) || 0;
  }

  get subtotal(): number {
    return this.itens.reduce(
      (total, item) => total + this.converterPreco(item.produto.price) * item.quantidade,
      0,
    );
  }

  get totalGeral(): number {
    return this.subtotal + this.frete;
  }

  alterarQuantidade(item: ItemCarrinho, delta: number): void {
    const novaQtd = item.quantidade + delta;
    if (novaQtd <= 0) {
      this.carrinhoService.remover(item.produto.id);
    } else {
      item.quantidade = novaQtd;
    }
  }

  removerItem(produtoId: string): void {
    this.carrinhoService.remover(produtoId);
  }

  aoAlterarCep(): void {
    this.freteCalculado = false;
    this.frete = 0;
    this.erroCep = '';
  }

  async buscarCep(): Promise<void> {
    const cepLimpo = this.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      this.erroCep = 'Digite um CEP válido com 8 números.';
      this.freteCalculado = false;
      return;
    }

    this.buscandoCep = true;
    this.erroCep = '';

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await resposta.json();

      if (dados.erro) {
        this.erroCep = 'CEP não encontrado.';
        this.freteCalculado = false;
      } else {
        this.rua = dados.logradouro || '';
        this.bairro = dados.bairro || '';
        this.cidade = dados.localidade || '';
        this.uf = dados.uf || '';
        this.calcularFretePorEstado(this.uf);
      }
    } catch {
      this.erroCep = 'Erro ao consultar o CEP. Tente novamente.';
      this.freteCalculado = false;
    } finally {
      this.buscandoCep = false;
    }
  }

  // Ajuste os valores de frete conforme a sua preferência
  private calcularFretePorEstado(uf: string): void {
    if (uf === 'SC') {
      this.frete = 18.0;
    } else if (['PR', 'RS', 'SP', 'RJ', 'MG', 'ES'].includes(uf)) {
      this.frete = 28.0;
    } else {
      this.frete = 38.0;
    }
    this.freteCalculado = true;
  }

finalizarWhatsApp(): void {
    this.erroNome = '';
    this.erroCep = '';
    let temErro = false;

    if (!this.nomeCliente || !this.nomeCliente.trim()) {
      this.erroNome = 'Por favor, informe o seu nome.';
      temErro = true;
    }

    const cepLimpo = this.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      this.erroCep = 'O CEP é obrigatório. Informe 8 dígitos para calcular o frete.';
      temErro = true;
    } else if (!this.freteCalculado) {
      this.erroCep = 'Clique em "Calcular" para confirmar o CEP e o frete antes de finalizar.';
      temErro = true;
    }

    if (temErro) {
      return;
    }

    const telefoneLoja = '5548991964822';

    let mensagem = `*NOVO PEDIDO - 3DDESIGNER (NATAL 2026)*\n\n`;
    mensagem += `*Cliente:* ${this.nomeCliente.trim()}\n`;
    mensagem += `\n*Itens do Pedido:*\n`;

    this.itens.forEach((item) => {
      const precoUnit = this.converterPreco(item.produto.price);
      const sub = (precoUnit * item.quantidade).toFixed(2).replace('.', ',');
      mensagem += `• ${item.quantidade}x ${item.produto.title} — R$ ${sub}\n`;
    });

    mensagem += `\n*Subtotal:* R$ ${this.subtotal.toFixed(2).replace('.', ',')}`;
    mensagem += `\n*Frete (${this.cidade}/${this.uf}):* R$ ${this.frete.toFixed(2).replace('.', ',')}`;
    mensagem += `\n*TOTAL: R$ ${this.totalGeral.toFixed(2).replace('.', ',')}*\n`;

    mensagem += `\n*Endereço de Entrega:*\n${this.rua}, nº ${this.numero || 'S/N'} - ${this.bairro}\n${this.cidade}/${this.uf} - CEP: ${this.cep}\n`;

    mensagem += `\nGostaria de confirmar o pedido e receber a chave PIX para pagamento.`;

    const url = `https://wa.me/${telefoneLoja}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }
}
