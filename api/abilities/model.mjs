import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export class AbilityModel {
  // Obtener todas las Habilidades
  static async getAll() {
    const coll = client.db("pokeapi").collection("abilities");
    const abilities = await coll.find().toArray();
    return abilities;
  }

  // Obtener Habilidad
  static async getById({ id }) {
    const coll = client.db("pokeapi").collection("abilities");
    const ability = await coll.findOne({ _id: new ObjectId(id) });
    if (!ability) throw { message: "NOT_FOUND" };
    return ability;
  }

  // Crear Habilidad
  static async create({ input }) {
    const coll = client.db("pokeapi").collection("abilities");
    const { insertedId } = await coll.insertOne(input);
    return { _id: insertedId, ...input };
  }

  // ELiminar Habilidad
  static async delete({ id }) {
    const coll = client.db("pokeapi").collection("abilities");
    const { deletedCount } = await coll.deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) throw { message: "NOT_FOUND" };
  }

  // Actualizar Habilidad
  static async update({ id, input }) {
    const coll = client.db("pokeapi").collection("abilities");
    const { matchedCount } = await coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: input }
    );
    if (matchedCount === 0) throw { message: "NOT_FOUND" };
  }

  // Crear muchas Habilidades
  static async createMany({ input }) {
    const coll = client.db("pokeapi").collection("abilities");
    const { insertedIds } = await coll.insertMany(input);
    return Object.values(insertedIds).map((id, index) => ({
      _id: id,
      ...input[index],
    }));
  }
}
