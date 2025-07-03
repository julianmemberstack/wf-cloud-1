"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./ButtonPrimary.module.css";

export function ButtonPrimary({
  as: _Component = _Builtin.Link,
  buttonText = "Get started",
  ...otherProps
}) {
  // Props specific to Link components
  const linkProps = _Component === _Builtin.Link ? {
    button: true,
    block: "",
    options: {
      href: "#",
    }
  } : {};

  return (
    <_Component
      className={_utils.cx(_styles, "button")}
      {...linkProps}
      {...otherProps}
    >
      {buttonText}
    </_Component>
  );
}
