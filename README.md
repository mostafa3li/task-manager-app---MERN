# task-manager-app
- `git clone https://github.com/mostafa3li/task-manager-app.git`
- `cd task-manager-app/ && npm install`
- `tocuh .env`
**==> add the following environment variables:**
    - PORT=5000 (ex.)
    - MONGODB_URL=mongodb://localhost:27017/task-manager-api
    - JWT_SECRET=secret (ex.)
- `cd client/ && npm install`
- `tocuh .env`
**==> add the following environment variables:**
    - REACT_APP_BASE_URL=http://localhost:5000 (the same port as above)
- `cd .. && npm run dev`

![](screenshots/1.png)
![](screenshots/2.png)
![](screenshots/3.png)
![](screenshots/4.png)
