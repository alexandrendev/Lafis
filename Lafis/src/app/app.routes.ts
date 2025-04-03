import { Routes } from '@angular/router';
import { CadastroSimulacaoComponent } from './pages/cadastro-simulacao/cadastro-simulacao.component';
import { CardComponent } from './pages/simulation-listing/card.component';
import { SimulationReportComponent } from './pages/simulation-report/simulation-report.component';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register/register.component';
import { authGuard } from './guards/auth-guard.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
    {path: '', pathMatch: 'full' ,redirectTo: 'login'},
    {path: 'register', component: RegisterComponent, canActivate: [noAuthGuard]},
    {path: 'login', component: LoginPageComponent, canActivate: [noAuthGuard]},
    {path: 'new', component: CadastroSimulacaoComponent, canActivate: [authGuard]},
    {path: 'home', component: CardComponent, canActivate: [authGuard]},
    {path: 'teste/:id', component: SimulationReportComponent, canActivate: [authGuard]}
];
