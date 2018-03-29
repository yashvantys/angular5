import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent }      from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import {TestComponent} from './test/test.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch:'full' },
  { path: 'about', component: AboutComponent },
  { path: 'test', component: TestComponent },
  { path: 'product', component: ProductsComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent, pathMatch:'full'},
  { path: '', redirectTo:'/login', pathMatch:'full' },
  { path: 'logout', component: LoginComponent, pathMatch:'full'},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
