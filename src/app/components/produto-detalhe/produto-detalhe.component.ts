import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OpcaoProduto, ProdutoMeta, ProdutoService } from '../../services/produto';
import { CarrinhoService } from '../../services/carrinho.service';
import { CommonModule } from '@angular/common';

// Estrutura tipada para cada opção de frete exibida ao cliente
export interface OpcaoFrete {
  tipo: string;
  prazo: string;
  valor: number;
}

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './produto-detalhe.component.html',
  styleUrls: ['./produto-detalhe.component.css'],
})
export class ProdutoDetalheComponent implements OnInit {
  // Dados do produto carregado pela rota
  produto: ProdutoMeta | undefined;
  // Mensagem de status ou resumo da consulta de CEP/frete
  valorFrete: string = '';
  // Lista de modalidades de frete disponíveis após consultar o CEP
  opcoesFrete: OpcaoFrete[] = [];
  // Modalidade de frete selecionada pelo cliente no radio button
  freteSelecionado: OpcaoFrete | null = null;
  // Quantidade escolhida (mínimo 1)
  quantidade: number = 1;
  // Cores marcadas pelo cliente
  coresSelecionadas: string[] = [];
  // Opção/kit selecionado (ex.: Unidade, Kit com 3, etc.)
  opcaoSelecionada: OpcaoProduto | null = null;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Lê o id da URL e localiza o produto correspondente no serviço
    const id = this.route.snapshot.paramMap.get('id');
    this.produto = this.produtoService.getProdutos().find((p) => p.id === id);

    // Pré-seleciona o primeiro kit/tamanho disponível
    if (this.produto?.opcoes?.length) {
      this.opcaoSelecionada = this.produto.opcoes[0];
    }

    // Pré-seleciona a primeira cor disponível
    if (this.produto?.cores?.length) {
      this.coresSelecionadas = [this.produto.cores[0]];
    }
  }

  // Marca a opção de frete escolhida pelo usuário
  selecionarFrete(frete: OpcaoFrete): void {
    this.freteSelecionado = frete;
  }

  async calcularFrete(cep: string): Promise<void> {
    if (!cep) return;

    // Remove caracteres não numéricos para validar os 8 dígitos do CEP
    const cepLimpo = cep.replace(/\D/g, '');
    this.opcoesFrete = [];
    this.freteSelecionado = null;

    if (cepLimpo.length !== 8) {
      this.valorFrete = 'CEP inválido. Digite os 8 números corretamente.';
      this.cdr.detectChanges();
      return;
    }

    this.valorFrete = 'Calculando frete...';
    this.cdr.detectChanges();

    // Limite de 4 segundos para não deixar o cliente preso em "Calculando..."
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const resposta = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!resposta.ok) {
        this.valorFrete = 'CEP não encontrado. Tente novamente.';
      } else {
        const dados = await resposta.json();
        this.valorFrete = `Opções de envio para ${dados.city} - ${dados.state}:`;
        this.opcoesFrete = this.montarOpcoesPorRegiao(cepLimpo, dados.city, dados.state);
        // Já deixa a primeira opção (mais vantajosa) marcada por padrão
        this.freteSelecionado = this.opcoesFrete[0];
      }
    } catch {
      clearTimeout(timeout);
      // Fallback caso a API demore: ainda verifica o prefixo do CEP para aplicar a faixa certa
      this.valorFrete = `Opções de envio para o CEP ${cepLimpo}:`;
      this.opcoesFrete = this.montarOpcoesPorRegiao(cepLimpo, '', '');
      this.freteSelecionado = this.opcoesFrete[0];
    }

    this.cdr.detectChanges();
  }

  // Define os valores e prazos de frete conforme a localização do CEP
  private montarOpcoesPorRegiao(cepLimpo: string, cidade: string, uf: string): OpcaoFrete[] {
    // Converte a string de 8 dígitos para número para comparar faixas de CEP
    const cepNumero = Number(cepLimpo);
    const cidadeNorm = (cidade || '').toLowerCase();
    const ufNorm = (uf || '').toUpperCase();

   // 1. Norte da Ilha de Florianópolis (88050-000 a 88059-999 e Rio Vermelho 88060-000 a 88062-999)
    const ehNorteDaIlha =
      (cepNumero >= 88050000 && cepNumero <= 88059999) ||
      (cepNumero >= 88060000 && cepNumero <= 88062999);

    if (ehNorteDaIlha) {
      return [
        {
          tipo: 'Entrega Grátis — Norte da Ilha',
          prazo: '1 a 2 dias úteis (Rio Vermelho, Ingleses, Santinho, Canasvieiras, Jurerê, Cachoeira, Ponta das Canas, Daniela, Ratones, Sto. Antônio, Sambaqui e Cacupé)',
          valor: 0,
        },
        {
          tipo: 'Retirada / Combinar no WhatsApp',
          prazo: 'A combinar',
          valor: 0,
        },
      ];
    }

    // 2. Região Central e Bacia do Itacorubi
    const ehCentroItacorubi = cepNumero >= 88000000 && cepNumero <= 88040999;

    if (ehCentroItacorubi) {
      return [
        {
          tipo: 'Entrega Local — Rota Centro / Itacorubi',
          prazo: '1 a 2 dias úteis (Centro, Agronômica, Trindade, Santa Mônica, Itacorubi, Córrego Grande e João Paulo)',
          valor: 8.0,
        },
        {
          tipo: 'Retirada / Combinar no WhatsApp',
          prazo: 'A combinar',
          valor: 0,
        },
      ];
    }

    // 3. Restante de Florianópolis (Sul da Ilha / Continente) e Grande Floripa (São José, Palhoça, Biguaçu)
    const grandeFloripa = ['florianópolis', 'florianopolis', 'são josé', 'sao jose', 'palhoça', 'palhoca', 'biguaçu', 'biguacu'];
    const ehGrandeFloripa =
      grandeFloripa.includes(cidadeNorm) || (cepNumero >= 88000000 && cepNumero <= 88199999);

    if (ehGrandeFloripa) {
      return [
        {
          tipo: 'Entrega Local — Grande Florianópolis',
          prazo: '1 a 2 dias úteis (Sul da Ilha, Continente, São José, Palhoça e Biguaçu)',
          valor: 14.9,
        },
        { tipo: 'PAC', prazo: '3 a 5 dias úteis', valor: 16.9 },
        { tipo: 'SEDEX', prazo: '1 a 2 dias úteis', valor: 22.9 },
      ];
    }

    // 4. Restante de Santa Catarina e Região Sul (SC, PR, RS)
    if (['SC', 'PR', 'RS'].includes(ufNorm)) {
      return [
        { tipo: 'PAC', prazo: '4 a 7 dias úteis', valor: 19.9 },
        { tipo: 'SEDEX', prazo: '2 a 3 dias úteis', valor: 29.9 },
      ];
    }

    // 5. Sudeste e Centro-Oeste
    if (['SP', 'RJ', 'MG', 'ES', 'DF', 'GO', 'MS', 'MT'].includes(ufNorm)) {
      return [
        { tipo: 'PAC', prazo: '6 a 9 dias úteis', valor: 26.9 },
        { tipo: 'SEDEX', prazo: '2 a 4 dias úteis', valor: 44.9 },
      ];
    }

    // 6. Norte e Nordeste (demais estados)
    return [
      { tipo: 'PAC', prazo: '8 a 14 dias úteis', valor: 36.9 },
      { tipo: 'SEDEX', prazo: '3 a 6 dias úteis', valor: 64.9 },
    ];
  }

  aumentarQuantidade(): void {
    this.quantidade++;
  }

  // Permite marcar mais de uma cor quando for kit ou quantidade maior que 1
  get podeEscolherVariasCores(): boolean {
    const ehKit = this.opcaoSelecionada?.label.toLowerCase().includes('kit') ?? false;
    return this.quantidade > 1 || ehKit;
  }

  // Aceita número ou string (com ou sem "BRL") e devolve sempre no padrão "R$ 00,00"
  formatarPreco(valor: number | string | undefined): string {
    if (valor === 0 || valor === '0') return 'Grátis';
    if (valor === undefined || valor === null || valor === '') return '';

    const numero =
      typeof valor === 'number'
        ? valor
        : Number(valor.replace('BRL', '').replace(',', '.').trim());

    if (Number.isNaN(numero)) {
      return 'R$ ' + String(valor).replace(' BRL', '').replace('.', ',');
    }

    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  diminuirQuantidade(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
      // Se voltou para unidade simples e não for kit, mantém apenas 1 cor
      if (!this.podeEscolherVariasCores && this.coresSelecionadas.length > 1) {
        this.coresSelecionadas = [this.coresSelecionadas[0]];
      }
    }
  }

  selecionarOpcao(opcao: OpcaoProduto): void {
    this.opcaoSelecionada = opcao;
    if (!this.podeEscolherVariasCores && this.coresSelecionadas.length > 1) {
      this.coresSelecionadas = [this.coresSelecionadas[0]];
    }
  }

  alternarCor(cor: string): void {
    if (!this.podeEscolherVariasCores) {
      this.coresSelecionadas = [cor];
      return;
    }

    const index = this.coresSelecionadas.indexOf(cor);
    if (index > -1) {
      // Garante que pelo menos 1 cor continue marcada
      if (this.coresSelecionadas.length > 1) {
        this.coresSelecionadas.splice(index, 1);
      }
    } else {
      this.coresSelecionadas.push(cor);
    }
  }

  get precoExibido(): string {
    return this.opcaoSelecionada ? this.opcaoSelecionada.price : this.produto?.price || '';
  }

  // Gera a URL do WhatsApp já preenchida com os dados atuais da tela
  get linkWhatsApp(): string {
    const telefone = '5548991964822';

    const nomeProduto = this.produto?.title
      ? this.produto.title.replace(/\n+/g, ' ')
      : 'Produto';

    const coresTexto =
      this.coresSelecionadas.length > 0
        ? this.coresSelecionadas.join(', ')
        : 'A definir';

    const opcaoTexto = this.opcaoSelecionada
      ? `${this.opcaoSelecionada.label} (${this.formatarPreco(this.opcaoSelecionada.price)})`
      : 'Padrão';

    const freteTexto = this.freteSelecionado
      ? `${this.freteSelecionado.tipo} - ${this.formatarPreco(this.freteSelecionado.valor)} (${this.freteSelecionado.prazo})`
      : this.valorFrete
        ? this.valorFrete
        : 'A calcular';

    // Converte o preço unitário exibido para número e multiplica pela quantidade
    const precoUnitarioNum = Number(
      this.precoExibido.replace('BRL', '').replace(',', '.').trim(),
    ) || 0;
    const subtotalProdutos = precoUnitarioNum * this.quantidade;
    const valorFreteNum = this.freteSelecionado ? this.freteSelecionado.valor : 0;
    const totalEstimado = subtotalProdutos + valorFreteNum;

    const mensagem = [
      'Olá! Vim pela loja *3DDesigner* e tenho interesse neste item:',
      `• *Produto:* ${nomeProduto}`,
      `• *Opção/Kit:* ${opcaoTexto}`,
      `• *Cor(es):* ${coresTexto}`,
      `• *Quantidade:* ${this.quantidade}`,
      `• *Frete:* ${freteTexto}`,
      `• *Total estimado:* ${this.formatarPreco(totalEstimado)}`,
    ].join('\n');

    return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
  }

  adicionarAoCarrinho(): void {
    if (!this.produto) return;

    const detalhes: string[] = [];
    if (this.opcaoSelecionada) detalhes.push(this.opcaoSelecionada.label);
    if (this.coresSelecionadas.length) {
      detalhes.push(`Cores: ${this.coresSelecionadas.join(', ')}`);
    }

    const sufixoTexto = detalhes.length ? ` (${detalhes.join(' - ')})` : '';
    const sufixoId = detalhes.length ? `-${detalhes.join('-')}` : '';

    const itemFinal: ProdutoMeta = {
      ...this.produto,
      id: `${this.produto.id}${sufixoId}`,
      title: `${this.produto.title}${sufixoTexto}`,
      price: this.precoExibido,
    };

    this.carrinhoService.adicionar(itemFinal, this.quantidade);
    alert(`${this.quantidade}x ${itemFinal.title} adicionado ao carrinho!`);
  }

  comprar(): void {
    if (!this.produto) return;
    const numeroWhatsApp = '5548991964822';
    const detalhes: string[] = [];
    if (this.opcaoSelecionada) detalhes.push(`*Opção:* ${this.opcaoSelecionada.label}`);
    if (this.coresSelecionadas.length) {
      detalhes.push(`*Cores:* ${this.coresSelecionadas.join(', ')}`);
    }
    if (this.freteSelecionado) {
      detalhes.push(
        `*Frete:* ${this.freteSelecionado.tipo} (${this.formatarPreco(this.freteSelecionado.valor)} - ${this.freteSelecionado.prazo})`,
      );
    }
    const blocoDetalhes = detalhes.length ? `\n${detalhes.join('\n')}` : '';

    const mensagem = `Olá, 3DDesigner! Tenho interesse em adquirir:\n\n*Produto:* ${this.produto.title}${blocoDetalhes}\n*Quantidade:* ${this.quantidade}\n*Valor:* ${this.formatarPreco(this.precoExibido)}\n\nPodemos fechar o pedido?`;
    const textoCodificado = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;
    window.open(url, '_blank');
  }
}