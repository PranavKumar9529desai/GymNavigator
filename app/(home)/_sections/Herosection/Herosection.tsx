import CustomButton from '@/app/(home)/_component/CustomButton';
import DumbbellWrapper from '@/app/(home)/_component/Hero-section/DumbbellWrapper';
import { GradientBackground } from '@/components/theme/GradientBackground';
import { GradientText } from '@/components/theme/GradientText';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import MobileStats from './_components/MobileStats';

export default function Herosection() {
	return (
		<GradientBackground>
			<div className="container mx-auto px-4 sm:px-12 lg:px-16 relative">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
					{/* Hero content */}
					<div className="space-y-6 lg:space-y-8 text-center lg:text-left relative z-10 py-8 lg:py-0">
						<div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto lg:mx-0">
							<div>
								<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
									<span className="block mb-2 sm:mb-4 text-white/90">
										Elevate Your
									</span>
									<GradientText>Gym Management</GradientText>
								</h1>
							</div>
							<p className="text-base sm:text-lg text-gray-300 leading-relaxed mt-4">
								Streamline operations, enhance member experience, and drive
								growth with our sophisticated management suite.
							</p>
						</div>

						{/* Mobile Stats Overview */}
						<div className="lg:hidden">
							<MobileStats />
						</div>

						<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-8">
							<CustomButton className="w-full sm:w-auto" />
							<Button
								variant="outline"
								className="w-full sm:w-auto hidden sm:flex items-center gap-2 bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-blue-500 hover:scale-105 font-medium px-6 py-3 rounded-lg transition-all duration-300"
							>
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</Button>
						</div>
					</div>

					<div className="hidden lg:flex justify-end">
						<DumbbellWrapper />
					</div>
				</div>
			</div>

			{/* Mobile-optimized scroll indicator */}
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:bottom-8">
				<div className="text-blue-400 text-sm flex flex-col items-center gap-2">
					<span className="hidden sm:block text-xs text-gray-400">
						Scroll to explore
					</span>
					<ArrowRight className="w-4 h-4 rotate-90" />
				</div>
			</div>
		</GradientBackground>
	);
}
