export class Address{
    Id: string;
    Road: string;
    Number: string;
    Complement: string;
    Cep: string;
    District: string;
    City: string;
    State: string;

    constructor(id: string,road: string, number: string, complement: string, cep: string,
        district: string, city: string, state: string
    ){
        this.Id = id;
        this.Road = road;
        this.Number = number;
        this.Complement = complement;
        this.Cep = cep;
        this.District = district;
        this.City = city;
        this.State = state;
    }
}