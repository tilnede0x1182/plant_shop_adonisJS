import { DateTime } from "luxon";
import { BaseModel, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import OrderItem from "./OrderItem";

export default class Plant extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public price: number;

  @column()
  public description: string;

  @column()
  public stock: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => OrderItem)
  public orderItems: HasMany<typeof OrderItem>;

  /**
   * Retourne une requête triée insensible à la casse
   * Compatible avec SQLite et PostgreSQL
   */
  public static querySortedByName() {
    const dbClient = process.env.DB_CONNECTION;

    if (dbClient === "sqlite") {
      return this.query().orderByRaw("LOWER(name) COLLATE NOCASE");
    } else if (dbClient === "pg") { // Base de données postgre
      return this.query().orderByRaw("LOWER(name) ASC");
    } else {
      return this.query().orderBy("name", "asc");
    }
  }
}
