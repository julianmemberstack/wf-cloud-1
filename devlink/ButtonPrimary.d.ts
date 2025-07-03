import * as React from "react";
import * as Types from "./types";

declare function ButtonPrimary<T extends React.ElementType = "a">(props: {
  as?: T;
  buttonText?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'buttonText'>): React.JSX.Element;
