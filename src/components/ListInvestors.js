import { useMutation, useQuery } from "@apollo/client";
import {
  CustomPaging,
  DataTypeProvider,
  PagingState,
  SearchState,
  SelectionState,
  SortingState,
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
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { default as React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { CustomToolbarMarkup } from "./CustomToolbarMarkup";
import { EmployeeFormatter } from "./EmployeeFormatter";
import { ADD_INVESTOR, GET_INVESTORS } from "./gql";
import { GroupTypeProvider } from "./groupListFormatter";
import { Loading } from "./loader/Loading";
import { NewInvestor } from "./NewInvestor";

const State = {
  addButton: "Add Investor",
  heading: "Investors",
};

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
        cursor: "pointer",
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
        history.push(`/investor/${tableRow.row.id}`);
      }}
    />
  );
};

export const ListInvestors = () => {
  const [columns] = useState([
    { name: "name", title: "Name" },
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
  const [debounceSearch] = useDebounce(searchValue, 1000);

  const [investorsColumn] = useState(["investments"]);

  //Paging
  const [pageSize, setPageSize] = useState(pageSizes[1]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [sorting, setSorting] = useState([
    { columnName: "id", direction: "asc" },
  ]);

  const { loading, error, data } = useQuery(GET_INVESTORS, {
    variables: {
      search: debounceSearch,
      orderBy: { [sorting[0].columnName]: sorting[0].direction },
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
    setTotalCount(data.investor_aggregate.aggregate.count);
  };

  const [AddInvestor] = useMutation(ADD_INVESTOR);

  const saveInvestor = async () => {
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

  useEffect(() => loadData(), [loading, currentPage, sorting]);

  const typeSearch = (value) => {
    setSearchValue("%" + value + "%");
  };

  const [tableColumnExtensions] = useState([
    { columnName: "name", width: 200 },
    { columnName: "investments", wordWrapEnabled: true },
  ]);

  const [employeeColumns] = useState(["name"]);

  return (
    <Paper style={{ position: "relative" }}>
      <NewInvestor
        open={openEditInvestor}
        setOpen={setOpenEditInvestor}
        state={state}
        setState={setState}
        saveInvestor={saveInvestor}
        groupName="Investor"
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
            { columnName: "investments", sortingEnabled: false },
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

        <GroupTypeProvider for={investorsColumn} />

        <Toolbar />
        <SearchPanel />
        <CustomToolbarMarkup
          setOpenEditInvestor={setOpenEditInvestor}
          State={State}
        />

        {/* Paging */}
        <CustomPaging totalCount={totalCount} />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
