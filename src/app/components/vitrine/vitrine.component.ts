import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService, ProdutoMeta } from '../../services/produto';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.css']
})
export class VitrineComponent implements OnInit {
  listaDeProdutos: ProdutoMeta[] = [];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.listaDeProdutos = this.produtoService.getProdutos();
  }
}
