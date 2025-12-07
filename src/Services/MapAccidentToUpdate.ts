import { Accident } from "../model/Accident";
import { v4 as uuidv4 } from "uuid";

export function MapAccidentToUpdate(accident: Accident) {
    const sinistroId = accident.id;

    return {
        id: sinistroId,
        date: new Date(accident.date).toISOString(),
        injuredPeople: accident.injuredPeople,
        sinistroType: accident.sinistroType,
        roadPavementType: accident.roadPavementType,
        roadType: accident.roadType,
        groundType: accident.groundType,
        weather: accident.weather,

        peopleEnvolved: accident.peopleEnvolved.map(p => {
            const personId = p.Id || uuidv4();

            return {
                id: personId,
                name: p.Name,
                birthDate: new Date(p.BirdDate).toISOString(),
                gender: p.Gender,
                cpf: p.CPF,
                rg: p.RG,
                cnh: p.CNH,
                phone: p.Phone,

                address: {
                    id: p.Address.Id || uuidv4(),
                    road: p.Address.Road,
                    number: p.Address.Number,
                    complement: p.Address.Complement,
                    cep: p.Address.Cep,
                    district: p.Address.District,
                    city: p.Address.City,
                    state: p.Address.State,
                    personId: personId
                },

                sinistroId: sinistroId 
            };
        }),

        vehiclesEnvolved: accident.vehiclesEnvolved.map(v => {
            const vehicleId = v.id || uuidv4();

            return {
                id: vehicleId,
                carLisencePlate: v.CarLisencePlate,
                brand: v.Brand,
                model: v.Model,
                manufacturingYear: new Date(v.ManufacturingYear).toISOString(),
                color: v.Color,
                typeVehicle: v.TypeVehicle,
                sinistroId: sinistroId 
            };
        }),

        sinistroAddress: {
            id: accident.sinistroAddress.Id || uuidv4(),
            road: accident.sinistroAddress.Road,
            number: accident.sinistroAddress.Number,
            complement: accident.sinistroAddress.Complement,
            cep: accident.sinistroAddress.Cep,
            district: accident.sinistroAddress.District,
            city: accident.sinistroAddress.City,
            state: accident.sinistroAddress.State,
            latitude: accident.sinistroAddress.Latitude,
            longitude: accident.sinistroAddress.Longitude,
            sinistroId: sinistroId
        },

        sinistroDescription: accident.sinistroDescription
    };
}
