import { useQuery, useMutation } from "@apollo/client";
import {
  Plugin,
  Template,
  TemplateConnector,
  TemplatePlaceholder,
  Getter,
} from "@devexpress/dx-react-core";
import { DataTypeProvider, SummaryState } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  Toolbar,
  TableEditColumn,
} from "@devexpress/dx-react-grid-material-ui";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormGroup from "@material-ui/core/FormGroup";
import MuiGrid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import { Loading } from "./loader/Loading";

import { EditingState } from "@devexpress/dx-react-grid";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useHistory, useParams } from 'react-router-dom';
import { Command } from "./Command";
import { ADD_INVESTMENT, GET_INVESTOR_DETAIL, GET_ALL_COMPANIES, UPDATE_INVESTMENT, UPDATE_INVESTOR, DELETE_INVESTOR, DELETE_INVESTMENT } from "./gql";
import { EmployeeFormatter } from "./EmployeeFormatter";
import { CurrencyTypeProvider } from "./CurrencyFormatter";

const Popup = ({
  row,
  onChange,
  onApplyChanges,
  onCancelChanges,
  open,
  refresh,
  allCompanies,
}) => {
  console.log(row, allCompanies);
  return (
    <Dialog
      open={open}
      onClose={onCancelChanges}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add Investment</DialogTitle>
      <DialogContent>
        <p>Please enter the details of the investment.</p>

        <FormGroup>
          <FormControl>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={row.companyId || ""}
              onChange={(event) => onChange("companyId", event.target.value)}
            >
              {(allCompanies ? allCompanies.company : []).map((company) => (
                <MenuItem value={company.id}>{company.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Amount</InputLabel>
            <Input
              id="standard-adornment-amount"
              type="number"
              value={row.amount || ""}
              onChange={(event) => onChange("amount", event.target.value)}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onCancelChanges();
            // refresh();
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            // onApplyChanges({ ...row, amount})
            onApplyChanges();
          }}
          color="primary"
          disableElevation
        >
          Add Company
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditInvestor = ({ open, setOpen, state, setState, saveInvestor }) => {
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
      <DialogTitle id="form-dialog-title">Edit Investor</DialogTitle>
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
          Edit Investor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PopupEditing = React.memo(({ popupComponent: Popup, allCompanies }) => {
  return (
    <Plugin>
      <Template name="popupEditing">
        <TemplateConnector>
          {(
            {
              addedRows,
              rows,
              getRowId,
              editingRowIds,
              createRowChange,
              rowChanges,
            },
            {
              changeRow,
              commitChangedRows,
              stopEditRows,
              cancelAddedRows,
              commitAddedRows,
              changeAddedRow,
            }
          ) => {
            const isAddMode = addedRows.length > 0;
            const isEditMode = editingRowIds.length > 0;

            const editRowId = editingRowIds[0] || 0;

            const open = isEditMode || isAddMode;
            const targetRow = rows.filter(
              (row) => getRowId(row) === editRowId
            )[0];
            const changedRow = isAddMode
              ? addedRows[0]
              : { ...targetRow, ...rowChanges[editRowId] };

            const processValueChange = (fieldName, newValue) => {
              const changeArgs = {
                rowId: editRowId,
                change: createRowChange(changedRow, newValue, fieldName),
              };

              if (isAddMode) {
                changeAddedRow(changeArgs);
              } else {
                changeRow(changeArgs);
              }
            };
            const applyChanges = () => {
              if (isEditMode) {
                commitChangedRows({ rowIds: editingRowIds });
              } else {
                commitAddedRows({ rowIds: [0] });
              }
              stopEditRows({ rowIds: editingRowIds });
            };
            const cancelChanges = () => {
              if (isAddMode) {
                cancelAddedRows({ rowIds: [0] });
              }
              stopEditRows({ rowIds: editingRowIds });
            };

            return (
              <Popup
                open={open}
                row={changedRow}
                onChange={processValueChange}
                onApplyChanges={applyChanges}
                onCancelChanges={cancelChanges}
                allCompanies={allCompanies}
              />
            );
          }}
        </TemplateConnector>
      </Template>
      <Template name="root">
        <TemplatePlaceholder />
        <TemplatePlaceholder name="popupEditing" />
      </Template>
    </Plugin>
  );
});

const State = {
  addButton: "+ Add Investments",
  heading: "Investments",
  columns: [
    { name: "name", title: "Name" },
    { name: "amount", title: "Amount" },
  ],
};

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
      </div>

      <TemplatePlaceholder />
    </Template>
  </Plugin>
);

const InvestorSummary = ({ investor, total, setOpen, removeInvestor }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "80px 6fr 2fr" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={investor.photo_large}
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            margin: "0 auto",
          }}
          alt="Avatar"
        />
      </div>
      <div>
        <p style={{ fontSize: "24px", lineHeight: "22px" }}>{investor.name}</p>
        <p style={{ fontSize: "15px", lineHeight: "14px" }}>
          Total Amount Invested:{" "}
          {total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button onClick={() => setOpen(true)} startIcon={<EditIcon />}>
          EDIT NAME
        </Button>
        <Button onClick={() => removeInvestor() } startIcon={<DeleteIcon />}>REMOVE INVESTOR</Button>
      </div>
    </div>
  );
};

export const InvestorDetails = () => {
  const { id: INVESTOR_ID } = useParams();
  const [columns] = useState(State.columns);
  const history = useHistory();

  const [addInvestment] = useMutation(ADD_INVESTMENT, {
    refetchQueries: [
      {
        query: GET_INVESTOR_DETAIL,
        variables: {
          id: INVESTOR_ID,
        },
      },
    ],
  });

  const { data: allCompanies } = useQuery(GET_ALL_COMPANIES);

  const [updateInvestment] = useMutation(UPDATE_INVESTMENT, {
    refetchQueries: [
      {
        query: GET_INVESTOR_DETAIL,
        variables: {
          id: INVESTOR_ID,
        },
      },
    ],
  });

  const [updateInvestor] = useMutation(UPDATE_INVESTOR, {
    refetchQueries: [
      {
        query: GET_INVESTOR_DETAIL,
        variables: {
          id: INVESTOR_ID,
        },
      },
    ],
  });

  const [deleteInvestorMutation] = useMutation(DELETE_INVESTOR);

  const [deleteInvestmentMutation] = useMutation(DELETE_INVESTMENT, {
    refetchQueries: [
      {
        query: GET_INVESTOR_DETAIL,
        variables: {
          id: INVESTOR_ID,
        },
      },
    ],
  });

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

  const [currencyColumns] = useState([State.columns[1].name]);

  const { loading, error, data, refetch } = useQuery(GET_INVESTOR_DETAIL, {
    variables: {
      id: INVESTOR_ID,
    },
  });

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [openEditInvestor, setOpenEditInvestor] = useState(false);

  const [state, setState] = useState({
    name: "",
    photoThumbnail: "",
    photoLarge: "",
  });

  const removeInvestor = () => {
    deleteInvestorMutation({variables:{id: INVESTOR_ID}});
    history.push('/');
  }

  const saveInvestor = () => {
    // console.log(state);
    updateInvestor({
      variables: {
        id: INVESTOR_ID,
        name: state.name,
        photo_large: state.photoLarge,
        photo_thumbnail: state.photoThumbnail,
      },
    });
  };

  const commitChanges = ({ added, changed, deleted }) => {
    console.log(added, changed, deleted, rows);
    if (added) {
      const [newRow] = added;
      addInvestment({
        variables: {
          amount: +newRow.amount,
          investor_id: INVESTOR_ID,
          company_id: newRow.companyId,
        },
      });
    }
    if (changed) {
      const exitingData = rows.find((row) => changed[row.id]);
      const editRow = { ...exitingData, ...changed[exitingData.id] };
      updateInvestment({
        variables: {
          id: editRow.id,
          amount: editRow.amount,
          company_id: editRow.companyId,
        },
      });
    }
    if (deleted) deleteInvestmentMutation({ variables: { id: deleted[0] } });
  };

  const getRowId = (row) => row.id;

  const loadData = () => {
    if (rows && !data) return;

    setRows(
      data.investor[0].investments.map((detail) => ({
        companyId: detail.company.id,
        id: detail.id,
        name: detail.company.name,
        amount: detail.amount,
      }))
    );

    setTotal(
      data.investor[0].investments
        .map((detail) => detail.amount)
        .reduce((i, sum) => i + sum, 0)
    );

    const { id, name, photo_large, photo_thumbnail } = data.investor[0];

    setState({
      id,
      name,
      photoLarge: photo_large,
      photoThumbnail: photo_thumbnail,
    });
  };

  useEffect(() => loadData(), [data]);

  const [tableColumnExtensions] = useState([
    { columnName: State.columns[0].name },
    { columnName: State.columns[1].name },
  ]);

  const [employeeColumns] = useState([State.columns[1].name]);

  return (
    <Paper style={{ position: "relative" }}>
      <EditInvestor
        open={openEditInvestor}
        setOpen={setOpenEditInvestor}
        state={state}
        setState={setState}
        saveInvestor={saveInvestor}
      />
      <InvestorSummary
        investor={data ? data.investor[0] : { name: "", photo_large: "" }}
        total={total}
        setOpen={setOpenEditInvestor}
        removeInvestor={removeInvestor}
      />

      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <DataTypeProvider
          for={employeeColumns}
          formatterComponent={EmployeeFormatter}
        />

        <EditingState onCommitChanges={commitChanges} />
        <Table columnExtensions={tableColumnExtensions} />

        <TableHeaderRow cellComponent={cellComponent} />

        <CurrencyTypeProvider for={currencyColumns} />

        <Toolbar />
        <CustomToolbarMarkup />

        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          commandComponent={Command}
        />
        <PopupEditing
          popupComponent={Popup}
          refresh={refetch}
          updateInvestment={updateInvestment}
          open={true}
          allCompanies={allCompanies}
        />
        <Getter
          name="tableColumns"
          computed={({ tableColumns }) => {
            const result = [
              ...tableColumns.filter(
                (c) => c.type !== TableEditColumn.COLUMN_TYPE
              ),
              { key: "editCommand", type: TableEditColumn.COLUMN_TYPE },
            ];
            return result;
          }}
        />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
