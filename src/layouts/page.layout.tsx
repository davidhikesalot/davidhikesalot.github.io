import { Outlet } from "react-router-dom";
import { ISiteData } from "../services/data.service";

export interface IPageLayoutProps {
  data: ISiteData;
}

export function PageLayout(props: IPageLayoutProps) {
  return (
    <section id="content">
      <Outlet context={props} />
    </section>
  );
}
