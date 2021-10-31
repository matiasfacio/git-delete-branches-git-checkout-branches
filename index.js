const { exec } = require("child_process");
const { stderr } = require("process");

exec("git branch", (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }

  if (stderr) {
    console.error("stderr:", stderr);
  }

  console.log("branch:", stdout);
});
