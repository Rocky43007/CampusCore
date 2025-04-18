#!/bin/bash

# This script uses 'cloc' to count lines of code, comments, and blank lines
# specifically in files that are tracked by Git (committed or staged).

# --- Prerequisites ---
# 1. Ensure 'git' is installed and you are in a Git repository.
# 2. Ensure 'cloc' is installed (e.g., 'npm install -g cloc', 'brew install cloc', 'sudo apt install cloc').

# Check if cloc is installed
if ! command -v cloc &>/dev/null; then
  echo "Error: 'cloc' command not found. Please install cloc."
  echo "See: https://github.com/AlDanial/cloc#install"
  exit 1
fi

# Check if this is a git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: Not inside a Git repository."
  exit 1
fi

echo "Running cloc on files tracked by Git..."
echo "(This includes committed and staged files)"
echo "-------------------------------------------------------------------------------"

# List all tracked files using NUL delimiters (handles special characters in filenames)
# Pipe the NUL-delimited list to xargs, which calls cloc with the file list.
# Using '-0' with xargs ensures filenames are read correctly.
git ls-files -z | xargs -0 cloc --quiet

# Check the exit status of the piped command (specifically cloc)
# PIPESTATUS is a bash array holding exit statuses of piped commands
# We check the status of the last command in the pipe (cloc).
if [ "${PIPESTATUS[1]}" -ne 0 ]; then
  echo "-------------------------------------------------------------------------------"
  echo "Warning: cloc may have encountered issues during counting."
else
  # The output from cloc already includes the summary table and footer.
  # No need for an extra "Count complete" message unless cloc produced no output.
  : # No-op, success case handled by cloc output
fi

exit 0
