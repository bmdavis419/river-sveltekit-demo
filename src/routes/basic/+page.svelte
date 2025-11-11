<script lang="ts">
	import { myRiverClient } from '$lib/river/client';

	let message = $state('Why is TypeScript a better language than Go?');
	const trimmedMessage = $derived(message.trim());

	let vowelCount = $state(0);
	let consonantCount = $state(0);
	let specialCount = $state(0);

	let status = $state<'idle' | 'running' | 'success' | 'error' | 'aborted'>('idle');

	const { start, abort } = myRiverClient.classifyCharacters({
		onStart: () => {
			status = 'running';
			vowelCount = 0;
			consonantCount = 0;
			specialCount = 0;
		},
		onChunk: (chunk) => {
			switch (chunk.type) {
				case 'vowel':
					vowelCount++;
					break;
				case 'consonant':
					consonantCount++;
					break;
				case 'special':
					specialCount++;
					break;
			}
		},
		onError: (error) => {
			console.warn(error);
		},
		onFatalError: (error) => {
			status = 'error';
			console.error(error);
		},
		onSuccess: () => {
			status = 'success';
		},
		onAbort: () => {
			status = 'aborted';
		}
	});

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		start({ message: trimmedMessage });
	};

	const handleAbort = () => {
		abort();
	};

	const handleClear = () => {
		message = '';
		vowelCount = 0;
		consonantCount = 0;
		specialCount = 0;
		status = 'idle';
	};

	const hasResults = $derived(vowelCount > 0 || consonantCount > 0 || specialCount > 0);
	const hasContent = $derived(trimmedMessage.length > 0);
	const showClear = $derived(hasResults || hasContent);
</script>

<a
	href="/"
	class="fixed top-6 right-6 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-300"
	>Other Examples</a
>

<div class="mx-auto w-full max-w-2xl space-y-6 p-6 pt-20">
	<h1 class="mb-6 text-3xl font-bold text-white">Character Classifier</h1>

	<div class="mb-6 grid grid-cols-3 gap-4">
		<div class="rounded-lg bg-neutral-800 p-4">
			<div class="mb-1 text-sm font-medium text-neutral-400">Vowels</div>
			<div class="text-3xl font-bold text-white">{vowelCount}</div>
		</div>
		<div class="rounded-lg bg-neutral-800 p-4">
			<div class="mb-1 text-sm font-medium text-neutral-400">Consonants</div>
			<div class="text-3xl font-bold text-white">{consonantCount}</div>
		</div>
		<div class="rounded-lg bg-neutral-800 p-4">
			<div class="mb-1 text-sm font-medium text-neutral-400">Special</div>
			<div class="text-3xl font-bold text-white">{specialCount}</div>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-4">
		<div>
			<label for="message" class="mb-2 block text-sm font-medium text-neutral-300"> Message </label>
			<textarea
				id="message"
				bind:value={message}
				disabled={status === 'running'}
				rows={4}
				class="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				placeholder="Enter your message here..."
			></textarea>
		</div>

		<div class="flex gap-3">
			<button
				type="submit"
				disabled={status === 'running' || !trimmedMessage}
				class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{status === 'running' ? 'Processing...' : 'Submit'}
			</button>

			{#if showClear && status !== 'running'}
				<button
					type="button"
					onclick={handleClear}
					class="rounded-lg bg-neutral-700 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-600 focus:ring-2 focus:ring-neutral-500 focus:outline-none"
				>
					Clear
				</button>
			{/if}

			{#if status === 'running'}
				<button
					type="button"
					onclick={handleAbort}
					class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
				>
					Abort
				</button>
			{/if}
		</div>

		{#if status === 'error'}
			<div class="mt-4 rounded-lg border border-red-700 bg-red-900/30 p-3 text-sm text-red-300">
				An error occurred while processing. Please try again.
			</div>
		{/if}

		{#if status === 'running'}
			<span class="inline-flex items-center gap-1 text-blue-400">
				<span
					class="h-3 w-3 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"
				></span>
				Running
			</span>
		{:else if status === 'success'}
			<span class="inline-flex items-center gap-1 text-green-400">
				<span class="h-3 w-3 rounded-full bg-green-400"></span>
				Done
			</span>
		{:else if status === 'error'}
			<span class="inline-flex items-center gap-1 text-red-400">
				<span class="h-3 w-3 rounded-full bg-red-400"></span>
				Error
			</span>
		{:else if status === 'aborted'}
			<span class="inline-flex items-center gap-1 text-yellow-400">
				<span class="h-3 w-3 rounded-full bg-yellow-400"></span>
				Aborted
			</span>
		{/if}
	</form>
</div>
