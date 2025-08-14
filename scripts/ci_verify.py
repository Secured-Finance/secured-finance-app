#!/usr/bin/env python3
"""
CI Verification Script - Test renamed workflows systematically.
Ensures all workflows function correctly after renaming.
"""

import subprocess
import time
import json
from datetime import datetime

# ANSI color codes
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'  # No Color

class WorkflowTester:
    """Test renamed CI workflows systematically."""
    
    def __init__(self, branch="issue-005-ci-refactor"):
        self.branch = branch
        self.results = {}
        
    def run_command(self, cmd, capture=True):
        """Execute shell command and return result."""
        print(f"{BLUE}  Running: {cmd}{NC}")
        if capture:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            return result.returncode == 0, result.stdout, result.stderr
        else:
            result = subprocess.run(cmd, shell=True)
            return result.returncode == 0, "", ""
    
    def test_manual_workflow(self, workflow_name):
        """Test a manual workflow using gh CLI."""
        print(f"\n{YELLOW}Testing manual workflow: {workflow_name}{NC}")
        
        # Run the workflow
        cmd = f"gh workflow run {workflow_name} --ref {self.branch}"
        success, _, _ = self.run_command(cmd)
        
        if not success:
            print(f"{RED}  ✗ Failed to trigger workflow{NC}")
            return False
        
        # Wait for workflow to start
        print(f"  Waiting for workflow to start...")
        time.sleep(5)
        
        # Check status
        cmd = f"gh run list --workflow={workflow_name} --limit=1 --json status,conclusion,name"
        success, stdout, _ = self.run_command(cmd)
        
        if success and stdout:
            try:
                data = json.loads(stdout)
                if data:
                    run = data[0]
                    status = run.get('status', 'unknown')
                    conclusion = run.get('conclusion', 'pending')
                    
                    if status == 'completed':
                        if conclusion == 'success':
                            print(f"{GREEN}  ✓ Workflow completed successfully{NC}")
                            return True
                        else:
                            print(f"{RED}  ✗ Workflow failed: {conclusion}{NC}")
                            return False
                    else:
                        print(f"{YELLOW}  ⏳ Workflow {status}... (check later){NC}")
                        return None  # Indeterminate
            except json.JSONDecodeError:
                pass
        
        print(f"{YELLOW}  ! Could not determine workflow status{NC}")
        return None
    
    def test_pr_workflow(self):
        """Test PR-triggered workflow with a dummy PR."""
        print(f"\n{YELLOW}Testing PR workflow with dummy PR{NC}")
        
        # Create test branch
        test_branch = f"ci-verify/pr-test-{int(time.time())}"
        print(f"  Creating test branch: {test_branch}")
        
        commands = [
            f"git checkout -b {test_branch}",
            f"echo '# CI Test {datetime.now()}' >> CI_TEST.md",
            "git add CI_TEST.md",
            "git commit -m 'Test CI rename - PR workflow'",
            f"git push -u origin {test_branch}"
        ]
        
        for cmd in commands:
            success, _, _ = self.run_command(cmd, capture=False)
            if not success:
                print(f"{RED}  ✗ Failed at: {cmd}{NC}")
                return False
        
        # Create PR
        pr_cmd = f"""gh pr create \
            --title "CI Test: Verify renamed workflows" \
            --body "Automated test for renamed CI workflows. Will be auto-closed." \
            --draft \
            --base v2"""
        
        success, stdout, _ = self.run_command(pr_cmd)
        if not success:
            print(f"{RED}  ✗ Failed to create PR{NC}")
            return False
        
        print(f"{GREEN}  ✓ PR created{NC}")
        
        # Wait for checks to start
        print("  Waiting for PR checks to start...")
        time.sleep(10)
        
        # Check PR status
        success, stdout, _ = self.run_command("gh pr checks")
        if success:
            print(f"{GREEN}  ✓ PR checks triggered{NC}")
            print(stdout)
            return True
        else:
            print(f"{YELLOW}  ! Could not verify PR checks{NC}")
            return None
    
    def cleanup_test_pr(self):
        """Close and delete test PR and branch."""
        print(f"\n{YELLOW}Cleaning up test PR{NC}")
        
        # Close PR
        self.run_command("gh pr close --delete-branch", capture=False)
        
        # Return to original branch
        self.run_command(f"git checkout {self.branch}", capture=False)
        
        print(f"{GREEN}  ✓ Cleanup complete{NC}")
    
    def run_all_tests(self):
        """Run all workflow tests in sequence."""
        print(f"{YELLOW}{'='*60}{NC}")
        print(f"{YELLOW}CI Workflow Verification - Branch: {self.branch}{NC}")
        print(f"{YELLOW}{'='*60}{NC}")
        
        # Test order (safest to most risky)
        tests = [
            ("Manual Smoke Test", lambda: self.test_manual_workflow("manual-ci-smoke.yml")),
            ("Manual Unit Tests", lambda: self.test_manual_workflow("manual-test-unit.yml")),
            ("PR Workflow", lambda: self.test_pr_workflow()),
        ]
        
        for test_name, test_func in tests:
            result = test_func()
            self.results[test_name] = result
            
            # Give user time to review
            if result is False:
                print(f"{RED}Test failed! Review before continuing.{NC}")
                input("Press Enter to continue...")
        
        # Cleanup
        if "PR Workflow" in self.results:
            self.cleanup_test_pr()
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary."""
        print(f"\n{YELLOW}{'='*60}{NC}")
        print(f"{YELLOW}Test Summary{NC}")
        print(f"{YELLOW}{'='*60}{NC}")
        
        for test_name, result in self.results.items():
            if result is True:
                status = f"{GREEN}✓ PASSED{NC}"
            elif result is False:
                status = f"{RED}✗ FAILED{NC}"
            else:
                status = f"{YELLOW}⏳ PENDING{NC}"
            
            print(f"{test_name:.<30} {status}")
        
        # Overall result
        failures = [k for k, v in self.results.items() if v is False]
        if failures:
            print(f"\n{RED}❌ Some tests failed: {', '.join(failures)}{NC}")
            print(f"{YELLOW}Review logs and fix issues before proceeding.{NC}")
        else:
            print(f"\n{GREEN}✅ All tests passed or pending!{NC}")
            print(f"{YELLOW}Monitor pending workflows in GitHub Actions.{NC}")
        
        print(f"\n{YELLOW}Next steps:{NC}")
        print("1. Monitor running workflows: gh run list")
        print("2. Review any failures: gh run view")
        print("3. If all pass, commit and create PR")
        print("4. After merge, monitor for 24 hours")

def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Verify renamed CI workflows")
    parser.add_argument("--branch", default="issue-005-ci-refactor", 
                       help="Branch to test on")
    parser.add_argument("--test", choices=["manual", "pr", "all"], 
                       default="all", help="Which tests to run")
    args = parser.parse_args()
    
    tester = WorkflowTester(branch=args.branch)
    
    if args.test == "manual":
        tester.test_manual_workflow("manual-ci-smoke.yml")
    elif args.test == "pr":
        result = tester.test_pr_workflow()
        if result is not False:
            tester.cleanup_test_pr()
    else:
        tester.run_all_tests()

if __name__ == "__main__":
    main()