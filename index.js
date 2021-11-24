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
      issue_number: pr.number,
      body: "Some Message",
    });
    console.log(`created comment URL: ${response.data.html_url}`);
  };
  createComment();

  // Show the files inside the folder
  exec("ls -la", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout1: ${stdout}`);
  });

  // Create .tar file
  exec("touch workspace.tar.gz", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout2: ${stdout}`);
  });

  // Tar the entire file
  exec(
    "tar -czf workspace.tar.gz --exclude=workspace.tar.gz .",
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      // Show the files inside the folder
      console.log(`stdout3: ${stdout}`);
      exec("ls -la", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout4: ${stdout}`);
      });
    }
  );
} catch (error) {
  core.setFailed(error.message);
}
