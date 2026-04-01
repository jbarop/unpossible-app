#!/usr/bin/env bash
set -euo pipefail

# RalphWiggum Loop - Iterative AI Agent Development
# Automates: Read spec -> Pick next task -> Implement -> Test -> Commit -> Repeat

SPEC="./specs/SPECIFICATION.md"
PLAN="./specs/IMPLEMENTATION_PLAN.md"
PROMPT="./prompt.md"
MAX_ITERATIONS=50

echo "=========================================="
echo "  RalphWiggum Loop"
echo "  Iterative AI Agent Development"
echo "=========================================="
echo ""
echo "Spec:   $SPEC"
echo "Plan:   $PLAN"
echo "Prompt: $PROMPT"
echo ""

for i in $(seq 1 $MAX_ITERATIONS); do
  echo "------------------------------------------"
  echo "  Iteration $i / $MAX_ITERATIONS"
  echo "------------------------------------------"

  # Check if all tasks are done
  if grep -q "All tasks completed" "$PLAN" 2>/dev/null; then
    echo "All tasks completed! Exiting loop."
    break
  fi

  # Feed prompt to Claude Code (it reads spec, implements, tests, and commits autonomously)
  claude -p "$(cat "$PROMPT")" --dangerously-skip-permissions

  echo "  Iteration $i complete."
  echo ""
done

echo ""
echo "=========================================="
echo "  RalphWiggum Loop finished!"
echo "  Total commits: $(git rev-list --count HEAD)"
echo "=========================================="
