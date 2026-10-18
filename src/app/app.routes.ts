import { Routes } from '@angular/router';
import { VitrineComponent } from './components/vitrine/vitrine.component';
import { ProdutoDetalheComponent } from './components/produto-detalhe/produto-detalhe.component';

export const routes: Routes = [
  { path: '', component: VitrineComponent },
  { path: 'produto/:id', component: ProdutoDetalheComponent }
];