import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { LoginSchema } from "@/components/forms/LoginForm";
import queryClient from "@/config/queryClient";

type User = object;
type Status = 'pending' | 'error' | 'success';

interface IAuthProvider {
    user: User | null;
    setUser(user: User | null): void;
    clearUser(): void;
    updateUser(nextUser: User): void;
}

interface IAuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<IAuthProvider>(null!);

export const AuthProvider = ({ children }: IAuthProviderProps) => {
    const [user, setData] = useState<User | null>(null);
    const navigate = useNavigate();

    const setUser = (nextUser: User | null) => {
        setData(nextUser);
    }

    const updateUser = (nextUser: User) => {
        setData(nextUser);
        navigate("/", { replace: true });
    }

    const clearUser = () => {
        setData(null);
        navigate("/login", { replace: true });
    }

    return (
        <AuthContext.Provider value={{ user, setUser, clearUser, updateUser }}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error('useAuth is outside AuthProvider.');
    }

    return context;
};

export const useUser = () => {
    const { user } = useAuth();

    if (user === null) {
        throw Error('User not exist.');
    }

    return user;
}

export const useCheckUser = () => {
    const [status, setStatus] = useState<Status>('pending');
    const { setUser } = useAuth();

    useEffect(() => {
        api.getUser()
            .then((user) => {
                if (user) {
                    setUser(user);
                    setStatus('success')
                } else {
                    setUser(null);
                    setStatus('error')
                }
            })
            .catch(() => {
                setUser(null)
                setStatus('error');
            })
    }, [])

    return { status };
}

export const useLogin = () => {
    const { updateUser } = useAuth();

    const { mutate, isError } = useMutation({
        mutationFn: api.login,
    });

    const loginAction = (data: LoginSchema) => {
        mutate(data, {
            onSuccess: () => {
                updateUser(data)
            }
        })
    }

    return { loginAction, isError };
}

export const useLogout = () => {
    const { clearUser } = useAuth();

    const { mutate } = useMutation({
        mutationFn: api.logout,
        onSettled: () => {
            queryClient.clear();
            clearUser();
        },
    });

    const logoutAction = () => {
        mutate()
    }

    return { logoutAction };
}

