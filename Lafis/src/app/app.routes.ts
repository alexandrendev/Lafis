import { Routes } from '@angular/router';
import { CadastroSimulacaoComponent } from './pages/cadastro-simulacao/cadastro-simulacao.component';
import { CardComponent } from './card/card.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {path: '', component: CadastroSimulacaoComponent},
    {path: 'all', component: CardComponent}
];
