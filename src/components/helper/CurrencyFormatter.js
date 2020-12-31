import { DataTypeProvider } from "@devexpress/dx-react-grid";
import React from "react";

const CurrencyFormatter = ({ value }) => (
  <p style={{ textAlign: "left", color: "#242424", fontSize: "12px" }}>
    {value.toLocaleString("en-US", { style: "currency", currency: "USD" })}
  </p>
);
export const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);
