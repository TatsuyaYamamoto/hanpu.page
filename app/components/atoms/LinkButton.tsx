import * as React from "react";

import Link from "next/link";

import Button from "@material-ui/core/Button";

interface LinkButtonProps {
  href: string;
  disabled?: boolean;
  variant?: "text" | "outlined" | "contained";
}
const LinkButton: React.FC<LinkButtonProps> = props => {
  const { children, href, ...others } = props;

  if (href.startsWith("http")) {
    // use a#href if provided url is absolute path with protocol
    return (
      <Button href={href} {...others}>
        {children}
      </Button>
    );
  }

  return (
    <Link href={href}>
      <Button {...others}>{children}</Button>
    </Link>
  );
};

export default LinkButton;
