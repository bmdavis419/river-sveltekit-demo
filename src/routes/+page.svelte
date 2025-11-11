<script lang="ts">
	import { goto } from '$app/navigation';
	import { remoteSignIn } from '$lib/auth/auth.remote';

	let password = $state('');
	let trimmedPassword = $derived(password.trim());
	let isLoading = $state(false);
	let error = $state<string>('');

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		if (!trimmedPassword) return;

		const result = await remoteSignIn({ password: trimmedPassword });

		if (result.success) {
			goto('/question');
		} else {
			error = result.error ?? 'An unknown error occurred';
		}
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-900 p-6">
	<div class="flex flex-col gap-3">
		<p class="max-w-lg text-lg text-neutral-300">
			The resuming stream demo is locked behind a password since it hit's an LLM endpoint and a DB.
			If you want to try it,{' '}
			<a
				href="https://github.com/bmdavis419/river-sveltekit-demo"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-500 hover:text-blue-600"
			>
				check out the repo
			</a>
			!
		</p>
		<p class="text-lg text-neutral-200">
			If you do want to try a basic demo,{' '}
			<a href="/basic" class="text-blue-500 hover:text-blue-600">click here</a>
			!
		</p>
	</div>
	<div class="w-full max-w-md">
		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-neutral-300">
					Password
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					disabled={isLoading}
					class="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					placeholder="Enter password"
				/>
			</div>
			{#if error}
				<div class="text-sm text-red-400">{error}</div>
			{/if}
			<button
				type="submit"
				disabled={!password.trim() || isLoading}
				class="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isLoading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>
	</div>
</div>
