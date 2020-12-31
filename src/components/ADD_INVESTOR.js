import { gql } from "@apollo/client";

export const ADD_INVESTOR = gql`
  mutation AddInvestor(
    $name: String
    $photo_large: String
    $photo_thumbnail: String
  ) {
    insert_investor(
      objects: {
        name: $name
        photo_large: $photo_large
        photo_thumbnail: $photo_thumbnail
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
export const GET_INVESTORS = gql`
  query GetInvestors($search: String, $offsetBy: Int, $limitBy: Int) {
    investor(
      limit: $limitBy
      offset: $offsetBy
      where: { name: { _ilike: $search } }
    ) {
      investments {
        company {
          name
        }
      }
      id
      name
      photo_thumbnail
    }

    investor_aggregate(where: { name: { _ilike: $search } }) {
      aggregate {
        count
      }
    }
  }
`;
