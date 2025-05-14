import React from 'react';
interface FormErrorPropsType {
	message: string;
	type: 'success' | 'fail';
}
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * A professional status message component for forms
 * @param {Object} props - Component props
 * @param {FormErrorPropsType} props.FormErrorProps - Form error properties
 */
export default function FormError({
	FormErrorProps,
}: {
	FormErrorProps: FormErrorPropsType;
}) {
	// For debugging
	console.log('FormError received props:', FormErrorProps);

	// Make sure we have valid props before rendering
	if (!FormErrorProps || !FormErrorProps.message) {
		console.error('Invalid or missing FormErrorProps:', FormErrorProps);
		return null;
	}

	const isFail = FormErrorProps.type === 'fail';
	const message =
		FormErrorProps.message || (isFail ? 'An error occurred' : 'Success');

	return (
		<div className="text-center w-full overflow-hidden transition-all">
			{isFail ? (
				<div className="w-full py-2 px-3 bg-red-100/90 border border-red-300 rounded-md flex items-center gap-2 justify-center shadow-sm">
					<AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
					<p className="text-sm text-red-700 font-medium">{message}</p>
				</div>
			) : (
				<div className="w-full py-2 px-3 bg-green-100/90 border border-green-300 rounded-md flex items-center gap-2 justify-center shadow-sm">
					<CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
					<p className="text-sm text-green-700 font-medium">{message}</p>
				</div>
			)}
		</div>
	);
}
