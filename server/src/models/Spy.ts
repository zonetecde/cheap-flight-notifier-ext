import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from "@sequelize/core/decorators-legacy";

class Spy extends Model<InferAttributes<Spy>, InferCreationAttributes<Spy>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare telegramId: string;

    @Attribute(DataTypes.STRING)
    declare flight: string | null;
}

export default Spy;
