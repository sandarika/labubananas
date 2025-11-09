// Use localhost:8000 as default for development
export const API_BASE = "http://localhost:8000";

/**
 * Build a full API URL.
 * If API_BASE is empty, this will return a path relative to the current origin
 * (useful when you deploy Next and FastAPI to the same host and use relative
 * /api routes).
 */
export function apiUrl(path: string) {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return API_BASE ? `${API_BASE.replace(/\/$/, "")}${path}` : path;
}

// Type definitions matching backend schemas
export interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  union_id: number | null;
  created_at: string;
  feedbacks?: Feedback[];
}

export interface PostCreate {
  title: string;
  content: string;
}

export interface Feedback {
  id: number;
  post_id: number;
  anonymous: boolean;
  message: string;
  created_at: string;
}

export interface FeedbackCreate {
  message: string;
  anonymous?: boolean;
}

export interface Union {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  posts?: Post[];
}

export interface UnionCreate {
  name: string;
  description?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  union_id: number | null;
  created_at: string;
}

export interface EventCreate {
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  union_id?: number;
}

export interface PollOption {
  id: number;
  poll_id: number;
  text: string;
}

export interface Poll {
  id: number;
  question: string;
  union_id: number | null;
  created_at: string;
  options: PollOption[];
}

export interface PollCreate {
  question: string;
  union_id?: number;
  options: Array<{ text: string }>;
}

export interface PollResultOption {
  option_id: number;
  text: string;
  votes: number;
}

export interface PollResults {
  poll_id: number;
  question: string;
  results: PollResultOption[];
}

export interface ChatbotResponse {
  answer: string;
  suggestions: string[];
}

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

// Helper to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  async register(username: string, password: string, role: string = "member"): Promise<User> {
    return fetchWithAuth(apiUrl("/api/auth/register"), {
      method: "POST",
      body: JSON.stringify({ username, password, role }),
    });
  },

  async login(username: string, password: string): Promise<Token> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(apiUrl("/api/auth/token"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(error.detail || "Invalid credentials");
    }

    return response.json();
  },

  async getCurrentUser(): Promise<User> {
    return fetchWithAuth(apiUrl("/api/auth/me"));
  },
};

// Posts API
export const postsApi = {
  async getPostsByUnion(unionId: number, skip: number = 0, limit: number = 100): Promise<Post[]> {
    return fetchWithAuth(apiUrl(`/api/posts/union/${unionId}?skip=${skip}&limit=${limit}`));
  },

  async getPost(postId: number): Promise<Post> {
    return fetchWithAuth(apiUrl(`/api/posts/${postId}`));
  },

  async createPost(unionId: number, post: PostCreate): Promise<Post> {
    return fetchWithAuth(apiUrl(`/api/posts/union/${unionId}`), {
      method: "POST",
      body: JSON.stringify(post),
    });
  },
};

// Feedback API
export const feedbackApi = {
  async createFeedback(postId: number, feedback: FeedbackCreate): Promise<Feedback> {
    return fetchWithAuth(apiUrl(`/api/feedbacks/post/${postId}`), {
      method: "POST",
      body: JSON.stringify(feedback),
    });
  },

  async createGeneralFeedback(feedback: FeedbackCreate): Promise<Feedback> {
    return fetchWithAuth(apiUrl("/api/feedbacks/"), {
      method: "POST",
      body: JSON.stringify(feedback),
    });
  },

  async getFeedbackByPost(postId: number, skip: number = 0, limit: number = 100): Promise<Feedback[]> {
    return fetchWithAuth(apiUrl(`/api/feedbacks/post/${postId}?skip=${skip}&limit=${limit}`));
  },

  async getFeedback(feedbackId: number): Promise<Feedback> {
    return fetchWithAuth(apiUrl(`/api/feedbacks/${feedbackId}`));
  },
};

// Unions API
export const unionsApi = {
  async getUnions(skip: number = 0, limit: number = 100): Promise<Union[]> {
    return fetchWithAuth(apiUrl(`/api/unions/?skip=${skip}&limit=${limit}`));
  },

  async getUnion(unionId: number): Promise<Union> {
    return fetchWithAuth(apiUrl(`/api/unions/${unionId}`));
  },

  async createUnion(union: UnionCreate): Promise<Union> {
    return fetchWithAuth(apiUrl("/api/unions/"), {
      method: "POST",
      body: JSON.stringify(union),
    });
  },
};

// Events API
export const eventsApi = {
  async getEvents(skip: number = 0, limit: number = 100): Promise<Event[]> {
    return fetchWithAuth(apiUrl(`/api/events/?skip=${skip}&limit=${limit}`));
  },

  async createEvent(event: EventCreate): Promise<Event> {
    return fetchWithAuth(apiUrl("/api/events/"), {
      method: "POST",
      body: JSON.stringify(event),
    });
  },
};

// Polls API
export const pollsApi = {
  async getPolls(skip: number = 0, limit: number = 50): Promise<Poll[]> {
    return fetchWithAuth(apiUrl(`/api/polls/?skip=${skip}&limit=${limit}`));
  },

  async createPoll(poll: PollCreate): Promise<Poll> {
    return fetchWithAuth(apiUrl("/api/polls/"), {
      method: "POST",
      body: JSON.stringify(poll),
    });
  },

  async vote(pollId: number, optionId: number): Promise<PollResults> {
    return fetchWithAuth(apiUrl(`/api/polls/${pollId}/vote`), {
      method: "POST",
      body: JSON.stringify({ option_id: optionId }),
    });
  },

  async getResults(pollId: number): Promise<PollResults> {
    return fetchWithAuth(apiUrl(`/api/polls/${pollId}/results`));
  },
};

// Chatbot API
export const chatbotApi = {
  async ask(question: string): Promise<ChatbotResponse> {
    return fetchWithAuth(apiUrl("/api/chatbot/ask"), {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  },
};

export default apiUrl;
