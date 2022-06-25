"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasWarExpandedSuccessfully = exports.DeployWar = void 0;
const tl = require("azure-pipelines-task-lib/task");
const fs = require("fs");
const path = require("path");
const webClient_1 = require("azure-pipelines-tasks-azure-arm-rest-v2/webClient");
var msDeploy = require('azure-pipelines-tasks-webdeployment-common/deployusingmsdeploy.js');
function DeployWar(webPackage, taskParams, msDeployPublishingProfile, kuduService, appServiceUtility) {
    return __awaiter(this, void 0, void 0, function* () {
        // get list of files before deploying to the web app.
        yield appServiceUtility.pingApplication();
        var listOfFilesBeforeDeployment = yield kuduService.listDir('/site/wwwroot/webapps/');
        tl.debug("Listing file structure of webapps folder before deployment starts => " + JSON.stringify(listOfFilesBeforeDeployment));
        // Strip package path and only keep the package name.
        var warFileName = path.basename(webPackage).split('.war')[0];
        // Find if directory with same name as war file, existed before deployment
        var directoryWithSameNameBeforeDeployment;
        if (listOfFilesBeforeDeployment) {
            listOfFilesBeforeDeployment.some(item => {
                if (item.name == warFileName && item.mime == "inode/directory") {
                    directoryWithSameNameBeforeDeployment = item;
                    return true;
                }
                return false;
            });
        }
        var retryCount = 3;
        while (retryCount > 0) {
            yield msDeploy.DeployUsingMSDeploy(webPackage, taskParams.WebAppName, msDeployPublishingProfile, taskParams.RemoveAdditionalFilesFlag, taskParams.ExcludeFilesFromAppDataFlag, taskParams.TakeAppOfflineFlag, taskParams.VirtualApplication, taskParams.SetParametersFile, taskParams.AdditionalArguments, false, taskParams.UseWebDeploy);
            // verify if the war file has expanded
            // if not expanded, deploy using msdeploy once more, to make it work.
            var hasWarExpandedSuccessfully = yield HasWarExpandedSuccessfully(kuduService, directoryWithSameNameBeforeDeployment, warFileName, appServiceUtility);
            if (!hasWarExpandedSuccessfully) {
                console.log(tl.loc("WarDeploymentRetry"));
                // If the war file is exactly same, MSDeploy doesn't update the war file in webapp.
                // So by changing ModifiedTime, we ensure it will be updated.
                var currentTime = new Date(Date.now());
                var modifiedTime = new Date(Date.now());
                fs.utimesSync(webPackage, currentTime, modifiedTime);
            }
            else {
                break;
            }
            retryCount--;
        }
    });
}
exports.DeployWar = DeployWar;
function HasWarExpandedSuccessfully(kuduService, directoryWithSameNameBeforeDeployment, warFileName, appServiceUtility) {
    return __awaiter(this, void 0, void 0, function* () {
        // Waiting for war to expand
        yield webClient_1.sleepFor(10);
        // do a get call on the target web app.
        yield appServiceUtility.pingApplication();
        var filesAfterDeployment = yield kuduService.listDir('/site/wwwroot/webapps/');
        tl.debug("Listing file structure of webapps folder after deployment has completed => " + JSON.stringify(filesAfterDeployment));
        // Verify if the content of that war file has successfully expanded. This is can be concluded if
        // directory with same name as war file exists after deployment and if it existed before deployment, then the directory should contain content of new war file
        // which can be concluded if the modified time of the directory has changed. We have however observerd some minor milliseconds change in the modified time even when deployment is not successfull, only for the first time. Hence we are introducing a check that the time change should be more than 0.5 second or 500 milliseconds.
        return filesAfterDeployment.some(item => { return item.name == warFileName && item.mime == "inode/directory" && (!directoryWithSameNameBeforeDeployment || (item.mtime != directoryWithSameNameBeforeDeployment.mtime && (new Date(item.mtime).getTime() - new Date(directoryWithSameNameBeforeDeployment.mtime).getTime() > 500))); });
    });
}
exports.HasWarExpandedSuccessfully = HasWarExpandedSuccessfully;
