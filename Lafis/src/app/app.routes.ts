import { Routes } from '@angular/router';
import { CadastroSimulacaoComponent } from './pages/cadastro-simulacao/cadastro-simulacao.component';
import { CardComponent } from './pages/simulation-listing/card.component';
import { SimulationReportComponent } from './pages/simulation-report/simulation-report.component';

export const routes: Routes = [
    {path: 'new', component: CadastroSimulacaoComponent},
    {path: '', component: CardComponent},
    {path: 'teste/:id', component: SimulationReportComponent}
];
