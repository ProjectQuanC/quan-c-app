class CustomError extends Error {
    status: number = 500;
    constructor(message: string) {
        super(message);
    }
}

export default CustomError;