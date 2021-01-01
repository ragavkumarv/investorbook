import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { State } from "../CompanyDetail/CompanyDetails";
import React, { useEffect, useState } from "react";

// Action button icons in the grid
export const Command = ({ id, onExecute, disabled }) => {
  const ButtonComponent = commandComponents[id];
  return <ButtonComponent onExecute={onExecute} disabled={disabled} />;
};
const EditButton = ({ onExecute, disabled }) => (
  <IconButton onClick={onExecute} disabled={disabled} aria-label="delete">
    <EditIcon fontSize="small" />
  </IconButton>
);
const DeleteButton = ({ onExecute, disabled }) => (
  <IconButton onClick={onExecute} disabled={disabled} aria-label="delete">
    <DeleteIcon fontSize="small" />
  </IconButton>
);
const AddButton = ({ onExecute, disabled }) => {
  const size = useWindowSize();

  return (
    <Button onClick={onExecute} disabled={disabled} color="primary">
      {size.width < 550 ? "+ Add" : State.addButton}
    </Button>
  );
};
const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
};

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}
