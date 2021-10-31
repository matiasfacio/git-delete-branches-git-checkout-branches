const aString = "main\n * my-new-branch\n what-a-day\nopiensas hola\namigo";
console.log(aString);

const toArray = aString.split(" ");
console.log(toArray);

const filteredToArray = toArray.filter((branch) => {
  return branch !== "*";
});

console.log("filtered To Array:", filteredToArray);

const regexArray = filteredToArray.map((branch) => {
  return branch.replace(/(\n$)/gm, "");
});
console.log(regexArray);
