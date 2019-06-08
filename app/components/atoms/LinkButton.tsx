import * as React from "react";

import { Link, LinkProps } from "react-router-dom";

import Button, { ButtonProps } from "@material-ui/core/Button";

/**
 * @link https://material-ui.com/components/buttons/#third-party-routing-library
 */
const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link innerRef={ref as any} {...props} />
);

const LinkButton: React.FC<ButtonProps & LinkProps> = props => {
  const { children, to, replace, innerRef, ...others } = props;

  if (typeof to === "string" && to.startsWith("http")) {
    // use a#href if provided url is absolute path with protocol
    return (
      <Button href={to} {...others as any}>
        {children}
      </Button>
    );
  }

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
