import { AiOutlineLock } from "react-icons/ai";
import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm";

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center  p-6">
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
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
