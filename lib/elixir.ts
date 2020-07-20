export type ScoredElixirType = 'Aura' | 'Elemental' | 'Enchantment' | 'Transformation';
export type ElixirType = ScoredElixirType | 'Neutral';
export default interface Elixir {
    type: ElixirType;
    color: string;
    particle: 'a' | 'an';
}

const kElixirInfo: { [Type in ElixirType]: Elixir } = {
    Aura: { type: 'Aura', color: '#4a851b', particle: 'an' },
    Elemental: { type: 'Elemental', color: '#aa8500', particle: 'an' },
    Enchantment: { type: 'Enchantment', color: '#8632aa', particle: 'an' },
    Transformation: { type: 'Transformation', color: '#aa2000', particle: 'a' },
    Neutral: { type: 'Neutral', color: '#999', particle: 'a' },
};

const kMapping: { [k: number]: ScoredElixirType | undefined } = {
    1: 'Aura',
    2: 'Elemental',
    3: 'Enchantment',
    4: 'Transformation',
};

export function getElixir(type: number | ElixirType): Elixir | null {
    if (typeof type === 'number') {
        return kElixirInfo[kMapping[type]] ?? null;
    } else {
        return kElixirInfo[type] ?? null;
    }
}

export function getElixirTypes(): Elixir[] {
    return Object.keys(kMapping).map((k) => kElixirInfo[kMapping[k]]);
}
