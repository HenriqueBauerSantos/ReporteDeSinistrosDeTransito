export enum GroundType {
    NaoInformado = 0,
    AcliveDeclive,
    Plano,
}

export const GroundTypeLabel: Record<GroundType, string> = {
    [GroundType.NaoInformado]: "Não informado",
    [GroundType.AcliveDeclive]: "Aclive/Declive",
    [GroundType.Plano]: "Plano"
};