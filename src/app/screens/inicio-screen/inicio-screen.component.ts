import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosComponent } from '../servicios/servicios.component';
import { AcercaDeComponent } from '../acerca-de/acerca-de.component';
import { EquipoComponent } from '../equipo/equipo.component';
import { GaleriaComponent } from '../galeria/galeria.component';
import { UbicacionComponent } from '../ubicacion/ubicacion.component';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';

type ActiveSection = 'inicio' | 'servicios' | 'acerca-de' | 'equipo' | 'galeria' | 'ubicacion';
type NavigationState = {
  component: ActiveSection;
  fragment?: string;
};

type NavigationOptions = {
  updateHistory?: boolean;
  replaceHistory?: boolean;
  scrollBehavior?: ScrollBehavior;
};

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

  activeComponent: ActiveSection = this.getNavigationStateFromUrl().component;
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
    this.applyNavigationState(
      { component, fragment },
      { updateHistory: true, scrollBehavior: 'smooth' }
    );
  }

  ngAfterViewInit(): void {
    const menuItems = this.header?.nativeElement.querySelectorAll('.menu-item');

    menuItems?.forEach(item => {
      item.classList.add('animate-bounce');
      setTimeout(() => item.classList.remove('animate-bounce'), 500);
    });

    this.observeFullImageSection();

    const initialState = this.getNavigationStateFromUrl();
    if (initialState.component !== 'inicio' || initialState.fragment) {
      this.applyNavigationState(initialState, {
        updateHistory: false,
        scrollBehavior: 'auto'
      });
    }
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

  @HostListener('window:popstate')
  onPopState(): void {
    this.applyNavigationState(this.getNavigationStateFromUrl(), {
      updateHistory: false,
      scrollBehavior: 'auto'
    });
  }

  private scrollToElement(element: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
    const headerHeight = this.header?.nativeElement.offsetHeight ?? 0;
    const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior
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

  private applyNavigationState(
    { component, fragment }: NavigationState,
    {
      updateHistory = false,
      replaceHistory = false,
      scrollBehavior = 'smooth'
    }: NavigationOptions
  ): void {
    this.closePromoImageFullscreen();
    this.closePromoModal();
    this.closeMobileMenu();
    this.activeComponent = component;

    if (updateHistory) {
      this.updateBrowserUrl({ component, fragment }, replaceHistory);
    }

    requestAnimationFrame(() => {
      if (fragment) {
        const fragmentTarget = document.getElementById(fragment);
        if (fragmentTarget) {
          this.scrollToElement(fragmentTarget, scrollBehavior);
          return;
        }
      }

      const fallbackTarget =
        component === 'inicio'
          ? this.inicioSection?.nativeElement
          : this.contentSection?.nativeElement;

      if (fallbackTarget) {
        this.scrollToElement(fallbackTarget, scrollBehavior);
      }
    });

    this.animateNavigationSelection(component);
  }

  private animateNavigationSelection(component: ActiveSection): void {
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

  private getNavigationStateFromUrl(): NavigationState {
    if (typeof window === 'undefined') {
      return { component: 'inicio' };
    }

    const url = new URL(window.location.href);
    const requestedSection = url.searchParams.get('section');
    const fragment = url.hash ? decodeURIComponent(url.hash.slice(1)) : undefined;

    return {
      component: this.isActiveSection(requestedSection) ? requestedSection : 'inicio',
      fragment
    };
  }

  private updateBrowserUrl({ component, fragment }: NavigationState, replaceHistory: boolean): void {
    if (typeof window === 'undefined') {
      return;
    }

    const url = new URL(window.location.href);

    if (component === 'inicio') {
      url.searchParams.delete('section');
    } else {
      url.searchParams.set('section', component);
    }

    url.hash = fragment ? encodeURIComponent(fragment) : '';

    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextUrl === currentUrl) {
      return;
    }

    const state = { section: component, fragment: fragment ?? null };

    if (replaceHistory) {
      window.history.replaceState(state, '', nextUrl);
      return;
    }

    window.history.pushState(state, '', nextUrl);
  }

  private isActiveSection(value: string | null): value is ActiveSection {
    return value === 'inicio'
      || value === 'servicios'
      || value === 'acerca-de'
      || value === 'equipo'
      || value === 'galeria'
      || value === 'ubicacion';
  }
}
