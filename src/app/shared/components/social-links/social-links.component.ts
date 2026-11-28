// Importa recursos do Angular para componente standalone, injeção de dependência, inputs e sinais
import { Component, inject, input, signal } from '@angular/core';
// Importa o serviço que centraliza os perfis oficiais (@fcgaragepaint, @elimarfae e Facebook)
import { SocialCommerceService } from '../../../core/services/social-commerce.service';

// Declara o componente <app-social-links /> voltado à experiência do cliente no rodapé
@Component({
  selector: 'app-social-links', // Seletor usado dentro do rodapé em app.html
  standalone: true, // Permite importação direta no componente App
  template: `
    <!-- Contentor elegante para o cliente acompanhar a 3DDesign nas redes sociais -->
    <section class="rodape-social-cliente" aria-label="Redes sociais da 3DDesign">
      <!-- Chamada amigável voltada ao visitante da loja -->
      <p class="chamada-redes">
        Acompanhe nossos projetos, acabamentos e novidades em impressão 3D:
      </p>

      <!-- Lista de botões diretos para os perfis oficiais no Instagram e Facebook -->
      <nav class="redes-sociais-meta" aria-label="Perfis oficiais">
        @for (item of socialService.profiles(); track item.id) {
          <a
            class="rede-link"
            [href]="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <!-- Renderiza o ícone vetorial correspondente à plataforma -->
            @if (item.platform === 'instagram') {
              <svg class="icone-rede" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.88 2.25a1.12 1.12 0 1 1 0 2.24 1.12 1.12 0 0 1 0-2.24ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
              </svg>
            } @else {
              <svg class="icone-rede" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 22v-8.2h2.76l.41-3.2H13.5V8.56c0-.93.26-1.56 1.59-1.56h1.7V4.14c-.29-.04-1.3-.13-2.48-.13-2.45 0-4.13 1.5-4.13 4.25v2.34H7.4v3.2h2.76V22h3.34Z" />
              </svg>
            }
            <!-- Exibe o identificador claro para o cliente clicar e visitar -->
            <span>{{ item.handleOrName }}</span>
          </a>
        }

        <!-- Botão discreto para o cliente compartilhar o link da loja com um amigo -->
        <button
          type="button"
          class="btn-indicar-loja"
          (click)="compartilharLoja()"
        >
          <svg class="icone-rede" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92Z" />
          </svg>
          <span>{{ copiado() ? 'Link copiado!' : 'Compartilhar loja' }}</span>
        </button>
      </nav>
    </section>
  `
})
export class SocialLinksComponent {
  // Injeta o serviço de redes sociais da loja
  readonly socialService = inject(SocialCommerceService);

  // URL oficial da loja publicada
  readonly shareUrl = input<string>('https://loja3ddesign.vercel.app');

  // Estado reativo para dar feedback rápido quando o link for copiado no computador
  readonly copiado = signal(false);

  // Usa o compartilhamento nativo no celular ou copia o link da loja no desktop
  async compartilharLoja(): Promise<void> {
    const url = this.shareUrl();

    // No celular/navegadores compatíveis, abre o menu nativo (WhatsApp, Instagram, etc.)
    if (navigator.share) {
      try {
        await navigator.share({
          title: '3DDesign · Impressão 3D & Acabamento',
          text: 'Confira as peças exclusivas em impressão 3D da 3DDesign:',
          url
        });
        return;
      } catch {
        // Se o usuário cancelar o menu nativo, não faz nada
        return;
      }
    }

    // No computador, copia o link da loja discretamente
    try {
      await navigator.clipboard.writeText(url);
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2000);
    } catch {
      this.copiado.set(false);
    }
  }
}