# task-manager-app
- `git clone https://github.com/mostafa3li/task-manager-app.git`
- `cd task-manager-app/ && npm install`
- `touch .env`
**==> add the following environment variables:**
    - PORT=5000 (ex.)
    - MONGODB_URL=mongodb://localhost:27017/task-manager-api
    - JWT_SECRET=secret (ex.)
- `cd client/ && npm install`
- `touch .env`
**==> add the following environment variables:**
    - REACT_APP_BASE_URL=http://localhost:5000 (the same port as above)
- `cd .. && npm run dev`

## Sign in
![](screenshots/1.png)

## add & edit & delete & view a Task
![](screenshots/2.png)
## search for a Task
![](screenshots/3.png)
## view profile & update info & update image
![](screenshots/4.png)
