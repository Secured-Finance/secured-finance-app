#!/bin/bash
# CI Refactoring Pre-flight Check Script

echo "=== CI Refactoring Pre-flight Check ==="
echo ""

# Check gh CLI
echo -n "1. GitHub CLI: "
if command -v gh &> /dev/null; then
    echo "✓ Installed ($(gh --version | head -1))"
    
    # Check auth status
    echo -n "   Auth status: "
    if gh auth status &> /dev/null; then
        echo "✓ Logged in"
    else
        echo "✗ Not logged in (run: gh auth login)"
    fi
else
    echo "✗ Not installed (run: brew install gh)"
fi

# Check Python
echo -n "2. Python: "
if command -v python3 &> /dev/null; then
    echo "✓ Installed ($(python3 --version))"
else
    echo "✗ Not installed"
fi

# Check ruamel.yaml
echo -n "3. ruamel.yaml: "
if python3 -c "import ruamel.yaml" 2>/dev/null; then
    echo "✓ Installed"
else
    echo "⚠ Not installed (optional but recommended: pip install ruamel.yaml)"
fi

# Check git status
echo -n "4. Git status: "
if [ -z "$(git status --porcelain)" ]; then
    echo "✓ Clean working tree"
else
    echo "⚠ Uncommitted changes (commit or stash first)"
fi

# Check current branch
echo -n "5. Current branch: "
BRANCH=$(git branch --show-current)
echo "$BRANCH"
if [[ "$BRANCH" == "issue-005-ci-refactor" ]]; then
    echo "   ✓ On correct branch"
elif [[ "$BRANCH" == "develop" ]] || [[ "$BRANCH" == "v2" ]]; then
    echo "   ⚠ Create feature branch: git checkout -b issue-005-ci-refactor"
else
    echo "   ⚠ Unexpected branch"
fi

# Check workflow files exist
echo -n "6. Workflow files: "
WF_COUNT=$(ls -1 .github/workflows/*.yml 2>/dev/null | wc -l)
echo "$WF_COUNT files found"

# Summary
echo ""
echo "=== Pre-flight Summary ==="
echo "If all checks pass (✓), you're ready to run:"
echo "  1. python3 scripts/ci_refactor_safe.py          # Dry run"
echo "  2. python3 scripts/ci_refactor_safe.py --apply  # Apply changes"
echo "  3. python3 scripts/ci_verify.py                 # Verify"