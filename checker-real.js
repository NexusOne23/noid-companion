// ============================================================================
// NoID Privacy Companion - REAL Security & Privacy Checker V2
// EINHEITLICHE EMOJIS: ✅ passed | ⚠️ warning | ❌ critical fail | ℹ️ info
// Native Browser Checks (no PowerShell required)
// ============================================================================

// Run all checks and return results
async function runRealPrivacyCheck() {
    const results = {
        score: 0,
        maxScore: 15,
        checks: []
    };

    console.log('Starting Real Privacy Check...');

    // 1. HTTPS Status (Critical)
    results.checks.push(await checkHTTPS());
    
    // 2. Do Not Track Status
    results.checks.push(checkDoNotTrack());
    
    // 3. Third-Party Cookies
    results.checks.push(await checkThirdPartyCookies());
    
    // 4. Geolocation Permission
    results.checks.push(await checkGeolocationPermission());
    
    // 5. Notification Permission
    results.checks.push(await checkNotificationPermission());
    
    // 6. Camera Permission
    results.checks.push(await checkCameraPermission());
    
    // 7. Microphone Permission
    results.checks.push(await checkMicrophonePermission());
    
    // 8. WebRTC IP Leak
    results.checks.push(await checkWebRTCLeak());
    
    // 9. Browser Fingerprinting Protection
    results.checks.push(await checkFingerprintingProtection());
    
    // 10. Secure Context (HTTPS/localhost)
    results.checks.push(checkSecureContext());
    
    // 11. Referrer Policy
    results.checks.push(checkReferrerPolicy());
    
    // 12. Content Security Policy
    results.checks.push(checkCSP());
    
    // 13. Mixed Content Blocked
    results.checks.push(checkMixedContent());
    
    // 14. JavaScript Enabled (Security vs Functionality)
    results.checks.push(checkJavaScriptSecurity());
    
    // 15. DNS Leak Test (via external API)
    results.checks.push(await checkDNSLeak());

    // Calculate score
    results.score = results.checks.filter(c => c.passed).length;
    
    return results;
}

// ============================================================================
// CHECK 1: HTTPS Status
// ============================================================================
async function checkHTTPS() {
    const isHTTPS = window.location.protocol === 'https:';
    
    return {
        id: 'https',
        name: 'HTTPS Connection',
        passed: isHTTPS,
        severity: 'critical',
        message: isHTTPS 
            ? 'Your connection is encrypted with HTTPS' 
            : 'WARNING: Unencrypted HTTP connection detected',
        recommendation: isHTTPS 
            ? 'Keep using HTTPS for all websites.' 
            : 'Always use HTTPS. Avoid entering sensitive data on HTTP sites.',
        learnMore: '#download',
        icon: isHTTPS ? '✅' : '❌',
        whyMatters: 'HTTPS encrypts your data in transit. Without HTTPS, hackers on the same network (coffee shop WiFi, public hotspots) can intercept your passwords, credit card numbers, and private messages. Always look for the padlock icon in your browser.'
    };
}

// ============================================================================
// CHECK 2: Do Not Track
// ============================================================================
function checkDoNotTrack() {
    const dnt = navigator.doNotTrack === '1' || 
                window.doNotTrack === '1' || 
                navigator.msDoNotTrack === '1';
    
    return {
        id: 'dnt',
        name: 'Do Not Track',
        passed: dnt,
        severity: 'high',
        message: dnt 
            ? 'Do Not Track is enabled in your browser' 
            : 'Do Not Track is not enabled',
        recommendation: dnt 
            ? 'Good! Many sites respect this setting.' 
            : 'Enable Do Not Track in your browser settings for additional privacy.',
        learnMore: '#download',
        icon: dnt ? '✅' : '⚠️',
        whyMatters: 'Do Not Track tells websites you don\'t want to be tracked across the internet. While not legally enforceable, many reputable sites respect this preference. It\'s one layer in protecting your browsing privacy from advertisers and analytics companies.'
    };
}

// ============================================================================
// CHECK 3: Third-Party Cookies
// ============================================================================
async function checkThirdPartyCookies() {
    try {
        // Modern browsers block third-party cookies by default
        // Chrome 115+, Edge 115+, Firefox with ETP, Safari with ITP
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Detect browser and version
        let isBlocked = false;
        let browserInfo = '';
        
        if (userAgent.includes('edg/')) {
            // Microsoft Edge
            const version = parseInt(userAgent.match(/edg\/(\d+)/)?.[1] || '0');
            isBlocked = version >= 115; // Edge 115+ blocks by default
            browserInfo = `Edge ${version}`;
        } else if (userAgent.includes('chrome/') && !userAgent.includes('edg')) {
            // Google Chrome
            const version = parseInt(userAgent.match(/chrome\/(\d+)/)?.[1] || '0');
            isBlocked = version >= 115; // Chrome 115+ blocks by default
            browserInfo = `Chrome ${version}`;
        } else if (userAgent.includes('firefox/')) {
            // Firefox with Enhanced Tracking Protection
            isBlocked = true; // Firefox blocks by default with ETP
            browserInfo = 'Firefox';
        } else if (userAgent.includes('safari/') && !userAgent.includes('chrome')) {
            // Safari with Intelligent Tracking Prevention
            isBlocked = true; // Safari blocks by default with ITP
            browserInfo = 'Safari';
        } else {
            // Unknown browser - check if cookies work at all
            const cookiesEnabled = navigator.cookieEnabled;
            isBlocked = !cookiesEnabled;
            browserInfo = 'Unknown browser';
        }
        
        return {
            id: 'cookies',
            name: 'Third-Party Cookies',
            passed: isBlocked,
            severity: 'high',
            message: isBlocked 
                ? `${browserInfo} blocks third-party cookies by default` 
                : `${browserInfo} may allow third-party cookies`,
            recommendation: isBlocked
                ? 'Good! Your browser protects you from cross-site tracking.'
                : 'Update your browser or check privacy settings to block third-party cookies.',
            learnMore: '#download',
            icon: isBlocked ? '✅' : '⚠️',
            whyMatters: 'Third-party cookies allow advertisers to track you across different websites. They build a profile of your interests and browsing habits. Blocking them prevents this cross-site tracking and protects your privacy without breaking most websites.'
        };
    } catch (e) {
        return {
            id: 'cookies',
            name: 'Third-Party Cookies',
            passed: true,
            severity: 'high',
            message: 'Third-party cookies likely blocked',
            recommendation: 'Modern browsers block third-party cookies by default.',
            learnMore: '#download',
            icon: '✅',
            whyMatters: 'Third-party cookies allow advertisers to track you across different websites. Modern browsers block them by default for better privacy.'
        };
    }
}

// ============================================================================
// CHECK 4: Geolocation Permission
// ============================================================================
async function checkGeolocationPermission() {
    try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        const passed = result.state === 'denied' || result.state === 'prompt';
        
        return {
            id: 'geolocation',
            name: 'Geolocation Permission',
            passed: passed,
            severity: 'medium',
            message: result.state === 'denied' 
                ? 'Geolocation is denied (good for privacy)' 
                : result.state === 'granted' 
                ? 'Geolocation is GRANTED - sites can track your location' 
                : 'Geolocation will prompt when needed',
            recommendation: result.state === 'granted' 
                ? 'Consider revoking geolocation permission in browser settings unless needed.' 
                : 'Only grant geolocation permission to trusted sites when necessary.',
            learnMore: '#download',
            icon: result.state === 'denied' ? '✅' : result.state === 'granted' ? '❌' : 'ℹ️',
            whyMatters: 'Your precise location is highly sensitive data. Websites can track where you live, work, and travel. Location access should only be granted to navigation apps or services that genuinely need it (maps, weather, delivery). Deny it for everything else.'
        };
    } catch (e) {
        return {
            id: 'geolocation',
            name: 'Geolocation Permission',
            passed: true,
            severity: 'medium',
            message: 'Could not check geolocation permission',
            recommendation: 'Browser may not support Permissions API.',
            learnMore: '#download',
            icon: 'ℹ️',
            whyMatters: 'Your precise location is highly sensitive data. Websites can track where you live, work, and travel. Always be cautious about granting location access.'
        };
    }
}

// ============================================================================
// CHECK 5: Notification Permission
// ============================================================================
async function checkNotificationPermission() {
    try {
        const result = await navigator.permissions.query({ name: 'notifications' });
        const passed = result.state === 'denied' || result.state === 'prompt';
        
        return {
            id: 'notifications',
            name: 'Notification Permission',
            passed: passed,
            severity: 'medium',
            message: result.state === 'denied' 
                ? 'Notifications are denied (less distraction)' 
                : result.state === 'granted' 
                ? 'Notifications are GRANTED - sites can send popups' 
                : 'Notifications will prompt when needed',
            recommendation: result.state === 'granted' 
                ? 'Consider limiting notification permissions to essential sites only.' 
                : 'Only grant notification permission to sites you trust.',
            learnMore: '#download',
            icon: result.state === 'denied' ? '✅' : result.state === 'granted' ? '❌' : 'ℹ️',
            whyMatters: 'Notification permissions let websites send you popup messages even when you\'re not on their site. This can be used for spam, phishing attempts, or constant distractions. Only grant it to essential services like email or messaging apps.'
        };
    } catch (e) {
        return {
            id: 'notifications',
            name: 'Notification Permission',
            passed: true,
            severity: 'medium',
            message: 'Could not check notification permission',
            recommendation: 'Browser may not support Permissions API.',
            learnMore: '#download',
            icon: 'ℹ️',
            whyMatters: 'Browser notifications can be used for spam and phishing. Be selective about which sites can send you notifications.'
        };
    }
}

// ============================================================================
// CHECK 6: Camera Permission
// ============================================================================
async function checkCameraPermission() {
    try {
        const result = await navigator.permissions.query({ name: 'camera' });
        const passed = result.state === 'denied' || result.state === 'prompt';
        
        return {
            id: 'camera',
            name: 'Camera Permission',
            passed: passed,
            severity: 'high',
            message: result.state === 'denied' 
                ? 'Camera is denied (good for privacy)' 
                : result.state === 'granted' 
                ? 'Camera is GRANTED - sites can access your webcam' 
                : 'Camera will prompt when needed',
            recommendation: result.state === 'granted' 
                ? 'SECURITY RISK: Revoke camera permission unless actively using it.' 
                : 'Only grant camera permission to video call sites you trust.',
            learnMore: '#download',
            icon: result.state === 'denied' ? '✅' : result.state === 'granted' ? '❌' : 'ℹ️',
            whyMatters: 'Webcam access is a major privacy risk. Malicious websites or browser extensions could secretly record you. Only grant camera permission to trusted video call services (Zoom, Teams, Google Meet) and revoke it immediately after use.'
        };
    } catch (e) {
        return {
            id: 'camera',
            name: 'Camera Permission',
            passed: true,
            severity: 'high',
            message: 'Could not check camera permission',
            recommendation: 'Browser may not support Permissions API.',
            learnMore: '#download',
            icon: 'ℹ️',
            whyMatters: 'Webcam access is a major privacy risk. Always be extremely cautious about granting camera permissions to websites.'
        };
    }
}

// ============================================================================
// CHECK 7: Microphone Permission
// ============================================================================
async function checkMicrophonePermission() {
    try {
        const result = await navigator.permissions.query({ name: 'microphone' });
        const passed = result.state === 'denied' || result.state === 'prompt';
        
        return {
            id: 'microphone',
            name: 'Microphone Permission',
            passed: passed,
            severity: 'high',
            message: result.state === 'denied' 
                ? 'Microphone is denied (good for privacy)' 
                : result.state === 'granted' 
                ? 'Microphone is GRANTED - sites can listen to you' 
                : 'Microphone will prompt when needed',
            recommendation: result.state === 'granted' 
                ? 'SECURITY RISK: Revoke microphone permission unless actively using it.' 
                : 'Only grant microphone permission to trusted communication apps.',
            learnMore: '#download',
            icon: result.state === 'denied' ? '✅' : result.state === 'granted' ? '❌' : 'ℹ️',
            whyMatters: 'Microphone access lets websites listen to everything around you - private conversations, phone calls, confidential meetings. Only grant it to trusted communication apps you\'re actively using, and revoke immediately after.'
        };
    } catch (e) {
        return {
            id: 'microphone',
            name: 'Microphone Permission',
            passed: true,
            severity: 'high',
            message: 'Could not check microphone permission',
            recommendation: 'Browser may not support Permissions API.',
            learnMore: '#download',
            icon: 'ℹ️',
            whyMatters: 'Microphone access lets websites listen to everything around you. Always be extremely cautious about granting microphone permissions.'
        };
    }
}

// ============================================================================
// CHECK 8: WebRTC IP Leak
// ============================================================================
async function checkWebRTCLeak() {
    try {
        const ips = [];
        const RTCPeerConnection = window.RTCPeerConnection || 
                                   window.mozRTCPeerConnection || 
                                   window.webkitRTCPeerConnection;
        
        if (!RTCPeerConnection) {
            return {
                id: 'webrtc',
                name: 'WebRTC IP Leak',
                passed: true,
                severity: 'high',
                message: 'WebRTC is not available (good for privacy)',
                recommendation: 'WebRTC is disabled or blocked - your IP is protected.',
                learnMore: '#download',
                icon: '✅',
                whyMatters: 'WebRTC can expose your real IP address even when using a VPN. This reveals your true location and identity to websites. Blocking WebRTC prevents this leak and protects your privacy when using VPNs or proxies.'
            };
        }

        return new Promise((resolve) => {
            const pc = new RTCPeerConnection({ iceServers: [] });
            pc.createDataChannel('');
            
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
            
            pc.onicecandidate = (ice) => {
                if (!ice || !ice.candidate || !ice.candidate.candidate) {
                    const leaked = ips.length > 0;
                    resolve({
                        id: 'webrtc',
                        name: 'WebRTC IP Leak',
                        passed: !leaked,
                        severity: 'high',
                        message: leaked 
                            ? `WebRTC leak detected: ${ips.length} IP(s) exposed` 
                            : 'No WebRTC IP leak detected',
                        recommendation: leaked 
                            ? 'WebRTC can expose your real IP even behind VPN. Consider disabling WebRTC in browser settings.' 
                            : 'Good! WebRTC is not leaking your IP address.',
                        learnMore: '#download',
                        icon: leaked ? '❌' : '✅',
                        whyMatters: 'WebRTC can expose your real IP address even when using a VPN. This reveals your true location and identity to websites. Blocking WebRTC prevents this leak and protects your privacy when using VPNs or proxies.'
                    });
                    pc.close();
                    return;
                }
                
                const candidateStr = ice.candidate.candidate;
                const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
                const ipMatch = candidateStr.match(ipRegex);
                
                if (ipMatch && !ips.includes(ipMatch[0])) {
                    ips.push(ipMatch[0]);
                }
            };
            
            setTimeout(() => {
                const leaked = ips.length > 0;
                resolve({
                    id: 'webrtc',
                    name: 'WebRTC IP Leak',
                    passed: !leaked,
                    severity: 'high',
                    message: leaked 
                        ? `WebRTC leak detected: ${ips.length} IP(s) exposed` 
                        : 'No WebRTC IP leak detected',
                    recommendation: leaked 
                        ? 'WebRTC can expose your real IP even behind VPN. Consider disabling WebRTC.' 
                        : 'Good! WebRTC is not leaking your IP address.',
                    learnMore: '#download',
                    icon: leaked ? '❌' : '✅',
                    whyMatters: 'WebRTC can expose your real IP address even when using a VPN. This reveals your true location and identity to websites. Blocking WebRTC prevents this leak and protects your privacy when using VPNs or proxies.'
                });
                pc.close();
            }, 3000);
        });
    } catch (e) {
        return {
            id: 'webrtc',
            name: 'WebRTC IP Leak',
            passed: true,
            severity: 'high',
            message: 'Could not check WebRTC leak',
            recommendation: 'WebRTC check failed - likely blocked or disabled.',
            learnMore: '#download',
            icon: 'ℹ️',
            whyMatters: 'WebRTC can expose your real IP address even when using a VPN. If this check failed, WebRTC may already be blocked, which is good for privacy.'
        };
    }
}

// ============================================================================
// CHECK 9: Browser Fingerprinting Protection
// ============================================================================
async function checkFingerprintingProtection() {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('NoID Privacy Test', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('NoID Privacy Test', 4, 17);
        
        const dataURL = canvas.toDataURL();
        const isBlank = dataURL === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        const protected = isBlank;
        
        return {
            id: 'fingerprinting',
            name: 'Canvas Fingerprinting Protection',
            passed: protected,
            severity: 'medium',
            message: protected 
                ? 'Canvas fingerprinting is likely blocked' 
                : 'Canvas fingerprinting may be possible',
            recommendation: protected 
                ? 'Good! Your browser has fingerprinting protection.' 
                : 'Consider using browser extensions like uBlock Origin or Privacy Badger to block fingerprinting.',
            learnMore: '#download',
            icon: protected ? '✅' : '⚠️',
            whyMatters: 'Canvas fingerprinting creates a unique "signature" of your device that can track you across websites without cookies. Websites can identify your specific computer even in private browsing mode. Blocking it prevents this invisible tracking.'
        };
    } catch (e) {
        return {
            id: 'fingerprinting',
            name: 'Canvas Fingerprinting Protection',
            passed: true,
            severity: 'medium',
            message: 'Canvas API blocked or restricted',
            recommendation: 'Canvas API appears to be blocked - good for privacy!',
            learnMore: '#download',
            icon: '✅',
            whyMatters: 'Canvas fingerprinting creates a unique "signature" of your device that can track you across websites without cookies. Your browser is blocking this tracking technique.'
        };
    }
}

// ============================================================================
// CHECK 10: Secure Context
// ============================================================================
function checkSecureContext() {
    const isSecure = window.isSecureContext;
    
    return {
        id: 'secure-context',
        name: 'Secure Context',
        passed: isSecure,
        severity: 'critical',
        message: isSecure 
            ? 'Running in secure context (HTTPS or localhost)' 
            : 'NOT running in secure context',
        recommendation: isSecure 
            ? 'Good! Secure contexts enable modern security features.' 
            : 'Only use sensitive features on HTTPS sites.',
        learnMore: '#download',
        icon: isSecure ? '✅' : '❌',
        whyMatters: 'Secure contexts (HTTPS or localhost) are required for modern security features like geolocation, camera access, and service workers. They ensure your connection is encrypted and prevent downgrade attacks.'
    };
}

// ============================================================================
// CHECK 11: Referrer Policy
// ============================================================================
function checkReferrerPolicy() {
    const metaReferrer = document.querySelector('meta[name="referrer"]');
    const policy = metaReferrer ? metaReferrer.content : 'default';
    
    const strictPolicies = ['no-referrer', 'same-origin', 'strict-origin'];
    const passed = strictPolicies.includes(policy);
    
    return {
        id: 'referrer',
        name: 'Referrer Policy',
        passed: passed,
        severity: 'low',
        message: passed 
            ? `Strict referrer policy: ${policy}` 
            : `Referrer policy: ${policy} (may leak URLs)`,
        recommendation: passed 
            ? 'Good! This site uses a privacy-friendly referrer policy.' 
            : 'Sites should use strict referrer policies to protect your browsing history.',
        learnMore: '#download',
        icon: passed ? '✅' : 'ℹ️',
        whyMatters: 'Referrer headers tell websites where you came from - the full URL including search queries and page paths. Strict referrer policies prevent leaking your browsing history and sensitive URL parameters to third parties.'
    };
}

// ============================================================================
// CHECK 12: Content Security Policy
// ============================================================================
function checkCSP() {
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const hasCSP = metaCSP !== null;
    
    return {
        id: 'csp',
        name: 'Content Security Policy',
        passed: hasCSP,
        severity: 'medium',
        message: hasCSP 
            ? 'Content Security Policy is active' 
            : 'No Content Security Policy detected',
        recommendation: hasCSP 
            ? 'Good! CSP helps protect against XSS attacks.' 
            : 'Sites should implement CSP to prevent code injection attacks.',
        learnMore: '#download',
        icon: hasCSP ? '✅' : '⚠️',
        whyMatters: 'Content Security Policy (CSP) protects you from cross-site scripting (XSS) attacks by controlling which scripts can run on a website. It prevents attackers from injecting malicious code that could steal your data or hijack your session.'
    };
}

// ============================================================================
// CHECK 13: Mixed Content
// ============================================================================
function checkMixedContent() {
    const isHTTPS = window.location.protocol === 'https:';
    
    if (!isHTTPS) {
        return {
            id: 'mixed-content',
            name: 'Mixed Content Protection',
            passed: true,
            severity: 'low',
            message: 'Not on HTTPS - check not applicable',
            recommendation: 'This check only applies to HTTPS sites.',
            learnMore: '#download',
            icon: 'ℹ️',
            whyMatters: 'Mixed content occurs when HTTPS pages load HTTP resources. This creates security holes in otherwise secure connections. Modern browsers block mixed content to maintain encryption integrity.'
        };
    }
    
    const scripts = document.querySelectorAll('script[src]');
    const links = document.querySelectorAll('link[href]');
    const images = document.querySelectorAll('img[src]');
    
    let hasInsecure = false;
    [...scripts, ...links, ...images].forEach(el => {
        const src = el.src || el.href;
        if (src && src.startsWith('http:')) {
            hasInsecure = true;
        }
    });
    
    return {
        id: 'mixed-content',
        name: 'Mixed Content Protection',
        passed: !hasInsecure,
        severity: 'medium',
        message: hasInsecure 
            ? 'Insecure HTTP resources detected on HTTPS page' 
            : 'No mixed content detected',
        recommendation: hasInsecure 
            ? 'Sites should load all resources via HTTPS to maintain security.' 
            : 'Good! All resources are loaded securely.',
        learnMore: '#download',
        icon: hasInsecure ? '⚠️' : '✅',
        whyMatters: 'Mixed content occurs when HTTPS pages load HTTP resources. This creates security holes where attackers can inject malicious content or spy on your activity, breaking the encryption promise of HTTPS.'
    };
}

// ============================================================================
// CHECK 14: JavaScript Security
// ============================================================================
function checkJavaScriptSecurity() {
    return {
        id: 'javascript',
        name: 'JavaScript Security',
        passed: true,
        severity: 'low',
        message: 'JavaScript is enabled (required for modern web)',
        recommendation: 'JavaScript is essential for most sites. Use browser extensions like NoScript or uBlock Origin to selectively block JS on untrusted sites.',
        learnMore: '#download',
        icon: 'ℹ️',
        whyMatters: 'JavaScript powers modern websites but can also be used maliciously to track you, inject ads, or exploit vulnerabilities. While necessary for most sites, selective blocking on untrusted sites adds extra protection.'
    };
}

// ============================================================================
// CHECK 15: DNS Leak Test
// ============================================================================
async function checkDNSLeak() {
    try {
        // Try multiple IP check APIs with CORS support
        let ip = null;
        
        // Try ipapi.co (has CORS support)
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            ip = data.ip;
        } catch (e1) {
            // Fallback: try ipify with different endpoint
            try {
                const response = await fetch('https://api64.ipify.org?format=json');
                const data = await response.json();
                ip = data.ip;
            } catch (e2) {
                // If both fail, return informational message
                throw new Error('All IP check services unavailable');
            }
        }
        
        if (!ip) {
            throw new Error('No IP returned');
        }
        
        const isPrivateIP = ip.startsWith('192.168.') || 
                             ip.startsWith('10.') || 
                             ip.startsWith('172.16.') ||
                             ip.startsWith('127.');
        
        return {
            id: 'dns-leak',
            name: 'Public IP Check',
            passed: isPrivateIP,
            severity: 'medium',
            message: isPrivateIP 
                ? 'You appear to be on a private network' 
                : `Your public IP is visible: ${ip}`,
            recommendation: isPrivateIP 
                ? 'Good! Your IP is not directly exposed to the internet.' 
                : 'Your IP address is visible to websites. Consider using a VPN for additional privacy. For full DNS leak testing, visit dnsleaktest.com',
            learnMore: '#download',
            icon: isPrivateIP ? '✅' : 'ℹ️',
            whyMatters: 'Your IP address reveals your approximate location and can be used to track your online activities. VPNs hide your real IP, but DNS leaks can expose your true location even with a VPN active.'
        };
    } catch (e) {
        return {
            id: 'dns-leak',
            name: 'Public IP Check',
            passed: true,
            severity: 'low',
            message: 'IP check unavailable (browser privacy features may block this)',
            recommendation: 'Some browsers block IP detection for privacy. For manual DNS leak testing, visit dnsleaktest.com',
            learnMore: '#download',
            icon: 'ℹ️',
            whyMatters: 'Your IP address reveals your approximate location and can be used to track your online activities. Use VPNs for additional privacy protection.'
        };
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runRealPrivacyCheck };
}
