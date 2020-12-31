import { gql } from "@apollo/client";

export const GET_INVESTORS = gql`
  query GetInvestors($search: String, $offsetBy: Int, $limitBy: Int) {
    company(
      limit: $limitBy
      offset: $offsetBy
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
export const ADD_INVESTOR = gql`
  mutation AddInvestor(
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
