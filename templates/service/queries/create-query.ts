import { gql } from 'apollo-angular';

export const CREATE_{{upperName}} = gql`
  mutation Create{{pascalName}}($input: Create{{pascalName}}Input!) {
    create{{pascalName}}(input: $input) {
      id
      # ...others
    }
  }
`;
