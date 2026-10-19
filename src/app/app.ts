import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // NOVO: RouterLink adicionado
import { CarrinhoService } from './services/carrinho.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // NOVO: RouterLink ativado aqui
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'minha-loja-meta';

  constructor(public carrinhoService: CarrinhoService) {}

  alertaEmDesenvolvimento(event: Event): void {
    event.preventDefault();
    alert('Página em desenvolvimento. Estará disponível em breve!');
  }
}