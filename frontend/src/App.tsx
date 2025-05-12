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
import IssueReportsLayout from "./components/admin/Issue/IssueReportsLayout";
import { OnboardingLayout } from "./layouts/OnboardingLayout ";
import OnboardingPage from "./components/OnboardingPage";
import { AuthProvider } from "./contexts/auth-provider";
import AdminsPage from "./pages/admin/AdminsPage";
import RolesAndPermissionsPage from "./pages/admin/RolesAndPermissionsPage";
import { RegisterTopicPage } from "./pages/RegisterTopicPage";
import ProjectsPage from "./pages/ProjectsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ManageDepartmentsPage from "./pages/admin/ManageDepartmentsPage";

function App() {
    const { theme } = useTheme();

    return (
        <div className="bg-background theme">
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/password/forgot" element={<ForgotPasswordPage />} />
                    <Route path="/password/reset" element={<ResetPasswordPage />} />
                </Route>

                <Route
                    path="/"
                    element={
                        <AuthProvider>
                            <ViewPreferenceProvider>
                                <RootLayout />
                            </ViewPreferenceProvider>
                        </AuthProvider>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<HomePage />} />
                    <Route path="mail" element={<MailPage />} />
                    <Route path="articles" element={<ArticlesPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="register-topic" element={<RegisterTopicPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="departments" element={<DepartmentsPage />} />
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

                <Route
                    path="/onboarding"
                    element={
                        <AuthProvider>
                            <OnboardingLayout />
                        </AuthProvider>
                    }
                >
                    <Route path="change-password" element={<OnboardingPage />} />
                </Route>

                <Route
                    path="/admin"
                    element={
                        <AuthProvider>
                            <AdminLayout />
                        </AuthProvider>
                    }
                >
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="topics" element={<TopicsPage />} />
                    <Route path="tags" element={<TagsPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="departments" element={<ManageDepartmentsPage />} />
                    <Route path="admins" element={<AdminsPage />} />
                    <Route path="roles" element={<RolesAndPermissionsPage />} />
                    <Route path="trashed-articles" element={<TrashedArticles />} />
                    <Route path="issues" element={<IssueReportsLayout />} />
                </Route>
            </Routes>
            <Toaster toastOptions={{ duration: 3500, position: "bottom-right" }} />
        </div>
    );
}

export default App;
