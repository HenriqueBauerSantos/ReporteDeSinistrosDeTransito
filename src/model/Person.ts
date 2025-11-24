import { Address } from "./Address";

export class Person{
    Id: string;
    Name: string;
    BirdDate: string;
    Gender: boolean;
    CPF: string;
    RG: string;
    CNH: string;
    Phone: string;
    Address: Address;

    constructor(id: string, name: string, birdDate: string, gender: boolean, cpf: string,
        rg: string, cnh: string, phone: string, address : Address
    ){
        this.Id = id
        this.Name = name;
        this.BirdDate = birdDate;
        this.Gender = gender;
        this.CPF = cpf;
        this.RG = rg;
        this.CNH = cnh;
        this.Phone = phone;
        this.Address = address;
    }
}