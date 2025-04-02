import { Routes } from '@angular/router';
import { CadastroSimulacaoComponent } from './pages/cadastro-simulacao/cadastro-simulacao.component';
import { CardComponent } from './pages/simulation-listing/card.component';
import { SimulationReportComponent } from './pages/simulation-report/simulation-report.component';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register/register.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full' ,redirectTo: 'login'},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginPageComponent},
    {path: 'new', component: CadastroSimulacaoComponent},
    {path: 'home', component: CardComponent},
    {path: 'teste/:id', component: SimulationReportComponent}
];
