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


export const GET_ALL_INVESTORS = gql`
query GetAllInvestors {
  investor(distinct_on: name, limit: 10) {
    id
    name
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

export const DELETE_INVESTOR = gql`
  mutation DeleteInvestor($id: Int) {
    delete_company(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
