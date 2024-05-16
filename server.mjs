import express, { json } from "express";
import { pokemonRouter } from "./api/pokemon/router.mjs";
import { abilitiesRouter } from "./api/abilities/router.mjs";
import { movesRouter } from "./api/moves/router.mjs";

const app = express();

app.use(json());

app.use("/pokemon", pokemonRouter);
app.use("/abilities/", abilitiesRouter);
app.use("/moves", movesRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`server http://localhost:${PORT}`));
