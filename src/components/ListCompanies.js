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
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { ListToolbarMarkup } from "./helper";
import { EmployeeFormatter } from "./helper";
import { ADD_COMPANY, GET_COMPANIES } from "./gql";
import { GroupTypeProvider } from "./helper";
import { Loading } from "./loader/Loading";
import { NewInvestor } from "./NewInvestor";
import { HighlightRowOnHover } from "./helper";

const State = {
  addButton: "Add Company",
  heading: "Companies",
  columns: [
    { name: "name", title: "Name" },
    { name: "investors", title: "Investors" },
  ],
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

  const [searchValue, setSearchValue] = useState("%%");
  const [debounceSearch] = useDebounce(searchValue, 1000);

  const [investmentColumns] = useState([State.columns[1].name]);

  //Paging
  const [pageSize, setPageSize] = useState(pageSizes[1]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [sorting, setSorting] = useState([
    { columnName: "id", direction: "asc" },
  ]);

  const { loading, data } = useQuery(GET_COMPANIES, {
    variables: {
      search: debounceSearch,
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
    { columnName: State.columns[0].name, width: "25%" },
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
        groupName="Company"
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

        <Table columnExtensions={tableColumnExtensions} />

        <TableHeaderRow showSortingControls cellComponent={cellComponent} />
        <SelectionState />
        <TableSelection
          selectByRowClick
          highlightRow
          rowComponent={HighlightRowOnHover}
          showSelectionColumn={false}
        />

        <SearchState onValueChange={typeSearch} />

        <GroupTypeProvider for={investmentColumns} />

        <Toolbar />
        <SearchPanel />
        <ListToolbarMarkup
          setOpenEditInvestor={setOpenEditInvestor}
          State={State}
        />

        {/* Paging */}
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <CustomPaging totalCount={totalCount} />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
