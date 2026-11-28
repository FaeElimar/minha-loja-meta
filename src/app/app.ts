// Importa o decorador base para definir um componente Angular
import { Component } from '@angular/core';
// Importa RouterOutlet (área das rotas) e RouterLink (navegação por links)
import { RouterOutlet, RouterLink } from '@angular/router'; // NOVO: RouterLink adicionado
// Importa o serviço existente do carrinho de compras
import { CarrinhoService } from './services/carrinho.service';
// Importa o componente de redes sociais (@fcgaragepaint, @elimarfae, Facebook) e compartilhamento
import { SocialLinksComponent } from './shared/components/social-links/social-links.component';

// Configura o componente raiz da aplicação
@Component({
  selector: 'app-root', // Tag principal montada no index.html
  standalone: true, // Componente standalone padrão do Angular
  // Registra RouterOutlet, RouterLink e SocialLinksComponent para uso no app.html
  imports: [RouterOutlet, RouterLink, SocialLinksComponent], // NOVO: RouterLink e SocialLinksComponent adicionados
  templateUrl: './app.html', // Template HTML principal
  styleUrls: ['./app.css'] // Folha de estilos principal
})
export class App {
  // Nome base do projeto
  title = 'minha-loja-meta';

  // Injeta o CarrinhoService como público para leitura direta no app.html
  constructor(public carrinhoService: CarrinhoService) {}

  // Bloqueia links provisórios e exibe aviso enquanto a página está em construção
  alertaEmDesenvolvimento(event: Event): void {
    event.preventDefault();
    alert('Página em desenvolvimento. Estará disponível em breve!');
  }
}