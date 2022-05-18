import React, { FC, useState, useEffect } from "react";
// import { Invoice, ProductLine } from "../data/types";
import { initialInvoice, initialProductLine } from "../data/initialData";
import EditableInput from "./EditableInput";
import EditableSelect from "./EditableSelect";
import EditableTextarea from "./EditableTextarea";
import EditableCalendarInput from "./EditableCalendarInput";
import EditableFileImage from "./EditableFileImage";
import countryList from "../data/countryList";
import Document from "./Document";
import Page from "./Page";
import View from "./View";
import Text from "./Text.js";
import { Font } from "@react-pdf/renderer";
import Download from "./DownloadPDF";
// import format from "date-fns/format";
import "../scss/main.scss";
import { DatePicker } from "antd";
import moment from "moment";
import Header from "../../Header/Header";
import PDFViewerComponent from "./PDFViewer ";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { Button, Typography } from "antd";
import "./InvoicePage.scss";
Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    },
    {
      src: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
      fontWeight: 600,
    },
  ],
});
// componentDidMount(){
//   try{
//       const options=JSON.parse(localStorage.getItem("options"));
//       if(options){
//           this.setState(()=>({ options }))
//       }
//   }
//   catch(e){

//   }
// }
// componentDidUpdate(prevProps, prevState){
//   if(prevState.options.length!== this.state.options.length){
//       const options=JSON.stringify(this.state.options);
//       localStorage.setItem("options",options);
//   }
// }
const InvoicePage = ({ data, pdfMode, id }) => {
  // const options1 = JSON.parse(options);
  if (id) {
    let parseData;
    id = String(id);
    id = id?.slice(3);
    console.log("sssssssssssss", id);
    let decodeStr = "";
    function asciiToSentence(str, len) {
      var num = 0;
      for (var i = 0; i < len; i++) {
        num = num * 10 + (str[i] - "0");
        if (num >= 32 && num <= 127) {
          var ch = String.fromCharCode(num);
          decodeStr += ch;
          num = 0;
        }
      }
    }
    asciiToSentence(id, id.length);
    try {
      parseData = JSON.parse(decodeStr);
      console.log("decodeStr", JSON.parse(decodeStr));
      console.log("parseData", parseData);
    } catch (e) {
      parseData = [];
      console.log("something went wrong");
    }
  }

  const [invoice, setInvoice] = useState(
    data ? { ...data } : { ...initialInvoice }
  );
  const [subTotal, setSubTotal] = useState();
  const [saleTax, setSaleTax] = useState();

  const dateFormat = "MMM dd, yyyy";
  const invoiceDate =
    invoice.invoiceDate !== "" ? new Date(invoice.invoiceDate) : new Date();
  const invoiceDueDate =
    invoice.invoiceDueDate !== ""
      ? new Date(invoice.invoiceDueDate)
      : new Date(invoiceDate.valueOf());

  if (invoice.invoiceDueDate === "") {
    invoiceDueDate.setDate(invoiceDueDate.getDate() + 30);
  }

  const handleChange = (name, value) => {
    if (name !== "productLines") {
      const newInvoice = { ...invoice };

      if (name === "logoWidth" && typeof value === "number") {
        newInvoice[name] = value;
      } else if (name !== "logoWidth" && typeof value === "string") {
        newInvoice[name] = value;
      }

      setInvoice(newInvoice);
    }
  };

  const handleProductLineChange = (index, name, value) => {
    const productLines = invoice.productLines.map((productLine, i) => {
      if (i === index) {
        const newProductLine = { ...productLine };

        if (name === "description") {
          newProductLine[name] = value;
        } else {
          if (
            value[value.length - 1] === "." ||
            (value[value.length - 1] === "0" && value.includes("."))
          ) {
            newProductLine[name] = value;
          } else {
            const n = parseFloat(value);

            newProductLine[name] = (n ? n : 0).toString();
          }
        }

        return newProductLine;
      }

      return { ...productLine };
    });

    setInvoice({ ...invoice, productLines });
  };

  const handleRemove = (i) => {
    const productLines = invoice.productLines.filter(
      (productLine, index) => index !== i
    );

    setInvoice({ ...invoice, productLines });
  };

  const handleAdd = () => {
    const productLines = [...invoice.productLines, { ...initialProductLine }];

    setInvoice({ ...invoice, productLines });
  };

  const calculateAmount = (quantity, rate) => {
    const quantityNumber = parseFloat(quantity);
    const rateNumber = parseFloat(rate);
    const amount =
      quantityNumber && rateNumber ? quantityNumber * rateNumber : 0;

    return amount.toFixed(2);
  };

  useEffect(() => {
    let subTotal = 0;

    invoice.productLines.forEach((productLine) => {
      const quantityNumber = parseFloat(productLine.quantity);
      const rateNumber = parseFloat(productLine.rate);
      const amount =
        quantityNumber && rateNumber ? quantityNumber * rateNumber : 0;

      subTotal += amount;
    });

    setSubTotal(subTotal);
  }, [invoice.productLines]);

  useEffect(() => {
    const match = invoice.taxLabel.match(/(\d+)%/);
    const taxRate = match ? parseFloat(match[1]) : 0;
    const saleTax = subTotal ? (subTotal * taxRate) / 100 : 0;

    setSaleTax(saleTax);
  }, [subTotal, invoice.taxLabel]);
  // const [ok, setOk] = useState(1);

  return (
    <Document pdfMode={pdfMode}>
      <Page className="invoice-wrapper" pdfMode={pdfMode}>
        {!pdfMode && (
          <>
            <Download data={invoice} />
          </>
        )}

        <div className="invoicePageCotainer">
          <div className="invoicePage">
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-50" pdfMode={pdfMode}>
                <EditableFileImage
                  className="logo"
                  placeholder="Your Logo"
                  value={invoice.logo}
                  width={invoice.logoWidth}
                  pdfMode={pdfMode}
                  onChangeImage={(value) => handleChange("logo", value)}
                  onChangeWidth={(value) => handleChange("logoWidth", value)}
                />
                <EditableInput
                  className="fs-20 bold"
                  placeholder="Your Company"
                  value={invoice.companyName}
                  onChange={(value) => handleChange("companyName", value)}
                  pdfMode={pdfMode}
                />
                <EditableInput
                  placeholder="Your Name"
                  value={invoice.name}
                  onChange={(value) => handleChange("name", value)}
                  pdfMode={pdfMode}
                />
                <EditableInput
                  placeholder="Company's Address"
                  value={invoice.companyAddress}
                  onChange={(value) => handleChange("companyAddress", value)}
                  pdfMode={pdfMode}
                />
                <EditableInput
                  placeholder="City, State Zip"
                  value={invoice.companyAddress2}
                  onChange={(value) => handleChange("companyAddress2", value)}
                  pdfMode={pdfMode}
                />
                <EditableSelect
                  options={countryList}
                  value={invoice.companyCountry}
                  onChange={(value) => handleChange("companyCountry", value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-50" pdfMode={pdfMode}>
                <EditableInput
                  className="fs-45 right bold"
                  placeholder="Invoice"
                  value={invoice.title}
                  onChange={(value) => handleChange("title", value)}
                  pdfMode={pdfMode}
                />
              </View>
            </View>
            <View className="flex mt-40" pdfMode={pdfMode}>
              <View className="w-55" pdfMode={pdfMode}>
                <EditableInput
                  className="bold dark mb-5"
                  value={invoice.billTo}
                  onChange={(value) => handleChange("billTo", value)}
                  pdfMode={pdfMode}
                />
                <EditableInput
                  placeholder="Your Client's Name"
                  value={invoice.clientName}
                  onChange={(value) => handleChange("clientName", value)}
                  pdfMode={pdfMode}
                />
                <EditableInput
                  placeholder="Client's Address"
                  value={invoice.clientAddress}
                  onChange={(value) => handleChange("clientAddress", value)}
                  pdfMode={pdfMode}
                />
                <EditableInput
                  placeholder="City, State Zip"
                  value={invoice.clientAddress2}
                  onChange={(value) => handleChange("clientAddress2", value)}
                  pdfMode={pdfMode}
                />
                <EditableSelect
                  options={countryList}
                  value={invoice.clientCountry}
                  onChange={(value) => handleChange("clientCountry", value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-45" pdfMode={pdfMode}>
                <View className="flex mb-5" pdfMode={pdfMode}>
                  <View className="w-40" pdfMode={pdfMode}>
                    <EditableInput
                      className="bold"
                      value={invoice.invoiceTitleLabel}
                      onChange={(value) =>
                        handleChange("invoiceTitleLabel", value)
                      }
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-60" pdfMode={pdfMode}>
                    <EditableInput
                      placeholder="INV-12"
                      value={invoice.invoiceTitle}
                      onChange={(value) => handleChange("invoiceTitle", value)}
                      pdfMode={pdfMode}
                    />
                  </View>
                </View>
                <View className="flex mb-5" pdfMode={pdfMode}>
                  <View className="w-40" pdfMode={pdfMode}>
                    <EditableInput
                      className="bold"
                      value={invoice.invoiceDateLabel}
                      onChange={(value) =>
                        handleChange("invoiceDateLabel", value)
                      }
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-60" pdfMode={pdfMode}>
                    <EditableCalendarInput
                      // value={format(invoiceDate, dateFormat)}
                      value={moment(invoiceDate).format("MMMM Do, YYYY")}
                      selected={invoiceDate}
                      onChange={(date) => {
                        console.log(date);
                        handleChange("invoiceDate", date);
                      }}
                      pdfMode={pdfMode}
                    />
                  </View>
                </View>
                <View className="flex mb-5" pdfMode={pdfMode}>
                  <View className="w-40" pdfMode={pdfMode}>
                    <EditableInput
                      className="bold"
                      value={invoice.invoiceDueDateLabel}
                      onChange={(value) =>
                        handleChange("invoiceDueDateLabel", value)
                      }
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-60" pdfMode={pdfMode}>
                    <EditableCalendarInput
                      // value={format(invoiceDueDate, dateFormat)}
                      value={moment(invoiceDueDate).format("MMMM Do, YYYY")}
                      selected={invoiceDueDate}
                      onChange={(date) => handleChange("invoiceDueDate", date)}
                      pdfMode={pdfMode}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View className="mt-30 bg-dark flex" pdfMode={pdfMode}>
              <View className="w-48 p-4-8" pdfMode={pdfMode}>
                <EditableInput
                  className="white bold"
                  value={invoice.productLineDescription}
                  onChange={(value) =>
                    handleChange("productLineDescription", value)
                  }
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8" pdfMode={pdfMode}>
                <EditableInput
                  className="white bold right"
                  value={invoice.productLineQuantity}
                  onChange={(value) =>
                    handleChange("productLineQuantity", value)
                  }
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8" pdfMode={pdfMode}>
                <EditableInput
                  className="white bold right"
                  value={invoice.productLineQuantityRate}
                  onChange={(value) =>
                    handleChange("productLineQuantityRate", value)
                  }
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-18 p-4-8" pdfMode={pdfMode}>
                <EditableInput
                  className="white bold right"
                  value={invoice.productLineQuantityAmount}
                  onChange={(value) =>
                    handleChange("productLineQuantityAmount", value)
                  }
                  pdfMode={pdfMode}
                />
              </View>
            </View>
            {invoice.productLines.map((productLine, i) => {
              return pdfMode && productLine.description === "" ? (
                <Text key={i}></Text>
              ) : (
                <View key={i} className="row flex" pdfMode={pdfMode}>
                  <View className="w-48 p-4-8 pb-10" pdfMode={pdfMode}>
                    <EditableTextarea
                      className="dark"
                      rows={2}
                      placeholder="Enter item name/description"
                      value={productLine.description}
                      onChange={(value) =>
                        handleProductLineChange(i, "description", value)
                      }
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                    <EditableInput
                      className="dark right"
                      value={productLine.quantity}
                      onChange={(value) =>
                        handleProductLineChange(i, "quantity", value)
                      }
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                    <EditableInput
                      className="dark right"
                      value={productLine.rate}
                      onChange={(value) =>
                        handleProductLineChange(i, "rate", value)
                      }
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-18 p-4-8 pb-10" pdfMode={pdfMode}>
                    <Text className="dark right" pdfMode={pdfMode}>
                      {calculateAmount(productLine.quantity, productLine.rate)}
                    </Text>
                  </View>
                  {!pdfMode && (
                    <button
                      className="link row__remove"
                      aria-label="Remove Row"
                      title="Remove Row"
                      onClick={() => handleRemove(i)}
                    >
                      <span className="icon icon-remove bg-red"></span>
                    </button>
                  )}
                </View>
              );
            })}
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-50 mt-10" pdfMode={pdfMode}>
                {!pdfMode && (
                  <button className="link" onClick={handleAdd}>
                    <span className="icon icon-add bg-green mr-10"></span>
                    Add Line Item
                  </button>
                )}
              </View>
              <View className="w-50 mt-20" pdfMode={pdfMode}>
                <View className="flex" pdfMode={pdfMode}>
                  <View className="w-50 p-5" pdfMode={pdfMode}>
                    <EditableInput
                      value={invoice.subTotalLabel}
                      onChange={(value) => handleChange("subTotalLabel", value)}
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-50 p-5" pdfMode={pdfMode}>
                    <Text className="right bold dark" pdfMode={pdfMode}>
                      {subTotal?.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View className="flex" pdfMode={pdfMode}>
                  <View className="w-50 p-5" pdfMode={pdfMode}>
                    <EditableInput
                      value={invoice.taxLabel}
                      onChange={(value) => handleChange("taxLabel", value)}
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-50 p-5" pdfMode={pdfMode}>
                    <Text className="right bold dark" pdfMode={pdfMode}>
                      {saleTax?.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View className="flex bg-gray p-5" pdfMode={pdfMode}>
                  <View className="w-50 p-5" pdfMode={pdfMode}>
                    <EditableInput
                      className="bold"
                      value={invoice.totalLabel}
                      onChange={(value) => handleChange("totalLabel", value)}
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-50 p-5 flex" pdfMode={pdfMode}>
                    <EditableInput
                      className="dark bold right ml-30"
                      value={invoice.currency}
                      onChange={(value) => handleChange("currency", value)}
                      pdfMode={pdfMode}
                    />
                    <Text className="right bold dark w-auto" pdfMode={pdfMode}>
                      {(typeof subTotal !== "undefined" &&
                      typeof saleTax !== "undefined"
                        ? subTotal + saleTax
                        : 0
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="mt-20" pdfMode={pdfMode}>
              <EditableInput
                className="bold w-100"
                value={invoice.notesLabel}
                onChange={(value) => handleChange("notesLabel", value)}
                pdfMode={pdfMode}
              />
              <EditableTextarea
                className="w-100"
                rows={2}
                value={invoice.notes}
                onChange={(value) => handleChange("notes", value)}
                pdfMode={pdfMode}
              />
            </View>
            <View className="mt-20" pdfMode={pdfMode}>
              <EditableInput
                className="bold w-100"
                value={invoice.termLabel}
                onChange={(value) => handleChange("termLabel", value)}
                pdfMode={pdfMode}
              />
              <EditableTextarea
                className="w-100"
                rows={2}
                value={invoice.term}
                onChange={(value) => handleChange("term", value)}
                pdfMode={pdfMode}
              />
            </View>
          </div>
        </div>
      </Page>
    </Document>
  );
};
// const InvoicePageContainer = () => {
//   return (
//     <>
//       <div className="app">
//         <h1 className="center fs-30">React Invoice Generator</h1>
//         <InvoicePage />
//       </div>
//     </>
//   );
// };
export default InvoicePage;
