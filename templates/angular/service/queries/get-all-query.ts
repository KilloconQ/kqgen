import { gql } from 'apollo-angular';

export const GET_ALL_{{upperName}} = gql`
  query GetAll{{pascalName}} {
    {{name}}s {
      id
      # ...others
    }
  }
`;
