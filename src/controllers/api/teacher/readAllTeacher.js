const {readDocFromDb, readOneDocFromDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
require ('../../../models/index');

const Teacher = mongoose.model ('Teacher');
const User = mongoose.model ('User');

module.exports = async (req, res) => {
    try {
        const users = await readDocFromDb (User, {role: 'teacher'});
        const teachers = [];
        for (const user of users) {
            console.log (user);
            const {age, subject, experience} = await readOneDocFromDb (Teacher, {_user: user._id});
            const userWithAllData = {
                _id: user.id,
                email: user.email,
                name: user.name,
                age,
                subject,
                experience,
                created: user.created
            };
            teachers.push (userWithAllData);
        }

        res.status (200).json (teachers);
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};