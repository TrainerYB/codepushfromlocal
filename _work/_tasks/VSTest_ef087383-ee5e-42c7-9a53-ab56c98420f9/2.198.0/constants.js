"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AreaCodes;
(function (AreaCodes) {
    AreaCodes.PUBLISHRESULTS = 'PublishResults';
    AreaCodes.INVOKEVSTEST = 'InvokeVsTest';
    AreaCodes.RUNTESTSLOCALLY = 'RunTestsLocally';
    AreaCodes.INVALIDSETTINGSFILE = 'InvalidSettingsFile';
    AreaCodes.EXECUTEVSTEST = 'ExecuteVsTest';
    AreaCodes.GETVSTESTTESTSLISTINTERNAL = 'GetVsTestTestsListInternal';
    AreaCodes.UPDATERESPONSEFILE = 'UpdateResponseFile';
    AreaCodes.RESPONSECONTAINSNOTESTS = 'ResponseContainsNoTests';
    AreaCodes.GENERATERESPONSEFILE = 'GenerateResponseFile';
    AreaCodes.GETVSTESTTESTSLIST = 'GetVsTestTestsList';
    AreaCodes.TIACONFIG = 'TiaConfig';
    AreaCodes.TESTRUNUPDATIONFAILED = 'TestRunUpdationFailed';
    AreaCodes.UPLOADTESTRESULTS = 'UploadTestResults';
    AreaCodes.RUNVSTEST = 'RunVsTest';
    AreaCodes.SPECIFIEDVSVERSIONNOTFOUND = 'SpecifiedVsVersionNotFound';
    AreaCodes.TOOLSINSTALLERCACHENOTFOUND = 'ToolsInstallerCacheNotFound';
})(AreaCodes = exports.AreaCodes || (exports.AreaCodes = {}));
var ResultMessages;
(function (ResultMessages) {
    ResultMessages.UPLOADTESTRESULTSRETURNED = 'uploadTestResults returned ';
    ResultMessages.EXECUTEVSTESTRETURNED = 'executeVstest returned ';
    ResultMessages.TESTRUNUPDATIONFAILED = 'testRunupdation failed';
})(ResultMessages = exports.ResultMessages || (exports.ResultMessages = {}));
var VsTestToolsInstaller;
(function (VsTestToolsInstaller) {
    VsTestToolsInstaller.PathToVsTestToolVariable = 'VsTestToolsInstallerInstalledToolLocation';
})(VsTestToolsInstaller = exports.VsTestToolsInstaller || (exports.VsTestToolsInstaller = {}));
var DistributionTypes;
(function (DistributionTypes) {
    DistributionTypes.EXECUTIONTIMEBASED = 'TestExecutionTimes';
    DistributionTypes.ASSEMBLYBASED = 'TestAssemblies';
    DistributionTypes.NUMBEROFTESTMETHODSBASED = 'numberoftestmethods';
})(DistributionTypes = exports.DistributionTypes || (exports.DistributionTypes = {}));
var ServerTypes;
(function (ServerTypes) {
    ServerTypes.HOSTED = 'hosted';
})(ServerTypes = exports.ServerTypes || (exports.ServerTypes = {}));
var ActionOnThresholdNotMet;
(function (ActionOnThresholdNotMet) {
    ActionOnThresholdNotMet.DONOTHING = 'donothing';
})(ActionOnThresholdNotMet = exports.ActionOnThresholdNotMet || (exports.ActionOnThresholdNotMet = {}));
var BackDoorVariables;
(function (BackDoorVariables) {
    BackDoorVariables.FORCE_HYDRA = 'Force_Hydra';
})(BackDoorVariables = exports.BackDoorVariables || (exports.BackDoorVariables = {}));
var AgentVariables;
(function (AgentVariables) {
    AgentVariables.AGENT_TEMPDIRECTORY = 'Agent.TempDirectory';
})(AgentVariables = exports.AgentVariables || (exports.AgentVariables = {}));
