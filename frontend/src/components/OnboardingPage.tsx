import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "./ui/progress";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/auth/useLogout";
import { Alert } from "./alert/Alert";
import { useAlert } from "./alert/hooks/useAlert";
import ThemeSelector from "./ThemeSelector";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/user.api";
import { USER_KEY } from "@/hooks/auth/keys";
import toast from "react-hot-toast";

const passwordSchema = z
    .object({
        password: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
        confirmPassword: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Hasła muszą być takie same",
        path: ["confirmPassword"],
    });

type OnboardingFormData = z.infer<typeof passwordSchema>;

const ChangePasswordStep = ({ register, errors }: any) => (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Zmień hasło</h2>
        <p className="text-sm text-muted-foreground">Wprowadź nowe hasło, aby zabezpieczyć konto.</p>

        <div>
            <input
                type="password"
                placeholder="Nowe hasło"
                className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg"
                {...register("password")}
            />
            {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}
        </div>

        <div>
            <input
                type="password"
                placeholder="Powtórz hasło"
                className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg"
                {...register("confirmPassword")}
            />
            {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword.message}</div>}
        </div>
    </div>
);

const AvatarUploader = () => {
    const [avatar, setAvatar] = useState<File | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatar(file);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Dodaj awatar</h2>
            <p className="text-sm text-muted-foreground">Wybierz zdjęcie profilowe.</p>
            <div className="flex justify-center">
                {avatar ? (
                    <img
                        src={URL.createObjectURL(avatar)}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xl">
                        +
                    </div>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-4 py-2 text-sm border border-input rounded-lg"
            />
        </div>
    );
};

const steps = [
    { id: 1, label: "Zmień hasło" },
    { id: 2, label: "Wybierz motyw" },
    { id: 3, label: "Wybierz Avatar" },
];

const OnboardingPage = () => {
    const queryClient = useQueryClient();
    const { logoutAction } = useLogout();
    const [currentStep, setCurrentStep] = useState(1);
    const { openAlert, isOpen: isLogoutAlertOpen, closeAlert } = useAlert();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<OnboardingFormData>({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
    });

    const { mutate } = useMutation({
        mutationFn: (formData) => {
            return userApi.changePassword(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(USER_KEY);
        },
        onError: ({ status }) => {
            if (status === 400) {
                toast.error("Nowe hasło nie może być takie samo jak obecne.");
            } else {
                toast.error("Wystąpił błąd podczas zmiany hasła.");
            }
        },
    });

    const onSubmit = (data: OnboardingFormData) => {
        console.log("Finalne dane z formularza:", data);
        mutate(data);
    };

    const renderStepComponent = () => {
        switch (currentStep) {
            case 1:
                return <ChangePasswordStep register={register} errors={errors} />;
            case 2:
                return <ThemeSelector />;
            case 3:
                return <AvatarUploader />;
            default:
                return null;
        }
    };

    const progress = (currentStep / steps.length) * 100;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <Progress value={progress} className="mb-4" />
                    <div className="grid grid-cols-3 text-xs text-muted-foreground text-center mt-2">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={clsx("transition-colors", {
                                    "text-foreground font-medium": currentStep === step.id,
                                })}
                            >
                                {step.label}
                            </div>
                        ))}
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`step-${currentStep}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStepComponent()}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between pt-4">
                            {currentStep > 1 ? (
                                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} type="button">
                                    Wstecz
                                </Button>
                            ) : (
                                <div />
                            )}
                            {currentStep < steps.length ? (
                                <button
                                    className="border border-muted bg-background text-foreground hover:bg-primary rounded-md px-4 py-2 transition-colors"
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={currentStep === 1 && !isValid}
                                    type="button"
                                >
                                    Dalej
                                </button>
                            ) : (
                                <Button className="bg-primary/80" type="submit">
                                    Zakończ
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Logout button */}
            <div className="absolute top-4 right-4">
                <Button variant="outline" className="hover:bg-primary" onClick={openAlert}>
                    Wyloguj
                </Button>
            </div>
            <Alert type="info" isOpen={isLogoutAlertOpen} onCancel={closeAlert} onConfirm={logoutAction}>
                <div>Czy na pewno chcesz się wylogować?</div>
            </Alert>
        </div>
    );
};

export default OnboardingPage;
