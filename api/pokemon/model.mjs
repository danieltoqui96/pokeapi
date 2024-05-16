import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export class PokemonModel {
  // Obtener todos los Pokémon
  static async getAll() {
    const coll = client.db("pokeapi").collection("pokemon");
    const allPokemon = await coll.find().toArray();
    return allPokemon;
  }

  // Obtener Pokémon
  static async getById({ id }) {
    const coll = client.db("pokeapi").collection("pokemon");
    const pokemon = await coll.findOne({ _id: new ObjectId(id) });
    if (!pokemon) throw { message: "NOT_FOUND" };
    return pokemon;
  }

  // Crear Pokémon
  static async create({ input }) {
    const coll = client.db("pokeapi").collection("pokemon");
    const { insertedId } = await coll.insertOne(input);
    return { _id: insertedId, ...input };
  }

  // Eliminar Pokémon
  static async delete({ id }) {
    const coll = client.db("pokeapi").collection("pokemon");
    const { deletedCount } = await coll.deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) throw { message: "NOT_FOUND" };
  }

  // Actualizar Pokémons
  static async update({ id, input }) {
    const coll = client.db("pokeapi").collection("pokemon");
    const { matchedCount } = await coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: input }
    );
    if (matchedCount === 0) throw { message: "NOT_FOUND" };
  }

  // Crear muchos Pokémon
  static async createMany({ input }) {
    const coll = client.db("pokeapi").collection("pokemon");
    const { insertedIds } = await coll.insertMany(input);
    return Object.values(insertedIds).map((id, index) => ({
      _id: id,
      ...input[index],
    }));
  }
}
