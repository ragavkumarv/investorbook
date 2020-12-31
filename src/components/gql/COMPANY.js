import { gql } from "@apollo/client";

export const ADD_COMPANY = gql`
  mutation AddCompany(
    $name: String
  ) {
    insert_company(
      objects: {
        name: $name
      }
    ) {
      affected_rows
      returning {
        id
        name
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

export const GET_COMPANIES = gql`
  query GetCompanies($search: String, $offsetBy: Int, $limitBy: Int, $orderBy: [company_order_by!] ) {
    company(
      limit: $limitBy,
      offset: $offsetBy,
      order_by: $orderBy,
      where: { name: { _ilike: $search } }
    ) {
      investments {
        investor {
          name
        }
      }
      id
      name
    }

    company_aggregate(where: { name: { _ilike: $search } }) {
      aggregate {
        count
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