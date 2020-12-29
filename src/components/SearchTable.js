import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import {
  SearchState,
  DataTypeProvider,
  PagingState,
  IntegratedPaging,
} from "@devexpress/dx-react-grid";

import {
  Plugin,
  Template,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";

import {
  Grid,
  Toolbar,
  Table,
  SearchPanel,
  VirtualTable,
  TableHeaderRow,
  PagingPanel,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";

import Button from "@material-ui/core/Button";

import { Loading } from "./loader/Loading";
import { useQuery, gql } from "@apollo/client";

const CurrencyFormatter = ({ value }) => (
  <p style={{ fontSize: "12px", color: "#6C6C6C", fontWeight: 500 }}>{value}</p>
);

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

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
      <div
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}
      >
        <p style={{ fontWeight: 500, fontSize: "28px", lineHeight: "26px" }}>
          Investors
        </p>
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

  const useStyles = makeStyles({
    headerRow: {
      textTransform: "uppercase",
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "11px",
      letterSpacing: "0.07em",
      color: "#797979",
    },
  });

  const classes = useStyles();

  const cellComponent = (props) => {
    return <TableHeaderRow.Cell {...props} className={classes.headerRow} />;
  };

  const [pageSizes] = useState([5, 10, 15]);

  const [searchValue, setSearchValue] = useState("%");

  const [currencyColumns] = useState(["investments"]);

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

  const [tableColumnExtensions] = useState([
    { columnName: "photo_thumbnail", width: 200 },
    { columnName: "investments", wordWrapEnabled: true },
  ]);

  const [employeeColumns] = useState(["photo_thumbnail"]);

  return (
    <Paper style={{ position: "relative" }}>
      <Grid rows={rows} columns={columns}>
        <DataTypeProvider
          for={employeeColumns}
          formatterComponent={EmployeeFormatter}
        />
        <PagingState defaultCurrentPage={0} defaultPageSize={10} />
        <IntegratedPaging />
        <Table columnExtensions={tableColumnExtensions} />

        <TableHeaderRow cellComponent={cellComponent} />

        <SearchState onValueChange={typeSearch} />

        <CurrencyTypeProvider for={currencyColumns} />

        <Toolbar />
        <SearchPanel />
        <CustomToolbarMarkup />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
