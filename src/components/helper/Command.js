import Button from "@material-ui/core/Button";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { State } from "../CompanyDetails";

// Action button icons in the grid
export const Command = ({ id, onExecute, disabled }) => {
  const ButtonComponent = commandComponents[id];
  return <ButtonComponent onExecute={onExecute} disabled={disabled} />;
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
