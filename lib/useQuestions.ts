import { Question } from "./quiz";
import { useState, useEffect } from "react";
import Axios from "axios";

export default function useQuestions(
    select = 12,
    randomized = true,
    randomizeQuestions = true,
): [Question[], boolean, boolean, () => void] {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const refresh = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await Axios.get("/api/questions", {
                params: {
                    randomized,
                    randomizeQuestions,
                    select,
                },
            });
            if (response.status !== 200) {
                setError(true);
                setLoading(false);
                return;
            }
            setQuestions(response.data);
            setLoading(false);
        } catch (e) {
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return [questions, loading, error, refresh];
}
