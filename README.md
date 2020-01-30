This api was created for: create, read, update and delete student, teacher, group and lesson.
You must create user with role = 'admin'. Special api for this action I dont create.
So, If you want create admin, you should open MongoDB Atlas.\
In order to "read" or "read/{id}" you must be authorization with any role.
If you want create, update or delete, you must be authorization with role = 'admin'. \
At start send POST request in "/login" with body:
`{
 	"email": "admin@admin.com",
 	"password": "admin"
 }`   
The email and password must match the user that you created. \

API for group: 
1. Read all group: GET method in "/group";
2. Read group by name: GET method in "/group/{name}" (you can get name from "Read all group");
3. Create group: POST method in "/group" with body: `{"name": "TEST"}`;
4. Delete group: DELETE method in "/group" with body: `{"name": "TEST"}`;
5. Update student: PUT method in "/student" with body: `{"name": "TEST", "students" : ["test1@test.com", "test2@test.com"]}`. 
All field is required. "Name" its name of group that you want update. 
"Students" its arrays of student that will be in this group.  

API for student: 
1. Read all student: GET method in "/student";
2. Read student by id: GET method in "/student/{id}" (you can get id from "Read all student");
3. Create student: POST method in "/student" with body: `{"name": "TEST", "email": "TEST@TEST.com", "password": "123456", "groupName": "TEST"}`;
4. Delete student: DELETE method in "/student" with body: `{"email": "TEST@TEST.com"}`;
5. Update student: PUT method in "/student" with body: `{"email": "s11@a.com", "newName": "v232", "newEmail": "s1@a.com", "password": "654321", "newPassword": "123456", "newGroup": "IP-81"}`. Only field "email" is required, other of your choice; 

API for teacher: 
1. Read all teacher: GET method in "/teacher";
2. Read teacher by id: GET method in "/teacher/{id}" (you can get id from "Read all teacher");
3. Create teacher: POST method in "/teacher" with body: `{"name": "TEST", "email": "TEST@TEST.com", "password": "123456", "subject": "TEST", "age":27, experience: 2}`;
4. Delete teacher: DELETE method in "/teacher" with body: `{"email": "TEST@TEST.com"}`;
5. Update teacher: PUT method in "/teacher" with body: `{"email": "s11@a.com", "newName": "v232", "newEmail": "s1@a.com", "password": "654321", "newPassword": "123456", "newName": "TEST", "newSubject": "TEST", "newExperience": 3, "newAge": 28}`. 
Only field "email" is required, other of your choice; 

API for lesson: 
1. Read all lesson: GET method in "/lesson";
2. Read lesson by id: GET method in "/lesson/{id}" (you can get id from "Read all lesson");
3. Create lesson: POST method in "/lesson" with body: `{"subject": "MATH", "teacher": "t1@a.com", "group": "IP-82", "classroom": "123-18", "startTime": "12:15", "endTime": "19:23"}`;
Time must be in format "hh:mm";
4. Delete lesson: DELETE method in "/lesson" with body: `{"id": "TEST"}`. You can get id from "Read all lesson".
5. Update lesson: PUT method in "/lesson" with body: `{"id": "5e32d77472a72d2d1c457616", "newSubject": "NEWWWW", "newTeacher": "NEWTEACHER@TEST.TEST", "newGroup": "NEWTEST", "newClassroom": "NEWCLASSROOM", "newStartTime": "NEW", "newEndTime": "NEW"}`. 
Only field "id" is required, other of your choice; 

[Schema of my database](http://bit.ly/37GkQw2)

