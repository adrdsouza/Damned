import { j as json } from "../../../../../../chunks/index.js";
const mockMessages = {
  "1": [
    {
      id: "1",
      message: "I placed an order a week ago and haven't received it yet. The tracking number doesn't show any updates for the past 3 days.",
      is_from_customer: true,
      created_at: "2023-12-01T10:30:00Z",
      user_id: "user123",
      ticket_id: "1"
    }
  ],
  "2": [
    {
      id: "2",
      message: "I would like to know more details about the warranty for the Djinn XL knife. Does it cover normal wear and tear?",
      is_from_customer: true,
      created_at: "2023-11-28T14:15:00Z",
      user_id: "user123",
      ticket_id: "2"
    },
    {
      id: "3",
      message: "Thank you for your inquiry. Our knives come with a lifetime warranty against manufacturing defects. This includes issues with the blade, handle, or locking mechanism that occur under normal use. It does not cover normal wear and tear, damage from misuse, or cosmetic issues that don't affect functionality. Could you please let me know if you're experiencing a specific issue with your knife?",
      is_from_customer: false,
      created_at: "2023-11-29T09:45:00Z",
      ticket_id: "2"
    }
  ],
  "3": [
    {
      id: "4",
      message: "I was charged twice for my recent order #12345. Please help me resolve this issue as soon as possible.",
      is_from_customer: true,
      created_at: "2023-11-20T08:00:00Z",
      user_id: "user123",
      ticket_id: "3"
    },
    {
      id: "5",
      message: "I apologize for the inconvenience. I can see the duplicate charge in our system. We will process a refund for the extra charge immediately.",
      is_from_customer: false,
      created_at: "2023-11-20T10:15:00Z",
      ticket_id: "3"
    },
    {
      id: "6",
      message: "The refund has been processed and should appear in your account within 3-5 business days.",
      is_from_customer: false,
      created_at: "2023-11-22T11:30:00Z",
      ticket_id: "3"
    },
    {
      id: "7",
      message: "Thank you for your help. I received the refund.",
      is_from_customer: true,
      created_at: "2023-11-24T09:20:00Z",
      user_id: "user123",
      ticket_id: "3"
    }
  ]
};
async function GET({ params }) {
  try {
    const { id } = params;
    await new Promise((resolve) => setTimeout(resolve, 500));
    const messages = mockMessages[id] || [];
    return json({ messages });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
async function POST({ params, request }) {
  try {
    const { id } = params;
    await new Promise((resolve) => setTimeout(resolve, 500));
    const messageData = await request.json();
    if (!messageData.message) {
      return json({ error: "Message is required" }, { status: 400 });
    }
    const newMessage = {
      id: Date.now().toString(),
      message: messageData.message,
      is_from_customer: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      user_id: "user123",
      ticket_id: id
    };
    return json({ message: newMessage });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
export {
  GET,
  POST
};
