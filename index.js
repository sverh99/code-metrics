const fs = require("fs");
const path = require("path");

function countStats(filePath) {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const lines = fileContents.split("\n");

  let totalLines = 0;
  let logicalLinesOfCode = 0;
  let totalEmptyLines = 0;
  let totalCommentLines = 0;
  let inBlockComment = false;

  for (const line of lines) {
    totalLines++;
    const trimmedLine = line.trim();

    if (trimmedLine === "") {
      totalEmptyLines++;
      continue;
    }

    if (inBlockComment) {
      totalCommentLines++;

      if (trimmedLine.endsWith("*/")) {
        inBlockComment = false;
        continue;
      }
    } else if (trimmedLine.startsWith("/*")) {
      totalCommentLines++;

      if (!trimmedLine.endsWith("*/")) {
        inBlockComment = true;
      }
    } else if (trimmedLine.startsWith("//")) {
      totalCommentLines++;
    } else {
      logicalLinesOfCode++;
    }
  }
  return {
    totalLines,
    totalEmptyLines,
    totalCommentLines,
    logicalLinesOfCode,
  };
}

function processFile(directory) {
  let totalLines = 0;
  let logicalLinesOfCode = 0;
  let physicalLinesOfCode = 0;
  let totalEmptyLines = 0;
  let totalCommentLines = 0;

  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);

    const stat = fs.statSync(fullPath);

    if (stat.isFile()) {
      const moduleStats = countStats(fullPath);
      console.log(
        `${fullPath}: total lines: ${moduleStats.totalLines}, logical lines of code: ${moduleStats.logicalLinesOfCode}, empty lines: ${moduleStats.totalEmptyLines}, comment lines: ${moduleStats.totalCommentLines}`
      );
      totalLines += moduleStats.totalLines;
      totalEmptyLines += moduleStats.totalEmptyLines;
      totalCommentLines += moduleStats.totalCommentLines;
      logicalLinesOfCode += moduleStats.logicalLinesOfCode;
      physicalLinesOfCode += moduleStats.totalLines;
    } else if (stat.isDirectory()) {
      const dirStats = processDirectory(fullPath); // Recursively process subdirectories
      totalLines += dirStats.totalLines;
      totalEmptyLines += dirStats.totalEmptyLines;
      totalCommentLines += dirStats.totalCommentLines;
      logicalLinesOfCode += dirStats.logicalLinesOfCode;
      physicalLinesOfCode += dirStats.totalLines;
    }
  }

  return {
    totalLines,
    totalEmptyLines,
    totalCommentLines,
    logicalLinesOfCode,
    physicalLinesOfCode,
  };
}

console.log(processFile("./lib"));
