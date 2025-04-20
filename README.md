# Portfolio

Welcome to my portfolio repository! This repository showcases my projects, skills, and experiences as a developer. This repository only details personal work, it does not include everything I've done by far, as most of my work is professional work, I won't show it here.

## Table of Contents

- [About Me](#about-me)
- [Projects](#projects)
- [Skills](#skills)
- [Contact](#contact)

## About Me

Hello! I'm Geoff Faiers, a passionate developer with experience in full stack development. I enjoy creating innovative solutions and continuously learning new technologies.

## Projects

### Portfolio Website

This portfolio website is a comprehensive showcase of my skills, projects, and experiences as a developer. It is built using modern web technologies and follows best practices for performance, security, and maintainability.

- **Frontend**:  
  The frontend is developed using [Next.js](https://nextjs.org/) (currently v15), a React framework that enables server-side rendering and static site generation.
  - **Design System**: The project takes base components from [shadcn/ui](https://ui.shadcn.com/).
  - **Styling**: The project uses [Tailwind CSS](https://tailwindcss.com/) for utility-first styling, with custom configuration and theme extensions.  

- **Backend**:  
  The backend is built with [Express](https://expressjs.com/) and TypeScript.  
  - **API**: Provides RESTful APIs for user authentication, profile management, messaging, and planning poker features.
  - **Database**: Integrates with a MySQL database for persistent data storage.
  - **Validation**: Uses `class-validator` and `class-transformer` for DTO validation and transformation.
  - **Testing**: Comprehensive unit tests are written using [Jest](https://jestjs.io/), with mocks and factories for all models.

- **WebSocket Integration**:  
  Real-time communication is implemented using [ws](https://github.com/websockets/ws) for features like chat and planning poker.

- **Authentication**:  
  User authentication is handled using JSON Web Tokens (JWT) with the [jose](https://github.com/panva/jose) library for secure and stateless authentication. Features include login, registration, password reset, and token refresh.

- **CI/CD**:  
  Continuous Integration and Continuous Deployment are managed through [GitHub Actions](https://github.com/features/actions). Automated workflows are set up for building, testing, and deploying the application.

- **Deployment**:  
  The application is hosted on a [DigitalOcean Droplet](https://www.digitalocean.com/products/droplets/) in a Docker container. This setup provides a scalable and isolated environment for running the application, ensuring high availability and performance.

- **API Documentation**:  
  The API is documented using the OpenAPI specification and served with [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express).  
  - Local server on port 3000: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
  - Local server on port 4000: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)  
  - Production server: [https://gfaiers.com/api-docs](https://gfaiers.com/api-docs)

This project demonstrates my ability to build full-stack applications using modern web technologies and best practices. It showcases my skills in frontend and backend development, real-time communication, authentication, CI/CD, and deployment.

Feel free to explore the codebase and reach out if you have any questions or feedback!

## Skills

- **Programming Languages:** JavaScript / TypeScript / Java / SQL
- **Frameworks and Libraries:** React.js / Next.js / Express / Jest / Cypress / Tailwind CSS
- **Tools and Platforms:** Git / Jira / Visual Studio Code / Android Studio / npm / Docker / GitHub Actions / Postman / Swagger / JUnit

## Contact

Feel free to reach out to me via [Email](mailto:geoff@gfaiers.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/gfaiers/).

Thank you for visiting my portfolio repository!