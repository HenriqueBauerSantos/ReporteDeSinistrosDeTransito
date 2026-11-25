import type { SinistroMapa } from "../../../Services/SinistroMapaService";

const EARTH_RADIUS_METERS = 6_378_137;
const MAX_MERCATOR_LATITUDE = 85.05112878;
const MIN_HEX_RADIUS_METERS = 100;
const HEX_RADIUS_PIXELS = 24;

export type HexagonalCell = {
    key: string;
    count: number;
    positions: [number, number][];
};

function project(latitude: number, longitude: number): [number, number] {
    const lat = Math.max(-MAX_MERCATOR_LATITUDE, Math.min(MAX_MERCATOR_LATITUDE, latitude));
    const latRadians = (lat * Math.PI) / 180;
    const x = (EARTH_RADIUS_METERS * longitude * Math.PI) / 180;
    const y = EARTH_RADIUS_METERS * Math.log(Math.tan(Math.PI / 4 + latRadians / 2));
    return [x, y];
}

function unproject(x: number, y: number): [number, number] {
    const longitude = (x / EARTH_RADIUS_METERS) * (180 / Math.PI);
    const latitude = (2 * Math.atan(Math.exp(y / EARTH_RADIUS_METERS)) - Math.PI / 2) * (180 / Math.PI);
    return [latitude, longitude];
}

function roundAxialCoordinates(q: number, r: number): [number, number] {
    let roundedQ = Math.round(q);
    let roundedR = Math.round(r);
    const roundedS = Math.round(-q - r);
    const qDifference = Math.abs(roundedQ - q);
    const rDifference = Math.abs(roundedR - r);
    const sDifference = Math.abs(roundedS + q + r);

    if (qDifference > rDifference && qDifference > sDifference) {
        roundedQ = -roundedR - roundedS;
    } else if (rDifference > sDifference) {
        roundedR = -roundedQ - roundedS;
    }

    return [roundedQ, roundedR];
}

export function groupSinistrosIntoHexagons(
    sinistros: SinistroMapa[],
    zoom: number,
): HexagonalCell[] {
    if (sinistros.length === 0) return [];

    const metersPerPixel = (2 * Math.PI * EARTH_RADIUS_METERS) / (256 * 2 ** zoom);
    const hexRadius = Math.max(MIN_HEX_RADIUS_METERS, metersPerPixel * HEX_RADIUS_PIXELS);
    const cellCounts = new Map<string, { q: number; r: number; count: number }>();

    for (const sinistro of sinistros) {
        const [x, y] = project(sinistro.latitude, sinistro.longitude);
        const q = ((Math.sqrt(3) / 3) * x - y / 3) / hexRadius;
        const r = ((2 / 3) * y) / hexRadius;
        const [roundedQ, roundedR] = roundAxialCoordinates(q, r);
        const key = `${roundedQ}:${roundedR}`;
        const cell = cellCounts.get(key);

        if (cell) {
            cell.count += 1;
        } else {
            cellCounts.set(key, { q: roundedQ, r: roundedR, count: 1 });
        }
    }

    return Array.from(cellCounts, ([key, cell]) => {
        const centerX = hexRadius * Math.sqrt(3) * (cell.q + cell.r / 2);
        const centerY = hexRadius * 1.5 * cell.r;
        const positions = Array.from({ length: 6 }, (_, index) => {
            const angle = (Math.PI / 6) + (index * Math.PI) / 3;
            return unproject(
                centerX + hexRadius * Math.cos(angle),
                centerY + hexRadius * Math.sin(angle),
            );
        });

        return { key, count: cell.count, positions };
    });
}
