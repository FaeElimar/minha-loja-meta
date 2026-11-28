// Define os tipos de redes sociais suportados na integração com o ecossistema Meta
export type SocialPlatform = 'instagram' | 'facebook';

// Representa cada link de perfil ou conta social apresentado na loja
export interface SocialProfileItem {
  id: string;
  platform: SocialPlatform;
  label: string;
  handleOrName: string;
  url: string;
}

// Estrutura de um produto compatível com o feed do Meta Commerce Manager
export interface MetaCatalogItem {
  id: string;
  title: string;
  description: string;
  availability: 'in stock' | 'out of stock';
  condition: 'new' | 'refurbished' | 'used';
  price: string;
  link: string;
  image_link: string;
  brand: string;
}