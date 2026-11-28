// Importa recursos reativos, de injeção e de serviço do Angular
import { computed, inject, Injectable, signal } from '@angular/core';
// Importa os modelos de perfil social e item de catálogo padrão Meta
import { MetaCatalogItem, SocialProfileItem } from '../models/meta-catalog.model';
// Importa a interface/classe de produto de src/app/services/produto.ts
import { ProdutoMeta } from '../../services/produto';

// Regista o serviço na raiz da aplicação para injeção em qualquer componente
@Injectable({
  providedIn: 'root'
})
export class SocialCommerceService {
  // Endereço base da loja publicada no Vercel
  readonly storeBaseUrl = 'https://loja3ddesign.vercel.app';

  // Sinal reativo com os perfis oficiais exibidos no rodapé para o cliente
  readonly profiles = signal<SocialProfileItem[]>([
    {
      id: 'ig-fcgaragepaint',
      platform: 'instagram',
      label: 'Instagram',
      handleOrName: '@fcgaragepaint',
      url: 'https://www.instagram.com/fcgaragepaint/'
    },
    {
      id: 'ig-elimarfae',
      platform: 'instagram',
      label: 'Instagram',
      handleOrName: '@elimarfae',
      url: 'https://www.instagram.com/elimarfae/'
    },
    {
      id: 'fb-loja',
      platform: 'facebook',
      label: 'Facebook',
      handleOrName: '3DDesign',
      url: 'https://www.facebook.com/'
    }
  ]);

  // Sinal reativo com os itens do catálogo (preencha ou alimente via setProdutosCatalogo())
  readonly produtos = signal<ProdutoMeta[]>([]);

  // Permite alimentar o catálogo a partir de qualquer componente/serviço que tenha os ProdutoMeta[]
  setProdutosCatalogo(lista: ProdutoMeta[]): void {
    this.produtos.set(lista ?? []);
  }

  // Converte automaticamente todos os produtos para o formato MetaCatalogItem
  readonly metaCatalog = computed<MetaCatalogItem[]>(() =>
    this.produtos().map((produto) => {
      // Remove quebras de linha (\n) do título e da descrição para evitar falhas no CSV da Meta
      const cleanTitle = produto.title.replace(/\s*\n+\s*/g, ' ').trim();
      const cleanDescription = produto.description.replace(/\s*\n+\s*/g, ' ').trim();

      // Garante que image_link vire URL público completo em https://loja3ddesign.vercel.app/...
      const cleanImagePath = produto.image_link.replace(/^\/+/, '');
      const fullImageUrl = produto.image_link.startsWith('http')
        ? produto.image_link
        : `${this.storeBaseUrl}/${cleanImagePath}`;

      // Garante valores válidos para availability e condition no padrão do catálogo Meta
      const availability: MetaCatalogItem['availability'] =
        produto.availability === 'out of stock' ? 'out of stock' : 'in stock';
      const condition: MetaCatalogItem['condition'] =
        produto.condition === 'refurbished' || produto.condition === 'used'
          ? produto.condition
          : 'new';

      return {
        id: produto.id,
        title: cleanTitle,
        description: cleanDescription,
        availability,
        condition,
        price: produto.price,
        // Usa produto.link se já existir ou monta o URL direto com o id do produto
        link: produto.link || `${this.storeBaseUrl}/?produto=${encodeURIComponent(produto.id)}`,
        image_link: fullImageUrl,
        brand: produto.brand || '3DDesign'
      };
    })
  );

  // Gera o URL oficial de compartilhamento no Facebook codificando o link informado
  getFacebookShareUrl(targetUrl: string): string {
    const cleanUrl = targetUrl?.trim() || this.storeBaseUrl;
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`;
  }

  // Monta o conteúdo CSV completo com os produtos formatados para importar no Meta Commerce Manager
  buildMetaCatalogCsv(): string {
    // Cabeçalhos oficiais esperados pelo feed de catálogo da Meta
    const headers = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand'
    ];

    // Escapa aspas duplas e envolve cada campo entre aspas para proteger vírgulas das dimensões
    const escapeCsv = (value: string): string =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    // Transforma cada MetaCatalogItem em uma linha CSV
    const rows = this.metaCatalog().map((item) =>
      [
        item.id,
        item.title,
        item.description,
        item.availability,
        item.condition,
        item.price,
        item.link,
        item.image_link,
        item.brand
      ]
        .map(escapeCsv)
        .join(',')
    );

    // Junta o cabeçalho e todas as linhas do catálogo
    return [headers.join(','), ...rows].join('\n');
  }

  // Dispara o download do arquivo catalogo-3ddesign-meta.csv no navegador
  downloadMetaCatalogCsv(): void {
    const csvContent = this.buildMetaCatalogCsv();
    // Inclui BOM UTF-8 (\uFEFF) para manter acentos como Árvore e Papai Noel íntegros
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'catalogo-3ddesign-meta.csv';
    anchor.click();

    URL.revokeObjectURL(url);
  }
}