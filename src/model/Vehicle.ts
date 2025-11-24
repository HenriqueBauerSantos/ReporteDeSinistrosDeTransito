import type { TypeVehicle } from "../enums/TypeVehicle";

export class Vehicle{
    id: string;
    CarLisencePlate: string;
    Brand: string;
    Model: string;
    ManufacturingYear: Date;
    Color: string;
    TypeVehicle: TypeVehicle;

    constructor(id: string,carLisencePlate: string, brand: string, model: string, manufacturingYear: Date,
        color: string, typeVehicle: TypeVehicle
    ) {
        this.id = id;
        this.CarLisencePlate = carLisencePlate;
        this.Brand = brand;
        this.Model = model;
        this.ManufacturingYear = manufacturingYear;
        this.Color = color;
        this.TypeVehicle = typeVehicle        
    }
}