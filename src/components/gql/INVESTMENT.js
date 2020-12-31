
import { gql } from "@apollo/client";

export const ADD_INVESTMENT = gql`
mutation AddInvestment(
  $amount: numeric
  $investor_id: Int
  $company_id: Int
) {
  insert_investment(
    objects: {
      amount: $amount
      investor_id: $investor_id
      company_id: $company_id
    }
  ) {
    returning {
      id
    }
  }
}
`;


export const GET_ALL_COMPANIES = gql`
  query GetAllCompanies {
    company(distinct_on: name) {
      id
      name
    }
  }
`;

export const UPDATE_INVESTMENT = gql`
  mutation UpdateInvestment($id: Int, $amount: numeric, $company_id: Int) {
    update_investment(
      where: { id: { _eq: $id } }
      _set: { amount: $amount, company_id: $company_id }
    ) {
      affected_rows
      returning {
        amount
        company {
          name
        }
      }
    }
  }
`;

export const DELETE_INVESTMENT = gql`
mutation DeleteInvestment($id: Int) {
  delete_investment(where: { id: { _eq: $id } }) {
    affected_rows
  }
}
`;

