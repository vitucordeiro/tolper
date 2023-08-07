# GitHub Webhooks Automation Documentation

This documentation provides an overview of a Node.js application that utilizes GitHub Webhooks for automating tasks in response to issue comments. The application is built using the `@octokit` library and interacts with GitHub repositories. It uses the OpenAI API to generate responses based on prompts.

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Webhook Handling](#webhook-handling)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)

## Introduction
This Node.js application leverages GitHub Webhooks to perform various automated actions on GitHub repositories. It listens for webhook events, such as issue comments, and responds accordingly by generating and posting comments using OpenAI's prompt generation.

## Installation
1. Clone the repository containing this application.
2. Install the required dependencies by running:
   ```shell
   npm install
   ```
2. Create .env with your enviroment variables
   ```shell
    APP_ID=your_app_id
    WEBHOOK_SECRET=your_webhook_secret
    PRIVATE_KEY_PATH=path_to_your_private_key
    API_KEY=your_openai_api_key
    ORGANIZATION=your_organization_name
    ```
## Configuration

Ensure you have obtained the necessary credentials from GitHub and OpenAI:

    APP_ID: GitHub App ID for authentication.
    WEBHOOK_SECRET: Secret token used for webhook payload verification.
    PRIVATE_KEY_PATH: Path to the private key file for GitHub App authentication.

## Usage

To use this application, follow these steps:

1. Configure your environment variables in the .env file as mentioned above.
2. Implement additional functionality within the provided functions, such as promptText, to customize the application's behavior.
3. Define specific responses and actions within the webhook event handling functions.
4. Customize the handleGetListCommentFromIssue and handlePostResumeFromIssue functions to match your use case.

## Webhook Handling

The application listens for specific webhook events, such as issue_comment, and responds by executing designated functions. The webhook handlers are defined under the service function, which orchestrates the entire process.

## API Endpoints

This application does not expose any external API endpoints. It interacts with GitHub's webhook events and responds accordingly.

## OpenAI Integration

The application leverages OpenAI's API to generate responses based on prompts. The integration with OpenAI is achieved through the prompt function provided in the snippet. Make sure to customize the prompts and configurations according to your requirements.

## Running the Application

    ```shell
    npm run dev 
    ```

    ```shell
    npx smee -u 'URL_WEBHOOK_FROM_SMEE' -t http://localhost:3000/api/webhook
    ```

## Conclusion

This documentation has provided an overview of the GitHub Webhooks automation application. By utilizing GitHub webhooks and OpenAI's prompt generation, you can automate various tasks based on user interactions within GitHub repositories. Customize the provided functions and event handlers to suit your specific use cases. Ensure proper testing and security measures are in place before deploying the application in a production environment.

### !!
Please note that this documentation assumes familiarity with Node.js, GitHub Webhooks, Octokit library, and OpenAI's API.