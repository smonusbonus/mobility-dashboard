const packageData = require("./package.json");
const github = require("octonode");
const fs = require("mz/fs");
const exec = require("mz/child_process").exec;
const download = require("download");

const version = packageData.version;
const fileName = `mobility-dashboard-${version}-armv7l.AppImage`;
// get IP by executing: ping raspberrypi.local
// TODO: automate this
const dashboardAddress = "192.168.0.14";

const ghClient = github.client(process.env.GITHUB_ACCESS_TOKEN);

ghClient
  .repo("smonusbonus/mobility-dashboard")
  .releases((err, status, body, headers) => {
    const latestRelease = status[0];
    const appImageAsset = latestRelease.assets.find(asset =>
      asset.name.includes(".AppImage")
    );
    download(appImageAsset.browser_download_url)
      .then(data => {
        return fs.writeFile(fileName, data);
      })
      .then(() => {
        console.log(`Successfully downloaded ${fileName}`);
        return exec(
          `sshpass -p ${
            process.env.RASPBERRY_PI_PASSWORD
          } scp ${fileName} pi@${dashboardAddress}`
        );
      })
      .then(() => {
        // make file executable
        console.log("Moved file to Raspberry, make executable");
        return exec(
          `sshpass -p ${
            process.env.RASPBERRY_PI_PASSWORD
          } ssh pi@${dashboardAddress} chmod a+x ${fileName}`
        );

      })
      .then(stdout => {
        console.log(stdout);
      })
      .catch(err => {
        console.error(err);
      });
  });
