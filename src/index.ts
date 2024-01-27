/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		const base = url.pathname.match(/^\/repo\/([^\/]+)\/([^\/]+)\/base\/(.*)$/);
		console.log(base)

		if (base) {
			const branch = base[1];
			const arch = base[2];
			const slug = base[3];
			const newUrl = `https://github.com/alt-autorepacked/repo/releases/download/${branch}-${arch}/${slug}`;

			return fetch(newUrl);
		}

		const RPMSaddon = url.pathname.match(/^\/repo\/([^\/]+)\/([^\/]+)\/RPMS\.addon\/([a-z-]+)-(\d+\.\d+\.\d+)-(.*)$/);
		if (RPMSaddon) {
			const packageName = RPMSaddon[3];
			const version = RPMSaddon[4];
			const rest = RPMSaddon[5];
			const newUrl = `https://github.com/alt-autorepacked/${packageName}/releases/download/v${version}/${packageName}-${version}-${rest}`;
			return fetch(newUrl);
		}

		return new Response('');
	},
};
