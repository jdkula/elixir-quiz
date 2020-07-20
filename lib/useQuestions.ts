import { Question } from './quiz';
import { useState, useEffect } from 'react';
import Axios from 'axios';

export default function useQuestions(
    select = 12,
    randomizeQuestions = true,
    forResult = undefined,
    lazy = false,
): [Question[], boolean, boolean, () => void] {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const refresh = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await Axios.get('/api/questions', {
                params: {
                    randomizeQuestions,
                    select,
                    forResult,
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
        if (!lazy) {
            refresh();
        }
    }, []);

    return [questions, loading, error, refresh];
}
