import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss', // altere para './carrinho.css' se o arquivo terminar em .css
})
export class Carrinho implements OnInit {
  itens: any[] = [];

  nomeCliente = '';
  cep = '';
  numero = '';

  rua = '';
  bairro = '';
  cidade = '';
  uf = '';

  buscandoCep = false;
  freteCalculado = false;
  frete = 0;
  descricaoFrete = '';

  erroNome = '';
  erroCep = '';

  private readonly bairrosNorteDaIlha = [
    'rio vermelho',
    'ingleses',
    'santinho',
    'canasvieiras',
    'jurere',
    'jurerê',
    'cachoeira',
    'ponta das canas',
    'daniela',
    'ratones',
    'sto. antonio',
    'sto. antônio',
    'santo antonio',
    'santo antônio',
    'sambaqui',
    'cacupe',
    'cacupé',
  ];

  ngOnInit(): void {
    this.carregarItens();
  }

  private carregarItens(): void {
    const salvo = localStorage.getItem('carrinho_3ddesign');
    this.itens = salvo ? JSON.parse(salvo) : [];
  }

  private salvarItens(): void {
    localStorage.setItem('carrinho_3ddesign', JSON.stringify(this.itens));
  }

  converterPreco(price: string | number): number {
    if (typeof price === 'number') return price;
    const limpo = String(price)
      .replace(/[^\d,.-]/g, '')
      .replace(/\.(?=\d{3}(?:,|$))/g, '')
      .replace(',', '.');
    const valor = parseFloat(limpo);
    return Number.isNaN(valor) ? 0 : valor;
  }

  get subtotal(): number {
    return this.itens.reduce(
      (acc, item) => acc + this.converterPreco(item.produto.price) * (item.quantidade || 1),
      0,
    );
  }

  get totalGeral(): number {
    return this.subtotal + (this.freteCalculado ? this.frete : 0);
  }

  alterarQuantidade(item: any, delta: number): void {
    const novaQtd = (item.quantidade || 1) + delta;
    if (novaQtd <= 0) {
      this.removerItem(item.produto.id);
      return;
    }
    item.quantidade = novaQtd;
    this.salvarItens();
  }

  removerItem(id: string | number): void {
    this.itens = this.itens.filter((i) => i.produto.id !== id);
    this.salvarItens();
  }

  aoAlterarCep(): void {
    this.erroCep = '';
    this.freteCalculado = false;
    this.frete = 0;
    this.descricaoFrete = '';
  }

  async buscarCep(): Promise<void> {
    this.erroCep = '';
    const cepLimpo = (this.cep || '').replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      this.erroCep = 'Digite um CEP válido com 8 dígitos.';
      this.freteCalculado = false;
      return;
    }

    this.buscandoCep = true;
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await resposta.json();

      if (dados.erro) {
        this.erroCep = 'CEP não encontrado.';
        this.freteCalculado = false;
        return;
      }

      this.rua = dados.logradouro || 'Endereço via CEP';
      this.bairro = dados.bairro || '';
      this.cidade = dados.localidade || '';
      this.uf = dados.uf || '';

      this.aplicarRegraFreteUnificada(cepLimpo, this.bairro, this.cidade, this.uf);
      this.freteCalculado = true;
    } catch {
      this.erroCep = 'Não foi possível consultar o CEP agora. Tente novamente.';
      this.freteCalculado = false;
    } finally {
      this.buscandoCep = false;
    }
  }

  private aplicarRegraFreteUnificada(
    cepLimpo: string,
    bairro: string,
    cidade: string,
    uf: string,
  ): void {
    const cidadeNorm = (cidade || '').trim().toLowerCase();
    const bairroNorm = (bairro || '').trim().toLowerCase();
    const ufNorm = (uf || '').trim().toUpperCase();

    const ehFlorianopolis = cidadeNorm === 'florianópolis' || cidadeNorm === 'florianopolis';
    const ehNorteDaIlha =
      ehFlorianopolis &&
      (this.bairrosNorteDaIlha.some((b) => bairroNorm.includes(b)) ||
        cepLimpo.startsWith('8805') ||
        cepLimpo.startsWith('8806'));

    if (ehNorteDaIlha) {
      this.frete = 0;
      this.descricaoFrete = 'Entrega Grátis — Norte da Ilha (1 a 2 dias úteis)';
      return;
    }

    if (ehFlorianopolis) {
      this.frete = 12;
      this.descricaoFrete = 'Entrega Florianópolis';
      return;
    }

    if (ufNorm === 'SC') {
      this.frete = 18;
      this.descricaoFrete = 'Envio Santa Catarina';
      return;
    }

    this.frete = 25;
    this.descricaoFrete = 'Envio Nacional';
  }

  finalizarWhatsApp(): void {
    this.erroNome = '';
    this.erroCep = '';

    const nomeTrim = (this.nomeCliente || '').trim();
    if (!nomeTrim) {
      this.erroNome = 'Informe seu nome para finalizar o pedido.';
    }

    if (!this.freteCalculado) {
      this.erroCep = 'Calcule o CEP para conferir o frete antes de enviar.';
    }

    if (this.erroNome || this.erroCep) {
      return;
    }

    const linhasItens = this.itens
      .map(
        (item) =>
          `• ${item.quantidade}x ${item.produto.title} — R$ ${(
            this.converterPreco(item.produto.price) * (item.quantidade || 1)
          ).toFixed(2)}`,
      )
      .join('\n');

    const textoFrete = this.frete === 0 ? 'Grátis' : `R$ ${this.frete.toFixed(2)}`;
    const enderecoCompleto = `${this.rua}, ${this.numero || 'S/N'} — ${this.bairro}, ${this.cidade}/${this.uf} (CEP: ${this.cep})`;

    const mensagem = [
      `Olá! Gostaria de finalizar meu pedido na *3DDesign*:`,
      ``,
      `*Cliente:* ${nomeTrim}`,
      `*Endereço:* ${enderecoCompleto}`,
      ``,
      `*Itens:*`,
      linhasItens,
      ``,
      `*Subtotal:* R$ ${this.subtotal.toFixed(2)}`,
      `*Frete (${this.descricaoFrete}):* ${textoFrete}`,
      `*Total:* R$ ${this.totalGeral.toFixed(2)}`,
    ].join('\n');

    const telefone = '5548991964822'; // Coloque o seu número real aqui
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
