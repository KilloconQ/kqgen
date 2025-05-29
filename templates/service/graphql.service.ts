import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

// Importa los queries generados
import {
  GET_ALL_{{upperName}},
  GET_{{upperName}}_BY_ID,
  CREATE_{{upperName}},
  UPDATE_{{upperName}}
} from './queries';

@Injectable({ providedIn: 'root' })
export class {{pascalName}}Service {
  private readonly apollo: Apollo;

  constructor() {}

  getAll() {
    return this.apollo.query({
      query: GET_ALL_{{upperName}}
    });
  }

  getById(id: string) {
    return this.apollo.query({
      query: GET_{{upperName}}_BY_ID,
      variables: { id }
    });
  }

  create(input: any) {
    return this.apollo.mutate({
      mutation: CREATE_{{upperName}},
      variables: { input }
    });
  }

  update(id: string, input: any) {
    return this.apollo.mutate({
      mutation: UPDATE_{{upperName}},
      variables: { id, input }
    });
  }
}
