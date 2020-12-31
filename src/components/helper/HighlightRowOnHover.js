import { TableSelection } from "@devexpress/dx-react-grid-material-ui";
import { makeStyles } from "@material-ui/core/styles";
import { default as React } from "react";
import { useHistory } from "react-router-dom";

export const HighlightRowOnHover = ({
  className,
  tableRow,
  onToggle,
  highlighted,
  ...restProps
}) => {
  const useStyles = makeStyles({
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
      className={classes.customRow}
      onClick={() => {
        onToggle();
        history.push(`/${tableRow.row.__typename}/${tableRow.row.id}`);
      }} />
  );
};
