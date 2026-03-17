export interface AutomationLocator {
    evaluateAll<TResult>(pageFunction: (elements: any[]) => TResult): Promise<TResult>;
}

export interface AutomationPage {
    close(): Promise<void>;
    evaluate<TResult>(pageFunction: () => TResult): Promise<TResult>;
    goto(url: string, options?: { timeout?: number; waitUntil?: string }): Promise<unknown>;
    locator(selector: string): AutomationLocator;
    url(): string;
    waitForSelector(selector: string, options?: { timeout?: number }): Promise<unknown>;
    waitForTimeout(timeoutMs: number): Promise<void>;
}

export interface AutomationBrowserContext {
    close(): Promise<void>;
    newPage(): Promise<AutomationPage>;
}

export interface AutomationBrowser {
    close(): Promise<void>;
    newContext(options?: { locale?: string }): Promise<AutomationBrowserContext>;
}

const CLOUDFLARE_PLAYWRIGHT_MODULE = '@cloudflare/playwright';
const PLAYWRIGHT_MODULE = 'playwright';

async function dynamicImport(specifier: string): Promise<any> {
    return import(specifier);
}

export async function launchOmniscientBrowser(env: any): Promise<AutomationBrowser> {
    if (env?.BROWSER) {
        // Stub fs.promises.mkdtemp to bypass unenv "not implemented yet" error during _connectOverCDPInternal
        try {
            const noopMkdtemp = async () => '/tmp/artifacts';
            
            // Use dynamic strings to bypass TypeScript static analysis (error TS2307)
            const nodeFs = 'node:fs';
            const nodeFsPromises = 'node:fs/promises';
            
            // 1. Try ESM imports
            const fs = await import(/* @vite-ignore */ nodeFs).catch(() => null);
            const fsPromises = await import(/* @vite-ignore */ nodeFsPromises).catch(() => null);
            
            // 2. Try to find require (wrangler often polyfills this for internal use)
            // @ts-ignore
            const req = typeof require !== 'undefined' ? require : null;
            const fsReq = req ? req(nodeFs) : null;

            const targets = [fs, fsPromises, fsReq].filter(Boolean);
            for (const t of targets) {
                try {
                    // Try direct assignment
                    (t as any).mkdtemp = noopMkdtemp;
                    if ((t as any).promises) (t as any).promises.mkdtemp = noopMkdtemp;
                    if ((t as any).default?.promises) (t as any).default.promises.mkdtemp = noopMkdtemp;
                } catch (e) {
                    // Try property definition if read-only
                    try {
                        Object.defineProperty(t, 'mkdtemp', { value: noopMkdtemp, configurable: true });
                    } catch (e2) {
                        // ignore
                    }
                }
            }

            // 3. Shim globalThis in case Playwright is looking there
            // @ts-ignore
            globalThis.mkdtemp = noopMkdtemp;
            // @ts-ignore
            if (!globalThis.fs) globalThis.fs = { promises: { mkdtemp: noopMkdtemp } };
        } catch (e) {
            // ignore
        }

        const { launch } = await dynamicImport(CLOUDFLARE_PLAYWRIGHT_MODULE);
        return launch(env.BROWSER);
    }

    const { chromium } = await dynamicImport(PLAYWRIGHT_MODULE);
    return chromium.launch({ headless: true });
}
