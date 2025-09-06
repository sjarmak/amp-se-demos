# AMP_TOOLBOX

Example tools to register in Amp sessions.

Register via toolbox.config.json or your session config. Example JSON:

{
  "tools": [
    {"name": "http_request", "command": "python AMP_TOOLBOX/tools/http_request_tool.py"},
    {"name": "git_ops", "command": "bash AMP_TOOLBOX/tools/git_ops_tool.sh"},
    {"name": "psql_migrate", "command": "python AMP_TOOLBOX/tools/psql_migrate_tool.py"},
    {"name": "screenshot", "command": "python AMP_TOOLBOX/tools/screenshot_tool.py"},
    {"name": "search_in_repo", "command": "python AMP_TOOLBOX/tools/search_in_repo_tool.py"}
  ]
}

Usage examples are embedded in each tool. Ensure Python 3.11 and required libs are installed.
