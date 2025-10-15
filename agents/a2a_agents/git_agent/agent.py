from autogen_agentchat.teams import MagenticOneGroupChat
import httpx
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent, UserProxyAgent
from dotenv import load_dotenv
import os
from git import Repo, GitCommandError
import requests

load_dotenv()

AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
AZURE_OPENAI_MODEL_NAME = os.getenv("AZURE_OPENAI_MODEL_NAME")
SSL_CERT_FILE = os.getenv("SSL_CERT_FILE")

httpx_client = httpx.AsyncClient(verify=False)

model_client = AzureOpenAIChatCompletionClient(
azure_deployment=AZURE_OPENAI_DEPLOYMENT_NAME,
model=AZURE_OPENAI_MODEL_NAME,
api_version=AZURE_OPENAI_API_VERSION,
azure_endpoint=AZURE_OPENAI_ENDPOINT,
api_key=AZURE_OPENAI_API_KEY,
httpx=httpx_client
)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

class GitManager:
    def __init__(self):
        self.github_token = GITHUB_TOKEN
        self.api_base = "https://api.github.com"

    def clone_repo(self, repo_url: str):
        """Clone a GitHub repository to a local path
        args:
            repo_url: Repository URL
        """
        clone_path = repo_url.split('github.com/')[-1].replace(".git","")
        if os.path.exists(clone_path):
            return("Repository already cloned.")
        try:
            Repo.clone_from(repo_url, clone_path)

            return(f"Repository cloned to {clone_path} successfully!")
        except GitCommandError as e:
            return(f"Error cloning repository: {e}")
        
    def create_branch(self, branch_name: str, repo_url: str, base_branch: str = "master"):
        """Create and checkout a new branch from base_branch
        Args:
            repo_url: Repository URL.
            branch_name: Name of the branch.
            base_branch: Base branch name (master/main).
        """
        repo=None
        clone_path = repo_url.split('github.com/')[-1].replace(".git","")
        if os.path.exists(clone_path):
            repo = Repo(clone_path)
        else:
            return("Repository not cloned. Clone it first.")
        
        git = repo.git
        try:
            git.checkout(base_branch)
            new_branch = repo.create_head(branch_name)
            new_branch.checkout()
            return(f"Created and switched to branch: {branch_name}")
        except GitCommandError as e:
            return(f"Error creating branch: {e}")
        
    def get_status(self,repo_url:str):
        """
        Show the status of the repository.
        Args:
            repo_url: Repository URL
        Returns:
            A dictionary with staged, unstaged, and untracked files.
        """
        repo=None
        clone_path = repo_url.split('github.com/')[-1].replace(".git","")
        if os.path.exists(clone_path):
            repo = Repo(clone_path)
        else:
            return "Repository not cloned. Clone it first."

        try:
            status = {
                "branch": repo.active_branch.name,
                "staged": [item.a_path for item in repo.index.diff("HEAD")],
                "unstaged": [item.a_path for item in repo.index.diff(None)],
                "untracked": repo.untracked_files,
                "is_dirty": repo.is_dirty()
            }
            return status
        except Exception as e:
            return f"Error getting status: {e}"

    def list_branches(self, repo_url: str , include_remote: bool = True):
        """
        List all branches in the repository.
        Args:
            include_remote: If False, excludes remote branches.
        Returns:
            A dictionary with local and/or remote branches.
        """
        repo=None
        clone_path = repo_url.split('github.com/')[-1].replace(".git","")
        if os.path.exists(clone_path):
            repo =Repo(clone_path)
        else:
            return "Repository not cloned. Clone it first."

        try:
            branches = {"local": [head.name for head in repo.heads]}
            if include_remote:
                branches["remote"] = [ref.name for ref in repo.remotes.origin.refs]
            return branches
        except Exception as e:
            return f"Error listing branches: {e}"

    def switch_branch(self, branch_name: str,repo_url: str):
        """
        Switch to an existing branch.
        Args:
            branch_name: Name of the branch to switch to.
            repo_url: Repository URL
        """

        repo=None
        clone_path = repo_url.split('github.com/')[-1].replace(".git","")
        if os.path.exists(clone_path):
            repo =Repo(clone_path)
        else:
            return "Repository not cloned. Clone it first."

        try:
            # Check if branch exists locally
            if branch_name in repo.heads:
                repo.git.checkout(branch_name)
                return f"Switched to branch: {branch_name}"
            else:
                # Try fetching from remote if it doesn’t exist locally
                origin = repo.remote(name="origin")
                origin.fetch(branch_name)

                repo.git.checkout(branch_name)
                return f"Switched to branch (fetched from remote): {branch_name}"
        except GitCommandError as e:
            return f"Error switching branch: {e}"
        
    def commit_changes(self, commit_message: str, repo_url: str, files: list = None):
        """
        Commit changes with commit_message.
        Args:
            repo_url: Repository URL
            commit_message: Commit message string
            files: List of file paths to add. If None, stages all changes.
        """
        repo=None
        clone_path = repo_url.split('github.com/')[-1].replace(".git","")
        if os.path.exists(clone_path):
            repo = Repo(clone_path)
        else:
            return("Repository not loaded. Clone it first.")

        try:
            if files:
                repo.index.add(files)
            else:
                repo.git.add(A=True)  # stage all changes

            if repo.is_dirty(index=True, working_tree=True, untracked_files=True):
                repo.index.commit(commit_message)
                return(f"Committed changes with message: '{commit_message}'")
            else:
                return("No changes to commit.")
        except GitCommandError as e:
            return(f"Error committing changes: {e}")
        
    def push_changes(self, repo_url: str, branch_name: str = None):
        """
        Push changes to the remote repository.
        Args:
            repo_url: Repository URL
            branch_name: Name of the branch to push. If None, pushes current branch.
        """
        repo = None
        clone_path = repo_url.split('github.com/')[-1].replace(".git", "")
        if os.path.exists(clone_path):
            repo = Repo(clone_path)
        else:
            return "Repository not cloned. Clone it first."

        try:
            branch_name = branch_name or repo.active_branch.name

            # Prepare remote with token authentication
            repo_url_clean = repo_url.replace("https://", "")
            origin = repo.remote(name="origin")
            remote_url = f"https://{self.github_token}@{repo_url_clean}"

            with repo.remotes.origin.config_writer as cw:
                cw.set("url", remote_url)

            push_info = origin.push(branch_name)

            # Check push result
            if push_info and push_info[0].flags & push_info[0].ERROR:
                # Special handling for permission errors
                if "403" in push_info[0].summary or "permission" in push_info[0].summary.lower():
                    return "Push failed: current user does not have permission to push to this repository."
                return f"Push failed: {push_info[0].summary}"

            return f"Changes pushed to origin/{branch_name}"

        except GitCommandError as e:
            # Handle explicit 403 error from GitHub
            if "403" in str(e) or "permission" in str(e).lower():
                return "Error: current user does not have push permission for this repository."
            return f"Error pushing changes: {e}"

    def pull_changes(self, repo_url:str, branch_name: str = None):
        """
        Pull the latest changes from the remote repository into the current branch.
        Args:
            repo_url: Repository URL
            branch_name: Name of the branch to pull. If None, uses the active branch.
        """
        repo=None
        clone_path = repo_url.split('github.com/')[-1].replace(".git","")
        if os.path.exists(clone_path):
            repo = Repo(clone_path)
        else:
            return "Repository not cloned. Clone it first."

        try:
            branch_name = branch_name or repo.active_branch.name
            repo_url = repo_url.replace("https://",'')
            origin = repo.remote(name="origin")
            remote_url = f"https://{self.github_token}@{repo_url}"
            with repo.remotes.origin.config_writer as cw:
                cw.set("url", remote_url)
            pull_info = origin.pull(branch_name)

            if pull_info and pull_info[0].flags & pull_info[0].ERROR:
                return f"Pull failed: {pull_info[0].summary}"

            return f"Pulled latest changes into {branch_name}"
        except GitCommandError as e:
            return f"Error pulling changes: {e}"

    def get_issue(self, repo_full_name: str, issue_number: int):
        """
        Fetch details of a specific GitHub issue or PR.
        Args:
            repo_full_name: e.g., 'username/repo'
            issue_number: issue or PR number
        Returns:
            A dict with issue details (title, body, state, url, etc.)
        """
        url = f"{self.api_base}/repos/{repo_full_name}/issues/{issue_number}"
        headers = {"Authorization": f"token {self.github_token}"}

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            issue_data = response.json()
            return {
                "number": issue_data["number"],
                "title": issue_data["title"],
                "state": issue_data["state"],
                "user": issue_data["user"]["login"],
                "body": issue_data.get("body", ""),
                "url": issue_data["html_url"]
            }
        else:
            return f"Failed to fetch issue: {response.status_code} - {response.text}"

    def issue_post_comment(self, repo_full_name: str, issue_number: int, comment: str) -> str:
        """
        Post a comment on an issue or PR using GitHub API
        Args:
            repo_full_name: e.g., 'username/repo'
            issue_number: issue or PR number
            comment: the comment to be posted
        """
        url = f"{self.api_base}/repos/{repo_full_name}/issues/{issue_number}/comments"
        headers = {"Authorization": f"token {self.github_token}"}
        data = {"body": comment}

        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 201:
            return(f"Comment posted: {response.json()['html_url']}")
        else:
            return(f"Failed to post comment: {response.status_code} - {response.text}")
        
    def create_pull_request(self, repo_full_name: str, head: str, base: str, title: str, body: str):
        """
        Create a GitHub pull request using.
        Args:
            repo_full_name: e.g., 'username/repo'
            head: branch name with changes (e.g., 'feature-branch')
            base: base branch to merge into (e.g., 'main')
        """
        url = f"{self.api_base}/repos/{repo_full_name}/pulls"
        headers = {"Authorization": f"token {self.github_token}"}
        data = {
            "title": title,
            "body": body,
            "head": head,
            "base": base
        }

        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 201:
            pr_url = response.json()['html_url']
            return(f"Pull request created: {pr_url}")
        else:
            return(f"Failed to create PR: {response.status_code} - {response.text}")
        
    def merge_branch(self, repo_url: str, source_branch: str, target_branch: str = None):
        """
        Merge source_branch into target_branch.
        Args:
            repo_url: Repository URL
            source_branch: Branch to merge from.
            target_branch: Branch to merge into (defaults to current branch).
        """
        repo=None
        clone_path = repo_url.split('github.com/')[-1].replace(".git","")
        if os.path.exists(clone_path):
            repo =Repo(clone_path)
        else:
            return "Repository not cloned. Clone it first."

        try:
            target_branch = target_branch or repo.active_branch.name
            git = repo.git

            # Checkout target branch first
            git.checkout(target_branch)
            git.merge(source_branch)

            return f"Branch '{source_branch}' merged into '{target_branch}' successfully."
        except GitCommandError as e:
            if "CONFLICT" in str(e):
                return f"Merge conflict occurred while merging '{source_branch}' into '{target_branch}'."
            return f"Error merging branches: {e}"

    def get_merge_conflicts(self,repo_url: str):
        """
        List files with merge conflicts.
        Args:
            repo_url: Repository URL
        Returns:
            A list of conflicted file paths.
        """
        repo=None
        clone_path = repo_url.split('github.com/')[-1].replace(".git","")
        if os.path.exists(clone_path):
            repo = Repo(clone_path)
        else:
            return "Repository not cloned. Clone it first."

        try:
            conflicts = []
            for path, blobs in repo.index.unmerged_blobs().items():
                conflicts.append(path)
            return conflicts if conflicts else "No merge conflicts. Proceed with merge branch"
        except Exception as e:
            return f"Error checking merge conflicts: {e}"




class GitMagenticAgent:
    def __init__(self):
        self.git_manager = GitManager()
        self.tools = [self.git_manager.clone_repo, self.git_manager.issue_post_comment, self.git_manager.create_branch,self.git_manager.list_branches, self.git_manager.commit_changes, self.git_manager.push_changes, self.git_manager.switch_branch, self.git_manager.pull_changes, self.git_manager.create_pull_request, self.git_manager.get_status, self.git_manager.get_issue, self.git_manager.get_merge_conflicts, self.git_manager.merge_branch]
        self.git_assistant = AssistantAgent(
                            "GitAssistant",
                            model_client=model_client,
                            tools=self.tools,  # Register the tool.
                            system_message="You are a helpful AI assistant agent, capable of completing specified git related operations with provided tools.",
                            )

        self.team = MagenticOneGroupChat([self.git_assistant], model_client=model_client, max_stalls=2, description="Only perform requested task.")
