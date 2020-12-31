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
export const GET_COMPANY_DETAIL = gql`
  query GetCompanyDetail($id: Int) {
    company(where: { id: { _eq: $id } }) {
      id
      name
      investments(order_by: { created_at: desc }) {
        id
        amount
        investor {
          id
          name
          photo_thumbnail
        }
      }
    }
  }
`;
export const GET_ALL_INVESTORS = gql`
  query GetAllInvestors {
    investor(distinct_on: name, limit: 10) {
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
export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: Int, $name: String) {
    update_company(where: { id: { _eq: $id } }, _set: { name: $name }) {
      affected_rows
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
export const DELETE_INVESTOR = gql`
  mutation DeleteInvestor($id: Int) {
    delete_company(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
