import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WeddingGalleryService } from '../../services/wedding-gallery.service';
import { WeddingGalleryItem } from '../../models/wedding.models';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.css'
})
export class VideoGalleryComponent implements OnInit {
  private galleryService = inject(WeddingGalleryService);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('track') track!: ElementRef<HTMLDivElement>;

  items = signal<WeddingGalleryItem[]>([]);
  playingId = signal<number | null>(null);
  playingEmbedUrl = signal<SafeResourceUrl | null>(null);

  private dragging = false;
  private startX = 0;
  private scrollLeftPos = 0;
  private didDrag = false;

  ngOnInit() {
    this.galleryService.getActiveItems().subscribe({
      next: all => this.items.set(all.filter(i => i.galleryType === 'wedding-video')),
      error: () => {}
    });
  }

  // ── Drag scroll ──
  onDragStart(e: MouseEvent | TouchEvent) {
    this.dragging = true;
    this.didDrag = false;
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    this.startX = x - this.track.nativeElement.offsetLeft;
    this.scrollLeftPos = this.track.nativeElement.scrollLeft;
    this.track.nativeElement.style.cursor = 'grabbing';
  }

  onDragMove(e: MouseEvent | TouchEvent) {
    if (!this.dragging) return;
    e.preventDefault();
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    const walk = (x - this.startX - (-this.track.nativeElement.offsetLeft)) * 1.5;
    if (Math.abs(walk) > 5) this.didDrag = true;
    this.track.nativeElement.scrollLeft = this.scrollLeftPos - walk;
  }

  onDragEnd() {
    this.dragging = false;
    this.track.nativeElement.style.cursor = 'grab';
  }

  // ── Button scroll ──
  scrollBy(dir: 'left' | 'right') {
    const cards = this.track.nativeElement.children;
    const step = cards.length >= 2
      ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft
      : (cards[0] as HTMLElement)?.offsetWidth ?? 396;
    this.track.nativeElement.scrollBy({ left: dir === 'right' ? step : -step, behavior: 'smooth' });
  }

  // ── Inline play ──
  play(item: WeddingGalleryItem, e: MouseEvent) {
    if (this.didDrag) return;
    e.stopPropagation();
    if (this.isYoutube(item.mediaUrl)) {
      this.playingEmbedUrl.set(this.buildEmbedUrl(item.mediaUrl));
    }
    this.playingId.set(item.id);
  }

  // ── YouTube helpers ──
  isYoutube(url: string): boolean {
    return /youtube\.com|youtu\.be/.test(url ?? '');
  }

  getYoutubeId(url: string): string | null {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  private buildEmbedUrl(url: string): SafeResourceUrl {
    const id = this.getYoutubeId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    );
  }

  getThumbnail(item: WeddingGalleryItem): string {
    if (item.thumbnailUrl) return this.toHttps(item.thumbnailUrl);
    if (this.isYoutube(item.mediaUrl)) {
      const id = this.getYoutubeId(item.mediaUrl);
      return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
    }
    return '';
  }

  private toHttps(url: string): string {
    return url.replace(/^http:\/\//i, 'https://');
  }
}
