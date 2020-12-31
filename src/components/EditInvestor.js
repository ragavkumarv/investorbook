import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import React from "react";

export const EditInvestor = ({ open, setOpen, state, setState, saveInvestor, type }) => {
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { name, photoThumbnail, photoLarge } = state;

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit {type}</DialogTitle>
      <DialogContent>
        <p>Please enter the details of the {type.toLowerCase()}.</p>
        <FormGroup style={{ gap: "20px" }}>
          <TextField
            style={{ width: "500px" }}
            name="name"
            value={name}
            onChange={handleChange}
            label="Name" />
          {type === "Investor" ? (
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
            setOpen(false);
            saveInvestor();
          }}
          color="primary"
          disableElevation
        >
          Edit {type}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
