import { jwtDecode } from "jwt-decode";
import type { UserPermissions, DecodedToken } from "./AuthTypes";

export function parseClaims(token: string): UserPermissions {
    const decoded = jwtDecode<DecodedToken>(token);

    const permissions: UserPermissions = {};

    for (const key in decoded) {
        const value = decoded[key];

        if (typeof value === "string" && value.includes(",")) {
            // Ex.: "Sinistros": "AD,VI,ED,EX"
            permissions[key] = value.split(",");
        }
    }

    return permissions;
}
