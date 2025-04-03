export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
  categoryId: string;
  brand?: string;
  images: string[];
  features?: string[];
  rating: number;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
  affiliateUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
} 