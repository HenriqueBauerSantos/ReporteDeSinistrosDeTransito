export enum RoadPavementType {
  NaoInformado = 0,
  Asfalto,
  Concreto,
  Paralelepipedo,
  NaoPavimentada
}

export const RoadPavementTypeLabel: Record<RoadPavementType, string> = {
  [RoadPavementType.NaoInformado]: "Não informado",
  [RoadPavementType.Asfalto]: "Asfalto",
  [RoadPavementType.Concreto]: "Concreto",
  [RoadPavementType.Paralelepipedo]: "Paralelepípedo",
  [RoadPavementType.NaoPavimentada]: "Não Pavimentada"
};