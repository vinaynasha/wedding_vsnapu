import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  headline = signal('Every Moment, Beautifully Preserved');
  subheadline = signal('Award-winning wedding photography & cinematography across India');
  heroVideoUrl = signal<string | null>(null);
  heroPosterUrl = signal<string | null>(null);
  heroImageUrl = signal<string | null>(null);

  ngOnInit() {
    this.contentService.getAll().subscribe({
      next: c => {
        if (c['hero.headline']) this.headline.set(c['hero.headline']);
        if (c['hero.subheadline']) this.subheadline.set(c['hero.subheadline']);
        if (c['hero.videoUrl']) this.heroVideoUrl.set(c['hero.videoUrl']);
        if (c['hero.posterUrl']) this.heroPosterUrl.set(c['hero.posterUrl']);
        if (c['hero.imageUrl']) this.heroImageUrl.set(c['hero.imageUrl']);
      },
      error: () => {}
    });
  }

  scrollToGallery() {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  }
}
