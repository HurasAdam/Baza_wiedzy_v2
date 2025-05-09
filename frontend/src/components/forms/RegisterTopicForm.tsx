import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MdCall, MdEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { conversationReportApi } from "@/lib/conversation-report.api";
import { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const RegisterTopicForm = ({ topicId }: { topicId: string }) => {
    const [feedback, setFeedback] = useState<null | "call" | "message">(null);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            description: "",
            topic: topicId || "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (formData) => {
            return conversationReportApi.sendConversationReport(formData);
        },
        onSuccess: (_data, variables: any) => {
            setFeedback(variables.type);
            reset();

            setTimeout(() => setFeedback(null), 1500);
        },
        onError: () => {},
        onSettled: () => {},
    });

    const onSubmit = (type) =>
        handleSubmit((values) => {
            const formData = { ...values, type };
            console.log(formData);
            mutate(formData);
        });

    return (
        <form className="flex items-center space-x-3 w-1/2 my-auto">
            <Input placeholder="Notatka (opcjonalnie)" {...register("description")} className="h-11" />
            <Input type="hidden" value={topicId} {...register("topic")} />

            <div className=" flex  items-center pr-1 ">
                <AnimatePresence mode="wait">
                    {feedback ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center h-11 w-[96px] rounded-md  text-green-600 bg-background border"
                        >
                            <IoCheckmarkCircle className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="buttons"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex gap-2 h-11 w-[96px]"
                        >
                            <Button
                                type="button"
                                onClick={onSubmit("call")}
                                disabled={isPending}
                                className="flex items-center justify-center"
                                variant="outline"
                                aria-label="Call"
                            >
                                {isPending ? (
                                    <div className="animate-spin">
                                        <MdCall className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <MdCall className="w-4 h-4" />
                                )}
                            </Button>
                            <Button
                                type="button"
                                onClick={onSubmit("message")}
                                disabled={isPending}
                                className=" flex items-center justify-center"
                                variant="outline"
                                aria-label="Message"
                            >
                                {isPending ? (
                                    <div className="animate-spin">
                                        <MdEmail className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <MdEmail className="w-4 h-4" />
                                )}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
};

export default RegisterTopicForm;
