import { Question } from "./quiz";
import { useState, useEffect } from "react";
import Axios from "axios";

export default function useQuestions(
    select = 12,
    randomized = true,
    randomizeQuestions = true,
): [Question[], boolean, () => void] {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        const response = await Axios.get("/api/questions", {
            params: {
                randomized,
                randomizeQuestions,
                select,
            },
        });
        setQuestions(response.data);
        setLoading(false);
    };

    useEffect(() => {
        refresh();
    }, []);

    return [questions, loading, refresh];
}
