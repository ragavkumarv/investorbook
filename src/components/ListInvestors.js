import { useQuery, useMutation } from "@apollo/client";
import {
  Plugin,
  Template,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";
import {
  CustomPaging,
  DataTypeProvider,
  PagingState,
  SearchState,
  SelectionState,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  PagingPanel,
  SearchPanel,
  Table,
  TableHeaderRow,
  TableSelection,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormGroup from "@material-ui/core/FormGroup";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { default as React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GET_INVESTORS, ADD_INVESTOR } from "./gql";
import { Loading } from "./loader/Loading";

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
        console.log(tableRow);
        history.push(`/investor/${tableRow.row.id}`);
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

const CustomToolbarMarkup = ({ setOpenEditInvestor }) => (
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
        <Button
          onClick={() => setOpenEditInvestor(true)}
          variant="outlined"
          color="primary"
        >
          Add Investor
        </Button>
      </div>

      <TemplatePlaceholder />
    </Template>
  </Plugin>
);

const NewInvestor = ({ open, setOpen, state, setState, saveInvestor }) => {
  const type = "Add";
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { name, photoThumbnail, photoLarge } = state;

  return (
    <Dialog
      open={open}
      // onClose={onCancelChanges}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{type} Investor</DialogTitle>
      <DialogContent>
        <p>Please enter the details of the investor.</p>
        <FormGroup style={{ gap: "20px" }}>
          <TextField
            style={{ width: "500px" }}
            name="name"
            value={name}
            onChange={handleChange}
            label="Name"
          />
          <TextField
            style={{ width: "500px" }}
            name="photoThumbnail"
            value={photoThumbnail}
            onChange={handleChange}
            label="Photo thumbnail"
          />
          <TextField
            style={{ width: "500px" }}
            name="photoLarge"
            value={photoLarge}
            onChange={handleChange}
            label="Photo large"
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
          {type} Investor
        </Button>
      </DialogActions>
    </Dialog>
  );
};



export const ListInvestors = () => {
  const [columns] = useState([
    { name: "photo_thumbnail", title: "Name" },
    { name: "investments", title: "Investments" },
  ]);

  const history = useHistory();

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

  const [searchValue, setSearchValue] = useState("%%");

  const [currencyColumns] = useState(["investments"]);

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
  const [openEditInvestor, setOpenEditInvestor] = useState(false);
  const [state, setState] = useState({
    name: "",
    photoThumbnail: "",
    photoLarge: "",
  });

  const loadData = () => {
    if (rows && !data) return;
    setRows(
      data.investor.map((detail) => ({
        ...detail,
        investments:
          detail.investments
            .map(({ company }) => company.name)
            .sort()
            .join(", ") || "Yet to Invest",
      }))
    );
    console.log(data.investor_aggregate.aggregate.count);
    setTotalCount(data.investor_aggregate.aggregate.count);
  };

  const [AddInvestor] = useMutation(ADD_INVESTOR);

  const saveInvestor = async () => {
    // console.log(state);
    const {
      data: { insert_investor },
    } = await AddInvestor({
      variables: {
        name: state.name,
        photo_large: state.photoLarge,
        photo_thumbnail: state.photoThumbnail,
      },
    });

    history.push(`/investor/${insert_investor.returning[0].id}`);
  };

  useEffect(() => loadData(), [loading, currentPage]);

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
        <CustomToolbarMarkup setOpenEditInvestor={setOpenEditInvestor} />

        {/* Paging */}
        <CustomPaging totalCount={totalCount} />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
