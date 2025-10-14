export interface Product {
  id: string | number;
  name: string;
  price: number;
  category?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  stock?: number;
}
