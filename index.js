import * as core from "@actions/core";
import * as github from "@actions/github";

try {
  const pr = github.context.payload.pull_request;

  const token = core.getInput("repo-token");

  // Create a GitHub client.
  const client = new github.GitHub(token);

  // Get owner and repo from context
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  const createComment = async () => {
    const response = await client.issues.createComment({
      owner,
      repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      issue_number: pr.number,
      body: message,
    });
    core.debug(`created comment URL: ${response.data.html_url}`);
  };
  createComment();

  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("who-to-greet");
  console.log(`Hello ${nameToGreet}!`);
  const time = new Date().toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
