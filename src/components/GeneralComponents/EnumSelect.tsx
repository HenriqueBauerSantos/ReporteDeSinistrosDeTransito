import type { FieldErrors, FieldValues, UseFormRegister, Path } from "react-hook-form";

type EnumSelectProps<FormType extends FieldValues, TEnum extends Record<number, string>> = {
    label: string;
    enumObj: TEnum;
    enumLabels: Record<number, string>;
    fieldName: Path<FormType>;
    register: UseFormRegister<FormType>;
    errors: FieldErrors<FormType>;
};

export function EnumSelect<FormType extends FieldValues, TEnum extends Record<number, string>>({
    label,
    enumObj,
    enumLabels,
    fieldName,
    register,
    errors,
}: EnumSelectProps<FormType, TEnum>) {
    // Pega apenas os valores numéricos do enum
    const enumValues = Object.values(enumObj).filter((v) => typeof v === "number") as number[];

    return (
        <div className="form-group">
            <label>{label}:</label>
            <select
                {...register(fieldName, {
                    valueAsNumber: true,
                    validate: (v) => v !== 0 || `Selecione um valor para ${label.toLowerCase()}`,
                })}
                defaultValue={0}
            >
                {enumValues.map((val) => (
                    <option key={val} value={val}>
                        {enumLabels[val]}
                    </option>
                ))}
            </select>

            {errors[fieldName]?.message && (
                <span style={{ color: "red" }}>{String(errors[fieldName]?.message)}</span>
            )}
        </div>
    );
}
