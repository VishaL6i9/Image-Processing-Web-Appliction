---

# Front-End Extension for Image Processing Application

This project provides a simple front-end interface to interact with the backend image processing API. The backend, developed using Spring Boot, allows users to upload, rotate, resize, and convert images to grayscale.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Upload Image**: Upload images to the server.
- **Rotate Image**: Rotate uploaded images by a specified number of degrees.
- **Resize Image**: Resize uploaded images to specified dimensions.
- **Grayscale Image**: Convert uploaded images to grayscale.

## Prerequisites

- [Node.js](https://nodejs.org/) (for running the front-end locally)
- [Spring Boot](https://spring.io/projects/spring-boot) (for running the backend)

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VishaL6i9/SpingBoot-REST-API.git
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Front-End**:
   ```bash
   npm start
   ```

4. **Start the Backend**:
   - Ensure your Spring Boot application is running on `http://localhost:8080`.

## Usage

1. **Upload Image**:
   - Use the file input to select an image and click "Upload" to send it to the server.

2. **Rotate Image**:
   - Enter the desired rotation angle (in degrees) and click "Rotate" to rotate the uploaded image.

3. **Resize Image**:
   - Enter the desired width and height and click "Resize" to resize the uploaded image.

4. **Grayscale Image**:
   - Click "Grayscale" to convert the uploaded image to grayscale.

## API Endpoints

- **Upload Image**:
  ```
  POST /api/image/upload
  ```

- **Rotate Image**:
  ```
  POST /api/image/rotate/{degrees}
  ```

- **Resize Image**:
  ```
  POST /api/image/resize
  ```

- **Grayscale Image**:
  ```
  POST /api/image/grayscale
  ```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
