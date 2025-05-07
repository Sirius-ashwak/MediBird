{
  "workflows": [
    {
      "name": "Start MediBridge",
      "command": "bash ./start_app.sh",
      "restartOn": {
        "files": ["client/", "server/", "shared", "package.json"]
      }
    }
  ]
}