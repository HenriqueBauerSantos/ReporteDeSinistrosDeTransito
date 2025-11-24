export enum Weather {
  NaoInformado = 0,
  Chuva,
  Nublado,
  Bom,
  Neblina
}

export const WeatherLabel: Record<Weather, string> = {
  [Weather.NaoInformado]: "Não informado",
  [Weather.Chuva]: "Chuvoso",
  [Weather.Nublado]: "Nublado",
  [Weather.Bom]: "Clima bom",
  [Weather.Neblina]: "Neblina"
};