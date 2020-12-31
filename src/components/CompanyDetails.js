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
import MuiGrid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Loading } from "./loader/Loading";

import { EditingState } from "@devexpress/dx-react-grid";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import { useHistory, useParams } from "react-router-dom";
import { Command } from "./helper/Command";
import {
  ADD_INVESTMENT,
  GET_COMPANY_DETAIL,
  GET_ALL_INVESTORS,
  UPDATE_INVESTMENT,
  UPDATE_COMPANY,
  DELETE_INVESTOR,
  DELETE_INVESTMENT,
} from "./gql";
import { EmployeeFormatter } from "./EmployeeFormatter";
import { CurrencyTypeProvider } from "./helper/CurrencyFormatter";
import { CustomToolbarMarkup } from "./helper/CustomToolbarMarkup";
// const INVESTOR_ID = 100;
import { PopupEditing } from "./helper/PopupEditing";
import { Popup } from "./helper/Popup";
import { EditInvestor } from "./EditInvestor";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import IconButton from "@material-ui/core/IconButton";
export const State = {
  addButton: "+ Add Investors",
  heading: "Investors",
  edit: "EDIT NAME",
  remove: "REMOVE COMPANY",
  columns: [
    { name: "name", title: "Name" },
    { name: "amount", title: "Amount" },
  ],
};

const InvestorSummary = ({ investor, total, setOpen, removeInvestor }) => {
  return (
    <div
      style={{
        display: "grid",
        padding: "20px",
        gridTemplateColumns: "1fr 2fr",
      }}
    >
      <div>
        <p style={{ fontSize: "24px", lineHeight: "22px" }}>{investor.name}</p>
      </div>
      <div
        style={{
          display: "flex",
          placeContent: "center flex-end",
          alignItems: "center",
        }}
      >
        <div>
          <Button
            style={{ marginRight: "10px" }}
            onClick={() => setOpen(true)}
            startIcon={<EditIcon />}
          >
            {State.edit}
          </Button>
          <Button onClick={() => removeInvestor()} startIcon={<DeleteIcon />}>
            {State.remove}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const CompanyDetails = () => {
  const { id: COMPANY_ID } = useParams();
  const [columns] = useState(State.columns);
  const history = useHistory();

  const [addInvestment] = useMutation(ADD_INVESTMENT, {
    refetchQueries: [
      {
        query: GET_COMPANY_DETAIL,
        variables: {
          id: COMPANY_ID,
        },
      },
    ],
  });

  const { data: allInvestors } = useQuery(GET_ALL_INVESTORS);

  const { loading, error, data, refetch } = useQuery(GET_COMPANY_DETAIL, {
    variables: {
      id: COMPANY_ID,
    },
  });

  const [updateInvestment] = useMutation(UPDATE_INVESTMENT, {
    refetchQueries: [
      {
        query: GET_COMPANY_DETAIL,
        variables: {
          id: COMPANY_ID,
        },
      },
    ],
  });

  const [updateCompany] = useMutation(UPDATE_COMPANY, {
    refetchQueries: [
      {
        query: GET_COMPANY_DETAIL,
        variables: {
          id: COMPANY_ID,
        },
      },
    ],
  });

  const [deleteInvestorMutation] = useMutation(DELETE_INVESTOR);

  const [deleteInvestmentMutation] = useMutation(DELETE_INVESTMENT, {
    refetchQueries: [
      {
        query: GET_COMPANY_DETAIL,
        variables: {
          id: COMPANY_ID,
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

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [openEditInvestor, setOpenEditInvestor] = useState(false);

  const [state, setState] = useState({
    name: "",
  });

  const removeInvestor = () => {
    deleteInvestorMutation({ variables: { id: COMPANY_ID } });
    history.push("/");
  };

  const saveInvestor = () => {
    updateCompany({
      variables: {
        id: COMPANY_ID,
        name: state.name,
      },
    });
  };

  const commitChanges = ({ added, changed, deleted }) => {
    if (added) {
      const [newRow] = added;
      addInvestment({
        variables: {
          amount: +newRow.amount,
          investor_id: newRow.investorId,
          company_id: COMPANY_ID,
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
          company_id: COMPANY_ID,
        },
      });
    }
    if (deleted) deleteInvestmentMutation({ variables: { id: deleted[0] } });
  };

  const getRowId = (row) => row.id;

  const loadData = () => {
    if (rows && !data) return;
    setRows(
      data.company[0].investments.map((detail) => ({
        investorId: detail.investor.id,
        id: detail.id,
        name: detail.investor.name,
        amount: detail.amount,
        photo_thumbnail: detail.investor.photo_thumbnail,
      }))
    );

    const { id, name } = data.company[0];

    setState({
      id,
      name,
    });
  };

  useEffect(() => loadData(), [data]);

  const [tableColumnExtensions] = useState([
    { columnName: State.columns[0].name },
    { columnName: State.columns[1].name },
  ]);

  const [employeeColumns] = useState([State.columns[0].name]);
  const detail = {
    type: "Edit",
    selectMenu: "Investor",
  };

  return (
    <div
      style={{
        display: "flex",
        placeContent: "flex-start",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <IconButton
        aria-label="back"
        style={{
          marginTop: "24px",
        }}
        onClick={()=> history.goBack()}
      >
        <ArrowBackIosIcon fontSize="large" />
      </IconButton>
      <Paper style={{ position: "relative" }}>
        <EditInvestor
          open={openEditInvestor}
          setOpen={setOpenEditInvestor}
          state={state}
          setState={setState}
          saveInvestor={saveInvestor}
          type="Company"
        />
        <InvestorSummary
          investor={data ? data.company[0] : { name: "" }}
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
          <CustomToolbarMarkup state={State} />

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
            allInvestors={allInvestors}
            detail={detail}
          />
          {/* Push action to Last column */}
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
    </div>
  );
};
