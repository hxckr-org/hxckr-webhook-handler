# Webhook Handler

This is a webhook handler for hxckr platform built with Node.js and Express. It's designed to receive and log webhook payloads from a git service.

## Features

- Receives webhook payloads via HTTP POST requests
- Logs the entire payload for each received webhook
- Handles 'push' events specifically, with extensibility for other event types
- Returns a JSON response confirming receipt of the webhook

## Prerequisites

Before you begin, ensure you have:

- You have installed Node.js and Yan
- Typescipt

## Installing Webhook Handler

To use the Webhook Handler, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/webhook-handler.git
   cd webhook-handler
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Configuring the Application

1. Create a `.env` by runnin `cp .env.example .env` and fill in the following values

For development, you can use:
```bash
yarn dev
```
This will start the server on watch mode and restart the server on file changes.

## Using Webhook Handler

The webhook handler exposes a single endpoint:

- POST `/webhook`

To test the webhook handler with the git-servie:

1. Head on to [hxckr-infra]() and setup git-service which also starts soft-serve.
2. Ensure the server is running.
3. Create, clone and push to a repo on soft-serve.

## Contributing to Webhook Handler

To contribute to Webhook Handler, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).
