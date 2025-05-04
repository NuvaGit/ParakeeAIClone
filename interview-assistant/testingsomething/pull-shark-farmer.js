// GitHub Pull Shark Achievement Farmer
// This script will create and merge pull requests to earn the Pull Shark achievement
// Gold level requires 128 merged PRs

const { Octokit } = require("@octokit/rest");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration - EDIT THESE VALUES
const TOKEN = "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"; // Replace with your GitHub token
const OWNER = "NuvaGit"; // Your GitHub username
const REPO = "ParakeeAIClone"; // The repository name
const TARGET_PRS = 128; // Number of PRs to create and merge (128 for gold)
const BASE_BRANCH = "main"; // Your main branch (main or master usually)
const FILE_TO_MODIFY = "pull_shark_farmer.md"; // This file will be modified with each PR

// Initialize Octokit with your token
const octokit = new Octokit({
  auth: TOKEN
});

// Create the tracking file if it doesn't exist
if (!fs.existsSync(FILE_TO_MODIFY)) {
  fs.writeFileSync(FILE_TO_MODIFY, "# Pull Shark Achievement Progress\n\n");
  execSync(`git add ${FILE_TO_MODIFY}`);
  execSync(`git commit -m "Initialize Pull Shark tracker"`);
  execSync(`git push origin ${BASE_BRANCH}`);
  console.log(`Created tracking file ${FILE_TO_MODIFY}`);
}

// Function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main function to create and merge PRs
async function createAndMergePRs() {
  console.log(`Starting to create ${TARGET_PRS} PRs to earn Pull Shark Gold...`);
  
  for (let i = 1; i <= TARGET_PRS; i++) {
    try {
      // Create a new branch
      const branchName = `pull-shark-${Date.now()}-${i}`;
      console.log(`Creating branch: ${branchName}`);
      execSync(`git checkout -b ${branchName}`);
      
      // Modify the file
      const content = fs.readFileSync(FILE_TO_MODIFY, "utf8");
      fs.writeFileSync(
        FILE_TO_MODIFY, 
        content + `\n## Pull Request #${i}\n\nCreated at: ${new Date().toISOString()}\n`
      );
      
      // Commit and push
      execSync(`git add ${FILE_TO_MODIFY}`);
      execSync(`git commit -m "Update for PR #${i}"`);
      execSync(`git push origin ${branchName}`);
      
      // Create PR
      console.log(`Creating PR #${i}...`);
      const { data: pullRequest } = await octokit.pulls.create({
        owner: OWNER,
        repo: REPO,
        title: `Pull Shark PR #${i}`,
        body: `This is an automated PR to earn the Pull Shark achievement (#${i} of ${TARGET_PRS})`,
        head: branchName,
        base: BASE_BRANCH
      });
      
      console.log(`Created PR #${pullRequest.number}`);
      
      // Merge PR
      await octokit.pulls.merge({
        owner: OWNER,
        repo: REPO,
        pull_number: pullRequest.number,
        commit_title: `Merge PR #${i} for Pull Shark achievement`,
        merge_method: "merge"
      });
      
      console.log(`Merged PR #${pullRequest.number} (${i}/${TARGET_PRS})`);
      
      // Go back to base branch
      execSync(`git checkout ${BASE_BRANCH}`);
      execSync(`git pull origin ${BASE_BRANCH}`);
      
      // Delete local branch
      execSync(`git branch -D ${branchName}`);
      
      // Optional: Delete remote branch
      // execSync(`git push origin --delete ${branchName}`);
      
      // Add a small delay to avoid rate limiting
      await sleep(2000);
      
    } catch (error) {
      console.error(`Error with PR #${i}:`, error.message);
    }
  }
  
  console.log("Complete! You should now have the Pull Shark Gold achievement.");
}

// Run the main function
createAndMergePRs().catch(console.error);