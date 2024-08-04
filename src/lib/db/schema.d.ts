import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type flight = {
    id: Generated<number>;
    from: string;
    departure: number;
    to: string;
    arrival: number;
    flightNumber: string | null;
    seat: string | null;
    seatNumber: string | null;
    /**
     * @kyselyType('economy' | 'economy+' | 'business' | 'first' | 'private')
     */
    seatClass: 'economy' | 'economy+' | 'business' | 'first' | 'private' | null;
    /**
     * @kyselyType('leisure' | 'business' | 'crew' | 'other')
     */
    flightReason: 'leisure' | 'business' | 'crew' | 'other' | null;
    airline: string | null;
    aircraft: string | null;
    aircraftReg: string | null;
    note: string | null;
    userId: string;
};
export type session = {
    id: string;
    expiresAt: number;
    userId: string;
};
export type user = {
    id: string;
    username: string;
    password: string;
    displayName: string;
    /**
     * @kyselyType('user' | 'admin')
     */
    role: 'user' | 'admin';
};
export type DB = {
    flight: flight;
    session: session;
    user: user;
};
