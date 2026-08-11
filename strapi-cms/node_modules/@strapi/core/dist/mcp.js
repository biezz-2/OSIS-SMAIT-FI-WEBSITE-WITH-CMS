'use strict';

var toolRegistry = require('./services/mcp/tool-registry.js');
var resourceRegistry = require('./services/mcp/resource-registry.js');
var promptRegistry = require('./services/mcp/prompt-registry.js');



exports.defineTool = toolRegistry.makeMcpToolDefinition;
exports.defineResource = resourceRegistry.makeMcpResourceDefinition;
exports.definePrompt = promptRegistry.makeMcpPromptDefinition;
//# sourceMappingURL=mcp.js.map
