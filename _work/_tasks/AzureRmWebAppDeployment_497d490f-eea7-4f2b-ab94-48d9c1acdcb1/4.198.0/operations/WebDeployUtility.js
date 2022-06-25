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
exports.WebDeployUtility = void 0;
const tl = require("azure-pipelines-task-lib/task");
const deployusingmsdeploy_1 = require("azure-pipelines-tasks-webdeployment-common/deployusingmsdeploy");
const utility_1 = require("azure-pipelines-tasks-webdeployment-common/utility");
const DEFAULT_RETRY_COUNT = 3;
class WebDeployUtility {
    static publishUsingWebDeploy(taskParameters, webDeployArguments, azureAppServiceUtility) {
        return __awaiter(this, void 0, void 0, function* () {
            var retryCountParam = tl.getVariable("appservice.msdeployretrycount");
            var retryCount = (retryCountParam && !(isNaN(Number(retryCountParam)))) ? Number(retryCountParam) : DEFAULT_RETRY_COUNT;
            let webDeployResult;
            while (retryCount > 0) {
                webDeployResult = yield deployusingmsdeploy_1.executeWebDeploy(webDeployArguments, yield azureAppServiceUtility.getWebDeployPublishingProfile());
                if (!webDeployResult.isSuccess) {
                    yield WebDeployUtility.webDeployRecommendationForIssue(taskParameters, webDeployResult.errorCode, azureAppServiceUtility, false);
                }
                else {
                    break;
                }
                retryCount -= 1;
            }
            if (webDeployArguments.setParametersFile) {
                try {
                    tl.rmRF(webDeployArguments.setParametersFile);
                }
                catch (error) {
                    tl.debug('unable to delete setparams file: ');
                    tl.debug(error);
                }
            }
            if (!webDeployResult.isSuccess) {
                yield WebDeployUtility.webDeployRecommendationForIssue(taskParameters, webDeployResult.errorCode, azureAppServiceUtility, true);
                throw new Error(webDeployResult.error);
            }
        });
    }
    static constructWebDeployArguments(taskParameters, publishProfile) {
        let webDeployArguments = {};
        webDeployArguments.package = taskParameters.Package;
        webDeployArguments.additionalArguments = taskParameters.AdditionalArguments;
        webDeployArguments.appName = taskParameters.WebAppName;
        webDeployArguments.excludeFilesFromAppDataFlag = taskParameters.ExcludeFilesFromAppDataFlag;
        webDeployArguments.publishUrl = publishProfile.publishUrl;
        webDeployArguments.password = publishProfile.userPWD;
        webDeployArguments.removeAdditionalFilesFlag = taskParameters.RemoveAdditionalFilesFlag;
        let setParametersFile = utility_1.copySetParamFileIfItExists(taskParameters.SetParametersFile);
        if (setParametersFile) {
            webDeployArguments.setParametersFile = setParametersFile.slice(setParametersFile.lastIndexOf('\\') + 1, setParametersFile.length);
        }
        webDeployArguments.takeAppOfflineFlag = taskParameters.TakeAppOfflineFlag;
        webDeployArguments.userName = publishProfile.userName;
        webDeployArguments.useWebDeploy = taskParameters.UseWebDeploy;
        webDeployArguments.virtualApplication = taskParameters.VirtualApplication;
        return webDeployArguments;
    }
    static webDeployRecommendationForIssue(taskParameters, errorCode, azureAppServiceUtility, isRecommendation) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (errorCode) {
                case 'ERROR_CONNECTION_TERMINATED': {
                    if (!isRecommendation) {
                        yield azureAppServiceUtility.pingApplication();
                    }
                    break;
                }
                case 'ERROR_INSUFFICIENT_ACCESS_TO_SITE_FOLDER': {
                    tl.warning(tl.loc("Trytodeploywebappagainwithappofflineoptionselected"));
                    break;
                }
                case 'WebJobsInProgressIssue': {
                    tl.warning(tl.loc('WebJobsInProgressIssue'));
                    break;
                }
                case 'FILE_IN_USE': {
                    if (!isRecommendation && taskParameters.RenameFilesFlag) {
                        yield azureAppServiceUtility.enableRenameLockedFiles();
                    }
                    else {
                        tl.warning(tl.loc("Trytodeploywebappagainwithrenamefileoptionselected"));
                        tl.warning(tl.loc("RunFromZipPreventsFileInUseError"));
                    }
                    break;
                }
                case 'transport connection': {
                    tl.warning(tl.loc("Updatemachinetoenablesecuretlsprotocol"));
                    break;
                }
                case 'ERROR_CERTIFICATE_VALIDATION_FAILED': {
                    if (isRecommendation) {
                        tl.warning(tl.loc('ASE_WebDeploySSLIssueRecommendation'));
                    }
                    break;
                }
                default:
                    break;
            }
        });
    }
}
exports.WebDeployUtility = WebDeployUtility;
