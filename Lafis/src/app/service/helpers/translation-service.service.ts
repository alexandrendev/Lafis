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


  translateSourceType(sourceType: string | undefined | null): string {
    const normalizedType = (sourceType || '').toLowerCase();

    switch (normalizedType) {
      case 'spherical':
        return 'Esférica';
      case 'cuboid':
        return 'Prisma Retângular';
      case 'cylindrical':
        return 'Cilíndrica';
      case 'point':
        return 'Pontual';
      default:
        return sourceType || '-';
    }
  }

  translateApertureType(apertureType: string | undefined | null): string {
    const normalizedType = (apertureType || '').toLowerCase();

    switch (normalizedType) {
      case 'circular':
        return 'circular';
      case 'rectangular':
        return 'retangular';
      default:
        return apertureType || '-';
    }
  }
}
