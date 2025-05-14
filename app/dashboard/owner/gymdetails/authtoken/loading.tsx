'use client';
import GymImage from '@/assests/gymd.webp';
import Image from 'next/image';
import React from 'react';
interface LoaderProps {
	size?: number;
	glowColor?: string;
	glowWidth?: number;
	animationDuration?: number;
}

export default function Loader({
	size = 200,
	glowColor = '#3b82f6',
	glowWidth = 6,
	animationDuration = 1,
}: LoaderProps) {
	return (
		<div className="flex items-center justify-center w-full h-full">
			<div
				className="relative"
				style={{
					width: size,
					height: size,
				}}
			>
				{/* Circular container for the logo */}
				<div className="absolute inset-0 rounded-full shadow-lg overflow-hidden  z-10">
					<Image
						src={GymImage}
						alt="GymNavigator Logo"
						width={size}
						height={size}
						className="object-contain "
					/>
				</div>

				{/* Rotating border light effect */}
				<div
					className="absolute inset-0 rounded-full"
					style={{
						border: `${glowWidth}px solid transparent`,
						background: `linear-gradient(white, white) padding-box,
                         conic-gradient(
                           from 0deg,
                           ${glowColor} 0deg 20deg,
                           transparent 20deg 340deg,
                           ${glowColor} 340deg 360deg
                         ) border-box`,
						animation: `spin ${animationDuration}s linear infinite`,
					}}
				/>
			</div>

			{/* CSS Animations */}
			<style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
		</div>
	);
}
