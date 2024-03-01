
# 10K Plus savings challenge

10K Plus savings challenge is a simple money-saving challenge. This project was developed for a freelancing client.

I have used the MERN stack with tailwind and framer-motion for styling.


## Tech Stack

**Client:** React, Recoil, TailwindCSS, framer-motion, chart.js,
typescript, stripe

**Server:** Node, Express, mongoose, nodemailer, stripe, JWT 



## Run Locally

Clone the project

```bash
  git clone https://github.com/tarunmeena6846/10K_Plus_Savings_challenge.git
```

Go to the backend directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  tsc && node dist/index.js
```

Go to the frontend directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the client

```bash
  tsc && npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

    VITE_SERVER_URL= URL of your backend
    VITE_STRIPE_KEY= stripe public Key
    VITE_CLIENT_URL= URL of your frontend

    JWT_SCERET= any random string
    MONGODB_URL= mongodb connection string
    STRIPE_SECRET_KEY= stripe secret key
    RETURN_CLIENT_URL= frontend url
    NODEMAILER_ADMIN_EMAIL: This should be set to the email address of your Gmail account.
    NODEMAILER_ADMIN_PASS: This should be set to the password of your Gmail account.



