import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { RootLayout } from "./layouts/RootLayout";
import { LoginPage } from "./pages/Login";

import { NotFoundPage } from "./pages/NotFoundPage";

import { ArticlesPage } from "./pages/ArticlesPage";
import { FavoritesPage } from "./pages/FavoritesArticlesPage";
import { HomePage } from "./pages/HomePage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { TopicsRegisterPage } from "./pages/TopicsRegisterPage";

import CreateArticle from "./components/articles/Create/CreateArticle";
import useTheme from "./hooks/useTheme";

import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import TagsPage from "./pages/admin/TagsPage";
import TopicsPage from "./pages/admin/TopicsPage";
import UsersPage from "./pages/admin/UsersPage";
import { RegisterPage } from "./pages/Register";

// const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
// const ArticlesPage = lazy(() => import("./pages/ArticlesPage").then((module) => ({ default: module.ArticlesPage })));
// const StatisticsPage = lazy(() =>
//     import("./pages/StatisticsPage").then((module) => ({ default: module.StatisticsPage }))
// );
// const TopicsRegisterPage = lazy(() =>
//     import("./pages/TopicsRegisterPage").then((module) => ({ default: module.TopicsRegisterPage }))
// );
// const FavoritesPage = lazy(() =>
//     import("./pages/FavoritesArticlesPage").then((module) => ({ default: module.FavoritesPage }))
// );

function App() {
    const { theme } = useTheme();

    return (
        <div className="bg-background theme">
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<HomePage />} />
                    <Route path="articles" element={<ArticlesPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="call-register" element={<TopicsRegisterPage />} />
                    <Route path="favourites" element={<FavoritesPage />} />
                    <Route path="new-article" element={<CreateArticle />} />

                    {/* <Route path="articles/new" element={<CreateArticle />} /> */}
                    {/* <Route path="articles/favorite" element={<FavouritesPage />} /> */}
                    {/* <Route path="articles/:id" element={<ArticleDetails />} /> */}
                    {/* <Route path="call-register" element={<CallRegister />} /> */}
                    {/* <Route path="settings" element={<Settings />} />  */}

                    {/* <Route path="departments" element={<Deparments />}>
                    <Route index element={<Navigate to="helpdesk" replace />} />
                    <Route index path="helpdesk" element={<HelpdeskPage />} />
                    <Route path="sales" element={<SalesPage />} />
                    <Route path="administration" element={<AdministrationPage />} />
                    <Route path="appointment" element={<AppointmentPage />} />
                    </Route> */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="topics" element={<TopicsPage />} />
                    <Route path="tags" element={<TagsPage />} />
                    <Route path="users" element={<UsersPage />} />
                </Route>
            </Routes>
            <Toaster toastOptions={{ duration: 3500 }} />;
        </div>
    );
}

export default App;
