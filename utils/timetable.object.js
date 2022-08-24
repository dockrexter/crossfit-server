module.exports = (statusCode, status, message, data) => {
    return {
        data: data,
        status: status,
        message: message,
        statusCode: statusCode,
    }
}