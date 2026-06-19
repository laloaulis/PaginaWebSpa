import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosComponent } from '../servicios/servicios.component';
import { AcercaDeComponent } from '../acerca-de/acerca-de.component';
import { EquipoComponent } from '../equipo/equipo.component';
import { GaleriaComponent } from '../galeria/galeria.component';
import { UbicacionComponent } from '../ubicacion/ubicacion.component';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';

type ActiveSection = 'inicio' | 'servicios' | 'acerca-de' | 'equipo' | 'galeria' | 'ubicacion';

@Component({
  selector: 'app-inicio-screen',
  standalone: true,
  imports: [
    CommonModule,
    ServiciosComponent,
    AcercaDeComponent,
    EquipoComponent,
    GaleriaComponent,
    UbicacionComponent,
    PageFooterComponent
  ],
  templateUrl: './inicio-screen.component.html',
  styleUrls: ['./inicio-screen.component.scss']
})
export class InicioScreenComponent implements AfterViewInit, OnDestroy {
  @ViewChild('header', { static: false }) header!: ElementRef<HTMLElement>;
  @ViewChild('inicioSection') inicioSection?: ElementRef<HTMLElement>;
  @ViewChild('contentSection') contentSection?: ElementRef<HTMLElement>;
  @ViewChild('fullImageSection') fullImageSection?: ElementRef<HTMLElement>;

  activeComponent: ActiveSection = 'inicio';
  isMobileMenuOpen = false;
  isPromoModalOpen = false;
  isPromoImageFullscreen = false;
  lastScroll = 0;
  readonly promoImageSrc = 'assets/images/promo.jpeg';
  readonly promoImageAlt = 'Promocion del mes de Glory Spa';
  readonly promoTitle = 'Promoción del mes: Ritual de hidratación';
  readonly promoDescription = 'Aprovecha un 20% de descuento en nuestro Ritual de Hidratación durante todo el mes. Incluye diagnóstico facial y masaje especializado.';
  readonly promoCtaText = 'Reservar ahora por WhatsApp';
  readonly promoCtaHref = 'https://wa.me/522291691480?text=Hola,%20quiero%20reservar%20la%20promoci%C3%B3n%20del%20mes';

  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly scrollThreshold = 10;
  private readonly debounceTime = 100;
  private readonly mobileBreakpoint = 768;
  private fullImageObserver?: IntersectionObserver;

  @HostListener('window:scroll')
  onScroll(): void {
    const headerElement = this.header?.nativeElement;
    if (!headerElement) {
      return;
    }

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (this.isMobileViewport()) {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = null;
      }

      headerElement.classList.remove('header--scroll-down', 'header--scroll-up');
      this.lastScroll = currentScroll;
      return;
    }

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      const nextScroll = window.pageYOffset || document.documentElement.scrollTop || 0;

      if (this.isMobileMenuOpen) {
        headerElement.classList.remove('header--scroll-down', 'header--scroll-up');
        this.lastScroll = nextScroll;
        return;
      }

      const scrollDelta = Math.abs(nextScroll - this.lastScroll);
      if (scrollDelta < this.scrollThreshold) {
        return;
      }

      if (nextScroll <= 0) {
        headerElement.classList.remove('header--scroll-down', 'header--scroll-up');
      } else if (nextScroll > this.lastScroll) {
        headerElement.classList.add('header--scroll-down');
        headerElement.classList.remove('header--scroll-up');
      } else {
        headerElement.classList.remove('header--scroll-down');
        headerElement.classList.add('header--scroll-up');
      }

      this.lastScroll = nextScroll;
    }, this.debounceTime);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isMobileViewport()) {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = null;
      }

      this.header?.nativeElement.classList.remove('header--scroll-down', 'header--scroll-up');
      return;
    }

    this.closeMobileMenu();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isPromoImageFullscreen) {
      this.closePromoImageFullscreen();
      return;
    }

    if (this.isPromoModalOpen) {
      this.closePromoModal();
      return;
    }

    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  setActiveComponent(component: ActiveSection, fragment?: string): void {
    this.closePromoModal();
    this.closeMobileMenu();
    this.activeComponent = component;

    requestAnimationFrame(() => {
      if (fragment) {
        const fragmentTarget = document.getElementById(fragment);
        if (fragmentTarget) {
          this.scrollToElement(fragmentTarget);
          return;
        }
      }

      const fallbackTarget =
        component === 'inicio'
          ? this.inicioSection?.nativeElement
          : this.contentSection?.nativeElement;

      if (fallbackTarget) {
        this.scrollToElement(fallbackTarget);
      }
    });

    const selectedItem = this.header?.nativeElement.querySelector(`[data-component="${component}"]`) as HTMLElement | null;

    if (!selectedItem) {
      return;
    }

    if (component === 'inicio') {
      selectedItem.classList.add('animate-highlight');
      setTimeout(() => selectedItem.classList.remove('animate-highlight'), 500);
      requestAnimationFrame(() => {
        this.restartHeroAnimations();
        this.observeFullImageSection();
      });
      return;
    }

    selectedItem.classList.add('animate-bounce');
    setTimeout(() => selectedItem.classList.remove('animate-bounce'), 500);
  }

  ngAfterViewInit(): void {
    const menuItems = this.header?.nativeElement.querySelectorAll('.menu-item');

    menuItems?.forEach(item => {
      item.classList.add('animate-bounce');
      setTimeout(() => item.classList.remove('animate-bounce'), 500);
    });

    this.observeFullImageSection();
  }

  ngOnDestroy(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.fullImageObserver?.disconnect();
    this.setBodyScrollLock(false);
  }

  toggleMobileMenu(): void {
    if (!this.isMobileViewport()) {
      return;
    }

    this.setMobileMenuState(!this.isMobileMenuOpen);
  }

  closeMobileMenu(): void {
    this.setMobileMenuState(false);
  }

  openPromoModal(): void {
    this.closeMobileMenu();
    this.isPromoModalOpen = true;
    this.setBodyScrollLock(true);
  }

  closePromoModal(): void {
    if (!this.isPromoModalOpen) {
      return;
    }

    this.isPromoModalOpen = false;
    this.setBodyScrollLock(this.isMobileMenuOpen);
  }

  openPromoImageFullscreen(): void {
    this.isPromoImageFullscreen = true;
    this.setBodyScrollLock(true);
  }

  closePromoImageFullscreen(): void {
    if (!this.isPromoImageFullscreen) {
      return;
    }

    this.isPromoImageFullscreen = false;
    this.setBodyScrollLock(this.isPromoModalOpen || this.isMobileMenuOpen);
  }

  private scrollToElement(element: HTMLElement): void {
    const headerHeight = this.header?.nativeElement.offsetHeight ?? 0;
    const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: 'smooth'
    });
  }

  private restartHeroAnimations(): void {
    const homeRoot = this.inicioSection?.nativeElement;
    if (!homeRoot) {
      return;
    }

    const animatedElements = homeRoot.querySelectorAll(
      '.img, .hero-content, .hero-content h1, .hero-copy, .hero .buttons'
    );

    animatedElements.forEach(elementRef => {
      const element = elementRef as HTMLElement;
      element.style.animation = 'none';
      void element.offsetHeight;
      element.style.animation = '';
    });
  }

  private observeFullImageSection(): void {
    const section = this.fullImageSection?.nativeElement;
    if (!section) {
      return;
    }

    this.fullImageObserver?.disconnect();

    this.fullImageObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.classList.add('is-visible');
            this.fullImageObserver?.unobserve(section);
          }
        });
      },
      {
        threshold: 0.35
      }
    );

    this.fullImageObserver.observe(section);
  }

  private isMobileViewport(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= this.mobileBreakpoint;
  }

  private setMobileMenuState(open: boolean): void {
    this.isMobileMenuOpen = open;
    this.setBodyScrollLock(open || this.isPromoModalOpen);

    if (open) {
      this.header?.nativeElement.classList.remove('header--scroll-down', 'header--scroll-up');
    }
  }

  private setBodyScrollLock(locked: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.style.overflow = locked ? 'hidden' : '';
  }
}
