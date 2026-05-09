import { Component } from '@angular/core';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';

@Component({
  selector: 'app-acerca-de',
  standalone: true,
  imports: [PageFooterComponent],
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.scss']
})
export class AcercaDeComponent {
  title = 'Acerca de';
}
