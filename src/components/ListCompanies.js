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
  SortingState,
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
import { useQuery, useMutation } from "@apollo/client";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import { GET_COMPANIES, ADD_COMPANY } from "./gql";
import { EmployeeFormatter } from "./EmployeeFormatter";

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

const TableRow = ({
  className,
  tableRow,
  onToggle,
  highlighted,
  ...restProps
}) => {

  const useStyles = makeStyles({
    selected: {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
    customRow: {
      "&:hover": {
        backgroundColor: "#F5F5F5",
        cursor: 'pointer'
      },
    },
  });

  const classes = useStyles();
  const history = useHistory();
  return (
    <TableSelection.Row
      {...restProps}
      className={{ [classes.selected]: highlighted, [classes.customRow]: true }}
      onClick={() => {
        onToggle();
        history.push(`/company/${tableRow.row.id}`)
      }}
    />
  );
};

const CustomToolbarMarkup = ({setOpenEditInvestor}) => (
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
        <Button onClick={() => setOpenEditInvestor(true)} variant="outlined" color="primary">
          {State.addButton}
        </Button>
      </div>

      <TemplatePlaceholder />
    </Template>
  </Plugin>
);



const NewInvestor = ({ open, setOpen, state, setState, saveInvestor }) => {
  const type = "Add";
  const groupName = 'Investor';
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { name, photoThumbnail, photoLarge } = state;

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{type} {groupName}</DialogTitle>
      <DialogContent>
        <p>Please enter the details of the {groupName.toLowerCase()}.</p>
        <FormGroup style={{ gap: "20px" }}>
          <TextField
            style={{ width: "500px" }}
            name="name"
            value={name}
            onChange={handleChange}
            label="Name"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            saveInvestor();
          }}
          color="primary"
          disableElevation
        >
          {type} {groupName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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
  const [sorting, setSorting] = useState([
    { columnName: "id", direction: "asc" },
  ]);

  const { loading, error, data } = useQuery(GET_COMPANIES, {
    variables: {
      search: searchValue,
      orderBy: { [sorting[0].columnName]: sorting[0].direction },
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

  const [AddInvestor] = useMutation(ADD_COMPANY);
  const history = useHistory();

  const [openEditInvestor, setOpenEditInvestor] = useState(false);
  const [state, setState] = useState({
    name: "",
  });

  const saveInvestor = async () => {
    const {
      data: { insert_company },
    } = await AddInvestor({
      variables: {
        name: state.name,
        photo_large: state.photoLarge,
        photo_thumbnail: state.photoThumbnail,
      },
    });
    
    history.push(`/company/${insert_company.returning[0].id}`);
  };

  useEffect(() => loadData(), [loading, currentPage]);

  const typeSearch = (value) => {
    setSearchValue("%" + value + "%");
  };

  const [tableColumnExtensions] = useState([
    { columnName: State.columns[0].name, width: '25%' },
    { columnName: State.columns[1].name, wordWrapEnabled: true },
  ]);

  const [employeeColumns] = useState([State.columns[1].name]);

  return (
    <Paper style={{ position: "relative" }}>
      <NewInvestor
        open={openEditInvestor}
        setOpen={setOpenEditInvestor}
        state={state}
        setState={setState}
        saveInvestor={saveInvestor}
      />
      <Grid rows={rows} columns={columns}>
        <DataTypeProvider
          for={employeeColumns}
          formatterComponent={EmployeeFormatter}
        />
        <SortingState
          sorting={sorting}
          onSortingChange={setSorting}
          columnExtensions={[
            { columnName: "investors", sortingEnabled: false },
          ]}
        />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <Table columnExtensions={tableColumnExtensions} />

        <TableHeaderRow showSortingControls cellComponent={cellComponent} />
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
        <CustomToolbarMarkup  setOpenEditInvestor={setOpenEditInvestor} />

        {/* Paging */}
        <CustomPaging totalCount={totalCount} />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
