
# Welcome to Online Testing Software

This documentation serves as a comprehensive guide for developers and end-users, providing instructions for the application's setup, usage, and maintenance.
    

    OTS tip: For the best experience use a Desktop

# Overview

The Online Testing Tool is designed to facilitate Computer Adaptive Tests (CAT), offering a personalized testing experience. The application uses the MERN stack (MongoDB, Express, React with Vite, and Node.js) and supports user authentication, a customised dashboard, and adaptive quiz functionalities.

With the Online Testing Tool, users can authenticate using email, password, or Google OAuth, and access a personalized dashboard where they can start adaptive quizzes tailored to their performance. The quizzes adjust in difficulty based on real-time responses, providing a customized testing experience that maximizes learning potential.

Upon completion, the tool instantly generates detailed performance reports and improvement suggestions, leveraging advanced analytics to support continuous learning and development. The platform's architecture ensures scalability and security, making it ideal for educational institutions and independent learners alike.
-From the Online Testing Tool Docs

# Understanding Project And Asumptions

# How Projects work
This project utilizes the Computer Adaptive Testing (CAT) algorithm, handy for conducting neutral interviews and assessments while considering the user’s knowledge level. Here’s a detailed breakdown of how the system functions. This software utilises a vast tech stack of Javascript including Redis and MongoDB.

# The Basics

Our software's heart lies in a comprehensive question bank, meticulously crafted to cover various topics and difficulty levels. Employing an innovative mechanism, the software ensures that each question is unique to the user. Through meticulous analysis of user responses, the software calculates scores based on question difficulty. These scores are then utilized by pre-coded algorithms to provide valuable insights into the results.


# For Developers

# How to code on local development

Clone both front-end and backend code

# Setting up Frontend

Setting up the front end is very simple you need to clone the project 

```
    git clone https://github.com/tusharajmer-op/ots-frontend.git
    npm i
```


now create a file at root named .env

```
VITE_BASE_URL= <Backend url> #http://localhost:3000

VITE_GOOGLE_CLIENT_ID=<google auth client id>
```
now to start the server run 

```
npm run dev// Some code
 ```


# setting up backend 

Backend requires you to have two services running MongoDB and Redis you can get them running by installing them or using docker

next clone the app

```
git clone https://github.com/tusharajmer-op/OTS-Backend.git
npm i 
```


Now create a .env file at the root of the app 

```
# This is a comment explaining the purpose of this property
PORT=3000

# This is a comment explaining the MongoDB connection URI
MONGO_URI='mongodb://localhost:27017/quiz-app'

# This is a comment explaining the number of salt rounds for password hashing
SALT_ROUNDS=10

# This is a comment explaining the JWT secret for authentication
JWT_SECRET="This is my secret for this typescript project"

# This is a comment explaining the JWT expiry time
JWT_EXPIRY="1h"

# This is a comment explaining the Redis URL for caching
REDIS_URL='redis://localhost:6379'

# This is a comment explaining the Google client ID for authentication
GOOGLE_CLIENT_ID=''

# This is a comment explaining the Google client secret for authentication
GOOGLE_CLIENT_SECRET=''

# This is a comment explaining the allowed origins for CORS
ALLOWED_ORIGINS=http://localhost:5173

# This is a comment explaining the maximum number of questions
MAX_QUESTIONS=20
```

Please refer to Google OAuth documentation to get to know how to get Client_secret and Client_id

Before starting the server you need to seed the database first for creating question bank and admin account 
```
npm run seed
```
start the application by 
```
npm run dev 
```
Backend also has jest as a testing framework which could be triggered by 
```
npm run test
```
# Using Docker

create a folder and add a compose.yml file to it 

```
mkdir ots
cd ots
touch compose.yml
vim compose.yml
```
Now add the following to the file 
```
version: '3.8'

services:
  app:
    image: tmajmer04/ots:latest
    ports:
      - "5418:5418"
    env_file:
      - .env
    depends_on:
      - mongo
      - redis
  frontend:
    image: tmajmer04/ots-frontend:latest
    ports :
      - "6489:6489"
    env_file:
      - frontend.env
    depends_on:
      - app
  mongo:
    container_name: mongo-container
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  redis:
    container_name: redis-container
    image: redis:latest
    ports:
      - "6379:6379"

volumes:
  mongo-data:
```
Now create two more files in the same folder and add the following to it
```
touch .env
vim .env

# This is a comment explaining the purpose of this property
PORT=3000

# This is a comment explaining the MongoDB connection URI
MONGO_URI='mongodb://localhost:27017/quiz-app'

# This is a comment explaining the number of salt rounds for password hashing
SALT_ROUNDS=10

# This is a comment explaining the JWT secret for authentication
JWT_SECRET="This is my secret for this typescript project"

# This is a comment explaining the JWT expiry time
JWT_EXPIRY="1h"

# This is a comment explaining the Redis URL for caching
REDIS_URL='redis://localhost:6379'

# This is a comment explaining the Google client ID for authentication
GOOGLE_CLIENT_ID=''

# This is a comment explaining the Google client secret for authentication
GOOGLE_CLIENT_SECRET=''

# This is a comment explaining the allowed origins for CORS
ALLOWED_ORIGINS=http://localhost:5173

# This is a comment explaining the maximum number of questions
MAX_QUESTIONS=20




touch frontend.env

vim frontend.env


VITE_BASE_URL= <Backend url> #http://localhost:3000

VITE_GOOGLE_CLIENT_ID=<google auth client id>
```
Now run the following command to start the dockers 

```
docker-compose up -d
```


# Tech stack note
​
## Front end
* React
* Shadcn 
* react-hook-forms
* Zod
* tailwind
* Vite
## Backend
* Express
* Typescript
* Nodejs
* Mongodb
* redis
* joi
* mongoose
* jwt
* bcrypt
* google-api
* winston
* log-rotate
* docker