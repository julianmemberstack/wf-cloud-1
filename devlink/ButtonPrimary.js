"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./ButtonPrimary.module.css";

export function ButtonPrimary({
  as: _Component = _Builtin.Link,
  buttonText = "Get started",

  link = {
    href: "#",
  },
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "button")}
      button={true}
      block=""
      options={link}
    >
      {buttonText}
    </_Component>
  );
}
