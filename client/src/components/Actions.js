import React from "react";
import Action from "./Action/Action";

export default function Actions() {
  return (
    <div className="mm-actions">
      <div className="mm-actions_item mm-actions_item--left">
        <Action btn="Borrow" bgColor="secondary">Borrow Fil</Action>
      </div>
      <div className="mm-actions_item mm-actions_item--right">
        <Action  btn="Lend" bgColor="primary">Lend Fil</Action>
      </div>
    </div>
  );
}
