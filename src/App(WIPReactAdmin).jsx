import { Admin, Resource } from "react-admin";
import dataProvider from "./dataProvider";

import VisitorsList from "./pages/list/VisitorsList(WIPReactAdmin";
import VisitorsEdit from "./pages/edit/VisitorsEdit";

export default function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="visitors"
        list={VisitorsList}
        edit={VisitorsEdit}
      />
    </Admin>
  );
}