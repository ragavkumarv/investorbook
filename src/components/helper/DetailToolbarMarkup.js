import {
  Plugin,
  Template,

  TemplatePlaceholder
} from "@devexpress/dx-react-core";
import React from "react";

export const DetailToolbarMarkup = ({state}) => (
  <Plugin name="customToolbarMarkup">
    <Template name="toolbarContent">
      <div
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}
      >
        <p style={{ fontWeight: 500, fontSize: "15px", lineHeight: "14px" }}>
          {state.heading}
        </p>
      </div>

      <TemplatePlaceholder />
    </Template>
  </Plugin>
);
