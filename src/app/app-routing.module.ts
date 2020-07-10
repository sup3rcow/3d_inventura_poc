import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThreejsEditorComponent } from './components/threejs-editor/threejs-editor.component';


const routes: Routes = [
  { path: '', component: ThreejsEditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
