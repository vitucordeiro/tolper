//
import dotenv from "dotenv";
import {App} from "octokit";
import {createNodeMiddleware} from "@octokit/webhooks";
import fs from "fs";
import http from "http";
import { prompt } from "../openai";

dotenv.config();

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

var promptText = (text) => {
  return  toString(prompt(text))
}
const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret
  },
});

async function handlePullRequestOpenedComment({octokit, payload}) {
  console.log(`Received a pull request event for #${payload.pull_request.name}`);

  try {
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.pull_request.number,
      body: messageForNewPRs,
      headers: {
        "x-github-api-version": "2022-11-28",
      },
    });
  } catch (error) {
    if (error.response) {
      console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
  }
};
async function getCommentsFromData(listComment){
  const text = listComment.data.map(array =>{
    return array["body"]
  })
  return promptText(text)
} 
async function handleGetListCommentFromIssue({octokit, payload}){
  const issue = payload.issue.number
  try{
    const listComment = await octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: issue,
    headers: {'X-GitHub-Api-Version': '2022-11-28'} })

    getCommentsFromData(listComment )

  }catch(error){
    if(error.response)[
      console.error(`Error from response! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    ]
    console.log(error)
  } 
}
async function handlePostResumeFromIssue({octokit, payload}){
  console.log("chegou aqui no post")
  const issue = payload.issue.number
  try {
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: issue,
      body: `${promptText} `,
      headers: {
        "x-github-api-version": "2022-11-28",
      },
    });
  } catch (error) {
    if (error.response) {
      console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
  }
}
async function handleGetCommentFromIssue({octokit, payload}){
  try {
    const result = await octokit.request("GET /repos/{owner}/{repo}/issues/comments/{comment_id}", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      comment_id: payload.comment.id,
      headers: {
        "x-github-api-version": "2022-11-28",
      },
    });
    return result.data.body == "!resume" ? handleGetListCommentFromIssue({octokit,payload}): false;


  } catch (error) {
    if (error.response) {
      console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
  }
}
async function service ({octokit,payload}){
  handleGetCommentFromIssue({octokit,payload})
    .then(response => handlePostResumeFromIssue({octokit,payload}))
}

app.webhooks.on("issue_comment", service)

app.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

//
const port = 3000;
const host = 'localhost';
const path = "/api/webhook";
const localWebhookUrl = `http://${host}:${port}${path}`;


const middleware = createNodeMiddleware(app.webhooks, {path});

http.createServer(middleware).listen(port, () => {
  console.log(`Server is listening for events at: ${localWebhookUrl}`);
  console.log('Press Ctrl + C to quit.')
});
