import { parseArgs } from "node:util";
import { $ } from "bun";

async function flyDeployPreview() {
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      name: {
        type: "string",
      },
    },
    strict: true,
    allowPositionals: true,
  });
  const appName = values.name;
  if (!appName) throw new Error("need --appName");

  const appsStr = await $`flyctl apps list -j`.quiet().text();
  const apps = JSON.parse(appsStr) as { Name: string }[];
  const alreadyExists = apps.some((it) => it.Name === appName);

  if (!alreadyExists) {
    await $`flyctl launch \\
          --config "$(pwd)/apps/api/fly.toml" \\
          --name=${appName} \\
          --no-deploy \\
          --ha=false \\
          --region=cdg \\
          --yes
        `;
  }

  // update secrets
  const INPUT_SECRETS = Bun.env.INPUT_SECRETS;
  if (!INPUT_SECRETS) throw new Error("need INPUT_SECRETS");

  const secrets = INPUT_SECRETS.replaceAll("\n", " ").split(" ");
  Bun.write(
    "secrets.txt",
    ["NODE_ENV=production", `PREVIEW_NAME=${appName}`, ...secrets].join("\n"),
  );
  await $`cat secrets.txt | flyctl secrets import --app ${appName}`;
  // build and deploy
  await $`flyctl deploy \\
        --app ${appName} \\
        --ha=false \\
        --remote-only \\
        --config "$(pwd)/apps/api/fly.toml" \\
        --dockerfile "$(pwd)/apps/api/Dockerfile"`;

  console.log(alreadyExists);
}

await flyDeployPreview();
