import { useState } from "react";

const ChangePasswordForm = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Hasła nie pasują do siebie.");
            return;
        }
        if (password.length < 8) {
            setErrorMessage("Hasło musi mieć co najmniej 8 znaków.");
            return;
        }
        console.log("Hasło zmienione!");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nowe hasło */}
            <div className="mb-5">
                <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                    Nowe hasło
                </label>
                <div className="relative mt-2">
                    <input
                        type={passwordVisibility ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Wpisz nowe hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out"
                    />
                    <button
                        type="button"
                        onClick={() => setPasswordVisibility(!passwordVisibility)}
                        className="absolute top-3 right-4 text-gray-600 hover:text-indigo-500 transition-all"
                    >
                        {passwordVisibility ? "👁️" : "👁️‍🗨️"}
                    </button>
                </div>
            </div>

            {/* Potwierdzenie hasła */}
            <div className="mb-5">
                <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">
                    Potwierdź hasło
                </label>
                <input
                    type={passwordVisibility ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Potwierdź swoje hasło"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out"
                />
            </div>

            {/* Komunikaty błędów */}
            {errorMessage && <div className="text-red-500 text-sm mb-5">{errorMessage}</div>}

            {/* Przycisk akcji */}
            <button
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all ease-in-out"
            >
                Zmień hasło
            </button>
        </form>
    );
};

export default ChangePasswordForm;
