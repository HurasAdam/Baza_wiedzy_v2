import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
// import OnboardingPage from "./components/OnboardingPage";
import useTheme from "./hooks/useTheme";
import { AuthLayout } from "./layouts/AuthLayout";

// import { OnboardingLayout } from "./layouts/OnboardingLayout ";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/Login";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import MailPage from "./components/articles/views/splitView/ArticlesSplitView";
import ArticlesPage from "./pages/ArticlesPage";
import { FavoritesPage } from "./pages/FavoritesArticlesPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { RegisterTopicPage } from "./pages/RegisterTopicPage";
import ProjectsPage from "./pages/ProjectsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
// import CreateArticle from "./components/articles/Create/CreateArticle";

import { AdminRoute } from "./layouts/AdminRoute";
import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import TopicsPage from "./pages/admin/TopicsPage";
import TagsPage from "./pages/admin/TagsPage";
import UsersPage from "./pages/admin/UsersPage";
import ManageProjectsPage from "./pages/admin/ManageProjectsPage";
import ManageDepartmentsPage from "./pages/admin/ManageDepartmentsPage";
import AdminsPage from "./pages/admin/AdminsPage";
import RolesAndPermissionsPage from "./pages/admin/RolesAndPermissionsPage";
import TrashedArticles from "./pages/admin/TrashedArticles";
import IssueReportsLayout from "./components/admin/Issue/IssueReportsLayout";

import { useQueryClient } from "@tanstack/react-query";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useCheckUser } from "./hooks/auth/useCheckUser";
import { Spinner2 } from "./components/core/spinner2";

function App() {
    useTheme();

    const queryClient = useQueryClient();
    const { user, status } = useCheckUser();

    if (status === "pending") {
        return <Spinner2 />;
    }

    queryClient.setQueryData(["user"], user);

    return (
        <div className="bg-background theme">
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
            <Toaster toastOptions={{ duration: 3500, position: "bottom-right" }} />
        </div>
    );
}

export default App;
