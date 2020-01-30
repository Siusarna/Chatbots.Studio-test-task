module.exports = {
  port: 3000,
  mongoUri: 'mongodb+srv://Siusarna:Ak4xZ8tVR3WSlsrA@cluster0-foury.gcp.mongodb.net/test?retryWrites=true&w=majority',
  jwt: {
    secret: 'Siusarna',
    tokens: {
      access: {
        type: 'access',
        expiresIn: '30m',
      },
      refresh: {
        type: 'refresh',
        expiresIn: '40m',
      },
    },
  },
  minimumTeacherAge: 25,
};
