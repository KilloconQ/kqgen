import { gql } from 'apollo-angular';

export const GET_{{upperName}}_BY_ID = gql`
  query Get{{pascalName}}ById($id: ID!) {
    {{name}}(id: $id) {
      id
      # ...otros campos
    }
  }
`;
