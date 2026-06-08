# Used Car Dealership Management System

A fully functional, server-side rendered web application built with Node.js, Express.js, and PostgreSQL using the Model-View-Controller (MVC) architecture. This application manages a used car dealership inventory, handles multi-tier user authorization, supports user-generated reviews, and features a multi-stage service/repair tracking workflow.

## Live Deployment and Repository Links
* **GitHub Repository:** [Insert your public GitHub URL here]
* **Live Render Deployment:** [Insert your live Render app URL here]

## Project Description
This platform serves three distinct audiences: public car shoppers, dealership employees, and the dealership owner. Standard visitors can browse inventory filtered by vehicle categories (Trucks, Vans, Cars, SUVs) and view detailed specification pages. Registered users can submit live vehicle reviews and track personal automotive maintenance requests through a multi-stage service workflow. Employees and administrative owners use a secure dashboard to manage listings, update maintenance stages, handle customer inquiries, and moderate user content.

## User Roles and Permissions

### 1. Standard User (Customer)
* Public access to browse vehicle categories and view individual vehicle specification details.
* Ability to register an account and log in securely.
* Can write, edit, and delete their own vehicle reviews.
* Can submit service/repair requests and view their historical maintenance status.

### 2. Employee
* Access to the Employee Dashboard interface.
* Ability to edit vehicle pricing, description details, and market availability.
* Permissions to moderate and delete inappropriate user reviews.
* Full visibility into customer service requests, including the ability to add internal notes and update progress states.
* Access to view public contact form submissions.

### 3. Owner (Full Admin)
* Inherits all capabilities of the Employee role.
* Exclusive access to add, edit, and delete root vehicle categories.
* Complete administrative control to add new vehicles to the inventory or delete old listings.
* Full system administration rights over user role management and core dealership operational metrics.

## Test Account Credentials
All test accounts utilize the universal password: **P@$$w0rd!**

* **Standard User Login:** customer@dealership.com
* **Employee Login:** employee@dealership.com
* **Owner/Admin Login:** owner@dealership.com

## Database Schema (ERD)
The relational database structure is built on PostgreSQL, utilizing foreign key constraints and cascade actions to link inventory data with user actions. 

![Entity Relation Diagram](assets/images/erd-placeholder.png)

*The schema consists of the following relational tables:*
* `users`: Stores user credentials, hashed passwords, and assigned authorization role tiers.
* `categories`: Defines vehicle classifications (Trucks, Vans, Cars, SUVs).
* `vehicles`: Houses core vehicle data, prices, and status parameters linked directly to a category ID.
* `vehicle_images`: Manages asset paths using a one-to-many relationship with the vehicles table.
* `reviews`: Links user reviews to both specific vehicle IDs and user account accounts.
* `service_requests`: Tracks customer repair tickets through a multi-stage status workflow (Submitted, In Progress, Completed).
* `contact_messages`: Captures external public inquiries from the contact forms.

## Technology Stack
* **Runtime Environment:** Node.js (ESM syntax utilizing import/export)
* **Backend Framework:** Express.js
* **Template Engine:** EJS (Server-Side Rendered views with modular partial layouts)
* **Database Layer:** PostgreSQL using node-postgres (pg) parameterized queries
* **Authentication State:** express-session backed by server-side cookie states
* **Security Layer:** bcrypt password hashing, form field validation, and input sanitization

## Known Limitations
* *Initial Setup:* Currently awaiting production environment variable configurations on Render.
* *Media Files:* Vehicle images utilize static mockup asset paths; an external cloud storage engine bucket wrapper has not been integrated yet.