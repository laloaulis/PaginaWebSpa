import { Component } from '@angular/core';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [PageFooterComponent],
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.scss']
})
export class EquipoComponent {
  title = 'Equipo';
}
