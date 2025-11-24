export enum SinistroType {
  NaoInformado = 0,
  Capotagem,
  Tombamento,
  Colisao,
  Choque,
  Queda,
  Incendio,
  Engavetamento,
  Outro
}

export const SinistroTypeLabel: Record<SinistroType, string> = {
  [SinistroType.NaoInformado]: "Não informado",
  [SinistroType.Capotagem]: "Capotagem",
  [SinistroType.Tombamento]: "Tombamento",
  [SinistroType.Colisao]: "Colisão",
  [SinistroType.Choque]: "Choque",
  [SinistroType.Queda]: "Queda",
  [SinistroType.Incendio]: "Incêndio",
  [SinistroType.Engavetamento]: "Engavetamento",
  [SinistroType.Outro]: "Outro"
};