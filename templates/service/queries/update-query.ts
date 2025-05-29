import { gql } from 'apollo-angular';

export const UPDATE_{{upperName}} = gql`
  mutation Update{{pascalName}}($id: ID!, $input: Update{{pascalName}}Input!) {
    update{{pascalName}}(id: $id, input: $input) {
      id
      # ...others
    }
  }
`;
