{
  "workflows": [
    {
      "name": "Start MediBridge",
      "command": "npm run dev",
      "restartOn": {
        "files": ["client/", "server/", "shared", "package.json"]
      }
    }
  ]
}