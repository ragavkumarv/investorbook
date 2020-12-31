import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import {
  SearchState,
  DataTypeProvider,
  PagingState,
  IntegratedPaging,
  CustomPaging,
  SelectionState,
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
  TableSelection
} from "@devexpress/dx-react-grid-material-ui";
import { useHistory } from 'react-router-dom';

import Button from "@material-ui/core/Button";

import { Loading } from "./loader/Loading";
import { useQuery, gql } from "@apollo/client";

const State = {
  addButton: "Add Company",
  heading: "Companies",
  columns: [
    { name: "name", title: "Name" },
    { name: "investors", title: "Investors" },
  ]
};

const CurrencyFormatter = ({ value }) => (
  <p style={{ fontSize: "12px", color: "#6C6C6C", fontWeight: 500 }}>{value}</p>
);

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const TableRow = ({ tableRow, onToggle, ...restProps }) => {
  const history = useHistory();
  return (
    <TableSelection.Row
      {...restProps}
      onClick={() => {
        onToggle();
        console.log(tableRow);
        history.push(`/company/${tableRow.row.id}`)
        // alert(JSON.stringify(tableRow));
      }}
    />
  );
};

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
        <p style={{ fontWeight: 500, fontSize: "28px", lineHeight: "26px" }}>
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

const GET_INVESTORS = gql`
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

export const ListCompanies = () => {
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

  const { loading, error, data } = useQuery(GET_INVESTORS, {
    variables: {
      search: searchValue,
      limitBy: pageSize,
      offsetBy: pageSize * currentPage,
    },
  });

  const [rows, setRows] = useState([]);

  const loadData = () => {
    if (rows && !data) return;
    setRows(
      data.company.map((detail) => ({
        ...detail,
        [State.columns[1].name]:
          detail.investments
            .map(({ investor }) => investor.name)
            .sort()
            .join(", ") || "Yet to Invest",
      }))
    );
    setTotalCount(data.company_aggregate.aggregate.count);
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
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <Table columnExtensions={tableColumnExtensions} />

        <TableHeaderRow cellComponent={cellComponent} />
        <SelectionState />
        <TableSelection
            selectByRowClick
            highlightRow
            rowComponent={TableRow}
            showSelectionColumn={false}
          />

        <SearchState onValueChange={typeSearch} />

        <CurrencyTypeProvider for={currencyColumns} />

        <Toolbar />
        <SearchPanel />
        <CustomToolbarMarkup />

        {/* Paging */}
        <CustomPaging totalCount={totalCount} />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
