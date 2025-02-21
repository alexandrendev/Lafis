import { Routes } from '@angular/router';
import { CadastroSimulacaoComponent } from './pages/cadastro-simulacao/cadastro-simulacao.component';
import { CardComponent } from './card/card.component';

export const routes: Routes = [
    {path: 'new', component: CadastroSimulacaoComponent},
    {path: '', component: CardComponent}
];
