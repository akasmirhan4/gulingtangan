const sampler = new Tone.Sampler({
	urls: urlsList,
	release: 1,
	baseUrl: PATH,
}).toDestination();