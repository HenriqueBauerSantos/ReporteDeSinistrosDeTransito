import { useAuth } from "./useAuth";
import type { ReactNode } from "react";

interface Props {
    claim: string;
    action: string;
    children: ReactNode;
}

export function RequirePermission({ claim, action, children }: Props) {
    const { permissions } = useAuth();

    if (!permissions) return null;

    const claimPermissions = permissions[claim];
    if (!claimPermissions) return null;
    if (!claimPermissions.includes(action)) return null;

    return <>{children}</>;
}
