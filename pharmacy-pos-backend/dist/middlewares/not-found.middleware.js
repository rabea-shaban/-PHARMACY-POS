export function notFoundMiddleware(req, res) {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}
//# sourceMappingURL=not-found.middleware.js.map