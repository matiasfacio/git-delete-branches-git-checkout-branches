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

  const branches = stdout.split(" ");

  const newbranch = branches
    .map((value) => {
      return value.replace(/\n/, "").replace("*", "");
    })
    .filter((value) => value !== "");
  console.log(newbranch);

  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "branches",
        message: "which branches do you want to delete?",
        choices: newbranch,
      },
    ])
    .then((answers) =>
      exec(`git branch -D ${answers.branches}`, (error, stdout, stderr) => {
        if (error) {
          console.log("sorry, there was an error");
        }
        if (stderr) {
          if (
            answers.branches.includes("main") ||
            answers.branches.includes("master")
          ) {
            console.error(`you cannot delete ${answers.branches}`);
            return;
          }
          console.error("stderr:", stderr);
        }
        console.log("******\n", stdout, "******+\n");
      })
    );
});
