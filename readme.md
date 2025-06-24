# AI-Powered GitHub Repository Analysis
[Composio](https://composio.ai) is a platform for managing and integrating tools with LLMs and AI agents. You can build fast, Groq-based assistants to seamlessly interact with external applications through features including:

- **Tool Integration**: Connect AI agents to APIs, RPCs, shells, file systems, and web browsers with 90+ readily available tools
- **Authentication Management**: Secure, user-level auth across multiple accounts and tools
- **Optimized Execution**: Improve security and cost-efficiency with tailored execution environments
- **Comprehensive Logging**: Track and analyze every function call made by your LLMs

This repository demonstrates GitHub repository analysis and starring using Groq LLMs with Composio's GitHub integration - automatically discovers and stars valuable repositories.

## Live Demo

**Try it yourself:** Clone this repo and run it with your own GitHub repositories to see AI-powered repository curation in action.

## Overview

This application demonstrates intelligent GitHub repository analysis using Groq's ultra-fast LLM inference with Composio's powerful GitHub integration. The system automatically fetches repository details, analyzes code quality and value proposition, and makes intelligent starring decisions in sub-second timeframes.

**Key Features:**
- **Lightning-Fast Analysis:** Powered by Groq's `llama-3.1-8b-instant` model for sub-second repository evaluation
- **Intelligent Repository Assessment:** Analyzes README content, repository metadata, and project quality indicators  
- **Automated GitHub Actions:** Seamlessly stars repositories based on AI recommendations via Composio
- **Smart Decision Making:** Evaluates usefulness, innovation, documentation quality, and developer value

## Architecture

**Tech Stack:**
- **AI Infrastructure:** Groq API with Llama 3.1 8B Instant model
- **GitHub Integration:** Composio for seamless API interactions
- **Orchestration:** LangChain for tool coordination and workflow management
- **Runtime:** Node.js with modern ES modules

## Quick Start

### Prerequisites
- Node.js 18+
- Groq API key ([Create a free GroqCloud account and generate an API key here](https://console.groq.com/keys))
- Composio API key ([Sign up at Composio](https://composio.dev))
- GitHub account for repository starring

### Setup

1. **Clone the repository**
   ```bash
   gh repo clone janzheng/groq-composio-template
   cd groq-composio-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** and add your API keys:
   ```env
   GROQ_API_KEY=your-groq-api-key-here
   COMPOSIO_API_KEY=your-composio-api-key-here
   ```

4. **Connect your GitHub account**
   ```bash
   node main.js
   ```
   On first run, the application will guide you through connecting your GitHub account via Composio.

5. **Run the analysis**
   ```bash
   # Run with default repository (janzheng/groq-composio-template)
   npm run analyze
   
   # Analyze a specific repository using command-line arguments
   node main.js --owner janzheng --repo groq-composio-template
   
   # Or use the predefined scripts
   npm run analyze:langchain   # Analyzes langchain-ai/langchain  
   npm run analyze:composio    # Analyzes ComposioHQ/composio
   ```

## How It Works

### 1. Repository Data Gathering
The system uses Composio's GitHub integration to fetch:
- Repository metadata (stars, forks, creation date)
- README content and documentation
- File structure and project details

### 2. AI-Powered Analysis
Groq's `llama-3.1-8b-instant` model analyzes the repository considering:
- **Usefulness & Innovation**: Does it solve real problems?
- **Documentation Quality**: Is it well-documented and accessible?
- **Code Quality Indicators**: Based on README and project structure
- **Developer Value**: Would this benefit the developer community?

### 3. Intelligent Decision Making
The LLM provides structured analysis and makes a clear recommendation:
```
ANALYSIS: [Detailed evaluation of the repository]
DECISION: STAR: [Reason] | SKIP: [Reason]
```

### 4. Automated Action
If the AI recommends starring, the system automatically stars the repository via Composio's GitHub integration.

## Example Output

```bash
🎯 Analyzing repository: janzheng/groq-composio-template
🔄 Fetching GitHub tools from Composio...
✅ Retrieved 45 GitHub tools

🎉 Repository Details:
📦 Name: groq-composio-template
👤 Owner: janzheng
📝 Description: LLM-based GitHub repo analysis with Groq and Composio
🌟 Stars: 1
🍴 Forks: 999999
📅 Created: 1998-01-15T10:30:00Z

...
```

## Customization

You can easily customize this template by modifying:

- **Analysis Criteria**: Edit the prompt in `main.js` to focus on different repository qualities
- **Model Settings**: Change the Groq model or temperature settings for different behavior
- **Repository Target**: Use command-line arguments to analyze any repository

## Usage Examples

```bash
# Analyze different repositories
node main.js --owner microsoft --repo vscode
node main.js --owner vercel --repo next.js
node main.js --owner facebook --repo react
```

## Technical Details

- **Model**: `llama-3.1-8b-instant` for fast, consistent analysis
- **Response Time**: Sub-second analysis for typical repositories
- **Error Handling**: Graceful handling of missing files and API issues
- **Security**: API keys stored securely in environment variables

## Troubleshooting

**Connection Issues**: Ensure your GitHub account is properly connected via Composio's OAuth flow.

**API Rate Limits**: The script includes proper error handling for GitHub API rate limits.

**Missing README**: The system gracefully handles repositories without README files.

## Next Steps

- **Get started**: [Sign up for a free Groq account](https://console.groq.com) to get your API key
- **Learn more**: Check out [Composio's documentation](https://docs.composio.dev) for more GitHub integrations
- **Customize**: Fork this repo and modify the analysis criteria for your needs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Created by Jan Zheng.
