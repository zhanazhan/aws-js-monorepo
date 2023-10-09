import {v4 as uuidv4} from 'uuid';

export class IdGenerator {
    static generateUUID(): string {
        return uuidv4();
    }
}