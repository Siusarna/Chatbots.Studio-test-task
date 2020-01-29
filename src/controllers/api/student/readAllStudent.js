const {readDocFromDb, readOneDocFromDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
require ('../../../models/index');

const Student = mongoose.model ('Student');
const User = mongoose.model ('User');

module.exports = async (req, res) => {
    try {
        const users = await readDocFromDb (User, {role: 'student'});
        const usersWithGroupName = [];
        for (const user of users) {
            const {group} = await readOneDocFromDb (Student, {_user: user._id}, 'group');
            const userWithGroupName = {
                _id: user.id,
                email: user.email,
                name: user.name,
                group: group.name,
                created: user.created
            };
            usersWithGroupName.push (userWithGroupName);
        }

        res.status (200).json (usersWithGroupName);
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};