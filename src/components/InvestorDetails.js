import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import {
  SearchState,
  DataTypeProvider,
  PagingState,
  IntegratedPaging,
  CustomPaging,
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

const State = {
  addButton: "+ Add Investments",
  heading: "Investments",
  columns: [
    { name: "name", title: "Name" },
    { name: "amount", title: "Amount" },
  ],
};

const CurrencyFormatter = ({ value }) => (
  <p style={{ textAlign: "left" }}>
    {value.toLocaleString("en-US", { style: "currency", currency: "USD" })}
  </p>
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
    {/* <div>
      <img
        src={row.name}
        style={{
          height: "38px",
          width: "38px",
          borderRadius: "50%",
          margin: "0 auto",
        }}
        alt="Avatar"
      />
    </div> */}
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
        <p style={{ fontWeight: 500, fontSize: "15px", lineHeight: "14px" }}>
          {State.heading}
        </p>
        <Button variant="outlined" color="primary">
          {State.addButton}
        </Button>
      </div>

      <TemplatePlaceholder />
    </Template>
  </Plugin>
);

const GetInvestorDetail = gql`
  query GetInvestorDetail($id: Int) {
    investor(where: { id: { _eq: $id } }) {
      id
      name
      photo_large
      investments {
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

export const InvestorDetails = () => {
  const [columns] = useState(State.columns);

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

  const [currencyColumns] = useState([State.columns[1].name]);

  //Paging
  const [pageSize, setPageSize] = useState(pageSizes[1]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const { loading, error, data } = useQuery(GetInvestorDetail, {
    variables: {
      id: 68,
      // limitBy: pageSize,
      // offsetBy: pageSize * currentPage,
    },
  });

  const [rows, setRows] = useState([]);

  const loadData = () => {
    if (rows && !data) return;
    setRows(
      data.investor[0].investments.map((detail) => ({
        name: detail.company.name,
        amount: detail.amount,
      }))
    );
    // setTotalCount(data.company_aggregate.aggregate.count);
  };

  useEffect(() => loadData(), [loading, currentPage]);

  const typeSearch = (value) => {
    setSearchValue(value + "%");
  };

  const [tableColumnExtensions] = useState([
    { columnName: State.columns[0].name, width: 200 },
    { columnName: State.columns[1].name, wordWrapEnabled: true },
  ]);

  const [employeeColumns] = useState([State.columns[1].name]);

  return (
    <Paper style={{ position: "relative" }}>
      <Grid rows={rows} columns={columns}>
        <DataTypeProvider
          for={employeeColumns}
          formatterComponent={EmployeeFormatter}
        />
        {/* <PagingState
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        /> */}
        <Table columnExtensions={tableColumnExtensions} />

        <TableHeaderRow cellComponent={cellComponent} />

        {/* <SearchState onValueChange={typeSearch} /> */}

        <CurrencyTypeProvider for={currencyColumns} />

        <Toolbar />
        {/* <SearchPanel /> */}
        <CustomToolbarMarkup />

        {/* Paging */}
        {/* <CustomPaging totalCount={totalCount} />
        <PagingPanel pageSizes={pageSizes} /> */}
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
