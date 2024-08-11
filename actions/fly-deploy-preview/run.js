#!/usr/bin/env zx

(async () => {
  const appName = argv.appName;
  if (!appName) throw new Error("need --appName");

  const appsStr = await $`flyctl apps list -j`.quiet();
  const apps = JSON.parse(appsStr);
  const alreadyExists = apps.some((it) => it.Name === appName);

  if (!alreadyExists) {
    await $`flyctl launch \\
        --copy-config \\
        --config "$(pwd)/api/fly.toml" \\
        --name=${appName} \\
        --no-deploy \\
        --ha=false \\
        --region=cdg \\
        --yes
      `;
  }

  // update secrets
  const secrets = process.env.INPUT_SECRETS.replaceAll("\n", " ").split(" ");
  fs.writeFileSync(
    "secrets.txt",
    ["NODE_ENV=production", `PREVIEW_NAME=${appName}`, ...secrets].join("\n"),
  );
  await $`cat secrets.txt | flyctl secrets import --app ${appName}`;
  // build and deploy
  await $`flyctl deploy \\
      --app ${appName} \\
      --ha=false \\
      --remote-only \\
      --region=cdg
      --config "$(pwd)/api/fly.toml" \\
      --dockerfile "$(pwd)/api/Dockerfile"`;

  console.log(alreadyExists);
})();
