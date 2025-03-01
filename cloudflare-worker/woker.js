export default {
    async fetch(request, env, ctx) {
  
      const url = new URL(request.url);
      const path = url.pathname;
  
      if (path.startsWith("/revange") && !this.verifyAuth(request, env.SECRET_KEY)) {
        return new Response("Unauthorized", {status: 401 });
      }
  
  
      if (path == "/auth" && request.method === "POST") {
        return this.handleAuth(env.SECRET_KEY);
      }
  
      else if (path == "/revenge") {
        switch (request.method) {
          case "POST":
            return this.addRevange(request, env.DB);
          case "GET":
            return this.listRevange(env.DB);
        }
      }
  
      else if (path.startsWith("/revenge/") && request.method === "DELETE") {
        const id = path.split("/")[2];
        return this.deleteRevenge(id, env.DB);
      }
      
  
      return new Response("Not Found", { status: 404 })
    },
  
    handleAuth(secretKey) {
      const timeBlock = Math.floor(Date.now() / 13000);
      const authKey = this.hash(secretKey + timeBlock);
  
      return new Response(JSON.stringify({ auth_key: authKey}), {
        headers: {"Content-Type": "application/json"}
      });
    },
  
    verifyAuth(request, secretKey) {
      const authHeader = request.headers.get("auth");
      if (!authHeader) return false;
  
      const timeBlock = Math.floor(Date.now() / 13000); // change password every 13 seconds
      const validKeys = [
        this.hash(secretKey + timeBlock),
        this.hash(secretKey (timeBlock - 1))
      ];
  
      return validKeys.includes(authHeader);
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