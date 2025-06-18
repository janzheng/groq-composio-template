# Groq x Composio: AI-Powered GitHub Repository Analysis

**Intelligent GitHub repository analysis and starring using Groq's lightning-fast LLMs with Composio's seamless GitHub integration - automatically discover and star valuable repositories in milliseconds.**

## Live Demo

**Try it yourself:** Clone this repo and run it with your own GitHub repositories to see AI-powered repository curation in action.

## Overview

This application demonstrates intelligent GitHub repository analysis using Groq's ultra-fast LLM inference with Composio's powerful GitHub integration. The system automatically fetches repository details, analyzes code quality and value proposition, and makes intelligent starring decisions in sub-second timeframes.

**Key Features:**
- **Lightning-Fast Analysis:** Powered by Groq's `llama-3.1-8b-instant` model for sub-second repository evaluation
- **Intelligent Repository Assessment:** Analyzes README content, repository metadata, and project quality indicators  
- **Automated GitHub Actions:** Seamlessly stars repositories based on AI recommendations via Composio
- **Production-Ready Integration:** Built with LangChain orchestration and enterprise-grade error handling
- **Smart Decision Making:** Evaluates usefulness, innovation, documentation quality, and developer value
- Sub-second response times, efficient concurrent request handling, and production-grade performance powered by Groq

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
   # Optional: Custom GitHub integration ID
   COMPOSIO_GITHUB_ID=your-github-integration-id
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
   node main.js --owner groqinc --repo groq-python
   
   # Or use the predefined scripts
   npm run analyze:groq        # Analyzes groqinc/groq-python
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
🎯 Analyzing repository: groqinc/groq-python
🔄 Fetching GitHub tools from Composio...
✅ Retrieved 45 GitHub tools

🎉 Repository Details:
📦 Name: groq-python
👤 Owner: groqinc
📝 Description: The official Python library for the Groq API
🌟 Stars: 1,234
🍴 Forks: 156
📅 Created: 2024-01-15T10:30:00Z

🧠 LLM Analysis:
This is the official Python library for Groq API with comprehensive 
documentation, examples, and active maintenance. It provides essential 
tooling for Python developers working with Groq's inference platform. 
The high star count and official status indicate strong community trust 
and reliability.

🎯 LLM Decision: STAR
📝 Reason: Official library, excellent documentation, high community 
engagement, and essential for Python developers using Groq

⭐ LLM recommends starring! Proceeding to star...
🌟 Repository starred successfully based on LLM recommendation!
```

## Customization

This template is designed to be a foundation for intelligent GitHub automation. Key areas for customization:

- **Analysis Criteria**: Modify the prompt in `main.js` to focus on specific repository qualities
- **Model Selection**: Update the Groq model configuration for different speed/accuracy tradeoffs
- **Actions**: Extend beyond starring to include forking, issue creation, or team notifications
- **Batch Processing**: Add functionality to analyze multiple repositories simultaneously

## Advanced Features

### Multi-Repository Analysis
Analyze multiple repositories using command-line arguments:
```bash
# Analyze multiple repositories in sequence
node main.js --owner microsoft --repo vscode
node main.js --owner vercel --repo next.js
node main.js --owner facebook --repo react

# Or create custom npm scripts in package.json
npm run analyze:vscode    # Custom script for microsoft/vscode
npm run analyze:nextjs    # Custom script for vercel/next.js
```

You can also extend the script programmatically:
```js
const repositories = [
  { owner: "microsoft", repo: "vscode" },
  { owner: "vercel", repo: "next.js" }
];

for (const { owner, repo } of repositories) {
  console.log(`Analyzing ${owner}/${repo}...`);
  // Set toolInput and run analysis
}
```

### Custom Scoring
Implement weighted scoring based on specific criteria important to your organization.

### Integration with CI/CD
Use this as part of automated workflows to curate high-quality dependencies and tools.

## Next Steps

### For Developers
- **Create your free GroqCloud account**: Access official API docs, the playground for experimentation, and more resources via [Groq Console](https://console.groq.com)
- **Build and customize**: Fork this repo and start customizing to build out your own AI-powered GitHub automation
- **Explore Composio**: Check out [Composio's documentation](https://docs.composio.dev) for more GitHub integrations and tools
- **Get support**: Connect with other developers building on Groq, chat with our team, and submit feature requests on our [Groq Developer Forum](https://community.groq.com)

### For Founders and Business Leaders
- **See enterprise capabilities**: This template showcases production-ready AI that can automate repository curation and developer workflow optimization at scale
- **Discuss your needs**: [Contact our team](https://groq.com/enterprise-access/) to explore how Groq can accelerate your AI initiatives and development workflows

## Technical Details

### Model Performance
- **Model**: `llama-3.1-8b-instant` - Optimized for speed and accuracy
- **Response Time**: Sub-second analysis for typical repositories
- **Temperature**: 0 for consistent, deterministic decisions

### Error Handling
- Comprehensive environment variable validation
- Graceful fallbacks for missing README files
- Robust GitHub API error handling
- Clear user guidance for setup issues

### Security
- API keys stored in environment variables
- No sensitive data logged or exposed
- Secure GitHub OAuth flow via Composio

## Troubleshooting

**Connection Issues**: Ensure your GitHub account is properly connected via Composio's OAuth flow.

**API Rate Limits**: The script includes proper error handling for GitHub API rate limits.

**Missing README**: The system gracefully handles repositories without README files.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Created by Jan Zheng for Groq, powered by Composio's GitHub integration and LangChain orchestration.
