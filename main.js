// Importing necessary modules from langchain and composio-core packages
import dotenv from 'dotenv';
dotenv.config();

import { ChatGroq } from "@langchain/groq";
import { LangchainToolSet } from "composio-core";


// Creating an instance of ChatGroq with specific model and temperature settings
const llm = new ChatGroq({
  model: "llama-3.1-8b-instant", // Valid Groq model
  temperature: 0,
});

console.log(`[LLM Model]`, llm.modelName);

// Check for required environment variables
if (!process.env.COMPOSIO_API_KEY) {
  console.error('❌ COMPOSIO_API_KEY not found in environment variables');
  process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY not found in environment variables');  
  process.exit(1);
}

// GitHub integration ID is optional - will use default if not provided
if (process.env.COMPOSIO_GITHUB_ID) {
  console.log('✅ Using custom GitHub integration ID');
} else {
  console.log('ℹ️ Using default GitHub integration ID');
}

console.log('✅ Environment variables found');

// Initialize the LangchainToolSet with the API key from environment variables
const toolset = new LangchainToolSet({ 
  apiKey: process.env.COMPOSIO_API_KEY,
  baseUrl: "https://backend.composio.dev"
});

// Check if we need to set up GitHub connection
console.log('🔍 Checking GitHub connection status...');
try {
  const integration = await toolset.integrations.get({
    integrationId: process.env.COMPOSIO_GITHUB_ID || '2a22d508-3566-44ab-a526-6b83b0619034'
  });
  
  console.log('GitHub integration found:', integration.name);
  console.log('Connections:', integration.connections?.length || 0);
  
  // If no connections, initiate the connection process
  if (!integration.connections || integration.connections.length === 0) {
    console.log('🔗 No GitHub connection found. Initiating connection...');
    
    const expectedInputFields = await toolset.integrations.getRequiredParams(integration.id);
    console.log('Required auth fields:', expectedInputFields);
    
    const connectedAccount = await toolset.connectedAccounts.initiate({
      integrationId: integration.id,
      entityId: 'default',
    });
    
    console.log('🌐 Please visit this URL to connect your GitHub account:');
    console.log(connectedAccount.redirectUrl);
    console.log('\nAfter connecting, restart the application.');
    process.exit(0);
  } else {
    console.log('✅ GitHub connection exists');
  }
} catch (error) {
  console.error('❌ Error checking GitHub integration:', error.message);
}

// Fetch tools configured for GitHub applications
console.log('🔄 Fetching GitHub tools from Composio...');
let tools;
try {
  tools = await toolset.getTools({ apps: ["github"] });
  console.log(`✅ Retrieved ${tools.length} GitHub tools`);
} catch (error) {
  console.error('❌ Error fetching tools:', error.message);
  throw error;
}

console.log('🔧 Direct tool execution (no ReAct needed)...');

try {
  // Find the specific GitHub tool we want to use
  const getRepoTool = tools.find(tool => tool.name === 'GITHUB_GET_A_REPOSITORY');
  
  if (!getRepoTool) {
    console.error('❌ GITHUB_GET_A_REPOSITORY tool not found');
    console.log('Available tools:', tools.map(t => t.name));
    process.exit(1);
  }
  
  console.log('✅ Found GITHUB_GET_A_REPOSITORY tool');
  
  // Call the tool directly
  const toolInput = {
    owner: "janzheng",
    repo: "groq-jigsawstack-template"
  };
  
  console.log('🔄 Calling GitHub API with:', toolInput);
  
  const result = await getRepoTool.invoke(toolInput);
  
  console.log('\n🎉 Repository Details:');
  const repoData = JSON.parse(result);
  if (repoData.data) {
    console.log(`📦 Name: ${repoData.data.name}`);
    console.log(`👤 Owner: ${repoData.data.owner.login}`);
    console.log(`📝 Description: ${repoData.data.description || 'No description'}`);
    console.log(`🌟 Stars: ${repoData.data.stargazers_count}`);
    console.log(`🍴 Forks: ${repoData.data.forks_count}`);
    console.log(`📅 Created: ${repoData.data.created_at}`);
    console.log(`🔗 URL: ${repoData.data.html_url}`);
  }
  
  // Now let's get the README to let the LLM decide if we should star it
  console.log('\n📖 Getting repository README...');
  
  const getContentTool = tools.find(tool => tool.name === 'GITHUB_GET_REPOSITORY_CONTENT');
  
  if (!getContentTool) {
    console.error('❌ GITHUB_GET_REPOSITORY_CONTENT tool not found');
    console.log('🔍 Looking for content-related tools...');
    const contentTools = tools.filter(tool => tool.name.toLowerCase().includes('content'));
    console.log('Available content tools:', contentTools.map(t => t.name));
    process.exit(1);
  }
  
  // First, let's see what files are in the root directory
  console.log('🔍 Checking repository root files...');
  try {
    const rootInput = {
      owner: toolInput.owner,
      repo: toolInput.repo,
      path: ''  // Root directory
    };
    
    const rootResult = await getContentTool.invoke(rootInput);
    const rootData = JSON.parse(rootResult);
    
    if (rootData.data && Array.isArray(rootData.data)) {
      console.log('📁 Files in repository root:');
      rootData.data.forEach(file => {
        console.log(`   ${file.type === 'dir' ? '📁' : '📄'} ${file.name}`);
      });
    }
  } catch (rootError) {
    console.log('⚠️ Could not list root directory files');
  }

  // Try to find README with different variations
  const readmeVariations = ['README.md', 'readme.md', 'Readme.md', 'README.MD', 'README', 'readme'];
  let readmeContent = '';
  let readmeFound = false;
  
  for (const readmeName of readmeVariations) {
    try {
      const readmeInput = {
        owner: toolInput.owner,
        repo: toolInput.repo,
        path: readmeName
      };
      
      console.log(`🔄 Trying to fetch ${readmeName}...`);
      const readmeResult = await getContentTool.invoke(readmeInput);
      const readmeData = JSON.parse(readmeResult);
      
      if (readmeData.data && readmeData.data.content) {
        // Decode base64 content
        readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf-8');
        console.log(`✅ Found ${readmeName}!`);
        console.log(`📄 README preview (first 300 chars): ${readmeContent.substring(0, 300)}...`);
        readmeFound = true;
        break;
      }
    } catch (readmeError) {
      console.log(`   ❌ ${readmeName} not found`);
    }
  }
  
  if (!readmeFound) {
    console.log('⚠️ No README file found in any common format');
    readmeContent = `Repository: ${repoData.data.name}\nDescription: ${repoData.data.description || 'No description provided'}\nLanguage: ${repoData.data.language || 'Not specified'}\nNote: No README file found in the repository.`;
  }
  
  // Now let the LLM decide whether to star the repository
  console.log('\n🤖 Asking LLM to analyze the repository...');
  
  const analysisPrompt = `
You are analyzing a GitHub repository to decide if it should be starred. Here's the information:

Repository: ${repoData.data.name}
Owner: ${repoData.data.owner.login}
Description: ${repoData.data.description || 'No description'}
Language: ${repoData.data.language || 'Not specified'}
Current Stars: ${repoData.data.stargazers_count}
Created: ${repoData.data.created_at}

README/Content:
${readmeContent}

Please analyze this repository step by step:

1. ANALYSIS: First, provide your detailed analysis of the repository considering:
   - Is it useful, innovative, or well-documented?
   - Does it solve a real problem?
   - Is the code quality likely to be good based on the README?
   - Would this be valuable to developers?

2. DECISION: Then, respond with EXACTLY one of these options:
   - "STAR: [reason]" if it should be starred
   - "SKIP: [reason]" if it should not be starred

Format your response like this:
ANALYSIS: [your detailed thinking here]
DECISION: STAR/SKIP: [brief reason]
`;

  try {
    const llmResponse = await llm.invoke(analysisPrompt);
    const fullResponse = llmResponse.content.trim();
    
    console.log('\n🧠 LLM Full Response:');
    console.log('=' .repeat(60));
    console.log(fullResponse);
    console.log('=' .repeat(60));
    
    // Extract the analysis and decision parts
    const analysisMatch = fullResponse.match(/ANALYSIS:\s*(.*?)(?=DECISION:|$)/s);
    const decisionMatch = fullResponse.match(/DECISION:\s*(STAR|SKIP):\s*(.*)/);
    
    if (analysisMatch) {
      console.log('\n🔍 LLM Analysis:');
      console.log(analysisMatch[1].trim());
    }
    
    if (decisionMatch) {
      const action = decisionMatch[1]; // STAR or SKIP
      const reason = decisionMatch[2].trim();
      
      console.log(`\n🎯 LLM Decision: ${action}`);
      console.log(`📝 Reason: ${reason}`);
      
      if (action === 'STAR') {
        console.log('\n⭐ LLM recommends starring! Proceeding to star...');
        
        const starTool = tools.find(tool => tool.name === 'GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER');
        
        if (starTool) {
          try {
            const starResult = await starTool.invoke(toolInput);
            console.log('🌟 Repository starred successfully based on LLM recommendation!');
            console.log('Star result:', starResult);
          } catch (starError) {
            console.error('❌ Failed to star repository:', starError.message);
          }
        } else {
          console.error('❌ Star tool not found');
        }
      } else if (action === 'SKIP') {
        console.log('\n⏭️ LLM recommends NOT starring this repository.');
        console.log('   Repository will not be starred.');
      }
    } else {
      console.log('\n❓ Could not parse LLM decision. Looking for simple STAR/SKIP format...');
      
      // Fallback to simple format
      if (fullResponse.includes('STAR:')) {
        console.log('✅ Found STAR in response, proceeding to star...');
        const starTool = tools.find(tool => tool.name === 'GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER');
        if (starTool) {
          try {
            const starResult = await starTool.invoke(toolInput);
            console.log('🌟 Repository starred successfully!');
          } catch (starError) {
            console.error('❌ Failed to star repository:', starError.message);
          }
        }
      } else {
        console.log('⏭️ No clear STAR decision found, skipping star action.');
      }
    }
    
  } catch (llmError) {
    console.error('❌ LLM analysis failed:', llmError.message);
    console.log('⚠️ Skipping star action due to analysis failure');
  }
  
} catch (error) {
  console.error('❌ Direct tool execution failed:', error.message);
  console.error('Full error:', error);
}