# Sahar Backend API

Backend API for Sahar Nail Care application.

## Environment Variables

The following environment variables are required for the application to run:

- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for signing JSON Web Tokens
- `SENDGRID_API_KEY`: SendGrid API key for sending emails
- `SENDGRID_FROM_EMAIL`: Default sender email address for SendGrid

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the required variables
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## Development

Run the server in development mode with hot reload:

```bash
npm run dev
```

## API Endpoints

### Reservations
- `GET /api/reservations`: Get all reservations
- `POST /api/reservations`: Create a new reservation
- `PUT /api/reservations/:id`: Update a reservation
- `DELETE /api/reservations/:id`: Delete a reservation

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user
- `GET /api/auth/verify`: Verify email
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password`: Reset password 