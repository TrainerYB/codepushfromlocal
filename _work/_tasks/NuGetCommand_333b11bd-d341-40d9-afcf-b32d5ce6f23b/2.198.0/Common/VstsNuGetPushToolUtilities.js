"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Placed as a separate file for the purpose of unit testing
const path = require("path");
const commandHelper = require("packaging-common/nuget/CommandHelper");
function getBundledVstsNuGetPushLocation() {
    const vstsNuGetPushPaths = ["VstsNuGetPush/0.19.0/tools"];
    const toolPath = commandHelper.locateTool("VstsNuGetPush", {
        root: path.dirname(__dirname),
        searchPath: vstsNuGetPushPaths,
        toolFilenames: ["VstsNuGetPush.exe"],
    });
    return toolPath;
}
exports.getBundledVstsNuGetPushLocation = getBundledVstsNuGetPushLocation;
