module.exports = {
    templateResponse: (rc, message, error) => {
        return {
            rc,
            sucess: false,
            message,
            error
        }
    }
}