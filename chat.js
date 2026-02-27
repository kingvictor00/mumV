export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { query } = req.body;

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_KEY,
        query: `Optimum blockchain ${query}`,
        search_depth: "basic",
        max_results: 4,
        include_domains: [
          "getoptimum.xyz",
          "docs.getoptimum.xyz",
          "mirror.xyz",
          "cryptorank.io",
          "blockworks.co",
          "cryptorank.io",
          "coindesk.com",
          "decrypt.co"
        ],
      }),
    });

    const data = await response.json();

    const results = (data.results || [])
      .map(r => `**${r.title}**\n${r.content}\nSource: ${r.url}`)
      .join("\n\n---\n\n");

    res.status(200).json({ results: results || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ results: null });
  }
}
