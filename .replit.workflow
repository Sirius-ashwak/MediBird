{
  "workflows": [
    {
      "name": "Start application",
      "command": "bash ./start.sh",
      "restartOn": {
        "files": ["client/", "server/", "shared", "package.json"]
      }
    }
  ]
}