import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

import DriftViewer from "./DiffViewer";
const obj1 = [{ name: "Abc", age: 10, test: { name: "abc" } }];
const obj2 = [{ name: "Abcd", gender: "male" }];
ReactDOM.render(
  <DriftViewer source={obj1} destination={obj2} />,
  document.getElementById("root")
);
