import { Address } from "./Address";

export class AccidentAddress extends Address{
    Latitude: number;
    Longitude: number;

    constructor(
        id: string,
        road: string,
        number: string,
        complement: string,
        cep: string,
        district: string,
        city: string,
        state: string,
        latitude: number,
        longitude: number
    ){
        super(id,road,number,complement,cep,district,city,state);

        this.Latitude = latitude;
        this.Longitude = longitude;
    }
}