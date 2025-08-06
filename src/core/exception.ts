export class ValidationException extends Error {
    constructor(
        public readonly details: string,
    ) {
        super(details);
    }
}