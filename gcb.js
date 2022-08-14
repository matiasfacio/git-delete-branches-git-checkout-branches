#!/usr/bin/env node

const { exec } = require("child_process");
const inquirer = require("inquirer");

exec("git branch", (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }

  if (stderr) {
    console.error("stderr:", stderr);
  }

  const replaceStars = stdout.replace("*", ""); // replace * with an empty string
  const branchesArray = replaceStars.split(" "); // this will finally display /n
  const newBranch = branchesArray.filter((t) => t !== "*" && t !== ""); // here we remove * and ""
  const filteredNewBranch = newBranch.map((value) => {
    return value.replace(/(\n$)/gm, "");
  });

  inquirer
    .prompt([
      {
        type: "list",
        name: "branches",
        message: "which branch do you want to checkout",
        choices: filteredNewBranch,
      },
    ])
    .then((answers) =>
      exec(`git checkout ${answers.branches}`, (error, stdout, stderr) => {
        if (error) {
          console.log("sorry, there was an error");
        }
        if (stderr) {
          console.error(stderr);
        }
        if (stdout.length > 0) {
          console.log("Successful - you are on ", answers.branches);
        }
      })
    );
});
