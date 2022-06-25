"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskLib = require("azure-pipelines-task-lib/task");
const semver = require("semver");
const path = require("path");
const peParser = require("packaging-common/pe-parser");
const telemetry = require("utility-common/telemetry");
const nuGetGetter = require("packaging-common/nuget/NuGetToolGetter");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let nugetVersion;
        let checkLatest;
        let nuGetPath;
        let msbuildSemVer;
        try {
            taskLib.setResourcePath(path.join(__dirname, "task.json"));
            let versionSpec = taskLib.getInput('versionSpec', false);
            if (!versionSpec) {
                msbuildSemVer = yield nuGetGetter.getMSBuildVersion();
                if (msbuildSemVer && semver.gte(msbuildSemVer, '16.8.0')) {
                    taskLib.debug('Defaulting to 5.8.0 for msbuild version: ' + msbuildSemVer);
                    versionSpec = '5.8.0';
                }
                else if (msbuildSemVer && semver.gte(msbuildSemVer, '16.5.0')) {
                    taskLib.debug('Defaulting to 4.8.2 for msbuild version: ' + msbuildSemVer);
                    versionSpec = '4.8.2';
                }
                else {
                    versionSpec = '4.3.0';
                }
            }
            checkLatest = taskLib.getBoolInput('checkLatest', false);
            nuGetPath = yield nuGetGetter.getNuGet(versionSpec, checkLatest, true);
            const nugetVersionInfo = yield peParser.getFileVersionInfoAsync(nuGetPath);
            if (nugetVersionInfo && nugetVersionInfo.fileVersion) {
                nugetVersion = nugetVersionInfo.fileVersion.toString();
            }
        }
        catch (error) {
            console.error('ERR:' + error.message);
            taskLib.setResult(taskLib.TaskResult.Failed, "");
        }
        finally {
            _logNugetToolInstallerStartupVariables(nugetVersion, checkLatest, nuGetPath, msbuildSemVer);
        }
    });
}
function _logNugetToolInstallerStartupVariables(nugetVersion, checkLatest, nuGetPath, msbuildSemVer) {
    try {
        const telem = {
            "NUGET_EXE_TOOL_PATH_ENV_VAR": taskLib.getVariable(nuGetGetter.NUGET_EXE_TOOL_PATH_ENV_VAR),
            "isCheckLatestEnabled": checkLatest,
            "requestedNuGetVersionSpec": taskLib.getInput('versionSpec', false),
            "nuGetPath": nuGetPath,
            "nugetVersion": nugetVersion,
            "msBuildVersion": msbuildSemVer && msbuildSemVer.toString()
        };
        telemetry.emitTelemetry("Packaging", "NuGetToolInstaller", telem);
    }
    catch (err) {
        taskLib.debug(`Unable to log NuGet Tool Installer task init telemetry. Err:(${err})`);
    }
}
run();
