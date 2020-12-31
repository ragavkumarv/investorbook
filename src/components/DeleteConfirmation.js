import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export function DeleteConfirmation({ open, setOpen, deleteConfirm }) {
  const cancel = () => {
    setOpen(false);
  };

  const confirmDelete = () => {
    setOpen(false);
    deleteConfirm();
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Once deleted cannot be reverted back.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={confirmDelete}
          color="primary"
          disableElevation
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
