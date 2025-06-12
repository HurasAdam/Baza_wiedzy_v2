import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
// import OnboardingPage from "./components/OnboardingPage";
import useTheme from "./hooks/useTheme";
import { AuthLayout } from "./layouts/AuthLayout";

// import { OnboardingLayout } from "./layouts/OnboardingLayout ";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/Login";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import MailPage from "./components/articles/views/splitView/ArticlesSplitView";
import { RootLayout } from "./layouts/RootLayout";
import ArticlesPage from "./pages/ArticlesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import { FavoritesPage } from "./pages/FavoritesArticlesPage";
import { HomePage } from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import { RegisterTopicPage } from "./pages/RegisterTopicPage";
import { StatisticsPage } from "./pages/StatisticsPage";
// import CreateArticle from "./components/articles/Create/CreateArticle";

import IssueReportsLayout from "./components/admin/Issue/IssueReportsLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminRoute } from "./layouts/AdminRoute";
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

import { useQueryClient } from "@tanstack/react-query";
import { Spinner2 } from "./components/core/spinner2";
import { useCheckUser } from "./hooks/auth/useCheckUser";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
    useTheme();

    const queryClient = useQueryClient();
    const { user, status } = useCheckUser();

    if (status === "pending") {
        return <Spinner2 />;
    }

    queryClient.setQueryData(["user"], user);

    return (
        <div className="theme">
            <Routes>
                <Route path="auth" element={<AuthLayout />}>
                    <Route index element={<Navigate to="login" replace />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="password/forgot" element={<ForgotPasswordPage />} />
                    <Route path="password/reset" element={<ResetPasswordPage />} />
                    <Route path="*" element={<Navigate to="login" replace />} />
                </Route>

                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<HomePage />} />
                    <Route path="mail" element={<MailPage />} />
                    <Route path="articles" element={<ArticlesPage />} />
                    <Route path="favourites" element={<FavoritesPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="register-topic" element={<RegisterTopicPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="departments" element={<DepartmentsPage />} />
                    {/* <Route path="new-article" element={<CreateArticle />} /> */}

                    <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* <Route path="/onboarding" element={<OnboardingLayout />}>
                    <Route path="change-password" element={<OnboardingPage />} />
                </Route> */}

                <Route path="/admin" element={<AdminRoute />}>
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
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Route>
            </Routes>
            <Toaster toastOptions={{ duration: 3500, position: "top-right" }} />
        </div>
    );
}

export default App;
