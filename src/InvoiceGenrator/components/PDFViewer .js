import React from "react";
import ReactDOM from "react-dom";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import InvoicePage from "./InvoicePage";
import { Button, Typography } from "antd";
import { Image } from "antd";

const PDFViewerComponent = ({ data }) => (
  <BlobProvider document={<h1>jjj</h1>}>
    {({ url }) => (
      <Button>
        Preview <a href={url} target="_blank"></a>
      </Button>
    )}
  </BlobProvider>
);

export default PDFViewerComponent;
