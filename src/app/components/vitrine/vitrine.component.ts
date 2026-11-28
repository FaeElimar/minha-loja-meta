// Importa recursos do Angular e reatividade com signals/effect para ler parâmetros de rota
import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProdutoService, ProdutoMeta } from '../../services/produto';

@Component({
  selector: 'app-vitrine', // Seletor do componente da vitrine
  imports: [CommonModule, RouterLink], // Módulos e diretivas usadas no template
  templateUrl: './vitrine.component.html', // Template HTML da vitrine
  styleUrls: ['./vitrine.component.css'], // Estilos CSS da vitrine
})
export class VitrineComponent implements OnInit {
  // Injeta serviços e utilitários de rota usando inject()
  private readonly produtoService = inject(ProdutoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Lista de produtos exibidos na vitrine
  listaDeProdutos: ProdutoMeta[] = [];

  // Observa o parâmetro ?produto=... da URL de forma reativa
  private readonly produtoQueryId = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('produto')?.trim() ?? '')),
  );

  constructor() {
    // Quando vier ?produto=ID na URL e o ID existir no catálogo, encaminha direto para /produto/:id
    effect(() => {
      const produtoId = this.produtoQueryId();
      if (!produtoId) {
        return;
      }

      const produtoEncontrado = this.produtoService.getProdutoPorId(produtoId);
      if (produtoEncontrado) {
        void this.router.navigate(['/produto', produtoEncontrado.id], {
          replaceUrl: true,
        });
      }
    });
  }

  ngOnInit(): void {
    // Carrega os produtos da loja para renderizar a vitrine
    this.listaDeProdutos = this.produtoService.getProdutos();
  }
}
