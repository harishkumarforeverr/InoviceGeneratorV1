import React from "react";
import Invoice from "./InvoiceGenrator/components/InvoiceGenrator";
// import IndexPDFView from "./PDFViewerComponent/IndexPDFView";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

function Child() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();

  return (
    <div>
      <h3>ID: {id}</h3>
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" children={<Invoice />} exact />
        <Route path="/:id" children={<Invoice />} exact />
        <Route path="*" children={<Invoice />} />
      </Switch>
    </Router>
  );
};

export default App;
