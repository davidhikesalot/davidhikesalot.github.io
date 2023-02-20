import { useRouteError } from "react-router-dom";
import { AppHeader } from "../components/appheader.component";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className="App">
      <AppHeader />
      <section id="content" className="card loaded">
        <div className="card-body">
          <h1>You are lost</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
        </div>
      </section>
    </div>
  );
}
