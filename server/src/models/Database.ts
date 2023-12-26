import { Sequelize } from "@sequelize/core";
import Spy from "./Spy";

export const sequelize = new Sequelize("sqlite:./src/database/db.db", {
    models: [Spy],
});
