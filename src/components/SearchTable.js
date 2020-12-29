import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import {
  SearchState,
  DataTypeProvider,
  PagingState,
  IntegratedPaging,
} from "@devexpress/dx-react-grid";

import {
  Plugin,
  Template,
  TemplatePlaceholder
} from "@devexpress/dx-react-core";


import {
  Grid,
  Toolbar,
  SearchPanel,
  VirtualTable,
  TableHeaderRow,
  PagingPanel,
} from "@devexpress/dx-react-grid-material-ui";

import Button from "@material-ui/core/Button";

import { Loading } from "./loader/Loading";
import { useQuery, gql } from "@apollo/client";

const EmployeeFormatter = ({ row }) => (
  <div
    style={{
      display: "flex",
      gap: "14px",
      alignItems: "center",
    }}
  >
    <div>
      <img
        src={row.photo_thumbnail}
        style={{
          height: "38px",
          width: "38px",
          borderRadius: "50%",
          margin: "0 auto",
        }}
        alt="Avatar"
      />
    </div>
    {row.name}
  </div>
);

const CustomToolbarMarkup = () => (
  <Plugin name="customToolbarMarkup">
    <Template name="toolbarContent">
      <div style={{
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}>
       <h2>INVESTORS</h2>
       <Button variant="outlined" color="primary">
          Add Investor
        </Button>

      </div>

      <TemplatePlaceholder />
    </Template>
  </Plugin>
);

const GET_INVESTORS = gql`
  query GetInvestors($search: String) {
    investor(limit: 300, where: { name: { _ilike: $search } }) {
      investments {
        company {
          name
        }
      }
      id
      name
      photo_thumbnail
    }
  }
`;

export const SearchTable = () => {
  const [columns] = useState([
    { name: "photo_thumbnail", title: "Name" },
    { name: "investments", title: "Investments" },
  ]);

  const [pageSizes] = useState([5, 10, 15]);

  const [searchValue, setSearchValue] = useState("%");

  const { loading, error, data } = useQuery(GET_INVESTORS, {
    variables: {
      search: searchValue,
    },
  });

  const [rows, setRows] = useState([]);

  const loadData = () => {
    if (rows && !data) return;
    setRows(
      data.investor.map((detail) => ({
        ...detail,
        investments: detail.investments
          .map(({ company }) => company.name)
          .join(", "),
      }))
    );
  };

  useEffect(() => loadData(), [loading]);

  const typeSearch = (value) => {
    setSearchValue(value + "%");
  };

  const [employeeColumns] = useState(["photo_thumbnail"]);

  return (
    <Paper style={{ position: "relative" }}>
      {/* <div
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}
      >
        <h2>INVESTORS</h2>
        <Button variant="outlined" color="primary">
          Add Company
        </Button>
      </div> */}
      <Grid rows={rows} columns={columns}>
        <DataTypeProvider
          for={employeeColumns}
          formatterComponent={EmployeeFormatter}
        />
        <PagingState defaultCurrentPage={0} defaultPageSize={5} />
        <IntegratedPaging />

        <SearchState onValueChange={typeSearch} />
        <VirtualTable />
        <TableHeaderRow />
        <Toolbar />
        <SearchPanel />
        <CustomToolbarMarkup />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
