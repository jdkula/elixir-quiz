import { getElixirTypes } from "~/lib/elixir";
import { NextApiHandler } from "next";

const Elixirs: NextApiHandler = async (_, res) => {
    res.setHeader("Cache-Control", "max-age=3600, public");
    res.json(getElixirTypes());
};

export default Elixirs;
