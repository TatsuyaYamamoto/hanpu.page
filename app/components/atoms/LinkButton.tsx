import * as React from "react";

import Link from "next/link";

import Button from "@material-ui/core/Button";

interface LinkButtonProps {
  href: string;
  disabled?: boolean;
}
const LinkButton: React.FC<LinkButtonProps> = props => {
  const { children, disabled, href } = props;

  if (href.startsWith("http")) {
    // use a#href if provided url is absolute path with protocol
    return (
      <Button href={href} disabled={disabled}>
        {children}
      </Button>
    );
  }

  return (
    <Link href={href}>
      <Button disabled={disabled}>{children}</Button>
    </Link>
  );
};

export default LinkButton;
