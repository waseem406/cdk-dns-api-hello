
exports.handler = async event => {
    return {
        statusCode: 200,
        message: process.env.MESSAGE_STRING || 'Hello World!'
    }
}