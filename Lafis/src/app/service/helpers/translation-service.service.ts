import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationServiceService {

  constructor() { }


  translateStatus(status: string): string {
    switch (status) {
      case 'CREATED':
        return 'Criada';
      case 'PENDING':
        return 'Pendente';
      case 'RUNNING':
        return 'Em execução';
      case 'FINISHED':
        return 'Finalizada';
      default:
        return status;
    }
  }


  translateSourceType(sourceType: string): string {
    switch (sourceType) {
      case 'spherical':
        return 'Esférica';
      case 'prismatica':
        return 'Prisma Retângular';
      case 'cylindrical':
        return 'Cilíndrica';
      default:
        return sourceType;
    }
  }

  translateApertureType(apertureType: string): string {
    switch (apertureType) {
      case 'circular':
        return 'circular';
      case 'rectangular':
        return 'retangular';
      default:
        return apertureType;
    }
  }
}
