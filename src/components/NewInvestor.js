import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";

export const NewInvestor = ({ open, setOpen, state, setState, saveInvestor, groupName }) => {
  const type = "Add";
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { name, photoThumbnail, photoLarge } = state;

  const [errorMsg, setErrorMsg] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  return (
    <>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {type} {groupName}
        </DialogTitle>
        <DialogContent>
          <p>Please enter the details of the {groupName.toLowerCase()}.</p>
          <FormGroup style={{ gap: "20px" }}>
            <TextField
              style={{ width: "500px" }}
              name="name"
              value={name}
              onChange={handleChange}
              label="Name" />
            {groupName === "Investor" ? (
              <>
                <TextField
                  style={{ width: "500px" }}
                  name="photoThumbnail"
                  value={photoThumbnail}
                  onChange={handleChange}
                  label="Photo thumbnail" />
                <TextField
                  style={{ width: "500px" }}
                  name="photoLarge"
                  value={photoLarge}
                  onChange={handleChange}
                  label="Photo large" />
              </>
            ) : (
                ""
              )}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!name) {
                setErrorMsg("Please fill in a name");
                setOpenToast(true);
                return;
              }
              setOpen(false);
              saveInvestor();
            }}
            color="primary"
            disableElevation
          >
            {type} {groupName}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={openToast}
        autoHideDuration={1000}
        onClose={handleClose}
        message={errorMsg} />
    </>
  );
};
