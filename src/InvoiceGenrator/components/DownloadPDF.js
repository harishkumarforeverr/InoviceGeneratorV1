import React, { FC, useEffect, useState } from "react";
import {
  PDFDownloadLink,
  BlobProvider,
  Document,
  Page,
  Text,
} from "@react-pdf/renderer";
import { Button, Typography } from "antd";
// import { Invoice } from "../data/types";
import InvoicePage from "./InvoicePage";
import { Image } from "antd";
import "../../Header/Header.scss";
import Back from "../../Header/Image/right-arrow.svg";
import { useHistory } from "react-router-dom";
const { Title } = Typography;
const Download = ({ data, title }) => {
  let history = useHistory();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);

    const timeout = setTimeout(() => {
      setShow(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [data]);
  const openLinkInNewTab = (e) => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === "a") {
      window.open(e.target.href);
    }
  };
  const MyDoc = () => <InvoicePage pdfMode={true} data={data} />;
  return (
    <div
      // className={"download-pdf " + (!show ? "loading" : "")}
      className={"download-pdf "}
      title="Save PDF"
    >
      <div className="invoice-header-wrapper">
        <Title level={4}>
          {/* <Image src={Back} preview={false} alt="back" /> */}
          {/* Invoice #002 */}
        </Title>
        <div>
          <Button>
            Download
            {show && (
              <PDFDownloadLink
                document={<InvoicePage pdfMode={true} data={data} />}
                fileName={`${
                  data.invoiceTitle
                    ? data.invoiceTitle.toLowerCase()
                    : "invoice"
                }.pdf`}
                aria-label="Save PDF"
              ></PDFDownloadLink>
            )}
          </Button>
          <BlobProvider document={<MyDoc />}>
            {({ url }) => (
              <Button>
                Preview <a href={url} target="_blank"></a>
              </Button>
            )}
          </BlobProvider>

          <Button onClick={openLinkInNewTab} type="primary">
            send Invoice
          </Button>
        </div>
      </div>
      <br />

      <h1 className="title center fs-30"> {title} </h1>

      <br />
    </div>
  );
};

export default Download;
