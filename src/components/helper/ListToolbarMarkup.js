import React from "react";
import {
  Plugin,
  Template,
  TemplatePlaceholder
} from "@devexpress/dx-react-core";
import Button from "@material-ui/core/Button";

export const ListToolbarMarkup = ({ setOpenEditInvestor, State }) => (
  <Plugin name="customToolbarMarkup">
    <Template name="toolbarContent">
      <div
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}
      >
        <p style={{ fontWeight: 500, fontSize: "28px", lineHeight: "26px" }}>
          {State.heading}
        </p>
        <Button
          onClick={() => setOpenEditInvestor(true)}
          variant="outlined"
          color="primary"
        >
          {State.addButton}
        </Button>
      </div>

      <TemplatePlaceholder />
    </Template>
  </Plugin>
);
