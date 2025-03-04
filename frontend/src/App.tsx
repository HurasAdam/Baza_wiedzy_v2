import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Login";

import { RootLayout } from "./layouts/RootLayout";
import { AuthLayout } from "./layouts/AuthLayout";

import { NotFoundPage } from "./pages/NotFoundPage";

// import { HomePage } from "./pages/HomePage";
// import { ArticlesPage } from "./pages/ArticlesPage";
// import { StatisticsPage } from "./pages/StatisticsPage";
// import { TopicsRegisterPage } from "./pages/TopicsRegisterPage";
// import { FavoritesPage } from "./pages/FavoritesArticlesPage";

import useTheme from "./hooks/useTheme";

const HomePage = lazy(() => import("./pages/HomePage").then(module => ({ default: module.HomePage })));
const ArticlesPage = lazy(() => import("./pages/ArticlesPage").then(module => ({ default: module.ArticlesPage })));
const StatisticsPage = lazy(() => import("./pages/StatisticsPage").then(module => ({ default: module.StatisticsPage })));
const TopicsRegisterPage = lazy(() => import("./pages/TopicsRegisterPage").then(module => ({ default: module.TopicsRegisterPage })));
const FavoritesPage = lazy(() => import("./pages/FavoritesArticlesPage").then(module => ({ default: module.FavoritesPage })));

const RegisterPage = lazy(() => import("./pages/Register").then(module => ({ default: module.RegisterPage })));

function App() {

    const { theme } = useTheme();

    return (
        <div className="bg-background theme">
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<RootLayout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<HomePage />} />
                        <Route path="articles" element={<ArticlesPage />} />
                        <Route path="statistics" element={<StatisticsPage />} />
                        <Route path="call-register" element={<TopicsRegisterPage />} />
                        <Route path="favourites" element={<FavoritesPage />} />

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


                    {/* <Route path="/admin" element={<AdminLayout />}>
                    <Route index path="dashboard" element={<AdminDashboard />} /> 
                <Route path="tags" element={<TagsPage />} /> 
                   <Route path="products" element={<ProductsPage />} /> 
                   <Route path="topics" element={<ConversationTopicsPage />} />
                    <Route path="articles-removed" element={<TrashedArticlesPage />} /> 
                </Route> */}
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
