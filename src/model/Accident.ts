import type { GroundType } from "../enums/GroundType";
import type { RoadPavementType } from "../enums/RoadPavementType";
import type { RoadType } from "../enums/RoadType";
import type { SinistroType } from "../enums/SinistroType";
import type { Weather } from "../enums/Weather";
import type { AccidentAddress } from "./AccidentAddress";
import { Person } from "./Person";
import type { Vehicle } from "./Vehicle";


export class Accident{
    id: string;
    date: string;
    injuredPeople: boolean;
    sinistroType: SinistroType;
    roadPavementType: RoadPavementType;
    roadType: RoadType;
    groundType: GroundType;
    weather: Weather;
    peopleEnvolved: Person[];
    vehiclesEnvolved: Vehicle[];
    sinistroAddress: AccidentAddress;
    sinistroDescription: string;

    constructor(id: string, date: string, injuredPeople: boolean, sinistroType: SinistroType, roadPavementType: RoadPavementType,
        roadType: RoadType, groundType: GroundType, weather: Weather, peopleEnvolved: Person[],
        vehiclesEnvolved: Vehicle[],sinistroAddress: AccidentAddress, sinistroDescription: string)
    {
        this.id = id;
        this.date = date;
        this.injuredPeople = injuredPeople;
        this.sinistroType = sinistroType;
        this.roadPavementType = roadPavementType;
        this.roadType = roadType;
        this.groundType = groundType;
        this.weather = weather;
        this.peopleEnvolved = peopleEnvolved;
        this.vehiclesEnvolved = vehiclesEnvolved;
        this.sinistroAddress = sinistroAddress;
        this.sinistroDescription = sinistroDescription;
    }
}