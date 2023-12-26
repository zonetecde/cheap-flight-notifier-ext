import express from "express";
import { Sequelize } from "@sequelize/core";
import Spy from "./models/Spy";
import { sequelize } from "./models/Database";
import { timeStamp } from "console";

const app = express();

// Relie les models à la base de données
sequelize.sync({ alter: true });

app.get("/", async (req: any, res: any): Promise<any> => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        Spy.sync();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }

    res.send("main");
});

app.get("/addSpy", async (req: any, res: any): Promise<any> => {
    // get query params of telegramIds
    const telegramIds = req.query.telegramIds.split(",");
    const flights = req.query.flights.split(",");

    // remove all spies with the same telegramId
    for (const id of telegramIds) {
        await Spy.destroy({
            where: {
                telegramId: id,
            },
        });
    }

    // add new spies
    for (const id of telegramIds) {
        for (const flight of flights) {
            if (id === "" || flight === "") continue;

            const spy = await Spy.findOne({
                where: {
                    telegramId: id,
                    flight: flight,
                },
            });

            if (spy) continue;

            Spy.create({
                telegramId: id,
                flight: flight,
            });
        }
    }

    res.send("spy");
});

app.get("/getSpies", async (req: any, res: any): Promise<any> => {
    const telegramIds = req.query.telegramIds.split(",");
    let flights: string[] = [];

    if (telegramIds.length === 1 && telegramIds[0] === "") return res.send(flights);

    for (const id of telegramIds) {
        const spies = await Spy.findAll({
            where: {
                telegramId: {
                    [Sequelize.Op.like]: `%${id}%`,
                },
            },
        });

        for (const spy of spies) {
            if (spy.flight === null) continue;
            if (flights.includes(spy.flight)) continue;
            flights.push(spy.flight);
        }
    }

    res.send(flights);
});

app.listen(3000, () => {
    console.log("success, listening on port 3000");
});
