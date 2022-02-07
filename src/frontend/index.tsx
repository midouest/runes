import React from "react";
import { render as reactDomRender } from "react-dom";
import { Provider } from "react-redux";

import { App } from "./App";
import { store } from "./store";

function render() {
  reactDomRender(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
}

render();
