// Importa Component e inject do núcleo do Angular
import { Component, inject } from '@angular/core';
// Importa o serviço que converte os produtos e gera o CSV para o Meta Commerce Manager
import { SocialCommerceService } from '../../core/services/social-commerce.service';

@Component({
  selector: 'app-exportar-meta', // Seletor HTML do componente
  standalone: true, // Componente standalone sem necessidade de NgModule
  imports: [], // Dependências usadas no template
  template: `
    <!-- Área administrativa para gerar e baixar o CSV do catálogo da 3DDesign -->
    <section class="exportar-meta-box">
      <h2>Exportar Catálogo para Meta (Instagram &amp; Facebook)</h2>
      <!-- Exibe a quantidade atual de produtos prontos vindos de produto.ts -->
      <p>
        Produtos prontos no catálogo: <strong>{{ socialService.metaCatalog().length }}</strong>
      </p>

      <!-- Dispara o download de catalogo-3ddesign-meta.csv -->
      <button
        type="button"
        class="btn-baixar-csv"
        (click)="socialService.downloadMetaCatalogCsv()"
      >
        Baixar catalogo-3ddesign-meta.csv
      </button>
    </section>
  `,
  styleUrl: './exportar-meta.component.css' // Aponta para o arquivo CSS externo separado
})
export class ExportarMeta {
  // Injeta o SocialCommerceService para acessar o catálogo e baixar o CSV
  readonly socialService = inject(SocialCommerceService);
}