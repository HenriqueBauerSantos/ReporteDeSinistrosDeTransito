export enum RoadType{
    NaoInformado = 0,
    Curva,
    Reta
}

export const RoadTypeLabel: Record<RoadType, string> = {
    [RoadType.NaoInformado]: "Não informado",
    [RoadType.Curva]: "Curva",
    [RoadType.Reta]: "Reta",
}