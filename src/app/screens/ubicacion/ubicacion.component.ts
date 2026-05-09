import { Component } from '@angular/core';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [PageFooterComponent],
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent {
  title = 'Ubicacion';
}
