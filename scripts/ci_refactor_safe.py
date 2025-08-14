#!/usr/bin/env python3
"""
Safe CI workflow rename and reference update script.
Features:
- Git repository root auto-detection
- Preserves git history with 'git mv'
- Structural YAML updates using ruamel.yaml
- Dry-run mode for testing
- Cross-platform compatibility (macOS/Linux)
"""

import argparse
import os
import sys
import subprocess
import shutil

def repo_root(start_dir):
    """Get git repository root directory."""
    try:
        return subprocess.check_output(
            ["git", "-C", start_dir, "rev-parse", "--show-toplevel"],
            text=True
        ).strip()
    except subprocess.CalledProcessError:
        print("Error: not inside a git repository", file=sys.stderr)
        sys.exit(1)

# Workflow rename mapping
MAPPING = {
    "build.yml": "reusable-build-webapp.yml",
    "cypress-test.yml": "reusable-test-cypress.yml",
    "identify-env.yml": "reusable-util-identify-env.yml",
    "build-and-deploy-all-workflow.yml": "auto-pr-build-deploy.yml",
    "deploy.yml": "auto-push-deploy-fleek.yml",
    "run-tests.yml": "manual-test-unit.yml",
    "merge-into-main.yml": "manual-release-merge-main.yml",
    "tag-version.yml": "manual-release-tag.yml",
    "deploy-environment.yml": "manual-deploy-environment.yml",
}

def color_text(text, color):
    """Add color to text for terminal output."""
    colors = {
        'red': '\033[0;31m',
        'green': '\033[0;32m',
        'yellow': '\033[1;33m',
        'reset': '\033[0m'
    }
    return f"{colors.get(color, '')}{text}{colors['reset']}"

def try_git_mv(repo, src, dst):
    """Try to use git mv to preserve history."""
    try:
        subprocess.check_call(["git", "-C", repo, "mv", src, dst], 
                            stderr=subprocess.DEVNULL)
        return True
    except subprocess.CalledProcessError:
        return False

def iter_yaml_files(workflows_dir):
    """Iterate over all YAML files in workflows directory."""
    for name in os.listdir(workflows_dir):
        if name.endswith((".yml", ".yaml")):
            yield os.path.join(workflows_dir, name)

def update_uses_with_ruamel(path, replacements, dry_run):
    """Update workflow references using ruamel.yaml to preserve formatting."""
    try:
        from ruamel.yaml import YAML
    except ImportError:
        return False  # Fall back to text replacement
    
    yaml = YAML()
    yaml.preserve_quotes = True
    yaml.width = 4096  # Prevent line wrapping
    
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.load(f)
    
    changed = False

    def walk(node):
        """Recursively walk YAML structure and update 'uses' fields."""
        nonlocal changed
        if isinstance(node, dict):
            # Update job-level reusable workflows: jobs.*.uses
            if "uses" in node and isinstance(node["uses"], str):
                val = node["uses"]
                for old, new in replacements.items():
                    # Handle both ./.github and .github prefixes
                    for prefix in ["./.github/workflows/", ".github/workflows/"]:
                        old_ref = f"{prefix}{old}"
                        new_ref = f"{prefix}{new}"
                        if old_ref in val:
                            node["uses"] = val.replace(old_ref, new_ref)
                            changed = True
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(data)
    
    if changed and not dry_run:
        with open(path, "w", encoding="utf-8") as f:
            yaml.dump(data, f)
    
    return changed

def text_replace_uses(path, replacements, dry_run):
    """Fallback text-based replacement for workflow references."""
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        old_ref = f"./.github/workflows/{old}"
        new_ref = f"./.github/workflows/{new}"
        new_content = new_content.replace(old_ref, new_ref)
    
    if new_content != content:
        if not dry_run:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
        return True
    
    return False

def yaml_validate(path):
    """Validate YAML syntax."""
    try:
        # Try ruamel.yaml first
        from ruamel.yaml import YAML
        yaml = YAML()
        with open(path, "r", encoding="utf-8") as f:
            yaml.load(f)
        return True
    except ImportError:
        try:
            # Fall back to PyYAML
            import yaml as pyyaml
            with open(path, "r", encoding="utf-8") as f:
                pyyaml.safe_load(f)
            return True
        except ImportError:
            # No YAML parser available
            return None
        except Exception:
            return False
    except Exception:
        return False

def check_residual_references(root, sources):
    """Check for any remaining references to old workflow names."""
    residual = []
    for old in sources:
        pattern = old
        try:
            # Search only in .github/workflows
            result = subprocess.run(
                ["git", "-C", root, "grep", "-n", pattern, "--", ".github/workflows"],
                capture_output=True, text=True
            )
            if result.stdout.strip():
                residual.append((old, result.stdout.strip()))
        except subprocess.CalledProcessError:
            pass
    return residual

def main():
    parser = argparse.ArgumentParser(
        description="Safe CI workflow rename and reference update"
    )
    parser.add_argument(
        "--apply", 
        action="store_true", 
        help="Apply changes (default: dry-run)"
    )
    parser.add_argument(
        "--workflows-dir", 
        default=None, 
        help="Override workflows directory"
    )
    args = parser.parse_args()

    # Setup paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root = repo_root(script_dir)
    workflows = args.workflows_dir or os.path.join(root, ".github", "workflows")
    dry_run = not args.apply

    # Print header
    print(color_text("=== CI Workflow Safe Rename Script ===", "yellow"))
    print(f"Repository root: {root}")
    print(f"Workflows dir:   {workflows}")
    print(f"Mode:           {color_text('DRY-RUN', 'yellow') if dry_run else color_text('APPLY', 'green')}")
    print()

    # Phase 1: Pre-flight checks
    print(color_text("Phase 1: Pre-flight checks", "yellow"))
    sources = list(MAPPING.keys())
    missing_count = 0
    
    for src in sources:
        src_path = os.path.join(workflows, src)
        dst = MAPPING[src]
        dst_path = os.path.join(workflows, dst)
        
        if os.path.exists(src_path):
            print(f"  {color_text('✓', 'green')} Found: {src}")
            if os.path.exists(dst_path):
                print(f"  {color_text('!', 'yellow')} Target exists (will skip): {dst}")
        else:
            print(f"  {color_text('!', 'yellow')} Missing (optional): {src}")
            missing_count += 1
    
    if missing_count == len(sources):
        print(color_text("  ✗ No source files found. Already renamed?", "red"))
        sys.exit(1)
    print()

    # Phase 2: Rename files
    print(color_text("Phase 2: Rename files", "yellow"))
    renamed_count = 0
    
    for src, dst in MAPPING.items():
        src_rel = os.path.join(".github", "workflows", src)
        dst_rel = os.path.join(".github", "workflows", dst)
        src_path = os.path.join(workflows, src)
        dst_path = os.path.join(workflows, dst)
        
        if not os.path.exists(src_path) or os.path.exists(dst_path):
            continue
        
        if dry_run:
            print(f"  {color_text('[DRY]', 'yellow')} {src} → {dst}")
        else:
            if try_git_mv(root, src_rel, dst_rel):
                print(f"  {color_text('✓', 'green')} Renamed: {src} → {dst}")
            else:
                # Fallback to regular move
                os.makedirs(os.path.dirname(dst_path), exist_ok=True)
                shutil.move(src_path, dst_path)
                print(f"  {color_text('✓', 'green')} Moved: {src} → {dst}")
        renamed_count += 1
    
    if renamed_count == 0:
        print(f"  {color_text('!', 'yellow')} No files to rename")
    print()

    # Phase 3: Update references
    print(color_text("Phase 3: Update workflow references", "yellow"))
    updated_count = 0
    
    for yf in iter_yaml_files(workflows):
        # Try ruamel.yaml first to preserve comments
        changed = update_uses_with_ruamel(yf, MAPPING, dry_run)
        if not changed:
            # Fallback to text replacement
            changed = text_replace_uses(yf, MAPPING, dry_run)
        
        if changed:
            rel_path = os.path.relpath(yf, root)
            if dry_run:
                print(f"  {color_text('[DRY]', 'yellow')} Would update: {rel_path}")
            else:
                print(f"  {color_text('✓', 'green')} Updated: {rel_path}")
            updated_count += 1
    
    if updated_count == 0:
        print(f"  {color_text('!', 'yellow')} No references to update")
    print()

    # Phase 4: Check for residual references
    print(color_text("Phase 4: Check for residual references", "yellow"))
    residual = check_residual_references(root, sources)
    
    if residual:
        print(f"  {color_text('✗', 'red')} Found residual references:")
        for old, refs in residual:
            print(f"    {old}:")
            for line in refs.split('\n')[:3]:  # Show first 3 matches
                print(f"      {line}")
    else:
        print(f"  {color_text('✓', 'green')} No residual references found")
    print()

    # Phase 5: YAML validation
    print(color_text("Phase 5: YAML validation", "yellow"))
    invalid_count = 0
    skip_validation = False
    
    for yf in iter_yaml_files(workflows):
        result = yaml_validate(yf)
        rel_path = os.path.relpath(yf, root)
        
        if result is None:
            print(f"  {color_text('!', 'yellow')} No YAML parser available, skipping validation")
            skip_validation = True
            break
        elif result:
            print(f"  {color_text('✓', 'green')} Valid: {rel_path}")
        else:
            print(f"  {color_text('✗', 'red')} Invalid: {rel_path}")
            invalid_count += 1
    print()

    # Summary
    print(color_text("=== Summary ===", "yellow"))
    print(f"Mode:             {color_text('DRY-RUN', 'yellow') if dry_run else color_text('APPLY', 'green')}")
    print(f"Files renamed:    {renamed_count}")
    print(f"Files updated:    {updated_count}")
    print(f"Residual refs:    {len(residual)}")
    if not skip_validation:
        print(f"Invalid YAMLs:    {invalid_count}")
    
    if not dry_run:
        if len(residual) == 0 and invalid_count == 0:
            print(color_text("✓ Ready to commit!", "green"))
            print()
            print("Next steps:")
            print("1. Test manual workflows:  gh workflow run manual-test-unit.yml")
            print("2. Create test PR for PR workflows")
            print("3. Push to ci-verify/* branch for push workflows")
        else:
            print(color_text("✗ Issues found. Review output above.", "red"))
    else:
        print()
        print("To apply changes, run:")
        print(f"  python {os.path.basename(__file__)} --apply")
    
    print()
    
    # Show git status if changes were applied
    if not dry_run and (renamed_count > 0 or updated_count > 0):
        print(color_text("Git status:", "yellow"))
        subprocess.run(["git", "-C", root, "status", "--short"])

if __name__ == "__main__":
    main()