export function sendSuccess(res, message, data, statusCode = 200) {
    const response = {
        success: true,
        message,
        ...(data !== undefined && { data }),
    };
    res.status(statusCode).json(response);
}
export function sendError(res, message, errors, statusCode = 400) {
    const response = {
        success: false,
        message,
        ...(errors !== undefined && { errors }),
    };
    res.status(statusCode).json(response);
}
//# sourceMappingURL=response.util.js.map