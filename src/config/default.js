module.exports = {
    port: 3000,
    mongoUri: 'mongodb+srv://Siusarna:Ak4xZ8tVR3WSlsrA@cluster0-foury.gcp.mongodb.net/test?retryWrites=true&w=majority',
    jwt: {
        secret: 'Siusarna',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '20m'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '30m'
            }
        }
    },
    minimumTeacherAge: 25
};