import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { RootLayout } from "./layouts/RootLayout";

import { NotFoundPage } from "./pages/NotFoundPage";

import { FavoritesPage } from "./pages/FavoritesArticlesPage";
import { HomePage } from "./pages/HomePage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { TopicsRegisterPage } from "./pages/TopicsRegisterPage";

import CreateArticle from "./components/articles/Create/CreateArticle";
import useTheme from "./hooks/useTheme";

import { useQuery } from "@tanstack/react-query";
import MailPage from "./components/articles/views/splitView/ArticlesSplitView";
import { ViewPreferenceProvider } from "./contexts/ViewPreferenceContext";
import { AdminLayout } from "./layouts/AdminLayout";
import { articleApi } from "./lib/article.api";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import TagsPage from "./pages/admin/TagsPage";
import TopicsPage from "./pages/admin/TopicsPage";
import TrashedArticles from "./pages/admin/TrashedArticles";
import UsersPage from "./pages/admin/UsersPage";
import ArticlesPage from "./pages/ArticlesPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

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
const Test = () => {
    const { id } = useParams();
    const { data: article, isError } = useQuery({
        queryKey: ["article", id],
        queryFn: () => {
            return articleApi.getArticle({ id });
        },
    });

    if (isError) {
        return <div>BŁAD</div>;
    } else {
        return <div className="text-foreground">{article?.title}</div>;
    }
};
function App() {
    const { theme } = useTheme();

    return (
        <div className="bg-background theme ">
            <Routes>
                <Route
                    path="/"
                    element={
                        <ViewPreferenceProvider>
                            <RootLayout />
                        </ViewPreferenceProvider>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<HomePage />} />
                    <Route path="mail" element={<MailPage />} />
                    <Route path="articles" element={<ArticlesPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="call-register" element={<TopicsRegisterPage />} />
                    <Route path="favourites" element={<FavoritesPage />} />
                    <Route path="new-article" element={<CreateArticle />} />
                    <Route path="/article/:id" element={<Test />} />

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
                    <Route path="/password/forgot" element={<ForgotPasswordPage />} />
                    <Route path="/password/reset" element={<ResetPasswordPage />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="topics" element={<TopicsPage />} />
                    <Route path="tags" element={<TagsPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="trashed-articles" element={<TrashedArticles />} />
                </Route>
            </Routes>
            <Toaster toastOptions={{ duration: 3500, position: "bottom-right" }} />
        </div>
    );
}

export default App;
