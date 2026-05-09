import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioScreenComponent } from './screens/inicio-screen/inicio-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InicioScreenComponent],
  template: '<app-inicio-screen></app-inicio-screen>',
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'spa_web';
}
