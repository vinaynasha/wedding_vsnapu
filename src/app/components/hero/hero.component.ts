import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WeddingContentService } from '../../services/wedding-content.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit {
  private contentService = inject(WeddingContentService);
  private sanitizer = inject(DomSanitizer);

  headline = signal('Every Moment, Beautifully Preserved');
  subheadline = signal('Award-winning wedding photography & cinematography across India');
  heroVideoUrl = signal<string | null>(null);
  heroYoutubeEmbedUrl = signal<SafeResourceUrl | null>(null);
  heroPosterUrl = signal<string | null>(null);
  heroImageUrl = signal<string | null>(null);

  ngOnInit() {
    this.contentService.getAll().subscribe({
      next: c => {
        if (c['hero.headline']) this.headline.set(c['hero.headline']);
        if (c['hero.subheadline']) this.subheadline.set(c['hero.subheadline']);
        if (c['hero.videoUrl']) {
          const url = c['hero.videoUrl'];
          const ytId = this.extractYoutubeId(url);
          if (ytId) {
            this.heroYoutubeEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
            ));
          } else {
            this.heroVideoUrl.set(url);
          }
        }
        if (c['hero.posterUrl']) this.heroPosterUrl.set(c['hero.posterUrl']);
        if (c['hero.imageUrl']) this.heroImageUrl.set(c['hero.imageUrl']);
      },
      error: () => {}
    });
  }

  private extractYoutubeId(url: string): string | null {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  scrollToGallery() {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  }
}
