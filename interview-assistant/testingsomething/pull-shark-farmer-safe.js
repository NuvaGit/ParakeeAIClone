// GitHub Pull Shark Achievement Farmer - SECURE VERSION
// This script will create and merge pull requests to earn the Pull Shark achievement
// Gold level requires 128 merged PRs

const { Octokit } = require("@octokit/rest");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Simple manual .env file loader (no dotenv required)
try {
  if (fs.existsSync('.env')) {
    const envConfig = fs.readFileSync('.env', 'utf8')
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => line.split('='))
      .reduce((acc, [key, value]) => {
        if (key && value) process.env[key.trim()] = value.trim();
        return acc;
      }, {});
    console.log("Loaded configuration from .env file");
  }
} catch (error) {
  console.log('No .env file found or error reading it. Using environment variables directly.');
}

// Configuration - Get all values from environment variables for security
const TOKEN = process.env.GITHUB_TOKEN; // Never hardcode tokens
const OWNER = process.env.GITHUB_USERNAME || "your_username"; 
const REPO = process.env.GITHUB_REPO || "your_repo_name";
const TARGET_PRS = parseInt(process.env.TARGET_PRS || "128", 10);
const BASE_BRANCH = process.env.BASE_BRANCH || "main";
const FILE_TO_MODIFY = process.env.FILE_TO_MODIFY || "pull_shark_farmer.md";
const DELAY_MS = parseInt(process.env.DELAY_MS || "2000", 10);

// Validate token exists
if (!TOKEN) {
  console.error("Error: GitHub token not found. Please set the GITHUB_TOKEN environment variable.");
  console.error("You can do this by creating a .env file with GITHUB_TOKEN=your_token_here");
  console.error("Make sure to add .env to your .gitignore!");
  process.exit(1);
}

// Initialize Octokit with your token
const octokit = new Octokit({
  auth: TOKEN
});

// Create the tracking file if it doesn't exist
async function initializeRepo() {
  try {
    console.log(`Checking if tracking file ${FILE_TO_MODIFY} exists...`);
    
    // Check if file exists in repo first
    try {
      await octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: FILE_TO_MODIFY,
      });
      console.log(`Tracking file ${FILE_TO_MODIFY} already exists.`);
      return;
    } catch (error) {
      // File doesn't exist, create it
      console.log(`Creating tracking file ${FILE_TO_MODIFY}...`);
      
      fs.writeFileSync(FILE_TO_MODIFY, "# Pull Shark Achievement Progress\n\n");
      execSync(`git add ${FILE_TO_MODIFY}`);
      execSync(`git commit -m "Initialize Pull Shark tracker"`);
      
      try {
        execSync(`git push origin ${BASE_BRANCH}`);
        console.log(`Created tracking file ${FILE_TO_MODIFY}`);
      } catch (error) {
        console.error(`Error pushing to ${BASE_BRANCH}:`, error.message);
        console.log("Please manually push the tracking file to your repository.");
      }
    }
  } catch (error) {
    console.error("Error initializing repository:", error.message);
  }
}

// Function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main function to create and merge PRs
async function createAndMergePRs() {
  console.log(`Starting to create ${TARGET_PRS} PRs to earn Pull Shark Gold...`);
  
  // Initialize the repo first
  await initializeRepo();
  
  let successCount = 0;
  let failureCount = 0;
  
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
      successCount++;
      
      // Go back to base branch
      execSync(`git checkout ${BASE_BRANCH}`);
      execSync(`git pull origin ${BASE_BRANCH}`);
      
      // Delete local branch
      execSync(`git branch -D ${branchName}`);
      
      // Optional: Delete remote branch
      // execSync(`git push origin --delete ${branchName}`);
      
      // Add a small delay to avoid rate limiting
      console.log(`Waiting ${DELAY_MS}ms before next PR...`);
      await sleep(DELAY_MS);
      
    } catch (error) {
      console.error(`Error with PR #${i}:`, error.message);
      failureCount++;
      
      // Try to return to base branch if possible
      try {
        execSync(`git checkout ${BASE_BRANCH}`);
      } catch (e) {
        console.error("Could not return to base branch:", e.message);
      }
    }
  }
  
  console.log("\n=== Summary ===");
  console.log(`Successfully created and merged: ${successCount} PRs`);
  console.log(`Failed: ${failureCount} PRs`);
  
  if (successCount >= 128) {
    console.log("\n🎉 Congratulations! You should now have the Pull Shark Gold achievement!");
  } else if (successCount >= 64) {
    console.log("\n🎉 You've earned the Pull Shark Silver achievement! Need ${128-successCount} more for Gold.");
  } else if (successCount >= 16) {
    console.log("\n🎉 You've earned the Pull Shark Bronze achievement! Need ${128-successCount} more for Gold.");
  }
}

// Run the main function
createAndMergePRs().catch(console.error);
