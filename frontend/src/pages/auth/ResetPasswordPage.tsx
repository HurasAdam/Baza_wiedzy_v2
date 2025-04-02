import { useMutation } from "@tanstack/react-query";
import { AiOutlineCheckCircle, AiOutlineLock } from "react-icons/ai";
import { Link, useSearchParams } from "react-router-dom";
import ResetPasswordForm from "../../components/forms/ResetPasswordForm";
import { authApi } from "../../lib/auth.api";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const exp = Number(searchParams.get("exp"));
    const now = Date.now();
    const linkIsValid = code && exp && exp > now;

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({ password, verificationCode }) => {
            return authApi.resetPassword({ password, verificationCode });
        },
    });

    const onSave = ({ password, verificationCode }) => {
        mutate({ password, verificationCode });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            {isSuccess ? (
                <div className="w-full max-w-md bg-background shadow-lg rounded-xl overflow-hidden max-h-[50vh] flex flex-col min-h-[50vh] border">
                    {/* Górna część z zielonym motywem */}
                    <div className="bg-green-600 py-6 flex flex-col items-center rounded-t-xl">
                        <div className="bg-white p-3 rounded-full shadow-md">
                            <AiOutlineCheckCircle className="text-green-600 h-10 w-10" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-white">Hasło zostało zmienione!</h2>
                    </div>

                    {/* Dolna część z komunikatem */}
                    <div className="bg-card p-12 text-center min-h-full flex-grow">
                        <div className="flex flex-col gap-7">
                            <p className="text-lg text-muted-foreground">
                                Twoje hasło zostało pomyślnie zmienione. Możesz się teraz zalogować.
                            </p>
                        </div>
                        <div className="mt-10">
                            <Link
                                to="/login"
                                className="px-6 py-3 border border-green-600 text-green-600 font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-green-600 hover:text-white"
                            >
                                Przejdź do logowania
                            </Link>
                        </div>
                    </div>
                </div>
            ) : linkIsValid ? (
                <div className="w-full max-w-md bg-background shadow-lg rounded-b-xl overflow-hidden">
                    <ResetPasswordForm code={code} onSave={onSave} isPending={isPending} />
                </div>
            ) : (
                <div className="w-full max-w-md shadow-lg rounded-xl overflow-hidden max-h-[50vh] flex flex-col min-h-[50vh] border">
                    {/* Górna część z czerwonym motywem */}
                    <div className="bg-rose-700 py-6 flex flex-col items-center rounded-t-xl">
                        <div className="bg-white p-3 rounded-full shadow-md">
                            <AiOutlineLock className="text-red-500 h-10 w-10" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-white">Link wygasł lub jest nieprawidłowy</h2>
                    </div>

                    {/* Dolna część z komunikatem */}
                    <div className="bg-card p-12 text-center min-h-full flex-grow">
                        <div className="flex flex-col gap-7">
                            <p className="text-lg text-muted-foreground">
                                Ten link do resetowania hasła jest nieprawidłowy lub wygasł.
                            </p>
                            <p className="text-sm mt-4 opacity-75">Jeśli Twój link wygasł, możesz wygenerować nowy.</p>
                        </div>
                        <div className="mt-10">
                            <Link
                                to="/password/forgot"
                                className="px-6 py-3 border border-red-500 text-red-500 font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-red-500 hover:text-white"
                            >
                                Wyślij nowy link
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPasswordPage;
