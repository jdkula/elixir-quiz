import { Question } from "./quiz";
import { useState, useEffect } from "react";
import Axios from "axios";
import Elixir, { ElixirType } from "./elixir";

export default function useElixirs(): [Map<ElixirType, Elixir>, boolean] {
    const [elixirs, setElixirs] = useState<Map<ElixirType, Elixir>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Axios.get("/api/elixirs").then((response) => {
            const map = new Map<ElixirType, Elixir>();
            for (const elixir of response.data) {
                map.set(elixir.type, elixir);
            }
            setElixirs(map);
            setLoading(false);
        });
    }, []);

    return [elixirs, loading];
}
