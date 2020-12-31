import { gql } from "@apollo/client";

export const GET_INVESTOR_DETAIL = gql`
  query GetInvestorDetail($id: Int) {
    investor(where: { id: { _eq: $id } }) {
      id
      name
      photo_large
      photo_thumbnail
      investments(order_by: { created_at: desc }) {
        id
        amount
        company {
          id
          name
        }
      }
    }
  }
`;
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
export const UPDATE_INVESTOR = gql`
  mutation UpdateInvestor(
    $id: Int
    $name: String
    $photo_large: String
    $photo_thumbnail: String
  ) {
    update_investor(
      where: { id: { _eq: $id } }
      _set: {
        name: $name
        photo_large: $photo_large
        photo_thumbnail: $photo_thumbnail
      }
    ) {
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
    delete_investor(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
