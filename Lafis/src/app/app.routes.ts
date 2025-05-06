import { Routes } from '@angular/router';
import { CadastroSimulacaoComponent } from './pages/cadastro-simulacao/cadastro-simulacao.component';
import { CardComponent } from './pages/simulation-listing/card.component';
import { SimulationReportComponent } from './pages/simulation-report/simulation-report.component';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register/register.component';
import { authGuard } from './guards/auth-guard.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full' ,redirectTo: 'login'},
    {path: 'register', component: RegisterComponent, canActivate: [noAuthGuard]},
    {path: 'login', component: LoginPageComponent, canActivate: [noAuthGuard]},
    {path: 'new', component: CadastroSimulacaoComponent, canActivate: [authGuard]},
    {path: 'all', component: CardComponent, canActivate: [authGuard]},
    {path: 'home', component: HomeComponent, canActivate: [authGuard]},
    {path: 'report/:id', component: SimulationReportComponent, canActivate: [authGuard]},
    {path: 'account', component: AccountComponent, canActivate: [authGuard]}
];
