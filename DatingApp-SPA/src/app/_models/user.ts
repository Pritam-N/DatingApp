import { Photo } from './photo';

export interface User {
    id: number;
    username: string;
    commonName: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: Date;
    city: string;
    state: string;
    country: string;
    photoUrl: string;
    introduction?: string;
    lookingFor?: string;
    interests?: string;
    photos?: Photo[];
}
