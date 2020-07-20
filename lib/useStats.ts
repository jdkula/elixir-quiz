import { useState, useEffect } from 'react';
import Axios from 'axios';
import { StatsReply } from './stats';

export default function useStats(): [StatsReply | null, boolean, boolean, () => void] {
    const [stats, setStats] = useState<StatsReply | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const refresh = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await Axios.get('/api/stats');
            if (response.status !== 200) {
                setError(true);
                setLoading(false);
                return;
            }
            setStats(response.data);
            setLoading(false);
        } catch (e) {
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return [stats, loading, error, refresh];
}
