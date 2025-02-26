import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { HomePage } from "./pages/HomePage";
import { RootLayout } from "./layouts/RootLayout";

import { AuthLayout } from "./layouts/AuthLayout";

import { StatisticsPage } from "./pages/StatisticsPage";
import { TopicsRegisterPage } from "./pages/TopicsRegisterPage";
import { FavoritesPage } from "./pages/FavoritesArticlesPage";
import { ArticlesPage } from "./pages/ArticlesPage";



function App() {
    return (
        <div className="bg-zinc-100">
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<HomePage />} />
                    <Route path="articles" element={<ArticlesPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="call-register" element={<TopicsRegisterPage />} />
                    <Route path="favourites" element={<FavoritesPage />} />
                    {/* <Route path="articles" element={<SearchPage />} /> */}
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
        </div>
    );
}

export default App;
