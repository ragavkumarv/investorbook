import { useMutation, useQuery } from "@apollo/client";
import { Getter } from "@devexpress/dx-react-core";
import { DataTypeProvider, EditingState } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableEditColumn,
  TableHeaderRow,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { EditInvestor } from "./EditInvestor";
import { EmployeeFormatter } from "./EmployeeFormatter";
import {
  ADD_INVESTMENT,
  DELETE_INVESTMENT,
  DELETE_INVESTOR,
  GET_ALL_COMPANIES,
  GET_INVESTOR_DETAIL,
  UPDATE_INVESTMENT,
  UPDATE_INVESTOR,
} from "./gql";
import { Command } from "./helper/Command";
import { CurrencyTypeProvider } from "./helper/CurrencyFormatter";
import { CustomToolbarMarkup } from "./helper/CustomToolbarMarkup";
import { Popup } from "./helper/Popup";
import { PopupEditing } from "./helper/PopupEditing";
import { Loading } from "./loader/Loading";

export const State = {
  addButton: "+ Add Investments",
  heading: "Investments",
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
        gridTemplateColumns: "80px 6fr 6fr",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={
            investor.photo_large ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQACGFpr0iqURE_6EHYMm-AGXfhXC1Nzf4ucA&usqp=CAU"
          }
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
      <div
        style={{
          display: "flex",
          placeContent: "center flex-end",
          alignItems: "center",
        }}
      >
        <Button
          style={{ marginRight: "10px" }}
          onClick={() => setOpen(true)}
          startIcon={<EditIcon />}
        >
          EDIT NAME
        </Button>
        <Button onClick={() => removeInvestor()} startIcon={<DeleteIcon />}>
          REMOVE INVESTOR
        </Button>
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

  const removeInvestor = async () => {
    await deleteInvestorMutation({ variables: { id: +INVESTOR_ID } });
    history.push("/");
  };

  const saveInvestor = () => {
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
  const detail = {
    type: "Edit",
    selectMenu: "Company",
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
        onClick={() => history.goBack()}
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
          type="Investor"
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
            allCompanies={allCompanies}
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
