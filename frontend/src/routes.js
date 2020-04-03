import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Chat from "./containers/Chat";

const BaseRouter = () => (
  // We need the name of this parameter,
    // so Chat.js will get this information and use it.
  <Hoc>
    <Route exact path="/:chatID/" component={Chat} />
  </Hoc>
);

export default BaseRouter;
