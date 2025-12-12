import env from "@/config/env.ts";
import { HostModel } from "@/types/models";

class RequestError extends Error {
  constructor(
    request: { method: string; endpoint: string },
    response: Response,
  ) {
    super(
      `[Failed to ${request.method} ${request.endpoint}] ${response.status} : ${response.statusText}`,
    );
    this.name = "RequestError";
  }
}

class API {
  private static async request(
    method: "GET" | "POST",
    endpoint: string,
    body: FormData | null = null,
  ): Promise<unknown> {
    const response = await fetch(`${env.api.baseUrl}/${endpoint}`, {
      method,
      body,
    });

    if (!response.ok) throw new RequestError({ method, endpoint }, response);

    return await response.json();
  }

  private static async get(endpoint: string): Promise<unknown> {
    return API.request("GET", endpoint);
  }

  private static async post(
    endpoint: string,
    body: FormData,
  ): Promise<unknown> {
    return API.request("POST", endpoint, body);
  }

  static async getHosts(): Promise<HostModel[]> {
    return (await API.get(env.api.get.hosts)) as Promise<HostModel[]>;
  }

  static async upload(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file, file.name);
    });

    return API.post(env.api.post.upload, formData);
  }
}

export { RequestError };
export default API;
