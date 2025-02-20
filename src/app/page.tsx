import ClientSideApp from "./ClientSideApp";
import { CategoryProvider } from "./hooks/useCategories";
import { SettingProvider } from "./hooks/useSetting";
import { categoryManager } from "./server/setting/categoryManager";
import { setting } from "./server/setting/settings";

export default async function App() {
    if (!categoryManager.categories) {
        throw new Error("Category should be loaded")
    }
    if (!setting.setting) {
        throw new Error("Setting should be loaded")
    }

    return (
        <SettingProvider>
            <CategoryProvider>
                <ClientSideApp> </ClientSideApp>
            </CategoryProvider>
        </SettingProvider>
    )
}
