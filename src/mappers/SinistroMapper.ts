import { Accident } from "../model/Accident";
import { Person } from "../model/Person";
import { Vehicle } from "../model/Vehicle";
import { AccidentAddress } from "../model/AccidentAddress";
import { Address } from "../model/Address";
import type { TypeVehicle } from "../enums/TypeVehicle";

// Tipos da API
interface ApiAddress {
    id: string;
    road: string;
    number: string;
    complement?: string;
    cep: string;
    district: string;
    city: string;
    state: string;
}

interface ApiAccidentAddress extends ApiAddress {
    latitude: number;
    longitude: number;
}

interface ApiPerson {
    id: string;
    name: string;
    birthDate: string;
    gender: boolean;
    cpf: string;
    rg: string;
    cnh: string;
    phone: string;
    address: ApiAddress | null;
}

interface ApiVehicle {
    id: string;
    carLisencePlate: string;
    brand: string;
    model: string;
    manufacturingYear: string;
    color: string;
    typeVehicle: TypeVehicle;
}

export interface ApiAccident {
    id: string;
    date: string;
    injuredPeople: boolean;
    sinistroType: number;
    roadPavementType: number;
    roadType: number;
    groundType: number;
    weather: number;
    sinistroDescription: string;
    sinistroAddress: ApiAccidentAddress | null;
    peopleEnvolved: ApiPerson[];
    vehiclesEnvolved: ApiVehicle[];
}

// Mapper principal
export function MapSinistroApiToModel(data: ApiAccident): Accident {
    const address =
        data.sinistroAddress &&
        new AccidentAddress(
            data.sinistroAddress.id,
            data.sinistroAddress.road,
            data.sinistroAddress.number,
            data.sinistroAddress.complement ?? "",
            data.sinistroAddress.cep,
            data.sinistroAddress.district,
            data.sinistroAddress.city,
            data.sinistroAddress.state,
            data.sinistroAddress.latitude,
            data.sinistroAddress.longitude
        );

    const people = data.peopleEnvolved.map((p) => {
        const addr = p.address
            ? new Address(
                p.address.id,
                p.address.road,
                p.address.number,
                p.address.complement ?? "",
                p.address.cep,
                p.address.district,
                p.address.city,
                p.address.state
            )
            : new Address("", "", "", "", "", "", "", ""); // vazio, caso não venha nada

        return new Person(
            p.id,
            p.name,
            p.birthDate,
            p.gender,
            p.cpf,
            p.rg,
            p.cnh,
            p.phone,
            addr
        );
    });

    const vehicles = data.vehiclesEnvolved.map(
        (v) =>
            new Vehicle(
                v.id,
                v.carLisencePlate,
                v.brand,
                v.model,
                new Date(v.manufacturingYear),
                v.color,
                v.typeVehicle
            )
    );

    return new Accident(
        data.id,
        data.date,
        data.injuredPeople,
        data.sinistroType,
        data.roadPavementType,
        data.roadType,
        data.groundType,
        data.weather,
        people,
        vehicles,
        address!,
        data.sinistroDescription
    );
}
