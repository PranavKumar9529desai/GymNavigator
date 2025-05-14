import GymSettings from './_components/Gym/GymSettings';
import PaymentSettings from './_components/Gym/Payments/PaymentSettings';
import TrainerSettings from './_components/Trainer/TrainerSettings';
import HealthProfile2 from './_components/Healthprofile/heathprofile';

export default async function SettingPage({
	params,
}: {
	params: Promise<{ settingpage: string[] }>; // Update params type to string[]
}) {
	const settingParams = (await params).settingpage;
	const mainPage = settingParams[0] as string; // First segment is the main page
	const selectedTopic = settingParams[1] as string | undefined; // Second segment is the topic (optional)

	// Map route parameters to components
	const components: { [key: string]: React.ComponentType<any> } = {
		gym: GymSettings,
		payment: PaymentSettings,
		trainer: TrainerSettings,
		healthprofile: HealthProfile2,
	};

	// Get the component for the current route based on the first segment
	const Component = components[mainPage];

	// If the component doesn't exist for the given route, show a not found message
	if (!Component) {
		return <div className="p-6 text-center">Settings page not found</div>;
	}

	// Prepare props, including selectedTopic if the component is HealthProfile2
	const componentProps: { [key: string]: any } = {};
	if (mainPage === 'healthprofile' && selectedTopic) {
		componentProps.selectedTopic = selectedTopic;
	}

	// Render the selected component, passing relevant props
	return <Component {...componentProps} />;
}
