import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WeddingGalleryService } from '../../services/wedding-gallery.service';
import { WeddingGalleryItem } from '../../models/wedding.models';

@Component({
  selector: 'app-pre-wedding-video-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pre-wedding-video-gallery.component.html',
  styleUrl: './pre-wedding-video-gallery.component.css'
})
export class PreWeddingVideoGalleryComponent implements OnInit {
  private galleryService = inject(WeddingGalleryService);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('track') track!: ElementRef<HTMLDivElement>;

  items = signal<WeddingGalleryItem[]>([]);
  playingId = signal<number | null>(null);
  playingEmbedUrl = signal<SafeResourceUrl | null>(null);

  private dragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private didDrag = false;

  ngOnInit() {
    this.galleryService.getActiveItems().subscribe({
      next: all => this.items.set(all.filter(i => i.galleryType === 'pre-wedding-video')),
      error: () => {}
    });
  }

  onDragStart(e: MouseEvent | TouchEvent) {
    this.dragging = true;
    this.didDrag = false;
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    this.startX = x - this.track.nativeElement.offsetLeft;
    this.scrollLeft = this.track.nativeElement.scrollLeft;
  }

  onDragMove(e: MouseEvent | TouchEvent) {
    if (!this.dragging) return;
    e.preventDefault();
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    const walk = (x - this.startX - (-this.track.nativeElement.offsetLeft)) * 1.5;
    if (Math.abs(walk) > 5) this.didDrag = true;
    this.track.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onDragEnd() {
    this.dragging = false;
  }

  scrollBy(dir: 'left' | 'right') {
    this.track.nativeElement.scrollBy({ left: dir === 'right' ? 420 : -420, behavior: 'smooth' });
  }

  play(item: WeddingGalleryItem, e: Event) {
    if (this.didDrag) return;
    e.stopPropagation();
    if (this.isYoutube(item.mediaUrl)) {
      this.playingEmbedUrl.set(this.buildEmbedUrl(item.mediaUrl));
    }
    this.playingId.set(item.id);
  }

  isYoutube(url: string | null): boolean {
    return /youtube\.com|youtu\.be/.test(url ?? '');
  }

  private buildEmbedUrl(url: string): SafeResourceUrl {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    const id = m ? m[1] : '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    );
  }

  getThumbnail(item: WeddingGalleryItem): string | null {
    if (item.thumbnailUrl) return item.thumbnailUrl;
    if (this.isYoutube(item.mediaUrl)) {
      const m = item.mediaUrl.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      if (m) return `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg`;
    }
    return null;
  }
}
