import { useEffect, useState } from "react";
import axios from "axios";
import { getApiErrorMessage } from "../Services/Api";
import {
    buscarSinistrosNoMapa,
    type MapaBounds,
    type SinistroMapa,
    type SinistroMapaFilters,
} from "../Services/SinistroMapaService";

export function useMapaSinistros(filters: SinistroMapaFilters) {
    const [bounds, setBounds] = useState<MapaBounds | null>(null);
    const [sinistros, setSinistros] = useState<SinistroMapa[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bounds) return;

        const controller = new AbortController();
        let isCurrentRequest = true;

        setSinistros([]);
        setError(null);
        setLoading(true);
        setHasLoaded(false);

        buscarSinistrosNoMapa(bounds, filters, controller.signal)
            .then((results) => {
                if (isCurrentRequest) setSinistros(results);
            })
            .catch((requestError: unknown) => {
                if (isCurrentRequest && !axios.isCancel(requestError)) {
                    setError(getApiErrorMessage(
                        requestError,
                        "Não foi possível carregar os sinistros desta área. Tente novamente."
                    ));
                }
            })
            .finally(() => {
                if (isCurrentRequest) {
                    setLoading(false);
                    setHasLoaded(true);
                }
            });

        return () => {
            isCurrentRequest = false;
            controller.abort();
        };
    }, [bounds, filters]);

    return { sinistros, loading, hasLoaded, error, setBounds };
}
