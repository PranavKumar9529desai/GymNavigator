'use client';
import { signIn, signOut } from '@/node_modules/next-auth/react';
import React from 'react';

export default function Button() {
	return (
		<>
			<button
				type="button"
				onClick={() => {
					signIn();
				}}
			>
				{' '}
				Signin
			</button>
			<button
				type="button"
				onClick={() => {
					signOut();
				}}
			>
				SignOut
			</button>
		</>
	);
}
