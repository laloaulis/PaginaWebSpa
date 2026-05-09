import { Component } from '@angular/core';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [PageFooterComponent],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'] // Corregido de styleUrl a styleUrls
})
export class ContactoComponent {
  title = 'Contacto';
}
