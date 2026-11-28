// Importações principais do Angular para criar o componente, inicializar e injetar serviços
import { Component, OnInit, inject } from '@angular/core';
// Módulo comum do Angular (permite diretivas estruturais como *ngIf na template)
import { CommonModule } from '@angular/common';
// Diretiva de navegação declarativa do Angular Router para links internos
import { RouterLink } from '@angular/router';
// Importa o serviço e a interface dos produtos a partir de src/app/services/produto.ts
import { ProdutoService, ProdutoMeta } from '../../services/produto';

@Component({
  // Seletor HTML usado caso o componente seja referenciado diretamente em templates
  selector: 'app-exportar-meta',
  // Componente standalone (não exige NgModule, importa suas próprias dependências)
  standalone: true,
  // Dependências disponibilizadas dentro do template HTML do componente
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Contentor principal centralizado da tela de exportação do catálogo -->
    <section class="exportar-meta-container">
      <!-- Cabeçalho com botão de retorno à loja e explicação do objetivo da página -->
      <div class="topo-exportar">
        <!-- Link para regressar à vitrine principal (/) -->
        <a routerLink="/" class="btn-voltar">← Voltar para a loja</a>
        <!-- Título principal da página de exportação -->
        <h1>Exportar Catálogo — Meta Commerce</h1>
        <!-- Descrição indicando a quantidade total de produtos carregados e a loja/página -->
        <p class="subtitulo">
          Gera o ficheiro CSV com os <strong>{{ produtos.length }}</strong> produtos da
          <strong>3DDesign</strong> para envio no Meta Business Suite (pela Página
          <strong>Elimar Faé - Designer Gráfico</strong>).
        </p>
      </div>

      <!-- Barra de ações com botões para descarregar ou copiar o conteúdo CSV -->
      <div class="acoes-exportar">
        <!-- Dispara o download do ficheiro catalogo-3ddesign-meta.csv -->
        <button type="button" class="btn-baixar-csv" (click)="baixarCsv()">
          Baixar catalogo-3ddesign-meta.csv ({{ produtos.length }} itens)
        </button>

        <!-- Copia o CSV bruto para a área de transferência e muda o rótulo temporariamente -->
        <button type="button" class="btn-copiar-csv" (click)="copiarCsv()">
          {{ copiado ? 'CSV copiado!' : 'Copiar CSV' }}
        </button>
      </div>

      <!-- Exibe a prévia das primeiras linhas apenas quando há produtos carregados -->
      <div *ngIf="produtos.length > 0" class="preview-box">
        <h2>Prévia do CSV (primeiras linhas)</h2>
        <!-- Mostra o cabeçalho e os primeiros 7 produtos para conferência rápida -->
        <pre class="codigo-csv">{{ gerarCsv().split('\n').slice(0, 8).join('\n') }}</pre>
      </div>
    </section>
  `,
  styles: [`
    /* Contentor branco central com sombra suave e espaçamento interno */
    .exportar-meta-container {
      max-width: 960px;
      margin: 32px auto 60px;
      padding: 28px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.14);
      box-sizing: border-box;
    }

    /* Botão discreto de retorno para a loja */
    .btn-voltar {
      display: inline-block;
      margin-bottom: 14px;
      padding: 8px 16px;
      background: #fdf5f5;
      color: #8b0000;
      text-decoration: none;
      font-weight: 700;
      border-radius: 4px;
    }

    /* Título em vermelho escuro com tipografia serifa */
    h1 {
      margin: 0 0 8px;
      color: #8b0000;
      font-family: 'Georgia', serif;
      font-size: 1.65rem;
    }

    /* Texto auxiliar legível abaixo do título */
    .subtitulo {
      margin: 0 0 22px;
      color: #444444;
      line-height: 1.5;
    }

    /* Agrupa os botões de ação permitindo quebra de linha em telas estreitas */
    .acoes-exportar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
    }

    /* Botão principal de download no tom bordô da loja */
    .btn-baixar-csv {
      padding: 12px 20px;
      background: #8b0000;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
    }

    /* Escurece ligeiramente o botão principal ao passar o cursor */
    .btn-baixar-csv:hover {
      background: #6d0000;
    }

    /* Botão secundário escuro para copiar o CSV */
    .btn-copiar-csv {
      padding: 12px 18px;
      background: #2b2b2b;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
    }

    /* Clareia ligeiramente o botão secundário ao passar o cursor */
    .btn-copiar-csv:hover {
      background: #444444;
    }

    /* Subtítulo da seção de prévia do CSV */
    .preview-box h2 {
      margin: 0 0 10px;
      font-size: 1.05rem;
      color: #222222;
    }

    /* Caixa de código com rolagem horizontal para inspecionar as colunas do CSV */
    .codigo-csv {
      background: #f8f9fa;
      border: 1px solid #e2e5e9;
      border-radius: 6px;
      padding: 14px;
      overflow-x: auto;
      font-size: 0.82rem;
      line-height: 1.45;
      color: #1f1f1f;
    }
  `]
})
export class ExportarMetaComponent implements OnInit {
  // Injeta a instância do ProdutoService fornecida na raiz da aplicação
  private readonly produtoService = inject(ProdutoService);

  // Endereço base público da loja na Vercel usado para compor links e imagens
  private readonly baseUrl = 'https://loja3ddesign.vercel.app';

  // Array que recebe os produtos carregados do serviço na inicialização
  produtos: ProdutoMeta[] = [];

  // Sinaliza visualmente quando o conteúdo do CSV foi copiado com sucesso
  copiado = false;

  // Hook de ciclo de vida executado ao iniciar o componente
  ngOnInit(): void {
    // Busca todos os produtos cadastrados no serviço
    this.produtos = this.produtoService.getProdutos();
  }

  // Normaliza textos removendo quebras de linha e espaços múltiplos para manter cada produto em uma linha CSV
  private limparTexto(valor: unknown): string {
    return String(valor ?? '')
      .replace(/\r?\n+/g, ' - ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Formata cada célula entre aspas duplas e duplica aspas internas para cumprir o padrão RFC de CSV
  private escaparCsv(valor: unknown): string {
    const texto = this.limparTexto(valor);
    return `"${texto.replace(/"/g, '""')}"`;
  }

  // Constrói a URL absoluta da imagem do produto no domínio da loja
  private montarUrlImagem(img?: string): string {
    // Usa imagem padrão caso o produto não tenha image_link definido
    if (!img) {
      return `${this.baseUrl}/imagens/sem-imagem.jpg`;
    }
    // Mantém intactas URLs que já começam com http:// ou https://
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    // Garante uma única barra entre o domínio base e o caminho relativo da imagem
    const caminhoLimpo = img.startsWith('/') ? img : `/${img}`;
    return `${this.baseUrl}${caminhoLimpo}`;
  }

  // Monta o link do produto com parâmetro de consulta (?produto=id) codificado para URL
  private montarUrlProduto(produto: ProdutoMeta): string {
    return `${this.baseUrl}/?produto=${encodeURIComponent(produto.id)}`;
  }

  // Gera o texto completo do CSV (cabeçalho obrigatório + uma linha por produto)
  gerarCsv(): string {
    // Colunas principais esperadas pelo catálogo de comércio da Meta
    const cabecalho = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand'
    ].join(',');

    // Converte cada objeto ProdutoMeta em uma linha separada por vírgulas
    const linhas = this.produtos.map((p) => {
      const titulo = this.limparTexto(p.title);
      const descricao = this.limparTexto(p.description || p.title);
      const link = this.montarUrlProduto(p);
      const imagem = this.montarUrlImagem(p.image_link);

      return [
        this.escaparCsv(p.id),
        this.escaparCsv(titulo),
        this.escaparCsv(descricao),
        this.escaparCsv(p.availability || 'in stock'),
        this.escaparCsv(p.condition || 'new'),
        this.escaparCsv(p.price),
        this.escaparCsv(link),
        this.escaparCsv(imagem),
        this.escaparCsv(p.brand || '3DDesign')
      ].join(',');
    });

    // Junta cabeçalho e linhas usando quebra de linha padrão
    return [cabecalho, ...linhas].join('\n');
  }

  // Gera o arquivo com BOM UTF-8 e aciona o download no navegador
  baixarCsv(): void {
    // \uFEFF ajuda o Excel e leitores de planilha a reconhecerem acentos em UTF-8
    const conteudo = '\uFEFF' + this.gerarCsv();
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Cria um elemento <a> temporário para forçar o download com o nome desejado
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalogo-3ddesign-meta.csv';
    link.click();

    // Libera a URL temporária da memória após iniciar o download
    URL.revokeObjectURL(url);
  }

  // Copia o CSV para a área de transferência do sistema e reseta o estado após 2,5 segundos
  async copiarCsv(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.gerarCsv());
      this.copiado = true;
      setTimeout(() => {
        this.copiado = false;
      }, 2500);
    } catch {
      this.copiado = false;
    }
  }
}