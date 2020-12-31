import React from "react";
import { DataTypeProvider } from "@devexpress/dx-react-grid";

const groupListFormatter = ({ value }) => (
  <p style={{ fontSize: "12px", color: "#6C6C6C", fontWeight: 500 }}>{value}</p>
);
export const GroupTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={groupListFormatter} {...props} />
);
