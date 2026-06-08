import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url as string;

  if (!url || !url.startsWith("http")) {
    throw createError({ statusCode: 400, statusMessage: "Missing or invalid url query param" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });

    const html = await response.text();

    let proxyHtml = html;

    proxyHtml = proxyHtml.replace(/<base\s[^>]*>/gi, "");
    proxyHtml = proxyHtml.replace(/<base\s[^>]*\/>/gi, "");
    proxyHtml = proxyHtml.replace(/<\/head>/i, `<base href="${url}">\n</head>`);

    proxyHtml = proxyHtml.replace(
      /<\/head>/i,
      `<style>
        body { margin: 0; padding: 0; }
        iframe, frame, object, embed { display: none !important; }
      </style>\n</head>`
    );

    const headers = new Headers();
    headers.set("Content-Type", "text/html; charset=utf-8");
    headers.set("X-Frame-Options", "ALLOWALL");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET");

    for (const h of ["x-frame-options", "content-security-policy", "x-content-type-options"]) {
      if (response.headers.get(h)) {
        // stripped
      }
    }

    return new Response(proxyHtml, {
      status: response.status,
      headers,
    });
  } catch (e) {
    throw createError({ statusCode: 502, statusMessage: `Proxy error: ${e instanceof Error ? e.message : "Unknown"}` });
  }
});
