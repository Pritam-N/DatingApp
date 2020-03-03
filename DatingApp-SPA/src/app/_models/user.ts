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

export interface AgeFilter{
    id: number;
    minAge: number;
    maxAge: number;
    displayName: string;
}

export const ageFilterList: AgeFilter[] = [
    { id: 0, minAge: 14, maxAge: 20, displayName: 'Below 20 years' },
    { id: 1, minAge: 21, maxAge: 30, displayName: '21 - 30 years'},
    { id: 2, minAge: 31, maxAge: 40, displayName: '31 - 40 years'},
    { id: 3, minAge: 41, maxAge: 50, displayName: '41 - 50 years'},
    { id: 4, minAge: 51, maxAge: 100, displayName: 'Above 50 years'}
  ]