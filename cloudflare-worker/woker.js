const rollingDuration = 13000;

export default {
  async fetch(request, env, ctx) {

    const url = new URL(request.url);
    const path = url.pathname;

    if (!this.verifyAuth(request, env.SECRET_KEY)) {
      return new Response("Unauthorized\n" + await this.hash(env.SECRET_KEY + Math.floor(Date.now() / 13000)) + "\n" + request.headers.get("Authorization"), {status: 401 });
    }

    if (path.startsWith("/revenge")) {
        if(request.method === "POST")
          return this.addRevange(request, env.DB);
        if(request.method === "GET")
          return this.listRevenge(env.DB);
        if(request.method === "DELETE")
          return this.deleteRevenge(path.split("/")[2], env.DB);
    }

    return new Response("Not Found", { status: 404 })
  },


  verifyAuth(request, secretKey) {
    const auth = request.headers.get("Authorization");

    return this.hash(secretKey + Math.floor(Date.now() / rollingDuration))
    ||  this.hash(secretKey + Math.floor((Date.now() / rollingDuration) - 1)) // 1 sec before too

  },

  async addRevange(request, db) {
    const { name, reason, vulnerabilities } = await request.json();
    if (!name || !reason || !vulnerabilities) {
      return new Response("Invalid arguments", {status: 400})
    }

    const id = crypto.randomUUID();
    await db.put(id, JSON.stringify({ name, reason, vulnerabilities, timestamp: Date.now() }));

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json"}
    });
  },

  async deleteRevenge(id, db) {
    await db.delete(id);
    return new Response(JSON.stringify({ success: true}), {
      headers: { "Content-Type": "application/json" }
    });
  },

  async listRevenge(db) {
    const keys = await db.list();
    const entries = [];

    for (const key of keys.keys) {
      const data = await db.get(key.name);
      entries.push({ id: key.name, ...JSON.parse(data) });
    }

    return new Response(JSON.stringify(entries), {
      headers: { "Content-Type": "application/json" }
    });
  },

  hash(text) {
    const encoder = new TextEncoder();
    return crypto.subtle.digest("SHA-256", encoder.encode(text)).then((buffer) => {
      return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0")).join("");
    })
  }
};