import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const MoviesActors = sequelize.define(
  "MoviesActors",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ARRAY(DataTypes.ENUM("DIR", "CAST", "PROD")),
      allowNull: false,
    },
  },
  { timestamps: false }
);
