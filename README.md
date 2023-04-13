
# IDS project 4: AWS Polly and Transcribe Hook for Next.js React

This repository provides React hooks for using AWS Polly and Transcribe services in your Next.js React applications. It also includes an API handler for OpenAI's ChatGPT.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [usePolly Hook](#usepolly-hook)
  - [useTranscribe Hook](#usetranscribe-hook)
  - [ChatGPT API Handler](#chatgpt-api-handler)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Install the required dependencies:

\`\`\`bash
npm install @aws-sdk/client-polly
\`\`\`

2. Add the hooks and API handler to your project.

## Usage

### usePolly Hook

This hook allows you to synthesize speech from text using AWS Polly. It returns the synthesized speech as an mp3 file and updates an audio element's source.

\`\`\`javascript
import { usePolly } from './path/to/usePolly';

const options = {
    region: 'us-east-1',
    voiceId: 'Brian',
    engine: 'neural',
    sampleRate: '22050',
};

const { audioRef, isLoading } = usePolly('Your text here', options);
\`\`\`

### useTranscribe Hook

This hook allows you to transcribe speech to text using AWS Transcribe. It returns the transcribed text and provides methods for starting and stopping the transcription process.

\`\`\`javascript
import useTranscribe from './path/to/useTranscribe';

const {
    isRecording,
    setIsRecording,
    transcribedText,
    setTranscribedText,
    language,
    setLanguage,
    handleStartRecording,
    handleStopRecording,
} = useTranscribe();
\`\`\`

### ChatGPT API Handler

This handler enables your application to send messages to OpenAI's ChatGPT API and receive a response.

\`\`\`javascript
import { ChatGPTAPI } from 'chatgpt';

async function sendMessageToChatGPT(text) {
    const api = new ChatGPTAPI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    try {
        const chatGPTres = await api.sendMessage(text);
        console.log(chatGPTres.text);
        return chatGPTres.text;
    } catch (error) {
        console.error(error);
        return null;
    }
}
\`\`\`

## Environment Variables

To use the hooks and API handler, you'll need to provide the following environment variables:

- `NEXT_PUBLIC_AWS_ACCESS_KEY_ID`: Your AWS access key ID.
- `NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
- `NEXT_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key.

Create a `.env.local` file in the root of your project and add the environment variables with their corresponding values.

\`\`\`
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key_id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
\`\`\`
