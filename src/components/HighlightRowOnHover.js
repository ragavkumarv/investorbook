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
        history.push(`/${tableRow.row.__typename}/${tableRow.row.id}`);
      }} />
  );
};
