# System Design

## Architecture: Monolith vs. Microservices

For this MVP, a Monolithic architecture was chosen. This approach is significantly faster to develop, deploy, and test, which is ideal for a time-constrained project with a well-defined scope. It keeps the entire backend logic in a single, cohesive codebase. For a future production system, this monolith is designed to be easily broken down into microservices (e.g., a separate service for user authentication, data processing, etc.) as the application scales.

## Database Design

MongoDB was selected as the database. Its flexible, document-based nature is perfect for handling varied research data.

### Collections:

- users: Stores user information, roles (researcher, admin), and status (pending, approved). Passwords are securely hashed using bcryptjs.

- datasets: Stores all metadata associated with a file upload, a reference to the uploaderId, and the file's location.

- Indexing for Search: To enable fast and efficient searching, a text index was created on the datasets collection. This index covers the title, author, tags, and the bonus fileContent fields, allowing MongoDB's native search engine to perform powerful queries across both metadata and file content.

## API Endpoints

```
A RESTful API was designed with the following key routes:
| Method | Endpoint                 | Description                             | Auth Required | Admin Only |
| :----- | :----------------------------- | :-------------------------------- | :------------ | :--------- |
| POST | /api/auth/register         | Register a new researcher               | No            | No         |
| POST | /api/auth/login            | Log in a user                           | No            | No         |
| POST | /api/datasets/upload       | Upload a file and its metadata          | Yes           | No         |
| GET | /api/datasets               | Get all datasets for the logged-in user | Yes           | No         |
| GET | /api/datasets/search?q=...  | Search within the user's datasets       | Yes           | No         |
| DELETE | /api/datasets/:id        | Delete a specific dataset               | Yes           | No         |
| GET | /api/admin/users            | Get all users for moderation            | Yes           | Yes        |
| PUT | /api/admin/users/:id/status | Approve/reject a pending user           | Yes           | Yes        |
| GET | /api/admin/datasets         | Get all datasets on the platform        | Yes           | Yes        |
```

## Authentication Strategy

JSON Web Tokens (JWT) were implemented for authentication. This is a stateless and modern approach ideal for single-page applications. After a user logs in, the server issues a signed token which the client then includes in the Authorization header for all subsequent protected requests. Middleware on the backend verifies this token to protect routes.

## Scaling for 10x Growth

To handle a 10x growth in users and data, the following strategies would be implemented:

- Stateless Backend: The backend is already stateless (thanks to JWT), so we can use a load balancer to distribute traffic across multiple instances of the application (horizontal scaling).

- Database Scaling: Use a managed service like MongoDB Atlas, which allows for easy scaling of the database cluster. Read replicas can be introduced to handle high read loads, separating them from the primary write database.

- Dedicated File Storage: Move from local file storage to a cloud object storage service like AWS S3. This decouples file storage from the application servers, making it infinitely scalable and more reliable.

---

# Petrii MVP - Research Data Management Platform

This repository contains the full-stack implementation for the Petrii MVP assignment. The goal of this project is to design and build a simplified version of a Research Data Management Platform where researchers can upload, tag, and search their experiment data, and admins can manage the platform's users.

---

## For Test purpose only:

### Login Info for Admin:

```
 email id: admin@test.com
 password: admin
```

### For Researcher:

```
- Register an account
- Go to admin tab using the above credentials, and approve your id ( make sure to keep any one admin or researcher on other browser or in incognito page [dev])
- Now add datasets with metadata and you are good to go.
```

---

## Features Implemented

The MVP successfully implements all the core requirements outlined in the problem statement.

### Researcher Features

```
[x] Secure Registration & Login: Researchers can create an account and log in using JWT-based authentication.

[x] Account Moderation: New researcher accounts are in a pending state until approved by an admin.

[x] File Upload: Researchers can upload their experiment data files (e.g., .txt, .csv, .pdf).

[x] Metadata Tagging: On upload, researchers can tag their data with a title, author, experiment type, and comma-separated tags.

[x] View Datasets: Researchers have a personal dashboard to view all the datasets they have uploaded.

[x] Search Metadata: Researchers can search through the metadata of their own datasets.

[x] (Bonus) Search Inside Files: The search functionality also indexes and searches the text content inside uploaded .txt(only tested .txt ones for now).

[x] Delete Datasets: Researchers can delete their own datasets.
```

### Admin Features

```
[x] Admin Dashboard: Admins have a dedicated dashboard.

[x] User Management: Admins can view all registered users and their statuses.

[x] Approve/Reject Users: Admins have the ability to approve or reject pending researcher accounts.

[x] View All Datasets: Admins can see a list of every dataset uploaded to the platform by all researchers.
```

### Tech Stack

```
This project is a modern MERN-stack application built with TypeScript.

Frontend: React with TypeScript & Tailwind CSS

Backend: Node.js with Express.js & TypeScript

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT)

File Handling: Multer for local file storage and pdf-parse for PDF content indexing.
```

---

## Backend Setup

### Navigate to the backend folder

```
cd backend-ts
```

### Install dependencies

```
npm install
```

### Create a .env file in the root of the server folder

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/petrii-mvp
JWT_SECRET=mysecretkey
PORT = 5000
```

### Start the server

```
npm run dev

```

---

# Problem-Solving Reflection (Part 3)

## Biggest Challenge

The most significant architectural challenge was ensuring the application remains responsive and scalable during large file uploads. The current synchronous approach, where the API receives the file, reads its content for indexing, and saves it to the database in a single request, creates a bottleneck. A large file upload could block the Node.js event loop, making the entire application unresponsive for all other users. This is a critical problem for a production system.

## Trade-offs Made

The primary trade-off was choosing local file storage over a cloud-based service like AWS S3. While a cloud service is the production-standard, it introduced external dependencies and configuration complexities that posed a risk to meeting the tight deadline. I prioritized building a stable, fully functional, and testable end-to-end application within the time constraints. The system is designed so that swapping the local storage module with a cloud storage module would be a straightforward future enhancement.

## What I'd Do Differently for Production

For a real production system, I would make three key changes:

- Implement Cloud Storage: Immediately replace local file storage with a service like AWS S3 for scalability, durability, and security.

- Asynchronous Content Indexing: Move the file content reading and parsing (especially for large files) to a background worker process using a message queue like RabbitMQ or AWS SQS. This would prevent the upload API from hanging while processing a large file and improve user experience.

- Containerization: Fully containerize the frontend and backend applications using Docker for consistent development and deployment environments.
