import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WeddingGalleryService } from '../../services/wedding-gallery.service';
import { WeddingGalleryItem } from '../../models/wedding.models';

@Component({
  selector: 'app-video-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-reviews.component.html',
  styleUrl: './video-reviews.component.css'
})
export class VideoReviewsComponent implements OnInit {
  private galleryService = inject(WeddingGalleryService);
  private sanitizer = inject(DomSanitizer);

  items = signal<WeddingGalleryItem[]>([]);
  playingId = signal<number | null>(null);
  playingEmbedUrl = signal<SafeResourceUrl | null>(null);

  ngOnInit() {
    this.galleryService.getActiveItems().subscribe({
      next: all => this.items.set(all.filter(i => i.galleryType === 'review-video')),
      error: () => {}
    });
  }

  play(item: WeddingGalleryItem) {
    if (this.isYoutube(item.mediaUrl)) {
      const id = this.getYoutubeId(item.mediaUrl);
      if (id) {
        this.playingEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
        ));
      }
    } else {
      this.playingEmbedUrl.set(null);
    }
    this.playingId.set(item.id);
  }

  isYoutube(url: string | null): boolean {
    return /youtube\.com|youtu\.be/.test(url ?? '');
  }

  getYoutubeId(url: string): string | null {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  getThumbnail(item: WeddingGalleryItem): string | null {
    if (item.thumbnailUrl) return this.toHttps(item.thumbnailUrl);
    if (this.isYoutube(item.mediaUrl)) {
      const id = this.getYoutubeId(item.mediaUrl);
      if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }
    return null;
  }

  private toHttps(url: string): string {
    return url.replace(/^http:\/\//i, 'https://');
  }
}
