#!/usr/bin/env node

const { exec } = require("child_process");
const inquirer = require("inquirer");

exec("git branch", async (error, stdout, stderr) => {
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

  const selectedByUser = await inquirer.prompt([
    {
      type: "checkbox",
      name: "branches",
      message: "which branches do you want to delete?",
      choices: [...filteredNewBranch, "-cancel-", new inquirer.Separator()],
    },
  ]);

  if (
    selectedByUser.branches.length > 0 &&
    !selectedByUser.branches.includes("-cancel-")
  ) {
    const message =
      selectedByUser.branches.length === 1
        ? `Are you sure that you want to delete this branch? [${selectedByUser.branches}]`
        : `Are you sure that you want to delete these branches? [${selectedByUser.branches.join(
            ", "
          )}]`;

    const confirm = await inquirer.prompt([
      {
        type: "confirm",
        name: "accepted",
        message: message,
      },
    ]);

    if (confirm.accepted) {
      selectedByUser.branches.map((branch) => {
        exec(`git branch -D ${branch}`, (error, stdout, stderr) => {
          if (error) {
            console.log("sorry, there was an error");
          }
          if (stderr) {
            if (
              selectedByUser.branches.includes("main") ||
              selectedByUser.branches.includes("master")
            ) {
              console.error(`you cannot delete ${selectedByUser.branches}`);
              return;
            }
            console.error(stderr, " > are you currently on this branch ?");
          }
          if (stdout) {
            console.log("Successful:", stdout);
          }
        });
      });
    }
  }
});
