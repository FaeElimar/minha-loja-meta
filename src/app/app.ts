import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'minha-loja-meta';

  alertaEmDesenvolvimento(event: Event): void {
    event.preventDefault(); // Impede que a página recarregue ao clicar no link
    alert('Página em desenvolvimento. Estará disponível em breve!');
  }
}