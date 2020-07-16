import { Question } from "./quiz";
import { useState, useEffect } from "react";
import Axios from "axios";

export default function useQuestions(select = 12, randomized = true): [Question[], boolean] {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Axios.get("/api/questions", {
            params: {
                randomized,
                select,
            },
        }).then((response) => {
            setQuestions(response.data);
            setLoading(false);
        });
    }, []);

    return [questions, loading];
}
