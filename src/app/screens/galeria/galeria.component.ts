import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';

type GalleryImage = {
  alt: string;
  src: string;
};

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, PageFooterComponent],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss']
})
export class GaleriaComponent implements OnDestroy {
  title = 'Galeria';

  images: GalleryImage[] = [
    { src: 'assets/images/img1_inicio.jpg', alt: 'Detalle de cabina en Glory Spa' },
    { src: 'assets/images/img2_inicio.jpg', alt: 'Ritual de relajacion en cabina' },
    { src: 'assets/images/img3_inicio.jpg', alt: 'Momento de preparacion de tratamiento' },
    { src: 'assets/images/img4_inicio.jpg', alt: 'Sesion facial en proceso' },
    { src: 'assets/images/img5_inicio.jpg', alt: 'Productos y herramientas de trabajo' },
    { src: 'assets/images/img6_inicio.jpg', alt: 'Ambiente de descanso y cuidado' }
  ];

  selectedIndex: number | null = null;
  private touchStartX = 0;
  private readonly swipeThreshold = 50;

  get selectedImage(): GalleryImage | null {
    if (this.selectedIndex === null) {
      return null;
    }

    return this.images[this.selectedIndex] ?? null;
  }

  openImage(index: number): void {
    this.selectedIndex = index;
    this.setBodyScrollLock(true);
  }

  closeImage(): void {
    this.selectedIndex = null;
    this.setBodyScrollLock(false);
  }

  showPreviousImage(): void {
    if (this.selectedIndex === null) {
      return;
    }

    this.selectedIndex = (this.selectedIndex - 1 + this.images.length) % this.images.length;
  }

  showNextImage(): void {
    if (this.selectedIndex === null) {
      return;
    }

    this.selectedIndex = (this.selectedIndex + 1) % this.images.length;
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.selectedImage) {
      this.closeImage();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeftKey(): void {
    if (this.selectedImage) {
      this.showPreviousImage();
    }
  }

  @HostListener('document:keydown.arrowright')
  onArrowRightKey(): void {
    if (this.selectedImage) {
      this.showNextImage();
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.selectedImage && event.touches.length > 0) {
      this.touchStartX = event.touches[0].clientX;
    }
  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (!this.selectedImage || event.changedTouches.length === 0) {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = this.touchStartX - touchEndX;

    // Deslizar hacia la izquierda (swipeDistance positivo) = siguiente imagen
    if (swipeDistance > this.swipeThreshold) {
      this.showNextImage();
    }
    // Deslizar hacia la derecha (swipeDistance negativo) = imagen anterior
    else if (swipeDistance < -this.swipeThreshold) {
      this.showPreviousImage();
    }
  }

  private setBodyScrollLock(locked: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.style.overflow = locked ? 'hidden' : '';
  }
}
