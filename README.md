Accommodation API Project
This project is a microservices-based application for managing accommodations, bookings, and payments using Node.js, Express.js, MongoDB, and RabbitMQ. 
It provides RESTful APIs for Hosts, Guests, and Admins, with features like user authentication, listing management, booking creation, payment processing, and refunds.

FEATURES
Authentication: User registration and login with role-based access control (Host, Guest, Admin) using JWT-based authentication.
Host Services: Hosts can add listings, delete listings, and view their own listings.
Guest Services: Guests can search for available listings, book accommodations with payment processing, cancel bookings with refund requests, and review accommodations.
Admin Services: Admins can view all host listings and remove low-rated properties.
RabbitMQ Integration: Payment Queue for booking payments and Refund Queue for handling cancellations and refunds.
API Gateway: Centralized API Gateway for routing requests to respective microservices.

TECHNOLOGIES
Backend: Node.js, Express.js
Database: MongoDB
Message Queue: RabbitMQ
Authentication: JSON Web Tokens (JWT)
API Gateway: express-http-proxy

MICROSERVICES
Auth Service: Handles user registration and login with role-based authentication.
Host Service: Manages property listings (add/delete).
Guest Service: Manages bookings, payments, and reviews.
Admin Service: Manages host listings and low-rated properties.
RabbitMQ: Handles asynchronous payment and refund processing.

Challenges I Faced:
Since I did not use Docker in adding RabbitMQ, it took me a long time to add external software, understand them and add them to my project. 
When adding the Gateway, I received many technical errors in port forwarding (such as using up-to-date and optimized libraries, port controls, inadequacy of service functions).
