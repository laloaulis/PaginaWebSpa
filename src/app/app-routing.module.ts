import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioScreenComponent } from './screens/inicio-screen/inicio-screen.component';

const routes: Routes = [
  { path: '', component: InicioScreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }