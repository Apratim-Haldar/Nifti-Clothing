export interface Category {
  _id: string;
  name: string;
}

export interface Product {
  _id?: string;
  title: string;
  description: string;
  price: number | string;
  sizes: string[];
  colors: string[] | string;
  imageUrl: string;
  categories: string[];
  inStock?: boolean;
  isHero?: boolean;
  heroImage?: string;
  heroTagline?: string;
  categoryDetails?: Category[];
}

export interface Review {
  _id: string;
  productId: string;
  userId?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  product?: Product;
}

export interface AdminTabProps {
  setMessage: (message: string, isError?: boolean) => void;
  setError: (error: string) => void;
}