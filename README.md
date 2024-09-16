# Webhook Handler with RabbitMQ Development Environment

This project includes a webhook handler for the hxckr platform built with Node.js and Express, along with a RabbitMQ development environment set up using a Nix flake.

## Webhook Handler Features

- Receives webhook payloads via HTTP POST requests
- Logs the entire payload for each received webhook
- Handles 'push' events specifically, with extensibility for other event types
- Returns a JSON response confirming receipt of the webhook

## RabbitMQ Development Environment

This repo uses a Nix flake to set up a RabbitMQ development environment. It provides an isolated environment with RabbitMQ server and necessary tools.

### Prerequisites

- Nix package manager with flakes enabled ([download](https://nixos.org/download.html))

### Setup

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Enter the Nix development shell:
   ```bash
   nix develop
   ```

   This command will download and set up all necessary dependencies, including RabbitMQ server.

3. Once in the Nix shell, you'll see output similar to:
   ```
   RabbitMQ development environment
   Run 'rabbitmq-server' to start RabbitMQ

   RabbitMQ Connection String:
   amqp://guest:guest@localhost:5672

   RabbitMQ data directory: /tmp/rabbitmq-<username>

   Available commands:
     rabbitmq-server    - Start the RabbitMQ server
     rabbitmqctl        - RabbitMQ management tool
     rabbitmq-plugins   - RabbitMQ plugin management tool
   ```

### Starting RabbitMQ

To start the RabbitMQ server, run:
```bash
rabbitmq-server
```
This will start RabbitMQ in the foreground. To stop it, press Ctrl+C.

### Connecting to RabbitMQ

Use the connection string provided in the shell output to connect to RabbitMQ from your applications. The default connection string is:

```bash
amqp://guest:guest@localhost:5672
```

- Username: guest
- Password: guest
- Host: localhost
- Port: 5672

### Managing RabbitMQ

- Use `rabbitmqctl` for management tasks (e.g., `rabbitmqctl list_queues`)
- Use `rabbitmq-plugins` to manage plugins (e.g., `rabbitmq-plugins enable rabbitmq_management`)

### Data Persistence

RabbitMQ data is stored in a temporary directory (shown in the shell output). This data will be lost when you reboot your system. For persistent data, modify the `flake.nix` to use a permanent directory.

### Exiting the Environment

To exit the Nix development shell, simply type `exit` or press Ctrl+D.

### Customization

To customize the RabbitMQ configuration or change default settings, modify the `flake.nix` file in this repository.

## Webhook Handler Setup

### Prerequisites

- Node.js and Yarn
- TypeScript

### Installing Webhook Handler

1. Install the dependencies:
   ```bash
   yarn install
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Fill in the necessary values.

### Running the Webhook Handler

For development:
```bash
yarn dev
```

This will start the server in watch mode and restart on file changes.

## Using Webhook Handler

The webhook handler exposes a single endpoint:
- POST `/webhook`

To test with the git-service:
1. Set up git-service using [hxckr-infra](https://github.com/extheoisah/hxckr-infra).
2. Ensure the server is running.
3. Create, clone, and push to a repo on soft-serve.

## Contributing

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

## Docker Setup for Local Development

1. Build the Docker image:
   ```bash
   docker build -t webhook-handler .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -e NODE_ENV=development -v $(pwd)/src:/app/src -d webhook-handler
   ```

3. View logs:
   ```bash
   docker logs -f <container_id>
   ```

4. Stop the container:
   ```bash
   docker stop <container_id>
   ```

Note: For hot-reloading in development, you may need to adjust the Dockerfile and use a tool like nodemon.
