import { Routes } from '@angular/router';
import { CadastroSimulacaoComponent } from './pages/cadastro-simulacao/cadastro-simulacao.component';
import { CardComponent } from './card/card.component';

export const routes: Routes = [
    {path: 'cadastro', component: CadastroSimulacaoComponent},
    {path: 'all', component: CardComponent}
];
