export type ElixirType = "Aura" | "Elemental" | "Enchanter" | "Transformer";

export default interface Elixir {
    type: ElixirType;
    color: string;
    particle: "a" | "an";
}

const kMapping: { [k: number]: Elixir } = {
    1: { type: "Aura", color: "#4a851b", particle: "an" },
    2: { type: "Elemental", color: "#aa8500", particle: "an" },
    3: { type: "Enchanter", color: "#8632aa", particle: "an" },
    4: { type: "Transformer", color: "#aa2000", particle: "a" },
};

export function getElixir(type: number): Elixir | null {
    return kMapping[type] ?? null;
}

export function getElixirTypes(): Elixir[] {
    return Object.keys(kMapping).map((k) => kMapping[k]);
}
