import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export class MoveModel {
  // Obtener todos los Movimientos
  static async getAll() {
    const coll = client.db("pokeapi").collection("moves");
    const moves = await coll.find().toArray();
    return moves;
  }

  // Obtener Movimiento
  static async getById({ id }) {
    const coll = client.db("pokeapi").collection("moves");
    const move = await coll.findOne({ _id: new ObjectId(id) });
    if (!move) throw { message: "NOT_FOUND" };
    return move;
  }

  // Crear Movimiento
  static async create({ input }) {
    const coll = client.db("pokeapi").collection("moves");
    const { insertedId } = await coll.insertOne(input);
    return { _id: insertedId, ...input };
  }

  // Eliminar Movimiento
  static async delete({ id }) {
    const coll = client.db("pokeapi").collection("moves");
    const { deletedCount } = await coll.deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) throw { message: "NOT_FOUND" };
  }

  // Actualizar Movimiento
  static async update({ id, input }) {
    const coll = client.db("pokeapi").collection("moves");
    const { matchedCount } = await coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: input }
    );
    if (matchedCount === 0) throw { message: "NOT_FOUND" };
  }

  // Crear muchos Movimientos
  static async createMany({ input }) {
    const coll = client.db("pokeapi").collection("moves");
    const { insertedIds } = await coll.insertMany(input);
    return Object.values(insertedIds).map((id, index) => ({
      _id: id,
      ...input[index],
    }));
  }
}
