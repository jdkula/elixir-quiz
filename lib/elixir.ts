export type ElixirType = "Aura" | "Elemental" | "Enchanter" | "Transformer" | "Neutral";
export default interface Elixir {
    type: ElixirType;
    color: string;
    particle: "a" | "an";
}

const kElixirInfo = {
    Aura: { type: "Aura", color: "#4a851b", particle: "an" } as Elixir,
    Elemental: { type: "Elemental", color: "#aa8500", particle: "an" } as Elixir,
    Enchanter: { type: "Enchanter", color: "#8632aa", particle: "an" } as Elixir,
    Transformer: { type: "Transformer", color: "#aa2000", particle: "a" } as Elixir,
    Neutral: { type: "Neutral", color: "#999", particle: "a" } as Elixir,
};

const kMapping: { [k: number]: ElixirType | undefined } = {
    1: "Aura",
    2: "Elemental",
    3: "Enchanter",
    4: "Transformer",
};

export function getElixir(type: number | ElixirType): Elixir | null {
    if (typeof type === "number") {
        return kElixirInfo[kMapping[type]] ?? null;
    } else {
        return kElixirInfo[type] ?? null;
    }
}

export function getElixirTypes(): Elixir[] {
    return Object.keys(kMapping).map((k) => kElixirInfo[kMapping[k]]);
}
