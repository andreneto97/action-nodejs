const { exec } = require("child_process");
const core = require("@actions/core");
const github = require("@actions/github");

try {
  const pr = github.context.payload.pull_request;

  const token = core.getInput("repo-token");

  // Create a GitHub client.
  const client = github.getOctokit(token);

  // Get owner and repo from context
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  const createComment = async () => {
    const response = await client.rest.issues.createComment({
      owner,
      repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      issue_number: pr.number,
      body: "Some Message",
    });
    console.log(`created comment URL: ${response.data.html_url}`);
  };
  createComment();

  exec("ls -la", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("who-to-greet");
  console.log(`Hello ${nameToGreet}!`);
  const time = new Date().toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
} catch (error) {
  core.setFailed(error.message);
}
