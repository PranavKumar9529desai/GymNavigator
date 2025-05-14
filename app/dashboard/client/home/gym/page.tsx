export default function GymPage() {
	return (
		// Make the entire page container scrollable if content overflows
		<div className="h-screen overflow-y-auto">
			{/* Scrollable Top Bar Part - Scrolls away */}
			<div className="bg-blue-600 p-4 text-white">
				Scrollable Header Part (Blue) - Scrolls Away
			</div>

			{/* Sticky Top Bar Part - Remains visible */}
			<div className="sticky top-0 z-10 bg-green-400 p-4 shadow">
				{' '}
				{/* Added sticky here */}
				Sticky Header Part (Green) - Always Visible
			</div>

			{/* Main Scrollable Content */}
			<div className="bg-gray-100 p-4 min-h-screen">
				{' '}
				{/* Added min-h-screen and more content */}
				Main Content Area (Gray)
				<br />
				Content Line 1<br />
				Content Line 2<br />
				Content Line 3<br />
				Content Line 4<br />
				Content Line 5<br />
				Content Line 6<br />
				Content Line 7<br />
				Content Line 8<br />
				Content Line 9<br />
				Content Line 10
				<br />
				Content Line 11
				<br />
				Content Line 12
				<br />
				Content Line 13
				<br />
				Content Line 14
				<br />
				Content Line 15
				<br />
				Content Line 16
				<br />
				Content Line 17
				<br />
				Content Line 18
				<br />
				Content Line 19
				<br />
				Content Line 20
				<br />
				Content Line 21
				<br />
				Content Line 22
				<br />
				Content Line 23
				<br />
				Content Line 24
				<br />
				Content Line 25
				<br />
				Content Line 26
				<br />
				Content Line 27
				<br />
				Content Line 28
				<br />
				Content Line 29
				<br />
				Content Line 30
				<br />
				Even more content to ensure scrolling...
				<br />
				Even more content to ensure scrolling...
				<br />
				Even more content to ensure scrolling...
				<br />
				Even more content to ensure scrolling...
				<br />
				End of Content
			</div>
		</div>
	);
}
