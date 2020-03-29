import { Category } from './pages/categories/shared/category.model';
import { InMemoryDbService } from 'angular-in-memory-web-api';


export class InMemoryDatabase implements InMemoryDbService{
  createDb(){
    const categories = [
      {id: 1, name: 'Lazer', description: 'Cinema, parque, praia ...'},
      {id: 2, name: 'Serviços', description: 'Mecânico, chaveiro, eletricista...'},
      {id: 3, name: 'Saúde', description: 'Hospitais, Clínicas, estética...'}
    ];
    return { categories }
  }
}
