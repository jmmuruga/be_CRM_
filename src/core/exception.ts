export class ValidationException extends Error {
    constructor(
        public readonly details: string,
    ) {
        super(details);
    }
}

export class UnauthenticatedException extends Error {
    constructor(message: string) {
        super(message);
    }
}