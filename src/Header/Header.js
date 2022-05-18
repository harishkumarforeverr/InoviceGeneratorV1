import { Button, Typography } from "antd";
import React from "react";
import { Image } from "antd";
import "./Header.scss";
import Back from "./Image/right-arrow.svg";
import { useHistory } from "react-router-dom";
const { Title } = Typography;
const Header = (props) => {
  let history = useHistory();
  return (
    <div className="invoice-header-wrapper">
      <Title level={4}>
        {/* <Image src={Back} preview={false} alt="back" /> */}
        {/* Invoice #002 */}
      </Title>
      <div>
        {/* <Button>Download</Button> */}
        <Button>Preview</Button>
        <Button type="primary">send Invoice</Button>
      </div>
    </div>
  );
};

export default Header;
