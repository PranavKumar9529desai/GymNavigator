'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from 'ai';
import { OpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { v4 as uuidv4 } from 'uuid';

// Get API key with fallbacks for different environment variable names
const geminiApiKey =
	process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

// Initialize AI providers
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY || '',
});

// Debug logging
console.log('Environment test var:', process.env.TEST_ENV);
console.log('Initializing Gemini with API key available:', !!geminiApiKey);
console.log(
	'API key first 4 chars:',
	geminiApiKey ? geminiApiKey.substring(0, 4) : 'none',
);
console.log('backend url is', process.env.NEXT_PUBLIC_BACKEND_URL);
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Generate content with Gemini model
 */
export async function generateWithGemini(
	prompt: string,
	options?: {
		temperature?: number;
		maxOutputTokens?: number;
	},
) {
	try {
		if (!geminiApiKey) {
			throw new Error(
				'Gemini API key is not configured. Please check your environment variables.',
			);
		}

		// Using free tier model instead of pro models
		// Try gemini-1.0-pro-vision-latest first (available on free tier)
		const modelName = 'gemini-2.0-flash';

		const model = genAI.getGenerativeModel({
			model: modelName,
			generationConfig: {
				temperature: options?.temperature || 0.4,
				topK: 32,
				topP: 0.95,
				maxOutputTokens: options?.maxOutputTokens || 4096,
			},
		});

		console.log(`Trying to generate content with ${modelName} model...`);

		// Regular non-streaming response
		try {
			const result = await model.generateContent(prompt);
			return result.response.text();
		} catch (modelError: unknown) {
			console.log('modelError', modelError);
			// If the first model fails, try another free model
			console.log(`${modelName} failed, trying gemini-pro...`);
			const fallbackModel = genAI.getGenerativeModel({
				model: 'gemini-pro',
				generationConfig: {
					temperature: options?.temperature || 0.4,
					topK: 32,
					topP: 0.95,
					maxOutputTokens: options?.maxOutputTokens || 2048, // Reduced tokens
				},
			});

			const fallbackResult = await fallbackModel.generateContent(prompt);
			return fallbackResult.response.text();
		}
	} catch (error) {
		console.error('Gemini API error details:', error);

		// If OpenAI key is available, fallback to OpenAI
		if (process.env.OPENAI_API_KEY) {
			console.log('Falling back to OpenAI...');
			try {
				return await generateWithOpenAI(
					[{ role: 'user', content: prompt, id: uuidv4() }],
					{
						temperature: options?.temperature,
					},
				);
			} catch (openaiError) {
				console.error('OpenAI fallback error:', openaiError);
				throw new Error(
					'Failed to generate content with both Gemini and OpenAI',
				);
			}
		}

		throw new Error(
			`Failed to generate content with Gemini: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`,
		);
	}
}

/**
 * Generate content with OpenAI
 */
export async function generateWithOpenAI(
	messages: Message[],
	options?: {
		temperature?: number;
		maxTokens?: number;
		model?: string;
	},
) {
	try {
		// Convert ai.Message to OpenAI's expected format
		const openaiMessages: ChatCompletionMessageParam[] = messages.map((msg) => {
			// Only include the role and content properties that OpenAI expects
			return {
				role:
					msg.role === 'user'
						? 'user'
						: msg.role === 'assistant'
							? 'assistant'
							: 'system',
				content: msg.content,
			};
		});

		const response = await openai.chat.completions.create({
			model: options?.model || 'gpt-3.5-turbo',
			messages: openaiMessages,
			temperature: options?.temperature || 0.7,
			max_tokens: options?.maxTokens || 2048,
		});

		return response.choices[0].message.content;
	} catch (error) {
		console.error('OpenAI API error:', error);
		throw new Error('Failed to generate content with OpenAI');
	}
}

/**
 * Generate structured content with retry logic
 */
export async function generateStructuredContent<T>(
	prompt: string,
	validateFn: (data: string) => { valid: boolean; data?: T; errors?: unknown },
	options?: {
		provider?: 'gemini' | 'openai';
		maxAttempts?: number;
		temperature?: number;
	},
) {
	// Default to OpenAI if OPENAI_API_KEY is available and no provider is specified
	const defaultProvider = process.env.OPENAI_API_KEY ? 'openai' : 'gemini';
	const provider = options?.provider || defaultProvider;
	const maxAttempts = options?.maxAttempts || 3;
	let attempts = 0;
	let lastResponse = '';
	let currentPrompt = prompt;

	while (attempts < maxAttempts) {
		attempts++;
		try {
			// Generate response based on provider
			const response =
				provider === 'gemini'
					? await generateWithGemini(currentPrompt, {
							temperature: options?.temperature,
						})
					: await generateWithOpenAI(
							[{ role: 'user', content: currentPrompt, id: uuidv4() }],
							{
								temperature: options?.temperature,
							},
						);

			lastResponse = response as string;

			// Validate response
			const validation = validateFn(lastResponse || '');

			if (validation.valid && validation.data) {
				console.log('Validation passed: form the AI', validation.data);
				return {
					success: true,
					data: validation.data,
					attempts,
				};
			}

			// If invalid, refine the prompt with error feedback
			currentPrompt = `
I tried to generate a structured response but received these errors:
${JSON.stringify(validation.errors || 'Invalid format')}

Please fix these issues and provide a response that strictly follows the specified format.

Original prompt:
${prompt}
`;
		} catch (error) {
			console.error(`Error on attempt ${attempts}:`, error);

			// If we were using Gemini and it failed, try OpenAI if available
			if (
				provider === 'gemini' &&
				process.env.OPENAI_API_KEY &&
				attempts === maxAttempts
			) {
				console.log('Switching to OpenAI for final attempt...');
				try {
					const openaiResponse = await generateWithOpenAI(
						[{ role: 'user', content: currentPrompt, id: uuidv4() }],
						{
							temperature: options?.temperature,
						},
					);

					lastResponse = openaiResponse as string;
					const validation = validateFn(lastResponse);

					if (validation.valid && validation.data) {
						return {
							success: true,
							data: validation.data,
							attempts,
							provider: 'openai',
						};
					}
				} catch (openaiError) {
					console.error('OpenAI fallback error:', openaiError);
				}
			}
		}
	}

	// If all attempts failed
	throw new Error(
		`Failed to generate valid structured content after ${maxAttempts} attempts. Last response: ${lastResponse}`,
	);
}

/**
 * Generate with feedback for iterative improvement
 */
export async function regenerateWithFeedback<T>(
	originalPrompt: string,
	originalResponse: unknown,
	feedback: string,
	validateFn: (data: string) => { valid: boolean; data?: T; errors?: unknown },
	options?: {
		provider?: 'gemini' | 'openai';
		temperature?: number;
	},
) {
	const provider = options?.provider || 'gemini';

	const feedbackPrompt = `
I previously generated this response:
${JSON.stringify(originalResponse, null, 2)}

Based on this feedback:
"${feedback}"

I need to create an improved version that addresses this feedback while maintaining the same structure.
Please provide a complete response that incorporates the feedback.

Original request:
${originalPrompt}
`;

	try {
		// Generate improved response with feedback
		const response =
			provider === 'gemini'
				? await generateWithGemini(feedbackPrompt, {
						temperature: options?.temperature || 0.5,
					})
				: await generateWithOpenAI(
						[{ role: 'user', content: feedbackPrompt, id: uuidv4() }],
						{
							temperature: options?.temperature || 0.5,
						},
					);

		// Validate response
		const validation = validateFn(response || '');

		if (validation.valid && validation.data) {
			console.log('Validation passed:', validation.data);
			return {
				success: true,
				data: validation.data,
			};
		}

		throw new Error('Generated response did not pass validation');
	} catch (error) {
		console.error('Error regenerating with feedback:', error);
		throw new Error('Failed to regenerate content based on feedback');
	}
}
