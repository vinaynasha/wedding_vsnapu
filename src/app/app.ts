import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { VideoGalleryComponent } from './components/video-gallery/video-gallery.component';
import { ClientsTickerComponent } from './components/clients-ticker/clients-ticker.component';
import { QuoteSectionComponent } from './components/quote-section/quote-section.component';
import { PreWeddingGalleryComponent } from './components/pre-wedding-gallery/pre-wedding-gallery.component';
import { PreWeddingVideoGalleryComponent } from './components/pre-wedding-video-gallery/pre-wedding-video-gallery.component';
import { VideoReviewsComponent } from './components/video-reviews/video-reviews.component';
import { WhyVsnapuComponent } from './components/why-vsnapu/why-vsnapu.component';
import { FooterComponent } from './components/footer/footer.component';
import { EnquiryModalComponent } from './components/enquiry-modal/enquiry-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    PhotoGalleryComponent,
    VideoGalleryComponent,
    ClientsTickerComponent,
    QuoteSectionComponent,
    PreWeddingGalleryComponent,
    PreWeddingVideoGalleryComponent,
    VideoReviewsComponent,
    WhyVsnapuComponent,
    FooterComponent,
    EnquiryModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
