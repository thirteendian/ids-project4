import { useEffect, useState, useRef } from 'react';
import { Polly, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

// Replace these with your IAM user's access key and secret access key
const AWS_ACCESS_KEY_ID = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY

export const usePolly = (text, options = {}) => {
    const audioRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const { region = 'us-east-1', voiceId = 'Brian', engine = 'neural', sampleRate = '22050' } = options;

    useEffect(() => {
        const synthesizeSpeech = async () => {
            if (!text) {
                return;
            }

            setIsLoading(true);

            try {
                const polly = new Polly({
                    region: region,
                    credentials: {
                        accessKeyId: AWS_ACCESS_KEY_ID,
                        secretAccessKey: AWS_SECRET_ACCESS_KEY,
                    },
                });

                const params = {
                    OutputFormat: 'mp3',
                    Text: text,
                    TextType: 'text',
                    Engine: engine,
                    VoiceId: voiceId,
                    SampleRate: sampleRate,
                };

                const data = await polly.send(new SynthesizeSpeechCommand(params));

                if (data.AudioStream && data.AudioStream instanceof ReadableStream) {
                    const reader = data.AudioStream.getReader();
                    const chunks = [];

                    const processStream = async (result) => {
                        if (result.done) {
                            const arrayBuffer = chunks.reduce((acc, chunk) => {
                                const tmp = new Uint8Array(acc.byteLength + chunk.byteLength);
                                tmp.set(new Uint8Array(acc), 0);
                                tmp.set(new Uint8Array(chunk), acc.byteLength);

                                return tmp.buffer;
                            }, new ArrayBuffer(0));
                            const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
                            const url = URL.createObjectURL(blob);

                            if (audioRef.current) {
                                audioRef.current.src = url;
                                audioRef.current.play();
                            }
                        } else {
                            chunks.push(result.value);
                            reader.read().then(processStream);
                        }
                    };

                    reader.read().then(processStream);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        synthesizeSpeech();
    }, [text, region, engine, voiceId, sampleRate]);

    return { audioRef, isLoading };
};
