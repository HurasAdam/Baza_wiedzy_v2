import { useMutation } from "@tanstack/react-query";
import { AiOutlineLock } from "react-icons/ai";
import { Link } from "react-router-dom";
import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm";
import { authApi } from "../../lib/auth.api";

const ForgotPasswordPage = () => {
    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: (email: string) => {
            return authApi.sendPasswordResetEmail(email);
        },
    });

    const onSave = (email) => {
        mutate(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center  p-6">
            {isSuccess ? (
                <div className="w-full max-w-md bg-gradient-to-r from-green-400 to-green-600 text-white p-8 rounded-xl shadow-2xl transform transition-all duration-300 ease-out scale-105">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white p-4 rounded-full shadow-lg">
                            <AiOutlineLock className="text-green-500 h-12 w-12" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-center mb-4">E-mail został wysłany!</h3>
                    <p className="text-center text-lg">Sprawdź swoją skrzynkę odbiorczą, aby zresetować hasło.</p>
                    <p className="text-center text-sm mt-4 opacity-75">
                        Jeśli nie otrzymałeś e-maila, sprawdź folder SPAM lub spróbuj ponownie.
                    </p>

                    {/* Przycisk do powrotu do logowania */}
                    <div className="mt-7 mb-1  text-center">
                        <Link
                            to="/login"
                            className="px-6 py-3 bg-foreground text-green-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out transform"
                        >
                            Powrót do logowania
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md bg-background shadow-lg rounded-b-xl overflow-hidden">
                    {/* Nagłówek z gradientowym tłem i ikoną */}
                    <div className="bg-primary py-6 flex flex-col items-center rounded-t-xl">
                        <div className="bg-white p-3 rounded-full shadow-md">
                            <AiOutlineLock className="text-blue-600 h-10 w-10" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-white">Resetowanie hasła</h2>
                        <p className="mt-2 text-sm text-white">
                            Podaj swój adres email, aby otrzymać link do resetowania hasła.
                        </p>
                    </div>
                    {/* Formularz */}
                    <div className="">
                        <ForgotPasswordForm onSave={onSave} isPending={isPending} isSuccess={isSuccess} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordPage;
