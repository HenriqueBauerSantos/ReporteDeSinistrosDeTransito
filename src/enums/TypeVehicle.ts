export enum TypeVehicle{
    NaoInformado = 0,
    Auto,
    Taxi,
    Caminhao,
    Onibus,
    Lotacao,
    Moto,
    Bicicleta,
    Carroca,
    Outro 
}

export const TypeVehicleLabel: Record<TypeVehicle, string> = {
    [TypeVehicle.NaoInformado]: "Não informado",
    [TypeVehicle.Auto]: "Automóvel",
    [TypeVehicle.Taxi]: "Taxí",
    [TypeVehicle.Caminhao]: "Caminhão",
    [TypeVehicle.Onibus]: "Ônibus",
    [TypeVehicle.Lotacao]: "Lotação",
    [TypeVehicle.Moto]: "Moto",
    [TypeVehicle.Bicicleta]: "Bicicleta",
    [TypeVehicle.Carroca]: "Carroça",
    [TypeVehicle.Outro]: "Outro"
} 