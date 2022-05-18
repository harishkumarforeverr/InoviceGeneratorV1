import React from "react";
import InvoicePage from "./InvoicePage";
import { useParams } from "react-router-dom";
const InvoiceGenrator = () => {
  let { id } = useParams();
  return (
    <div className="InvoiceGenrator">
      <InvoicePage id={id} />
    </div>
  );
};
export default InvoiceGenrator;
