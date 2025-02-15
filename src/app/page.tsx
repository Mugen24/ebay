import ClientSideApp from "./ClientSideApp";
import { ServerInit } from "./server/Init";
// import { SavedQueryGallery } from "./server_components/SavedQueryGalleryClient";

export default function App() {
    ServerInit()
    return (
        <ClientSideApp>
            {/* <SavedQueryGallery></SavedQueryGallery> */}
        </ClientSideApp>
    )
}
