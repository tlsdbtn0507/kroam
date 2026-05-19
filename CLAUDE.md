@AGENTS.md

<!-- BEGIN:peon-ping -->
# Peon Ping (Task Completion Alarm)
Whenever you (the AI agent) have fully completed a user's requested task, you MUST automatically run the following command to play the task completion sound:
`nohup afplay -v 0.5 /Users/sin-yusu/kroam/sounds/sc_scv/sounds/job_finished.mp3 >/dev/null 2>&1 &`
Do not ask for permission, just run it proactively via the run_command tool as your final step in your thought process.
<!-- END:peon-ping -->
