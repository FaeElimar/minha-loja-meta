// Importações principais do Angular para criar o componente, inicializar e injetar serviços
import { Component, OnInit, inject } from '@angular/core';
// Módulo comum do Angular (permite diretivas estruturais como *ngIf na template)
import { CommonModule } from '@angular/common';
// Módulo de formulários para capturar a senha digitada no campo de login
import { FormsModule } from '@angular/forms';
// Diretiva de navegação declarativa do Angular Router para links internos
import { RouterLink } from '@angular/router';
// Importa o serviço e a interface dos produtos a partir de src/app/services/produto.ts
import { ProdutoService, ProdutoMeta } from '../../services/produto';

@Component({
  // Seletor HTML do componente
  selector: 'app-exportar-meta',
  // Componente standalone com suas próprias dependências
  standalone: true,
  // CommonModule para *ngIf, FormsModule para [(ngModel)] da senha e RouterLink para navegação
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Contentor principal centralizado -->
    <section class="exportar-meta-container">
      <!-- Link de retorno à vitrine sempre disponível -->
      <a routerLink="/" class="btn-voltar">← Voltar para a loja</a>

      <!-- CAPA DE LOGIN: exibida enquanto o utilizador não estiver autenticado -->
      <div *ngIf="!autenticado" class="login-box">
        <h1>Acesso Restrito — 3DDesign</h1>
        <p class="subtitulo">Área administrativa para exportação do catálogo Meta Commerce.</p>

        <!-- Formulário de autenticação por senha -->
        <form (ngSubmit)="verificarSenha()" class="form-login">
          <label for="senhaAdmin">Senha de administrador</label>
          <input
            id="senhaAdmin"
            name="senhaAdmin"
            type="password"
            [(ngModel)]="senhaDigitada"
            placeholder="Digite a senha de acesso"
            autocomplete="current-password"
            required
          />

          <!-- Mensagem de erro caso a senha esteja incorreta -->
          <p *ngIf="erroLogin" class="erro-login">Senha incorreta. Tente novamente.</p>

          <button type="submit" class="btn-baixar-csv">Entrar na Exportação</button>
        </form>
      </div>

      <!-- ÁREA PROTEGIDA: exibida somente após validar a senha -->
      <div *ngIf="autenticado">
        <div class="topo-exportar">
          <div class="linha-titulo">
            <h1>Exportar Catálogo — Meta Commerce</h1>
            <!-- Botão para encerrar a sessão administrativa -->
            <button type="button" class="btn-sair" (click)="sair()">Bloquear / Sair</button>
          </div>
          <p class="subtitulo">
            Gera o ficheiro CSV com os <strong>{{ produtos.length }}</strong> produtos da
            <strong>3DDesign</strong> para envio no Meta Business Suite (pela Página
            <strong>Elimar Faé - Designer Gráfico</strong>).
          </p>
        </div>

        <!-- Botões de ação para baixar ou copiar o CSV -->
        <div class="acoes-exportar">
          <button type="button" class="btn-baixar-csv" (click)="baixarCsv()">
            Baixar catalogo-3ddesign-meta.csv ({{ produtos.length }} itens)
          </button>

          <button type="button" class="btn-copiar-csv" (click)="copiarCsv()">
            {{ copiado ? 'CSV copiado!' : 'Copiar CSV' }}
          </button>
        </div>

        <!-- Prévia das primeiras linhas do CSV gerado -->
        <div *ngIf="produtos.length > 0" class="preview-box">
          <h2>Prévia do CSV (primeiras linhas)</h2>
          <pre class="codigo-csv">{{
            gerarCsv()
              .split(
                '
'
              )
              .slice(0, 8)
              .join(
                '
'
              )
          }}</pre>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* Contentor branco central com sombra suave */
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
        margin-bottom: 18px;
        padding: 8px 16px;
        background: #fdf5f5;
        color: #8b0000;
        text-decoration: none;
        font-weight: 700;
        border-radius: 4px;
      }

      /* Cartão centralizado da capa de login */
      .login-box {
        max-width: 420px;
        margin: 12px auto 20px;
        padding: 24px;
        border: 1px solid #ececec;
        border-radius: 8px;
        background: #fafafa;
      }

      /* Estrutura vertical do formulário de senha */
      .form-login {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* Rótulo do campo de senha */
      .form-login label {
        font-weight: 700;
        font-size: 0.9rem;
        color: #333333;
      }

      /* Campo de entrada da senha */
      .form-login input {
        padding: 11px 14px;
        border: 1px solid #cccccc;
        border-radius: 6px;
        font-size: 1rem;
        outline: none;
      }

      /* Destaque na borda ao focar no campo */
      .form-login input:focus {
        border-color: #8b0000;
      }

      /* Mensagem de aviso quando a senha falha */
      .erro-login {
        margin: 0;
        color: #b00020;
        font-size: 0.88rem;
        font-weight: 600;
      }

      /* Alinha o título da área logada com o botão Sair */
      .linha-titulo {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      /* Botão discreto para bloquear novamente a tela */
      .btn-sair {
        padding: 7px 14px;
        background: #f1f1f1;
        color: #333333;
        border: 1px solid #d4d4d4;
        border-radius: 5px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
      }

      .btn-sair:hover {
        background: #e4e4e4;
      }

      /* Título em bordô da identidade visual da loja */
      h1 {
        margin: 0 0 8px;
        color: #8b0000;
        font-family: 'Georgia', serif;
        font-size: 1.65rem;
      }

      /* Texto auxiliar abaixo do título */
      .subtitulo {
        margin: 0 0 22px;
        color: #444444;
        line-height: 1.5;
      }

      /* Agrupa os botões de exportação */
      .acoes-exportar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 24px;
      }

      /* Botão principal em bordô */
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

      .btn-copiar-csv:hover {
        background: #444444;
      }

      /* Subtítulo da seção de prévia */
      .preview-box h2 {
        margin: 0 0 10px;
        font-size: 1.05rem;
        color: #222222;
      }

      /* Caixa de código com rolagem horizontal */
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
    `,
  ],
})
export class ExportarMetaComponent implements OnInit {
  // Injeta o serviço de produtos da loja
  private readonly produtoService = inject(ProdutoService);

  // Endereço base público da loja na Vercel
  private readonly baseUrl = 'https://loja3ddesign.vercel.app';

  // Chave usada no sessionStorage para manter o login enquanto a aba estiver aberta
  private readonly storageKey = '3ddesign_admin_auth';

  // Senha definida para liberar a exportação do catálogo
  private readonly senhaCorreta = 'Vi!@184546';

  // Controla se a capa de login ou o painel de exportação é exibido
  autenticado = false;

  // Armazena o texto digitado no campo de senha
  senhaDigitada = '';

  // Exibe mensagem de erro caso a senha esteja errada
  erroLogin = false;

  // Lista dos 42 produtos carregados somente após login
  produtos: ProdutoMeta[] = [];

  // Controla o feedback visual ao copiar o CSV
  copiado = false;

  // Verifica se já existe sessão ativa nesta aba ao abrir a rota
  ngOnInit(): void {
    if (sessionStorage.getItem(this.storageKey) === 'ok') {
      this.autenticado = true;
      this.produtos = this.produtoService.getProdutos();
    }
  }

  // Valida a senha digitada e libera os produtos em caso de acerto
  verificarSenha(): void {
    if (this.senhaDigitada.trim() === this.senhaCorreta) {
      this.autenticado = true;
      this.erroLogin = false;
      this.senhaDigitada = '';
      sessionStorage.setItem(this.storageKey, 'ok');
      this.produtos = this.produtoService.getProdutos();
    } else {
      this.erroLogin = true;
    }
  }

  // Encerra a sessão administrativa e limpa os dados da tela
  sair(): void {
    sessionStorage.removeItem(this.storageKey);
    this.autenticado = false;
    this.produtos = [];
    this.senhaDigitada = '';
    this.erroLogin = false;
  }

  // Normaliza textos removendo quebras de linha e espaços múltiplos
  private limparTexto(valor: unknown): string {
    return String(valor ?? '')
      .replace(/\r?\n+/g, ' - ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Escapa cada célula conforme o padrão CSV
  private escaparCsv(valor: unknown): string {
    const texto = this.limparTexto(valor);
    return `"${texto.replace(/"/g, '""')}"`;
  }

  // Monta a URL absoluta da imagem do produto na Vercel
  private montarUrlImagem(img?: string): string {
    if (!img) {
      return `${this.baseUrl}/imagens/sem-imagem.jpg`;
    }
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    const caminhoLimpo = img.startsWith('/') ? img : `/${img}`;
    return `${this.baseUrl}${caminhoLimpo}`;
  }

  // Monta o link direto do produto
  private montarUrlProduto(produto: ProdutoMeta): string {
    return `${this.baseUrl}/?produto=${encodeURIComponent(produto.id)}`;
  }

  // Gera o CSV completo com cabeçalho e os 42 produtos
  gerarCsv(): string {
    const cabecalho = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
    ].join(',');

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
        this.escaparCsv(p.brand || '3DDesign'),
      ].join(',');
    });

    return [cabecalho, ...linhas].join('\n');
  }

  // Gera o ficheiro UTF-8 com BOM e dispara o download
  baixarCsv(): void {
    const conteudo = '\uFEFF' + this.gerarCsv();
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalogo-3ddesign-meta.csv';
    link.click();

    URL.revokeObjectURL(url);
  }

  // Copia o CSV para a área de transferência
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
