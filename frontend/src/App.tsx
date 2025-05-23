import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import IssueReportsLayout from "./components/admin/Issue/IssueReportsLayout";
import CreateArticle from "./components/articles/Create/CreateArticle";
import MailPage from "./components/articles/views/splitView/ArticlesSplitView";
import OnboardingPage from "./components/OnboardingPage";
import { AuthProvider } from "./contexts/auth-provider";
import { ViewPreferenceProvider } from "./contexts/ViewPreferenceContext";
import useTheme from "./hooks/useTheme";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminRoute } from "./layouts/AdminRoute";
import { AuthLayout } from "./layouts/AuthLayout";
import { OnboardingLayout } from "./layouts/OnboardingLayout ";
import { RootLayout } from "./layouts/RootLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminsPage from "./pages/admin/AdminsPage";
import ManageDepartmentsPage from "./pages/admin/ManageDepartmentsPage";
import ManageProjectsPage from "./pages/admin/ManageProjectsPage";
import ProductsPage from "./pages/admin/ProductsPage";
import RolesAndPermissionsPage from "./pages/admin/RolesAndPermissionsPage";
import TagsPage from "./pages/admin/TagsPage";
import TopicsPage from "./pages/admin/TopicsPage";
import TrashedArticles from "./pages/admin/TrashedArticles";
import UsersPage from "./pages/admin/UsersPage";
import ArticlesPage from "./pages/ArticlesPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import { FavoritesPage } from "./pages/FavoritesArticlesPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import ProjectsPage from "./pages/ProjectsPage";
import { RegisterTopicPage } from "./pages/RegisterTopicPage";
import { StatisticsPage } from "./pages/StatisticsPage";

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
                            <AdminRoute />
                        </AuthProvider>
                    }
                >
                    <Route element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="topics" element={<TopicsPage />} />
                        <Route path="tags" element={<TagsPage />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="projects" element={<ManageProjectsPage />} />
                        <Route path="departments" element={<ManageDepartmentsPage />} />
                        <Route path="admins" element={<AdminsPage />} />
                        <Route path="roles" element={<RolesAndPermissionsPage />} />
                        <Route path="trashed-articles" element={<TrashedArticles />} />
                        <Route path="issues" element={<IssueReportsLayout />} />
                    </Route>
                </Route>
            </Routes>
            <Toaster toastOptions={{ duration: 3500, position: "bottom-right" }} />
        </div>
    );
}

export default App;
