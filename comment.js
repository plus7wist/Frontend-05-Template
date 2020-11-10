const process = require("process");

const axios = require("axios");
const { program } = require("commander");

const config = {
  githubName: "plus7wist",
  repoName: "Frontend-05-Template",
};

function main() {
  program
    .version("1.0.0")
    .option("-w --weekno <wn>", "week number")
    .parse(program.argv);

  const issue = getIssueNumber(program.weekno);
  const url = `https://api.github.com/repos/GeekUniversity/${config.repoName}/issues/${issue}/comments`;
}

function commentText() {
  let lines = [
    "#学号: G20200447050163",
    "#姓名: 张世权",
    "#班级: 5",
    "#小组: 5",
    `#作业&总结链接: https://github.com/plus7wist/${config.repoName}/tree/master/${week}`,
  ];
  return lines.join("\n");
}

main();
