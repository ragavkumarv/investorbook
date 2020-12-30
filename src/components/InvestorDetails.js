import { gql, useQuery } from "@apollo/client";
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

const Popup = ({ row, onChange, onApplyChanges, onCancelChanges, open }) => (
  <Dialog
    open={open}
    onClose={onCancelChanges}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Add Investment</DialogTitle>
    <DialogContent>
      <p>Please enter the details of the investment.</p>

      <FormGroup>
        <TextField
          margin="normal"
          name="company"
          label="Select Company"
          value={row.name || ""}
          onChange={onChange}
        />
        <TextField
          margin="normal"
          name="amount"
          label="Investment Amount"
          value={row.amount || ""}
          onChange={onChange}
        />
      </FormGroup>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancelChanges} color="primary">
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onApplyChanges}
        color="primary"
        disableElevation
      >
        Add Company
      </Button>
    </DialogActions>
  </Dialog>
);

const PopupEditing = React.memo(({ popupComponent: Popup }) => (
  <Plugin>
    <Template name="popupEditing">
      <TemplateConnector>
        {(
          {
            rows,
            getRowId,
            addedRows,
            editingRowIds,
            createRowChange,
            rowChanges,
          },
          {
            changeRow,
            changeAddedRow,
            commitChangedRows,
            commitAddedRows,
            stopEditRows,
            cancelAddedRows,
            cancelChangedRows,
          }
        ) => {
          const isNew = addedRows.length > 0;
          let editedRow;
          let rowId;
          if (isNew) {
            rowId = 0;
            editedRow = addedRows[rowId];
          } else {
            [rowId] = editingRowIds;
            const targetRow = rows.filter((row) => getRowId(row) === rowId)[0];
            editedRow = { ...targetRow, ...rowChanges[rowId] };
          }

          const processValueChange = ({ target: { name, value } }) => {
            const changeArgs = {
              rowId,
              change: createRowChange(editedRow, value, name),
            };
            if (isNew) {
              changeAddedRow(changeArgs);
            } else {
              changeRow(changeArgs);
            }
          };
          const rowIds = isNew ? [0] : editingRowIds;
          const applyChanges = () => {
            if (isNew) {
              commitAddedRows({ rowIds });
            } else {
              stopEditRows({ rowIds });
              commitChangedRows({ rowIds });
            }
          };
          const cancelChanges = () => {
            if (isNew) {
              cancelAddedRows({ rowIds });
            } else {
              stopEditRows({ rowIds });
              cancelChangedRows({ rowIds });
            }
          };

          const open = editingRowIds.length > 0 || isNew;
          return (
            <Popup
              open={open}
              row={editedRow}
              onChange={processValueChange}
              onApplyChanges={applyChanges}
              onCancelChanges={cancelChanges}
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
));

const State = {
  addButton: "+ Add Investments",
  heading: "Investments",
  columns: [
    { name: "name", title: "Name" },
    { name: "amount", title: "Amount" },
  ],
};

const CurrencyFormatter = ({ value }) => (
  <p style={{ textAlign: "left", color: "#242424", fontSize: "12px" }}>
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
        {/* <Button variant="outlined" color="primary">
          {State.addButton}
        </Button> */}
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

const InvestorSummary = ({ investor, total }) => {
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
        <Button startIcon={<EditIcon />}>EDIT NAME</Button>
        <Button startIcon={<DeleteIcon />}>REMOVE INVESTOR</Button>
      </div>
    </div>
  );
};

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

  const [currencyColumns] = useState([State.columns[1].name]);

  const { loading, error, data } = useQuery(GetInvestorDetail, {
    variables: {
      id: 68,
    },
  });

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const commitChanges = ({ added, changed }) => {
    let changedRows;
    if (added) {
      const startingAddedId =
        rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
    }
    if (changed) {
      changedRows = rows.map((row) =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row
      );
    }
    setRows(changedRows);
  };

  const loadData = () => {
    if (rows && !data) return;

    setRows(
      data.investor[0].investments.map((detail) => ({
        name: detail.company.name,
        amount: detail.amount,
      }))
    );

    setTotal(
      data.investor[0].investments
        .map((detail) => detail.amount)
        .reduce((i, sum) => i + sum, 0)
    );
  };

  useEffect(() => loadData(), [loading]);

  const [tableColumnExtensions] = useState([
    { columnName: State.columns[0].name },
    { columnName: State.columns[1].name },
  ]);

  const [employeeColumns] = useState([State.columns[1].name]);

  return (
    <Paper style={{ position: "relative" }}>
      <InvestorSummary
        investor={data ? data.investor[0] : { name: "", photo_large: "" }}
        total={total}
      />

      <Grid rows={rows} columns={columns}>
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
        <PopupEditing popupComponent={Popup} />
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

const EditButton = ({ onExecute, disabled }) => (
  <IconButton onClick={onExecute} disabled={disabled} aria-label="delete">
    <EditIcon color="default" fontSize="small" />
  </IconButton>
);

const DeleteButton = ({ onExecute, disabled }) => (
  <IconButton onClick={onExecute} disabled={disabled} aria-label="delete">
    <DeleteIcon color="default" fontSize="small" />
  </IconButton>
);

const AddButton = ({ onExecute, disabled }) => (
  <Button onClick={onExecute} disabled={disabled} color="primary">
    {State.addButton}
  </Button>
);

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
};

const Command = ({ id, onExecute, disabled }) => {
  const ButtonComponent = commandComponents[id];
  return <ButtonComponent onExecute={onExecute} disabled={disabled} />;
};
