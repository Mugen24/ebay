import ClientSideApp from "./ClientSideApp";
import { SavedSearchDashboard } from "./server_components/SavedSearchGallery";

export default function App() {
    return (
        <ClientSideApp>
            <SavedSearchDashboard></SavedSearchDashboard>
        </ClientSideApp>
    )
}
