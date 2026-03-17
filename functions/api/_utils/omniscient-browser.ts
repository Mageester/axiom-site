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
            // @ts-ignore
            const fs = await import('node:fs');
            // @ts-ignore
            const fsPromises = await import('node:fs/promises');
            const noopMkdtemp = async () => '/tmp/artifacts';
            
            if (fs.promises) {
                (fs.promises as any).mkdtemp = noopMkdtemp;
            }
            if (fsPromises) {
                (fsPromises as any).mkdtemp = noopMkdtemp;
            }
        } catch (e) {
            // ignore
        }

        const { launch } = await dynamicImport(CLOUDFLARE_PLAYWRIGHT_MODULE);
        return launch(env.BROWSER);
    }

    const { chromium } = await dynamicImport(PLAYWRIGHT_MODULE);
    return chromium.launch({ headless: true });
}
