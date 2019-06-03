import * as React from "react";

import { Link, LinkProps } from "react-router-dom";
import * as H from "history";

import Button, { ButtonProps } from "@material-ui/core/Button";

/**
 * @link https://material-ui.com/components/buttons/#third-party-routing-library
 */
const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link innerRef={ref as any} {...props} />
);

const LinkButton: React.FC<ButtonProps & LinkProps> = props => {
  const { children, to, replace, innerRef, ...others } = props;

  return (
    <Button
      component={AdapterLink}
      to={to}
      replace={replace}
      innerRef={innerRef}
      {...others as any}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
