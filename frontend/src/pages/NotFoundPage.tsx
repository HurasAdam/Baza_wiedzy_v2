import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground ">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-8xl font-extrabold text-foreground">404</h1>
                <p className="text-2xl mt-4 text-primary">Ups! Strona nie została znaleziona.</p>
                <p className="text-foreground mt-2">Strona, której szukasz, nie istnieje.</p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-primary text-foreground px-6 py-3 rounded-lg text-lg font-medium shadow-md hover:bg-primary/80 transition"
                >
                    Wróć na stronę główną
                </Link>
            </motion.div>
        </div>
    );
};
