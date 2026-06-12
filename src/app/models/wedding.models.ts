export interface WeddingEnquiryRequest {
  name: string;
  contact: string;
  eventType?: string;
  weddingDate?: string;
  pageName?: string;
}

export interface WeddingGalleryItem {
  id: number;
  title?: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video' | string;
  thumbnailUrl?: string;
  category?: string;
  location?: string | null;
  galleryType: string; // wedding-photo | wedding-video | pre-wedding | hero
  sortOrder: number;
  isActive: boolean;
}

export interface WeddingClient {
  id: number;
  name: string;
  tickerRow: number; // 1 = scrolls left, 2 = scrolls right
}

export interface WeddingTestimonial {
  id: number;
  clientName: string;
  quote: string;
  eventType?: string;
  location?: string;
  avatarUrl?: string;
}
