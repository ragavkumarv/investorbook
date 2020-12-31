import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormGroup from "@material-ui/core/FormGroup";
import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

export const Popup = ({
  row,
  onChange,
  onApplyChanges,
  onCancelChanges,
  open,
  refresh,
  allCompanies,
  detail
}) => {
  const path = detail.selectMenu.toLowerCase();
  const id = path + 'Id';
  return (
    <Dialog
      open={open}
      onClose={onCancelChanges}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{detail.type} Investment</DialogTitle>
      <DialogContent>
        <p>Please enter the details of the investment.</p>

        <FormGroup style={{ gap: "10px" }}>
          <FormControl>
            <InputLabel>Select {detail.selectMenu}</InputLabel>
            <Select
              value={row[id] || ""}
              onChange={(event) => onChange(id, event.target.value)}
            >
              {(allCompanies ? allCompanies[path] : []).map((investor) => (
                <MenuItem key={investor.id} value={investor.id}>{investor.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Amount</InputLabel>
            <Input
              id="standard-adornment-amount"
              type="number"
              value={row.amount || ""}
              onChange={(event) => onChange("amount", event.target.value)}
              startAdornment={<InputAdornment position="start">$</InputAdornment>} />
          </FormControl>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onCancelChanges();
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onApplyChanges();
          }}
          color="primary"
          disableElevation
        >
          {detail.type} {detail.selectMenu}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
