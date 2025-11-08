import { chromium, devices } from 'playwright';
import sharp from 'sharp';
import { HIDE_OVERLAYS } from './hide-css.js';
import { scrollToLoad } from './scroll.js';

export async function captureScreenshot(opts: { 
  url: string; 
  fullPage?: boolean; 
  viewport?: { width: number; height: number }; 
  mobile?: boolean; 
}): Promise<{ webp: Buffer; width: number; height: number; bytes: number }> {
  const viewportSize = opts.viewport || { width: 1440, height: 900 };
  
  const browser = await chromium.launch({
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled', // Hide automation to match real browser
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=' + viewportSize.width + ',' + viewportSize.height,
      '--force-device-scale-factor=1', // Ensure no scaling
    ],
    // Headless expects a boolean in Playwright types
    headless: true,
  });
  
  const contextOptions: any = {
    locale: 'en-US',
    timezoneId: 'UTC',
    // Use a modern desktop user agent that matches typical browsers
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    // Emulate a real screen - important for responsive websites
    screen: {
      width: viewportSize.width,
      height: viewportSize.height
    },
    // Disable color scheme preference that might affect rendering
    colorScheme: 'light',
    // Ensure consistent viewport
    viewport: {
      width: viewportSize.width,
      height: viewportSize.height
    },
    deviceScaleFactor: 1,
    // Include viewport in extraHTTPHeaders to match real browser behavior
  };
  
  if (opts.mobile) {
    Object.assign(contextOptions, devices['iPhone 14 Pro']);
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  
  // Set extra headers that real browsers send
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Upgrade-Insecure-Requests': '1',
  });
  
  // Ensure viewport is set correctly on the page BEFORE any navigation
  await page.setViewportSize({
    width: viewportSize.width,
    height: viewportSize.height
  });

  // Avoid request interception by default to reduce breakage; allow all resources to load.

  page.setDefaultTimeout(90000);

  try {
    // Pre-navigation suppression: set known consent cookies for certain hosts
    try {
      const host = new URL(opts.url).hostname;
      const now = Math.floor(Date.now() / 1000);
      const oneYear = now + 31536000;
      if (host.endsWith('airbnb.com')) {
        await context.addCookies([
          { name: 'OptanonAlertBoxClosed', value: '2024-01-01T00:00:00.000Z', domain: '.airbnb.com', path: '/', expires: oneYear, httpOnly: false, secure: true, sameSite: 'Lax' },
          { name: 'OptanonConsent', value: 'isIABGlobal=false&datestamp=2024-01-01T00:00:00.000Z&version=6.16.0&hosts=&consentId=anon&interactionCount=1&landingPath=/', domain: '.airbnb.com', path: '/', expires: oneYear, httpOnly: false, secure: true, sameSite: 'Lax' },
        ]);
      }
    } catch {}

    // Navigate with the correct viewport already set (wait for full page load)
    await page.goto(opts.url, { waitUntil: 'load', timeout: 90000 });
    // Add hide CSS after navigation to avoid interfering with early render
    await page.addStyleTag({ content: HIDE_OVERLAYS });

    // Try actively dismissing cookie banners (OneTrust and common variants)
    try {
      // Direct selectors
      const directSelectors = [
        '#onetrust-accept-btn-handler',
        'button#onetrust-accept-btn-handler',
        '[id*="accept"]:not([disabled])',
        'button[aria-label*="Accept"]',
        'button:has-text("Accept")',
        'button:has-text("I agree")',
        'button:has-text("Got it")',
      ];
      for (const sel of directSelectors) {
        const el = await page.$(sel as any);
        if (el) {
          try { await el.click({ force: true }); } catch {}
        }
      }
      // OneTrust API if present
      await page.evaluate(() => {
        // @ts-ignore
        if (window.Optanon && typeof window.Optanon.ToggleInfoDisplay === 'function') {
          try {
            // @ts-ignore accept all categories if API available
            // Some OneTrust setups expose OptanonWrapper with accept function
            // This is best-effort and wrapped in try/catch
            // @ts-ignore
            window.Optanon && (window as any).Optanon.Automation && (window as any).Optanon.Automation.runAcceptAll && (window as any).Optanon.Automation.runAcceptAll();
          } catch {}
        }
      });
      // Inside iframes (some consent banners are in iframes)
      for (const frame of page.frames()) {
        try {
          const fe = await frame.$('#onetrust-accept-btn-handler');
          if (fe) { await fe.click({ force: true }); }
          const fa = await frame.$('button:has-text("Accept")' as any);
          if (fa) { await fa.click({ force: true }); }
        } catch {}
      }
      // Wait a bit for the banner to disappear
      await page.waitForTimeout(500);
    } catch {}
    // Proactively remove common consent/overlay nodes in case CSS doesn't apply fast enough
    await page.evaluate(() => {
      const selectors = [
        '#onetrust-banner-sdk', '#onetrust-consent-sdk', '[class*=onetrust]',
        '[class*=ot-sdk-container]', '[class*=ot-sdk-row]', '[class*=ot-floating-button]', '[class*=ot-pc-container]',
        '[id*=cookie]', '[class*=cookie]', '[id*=consent]', '[class*=consent]',
        '[class*=cc-window]', '[class*=cc-banner]', '[class*=cookiebot]', '[id*=CybotCookie]',
        '[class*=truste]', '[id*=truste]', '[class*=optanon]', '[id*=optanon]'
      ];
      for (const sel of selectors) {
        document.querySelectorAll(sel).forEach(n => n.remove());
      }
      // Remove fixed bottom overlays
      document.querySelectorAll('*').forEach((el) => {
        const style = window.getComputedStyle(el as Element);
        if ((style.position === 'fixed' || style.position === 'sticky') && (style.bottom && style.bottom !== 'auto')) {
          (el as HTMLElement).style.display = 'none';
        }
      });
    });
    
    // Ensure viewport is still correct after navigation (sometimes it resets)
    const currentViewport = page.viewportSize();
    if (!currentViewport || currentViewport.width !== viewportSize.width || currentViewport.height !== viewportSize.height) {
      await page.setViewportSize({
        width: viewportSize.width,
        height: viewportSize.height
      });
      await page.waitForTimeout(500);
    }
    
    // Scroll through the page to trigger lazy loading
    console.log('[capture] Scrolling to trigger lazy loading...');
    await scrollToLoad(page);
    await page.waitForTimeout(2000); // Wait after scrolling
    
    // Wait for network to be idle (no requests for 500ms) - increased timeout
    console.log('[capture] Waiting for network idle...');
    try {
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
        console.log('[capture] Network idle timeout, continuing...');
      });
    } catch {}
    
    // Wait for page to stabilize and lazy-loaded content - increased to 15 seconds
    console.log('[capture] Waiting 15 seconds for page stabilization...');
    await page.waitForTimeout(15000);
    
    // Wait for all images to load with longer timeout
    console.log('[capture] Waiting for images to load...');
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(images.map(img => {
        if (img.complete && img.naturalHeight > 0) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 15000); // Timeout after 15s per image
        });
      }));
    });
    
    // Wait for fonts to load
    console.log('[capture] Waiting for fonts to load...');
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    }).catch(() => {});
    
    // Wait for JavaScript execution to complete (check if page is still loading)
    console.log('[capture] Waiting for JavaScript execution...');
    await page.evaluate(async () => {
      // Wait for any pending promises or async operations
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
    
    // Additional wait for any lazy-loaded content or animations - increased to 5 seconds
    console.log('[capture] Final wait for lazy-loaded content (5 seconds)...');
    await page.waitForTimeout(5000);
    
    // Wait for videos to load and seek to a meaningful frame
    await page.evaluate(async () => {
      const videos = Array.from(document.querySelectorAll('video'));
      
      if (videos.length === 0) {
        return; // No videos to process
      }
      
      const videoPromises = videos.map((video: HTMLVideoElement) => {
        return new Promise<void>((resolve) => {
          // If video is already loaded enough
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA
            // Try to play to get a frame (may fail due to autoplay policies)
            video.play().catch(() => {
              // Autoplay blocked, that's ok - we'll seek to a frame
            });
            // Seek to 1 second to get a meaningful frame (or use currentTime if < 1s)
            if (video.duration > 0 && video.currentTime < 1) {
              video.currentTime = Math.min(1, video.duration * 0.1);
            }
            // Wait for frame to render after seek
            setTimeout(resolve, 800);
            return;
          }
          
          // Wait for video to load metadata
          const onLoadedMetadata = () => {
            // Try to play to get a frame
            video.play().catch(() => {
              // Autoplay blocked, that's ok - we'll seek to a frame
            });
            // Seek to 1 second (or 10% of duration if shorter)
            if (video.duration > 0) {
              video.currentTime = Math.min(1, video.duration * 0.1);
            }
            // Wait for frame to render after seek
            setTimeout(resolve, 800);
          };
          
          const onError = () => {
            resolve(); // Resolve even on error to not block
          };
          
          // Also handle canplay event for when video is ready to play
          const onCanPlay = () => {
            video.play().catch(() => {
              // Autoplay blocked, that's ok
            });
            if (video.duration > 0) {
              video.currentTime = Math.min(1, video.duration * 0.1);
            }
            setTimeout(resolve, 800);
          };
          
          video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
          video.addEventListener('canplay', onCanPlay, { once: true });
          video.addEventListener('error', onError, { once: true });
          
          // Timeout after 6s
          setTimeout(() => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('canplay', onCanPlay);
            video.removeEventListener('error', onError);
            resolve();
          }, 6000);
          
          // Try to load if not already loading
          if (video.readyState === 0) {
            video.load();
          }
        });
      });
      
      await Promise.all(videoPromises);
    });
    
    // Handle videos in iframes (e.g., YouTube embeds)
    await page.evaluate(async () => {
      const iframes = Array.from(document.querySelectorAll('iframe'));
      for (const iframe of iframes) {
        try {
          // Check if iframe has video-related classes/attributes
          const src = iframe.getAttribute('src') || '';
          const className = iframe.getAttribute('class') || '';
          const id = iframe.getAttribute('id') || '';
          
          // Common video embed patterns
          const isVideoEmbed = 
            src.includes('youtube.com') || 
            src.includes('youtu.be') ||
            src.includes('vimeo.com') ||
            src.includes('video') ||
            className.toLowerCase().includes('video') ||
            id.toLowerCase().includes('video');
          
          if (isVideoEmbed) {
            // Wait a bit for iframe video to load
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (e) {
          // Cross-origin iframes can't be accessed, skip
        }
      }
    });
    
    // Additional wait after video seeks to ensure frame is rendered
    await page.waitForTimeout(500);
    
    // Open hamburger menus that require interaction
    try {
      const hamburgerSelectors = [
        'button[aria-label*="menu" i]',
        'button[aria-label*="Menu" i]',
        '[class*="hamburger"]',
        '[class*="menu-button"]',
        '[id*="menu-toggle"]',
        '[id*="menu-button"]',
        '[class*="mobile-menu"] button',
        '[data-testid*="menu"]',
      ];
      
      for (const selector of hamburgerSelectors) {
        try {
          const menuBtn = await page.$(selector);
          if (menuBtn) {
            const isVisible = await menuBtn.isVisible();
            if (isVisible) {
              // Check if menu is already open
              const isExpanded = await page.evaluate((el) => {
                const htmlEl = el as HTMLElement;
                return htmlEl.getAttribute('aria-expanded') === 'true' ||
                       htmlEl.classList.contains('active') ||
                       htmlEl.classList.contains('open') ||
                       document.querySelector('nav[aria-hidden="false"]') !== null ||
                       document.querySelector('[class*="menu"][class*="open"]') !== null;
              }, menuBtn);
              
              if (!isExpanded) {
                // Click to open menu
                await menuBtn.click({ timeout: 2000 });
                await page.waitForTimeout(600); // Wait for menu animation
                break; // Only open one menu
              }
            }
          }
        } catch (e) {
          // Continue to next selector
        }
      }
    } catch (e) {
      // If hamburger menu handling fails, continue anyway
    }
    
    // Trigger hover on navigation menus to reveal dropdowns (using Playwright's hover for reliability)
    try {
      const navElements = await page.$$('nav a, nav button, [class*="nav"] a, [class*="menu"] a');
      
      // Try hovering on the first few nav elements to reveal dropdowns
      for (const el of navElements.slice(0, 3)) {
        try {
          const isVisible = await el.isVisible();
          if (isVisible) {
            await el.hover({ timeout: 1000 });
            await page.waitForTimeout(400); // Wait for dropdown animation
            
            // Check if a dropdown appeared
            const hasDropdown = await page.evaluate(() => {
              return document.querySelector('[class*="dropdown"][style*="display: block"], [class*="submenu"][style*="display: block"], [class*="menu"][style*="display: block"], [aria-expanded="true"]') !== null;
            });
            
            if (hasDropdown) {
              await page.waitForTimeout(500); // Wait for menu to fully appear
              break; // Found a menu, stop
            }
          }
        } catch (e) {
          // Continue to next element
        }
      }
    } catch (e) {
      // If hover fails, continue anyway
    }
    
    // Ensure masked text and CSS masks are properly rendered
    await page.evaluate(() => {
      // Force repaint of all elements with masks
      const elementsWithMasks = document.querySelectorAll('*');
      elementsWithMasks.forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        const style = window.getComputedStyle(htmlEl);
        
        // Check for mask properties
        if (style.maskImage && style.maskImage !== 'none') {
          // Force repaint by toggling visibility
          htmlEl.style.visibility = 'hidden';
          htmlEl.offsetHeight; // Force reflow
          htmlEl.style.visibility = '';
        }
        
        // Check for clip-path
        if (style.clipPath && style.clipPath !== 'none') {
          htmlEl.offsetHeight; // Force reflow
        }
        
        // Check for background-clip: text (gradient text)
        if (style.webkitBackgroundClip === 'text' || style.backgroundClip === 'text') {
          htmlEl.offsetHeight; // Force reflow
        }
        
        // Check for -webkit-text-fill-color (gradient text)
        if (style.webkitTextFillColor && style.webkitTextFillColor !== 'currentColor') {
          htmlEl.offsetHeight; // Force reflow
        }
      });
      
      // Force repaint of the entire document
      document.body.offsetHeight;
    });
    
    // Additional wait for any animations or dynamic content
    await page.waitForTimeout(3000);
    
    if (opts.fullPage) {
      await scrollToLoad(page);
    }

    // Final viewport check right before screenshot
    const finalViewport = page.viewportSize();
    if (!finalViewport || finalViewport.width !== viewportSize.width || finalViewport.height !== viewportSize.height) {
      await page.setViewportSize({
        width: viewportSize.width,
        height: viewportSize.height
      });
      await page.waitForTimeout(500);
    }
    
    // Extra settle wait per product requirement (9 seconds)
    console.log('[capture] extra settle wait 9s');
    await page.waitForTimeout(9000);

    // Get the actual rendered viewport dimensions from the browser
    const actualDimensions = await page.evaluate(() => {
      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio
      };
    });
    
    console.log('Actual browser dimensions:', actualDimensions);
    console.log('Expected dimensions:', viewportSize.width, 'x', viewportSize.height);
    
    // If dimensions don't match, something is wrong
    if (actualDimensions.viewportWidth !== viewportSize.width || actualDimensions.viewportHeight !== viewportSize.height) {
      console.warn(`Viewport mismatch! Expected ${viewportSize.width}x${viewportSize.height}, got ${actualDimensions.viewportWidth}x${actualDimensions.viewportHeight}`);
      // Force set again
      await page.setViewportSize({
        width: viewportSize.width,
        height: viewportSize.height
      });
      await page.waitForTimeout(500);
    }
    
    // Ensure we are at the very top, and the document fills the viewport height exactly
    await page.evaluate((size) => {
      window.scrollTo(0, 0);
      const docEl = document.documentElement;
      const body = document.body;
      if (docEl) {
        docEl.style.margin = '0';
        docEl.style.padding = '0';
        docEl.style.height = `${size.height}px`;
        docEl.style.overflow = 'hidden';
      }
      if (body) {
        body.style.margin = '0';
        body.style.padding = '0';
        body.style.minHeight = `${size.height}px`;
        body.style.overflow = 'hidden';
      }
    }, viewportSize);
    await page.emulateMedia({ media: 'screen' });
    
    // Final wait before capturing - increased to 10 seconds for page to fully stabilize
    console.log('[capture] Final wait before screenshot capture (10 seconds)...');
    await page.waitForTimeout(10000);
    
    // Verify page is actually loaded by checking scroll height and image loading status
    const pageStats = await page.evaluate(() => {
      return {
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
        readyState: document.readyState,
        imagesLoaded: Array.from(document.images).filter(img => img.complete && img.naturalHeight > 0).length,
        totalImages: document.images.length,
      };
    });
    console.log('[capture] Page stats before capture:', pageStats);
    
    // If there are still images loading, wait a bit more
    if (pageStats.imagesLoaded < pageStats.totalImages && pageStats.totalImages > 0) {
      const loadingRatio = pageStats.imagesLoaded / pageStats.totalImages;
      console.log(`[capture] Only ${(loadingRatio * 100).toFixed(1)}% of images loaded (${pageStats.imagesLoaded}/${pageStats.totalImages}), waiting additional 5 seconds...`);
      await page.waitForTimeout(5000);
      
      // Check again
      const updatedStats = await page.evaluate(() => {
        return {
          imagesLoaded: Array.from(document.images).filter(img => img.complete && img.naturalHeight > 0).length,
          totalImages: document.images.length,
        };
      });
      console.log(`[capture] After additional wait: ${updatedStats.imagesLoaded}/${updatedStats.totalImages} images loaded`);
    }
    
    // Take screenshot - use fullPage: false to get exactly the viewport size
    // This should match what you see when inspecting at 1200x900 in a real browser
    const buffer = await page.screenshot({ 
      type: 'png',
      fullPage: false // Captures exactly what's visible in the viewport
    }) as Buffer;

    const image = sharp(buffer).webp({ quality: 80 });
    const meta = await image.metadata();
    const webp = await image.toBuffer();

    await browser.close();
    
    return { 
      webp, 
      width: meta.width || 0, 
      height: meta.height || 0, 
      bytes: webp.length 
    };
  } catch (e) {
    await browser.close();
    throw e;
  }
}

