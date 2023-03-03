import { ReactNode } from "react";

interface IExternalLinkProps {
  href: string | undefined;
  newtab?: boolean;
  children: ReactNode;
  className?: string;
}
export function ExternalLink(props: IExternalLinkProps) {
  const targetProps = props.newtab ? { target: "_blank" } : {};
  return props.href ? (
    <a href={props.href} className={props.className} {...targetProps}>
      {props.children}
    </a>
  ) : (
    <>{props.children}</>
  );
}
