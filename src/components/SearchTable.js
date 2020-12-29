import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { SearchState, DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Toolbar,
  SearchPanel,
  VirtualTable,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";

import { Loading } from "./loader/Loading";
import { useQuery, gql } from "@apollo/client";

const EmployeeFormatter = ({ row }) => (
  <div
    style={{
      display: 'flex',
      gap: '14px',
      alignItems: 'center'
    }}
  >
    <div
 
    >
      <img
        src={row.photo_thumbnail}
        style={{
          height: '38px',
          width: '38px',
          borderRadius: '50%',
          margin: '0 auto',
        }}
        alt="Avatar"
      />
    </div>
    {row.name}
  </div>
);


const GET_INVESTORS = gql`
  query GetInvestors($search: String) {
    investor(limit: 20, where: { name: { _ilike: $search } }) {
      id
      name
      photo_thumbnail
    }
  }
`;

export const SearchTable = () => {
  const [columns] = useState([
    // { name: "id", title: "Id" },
    // { name: "name", title: "Name" },
    { name: "photo_thumbnail", title: "Name" },
  ]);

  const [searchValue, setSearchValue] = useState("%");

  const { loading, error, data } = useQuery(GET_INVESTORS, {
    variables: {
      search: searchValue,
    },
  });

  const [rows, setRows] = useState([]);

  const loadData = () => {
    if(rows && !data)
     return
    setRows(data.investor)
  };

  useEffect(() => loadData(), [loading]);



  const typeSearch = (value) => {
    setSearchValue(value + '%')
  };

  const [employeeColumns] = useState(['photo_thumbnail']);

  return (
    
    <Paper style={{ position: "relative" }}>
      <Grid rows={rows} columns={columns}>
      <DataTypeProvider
          for={employeeColumns}
          formatterComponent={EmployeeFormatter}
        />
        <SearchState onValueChange={typeSearch} />
        <VirtualTable />
        <TableHeaderRow />
        <Toolbar />
        <SearchPanel />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
