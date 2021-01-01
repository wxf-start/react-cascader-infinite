import React from "react";
import ReactDOM from "react-dom";
import ReactCascaderTransfer from "./index";

import city from "./config/city";

const onChange=(checked:boolean,item:any)=>{
 console.log(checked,"checked");
 console.log(item,"itemitem")
}

ReactDOM.render(
  <ReactCascaderTransfer
    data={{
      children: city,
      title: "省",
      defaultValue:[350206],
      disabledValue:[31,330100,350206123]
    }}
    onChange={onChange}
  />,
  document.getElementById("root")
);
