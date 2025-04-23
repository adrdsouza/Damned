<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, isAuthenticated } from "$lib/stores/userStore";
  import { ChevronRight } from "lucide-svelte";
  import toast from "svelte-french-toast";
  import { z } from "zod";
  import { superForm } from "sveltekit-superforms/client";
  
  // Define the form schema
  const ticketSchema = z.object({
    subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
    description: z.string().min(20, { message: "Description must be at least 20 characters" }),
    category: z.enum(["technical", "billing", "shipping", "product", "other"], {
      required_error: "Please select a category",
    }),
    priority: z.enum(["low", "medium", "high", "urgent"], {
      required_error: "Please select a priority",
    }),
    order_id: z.string().optional(),
  });
  
  // Initialize the form
  const { form, errors, enhance } = superForm(ticketSchema, {
    id: 'new-ticket',
    dataType: 'json',
    onSubmit: async ({ formData, cancel }) => {
      try {
        const response = await fetch('/api/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subject: formData.get('subject'),
            description: formData.get('description'),
            category: formData.get('category'),
            priority: formData.get('priority'),
            order_id: formData.get('order_id')
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to create ticket');
          cancel();
          return;
        }
        
        return {
          success: true
        };
      } catch (error) {
        console.error('Error creating ticket:', error);
        toast.error('Failed to create ticket. Please try again.');
        cancel();
      }
    },
    onResult: ({ result }) => {
      if (result.type === 'success') {
        toast.success('Ticket submitted successfully!');
        goto('/help/tickets');
      }
    }
  });
  
  // Get user's orders for the dropdown
  let orders = [];
  
  onMount(() => {
    if (!$isAuthenticated) {
      goto('/login');
      return;
    }
    
    // In a real app, fetch the user's orders
    // For now, use mock data
    if ($user && $user.orders) {
      orders = $user.orders.map(order => ({
        id: order.id,
        date: new Date(order.date).toLocaleDateString(),
        total: order.total
      }));
    }
  });
</script>

<svelte:head>
  <title>Create New Support Ticket | Damned Designs</title>
  <meta name="description" content="Submit a new support ticket to get help from our customer service team." />
</svelte:head>

<div class="container py-12">
  <div class="flex items-center text-sm mb-6">
    <a href="/" class="hover:underline">Home</a>
    <ChevronRight size={16} class="mx-2" />
    <a href="/help" class="hover:underline">Support</a>
    <ChevronRight size={16} class="mx-2" />
    <a href="/help/tickets" class="hover:underline">My Tickets</a>
    <ChevronRight size={16} class="mx-2" />
    <span>New Ticket</span>
  </div>
  
  <h1 class="text-3xl font-bold mb-8">Create New Support Ticket</h1>
  
  <div class="max-w-3xl mx-auto">
    <div class="bg-white p-8 rounded-lg shadow-sm">
      <form use:enhance class="space-y-6">
        <div>
          <label for="subject" class="block font-bold mb-2">Subject <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            id="subject" 
            bind:value={$form.subject}
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Brief summary of your issue"
          />
          {#if $errors.subject}
            <p class="text-red-500 text-sm mt-1">{$errors.subject}</p>
          {/if}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="category" class="block font-bold mb-2">Category <span class="text-red-500">*</span></label>
            <select 
              id="category" 
              bind:value={$form.category}
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="" disabled selected>Select a category</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="shipping">Shipping</option>
              <option value="product">Product</option>
              <option value="other">Other</option>
            </select>
            {#if $errors.category}
              <p class="text-red-500 text-sm mt-1">{$errors.category}</p>
            {/if}
          </div>
          
          <div>
            <label for="priority" class="block font-bold mb-2">Priority <span class="text-red-500">*</span></label>
            <select 
              id="priority" 
              bind:value={$form.priority}
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="" disabled selected>Select a priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            {#if $errors.priority}
              <p class="text-red-500 text-sm mt-1">{$errors.priority}</p>
            {/if}
          </div>
        </div>
        
        {#if orders.length > 0}
          <div>
            <label for="order_id" class="block font-bold mb-2">Related Order (Optional)</label>
            <select 
              id="order_id" 
              bind:value={$form.order_id}
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">None</option>
              {#each orders as order}
                <option value={order.id}>Order #{order.id} - {order.date} (${order.total.toFixed(2)})</option>
              {/each}
            </select>
          </div>
        {/if}
        
        <div>
          <label for="description" class="block font-bold mb-2">Description <span class="text-red-500">*</span></label>
          <textarea 
            id="description" 
            bind:value={$form.description}
            rows="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Please provide as much detail as possible about your issue"
          ></textarea>
          {#if $errors.description}
            <p class="text-red-500 text-sm mt-1">{$errors.description}</p>
          {/if}
        </div>
        
        <div class="pt-4">
          <button type="submit" class="btn btn-primary w-full">Submit Ticket</button>
        </div>
      </form>
    </div>
    
    <div class="mt-8 bg-gray-50 p-6 rounded-lg">
      <h2 class="text-xl font-bold mb-4">Before Submitting a Ticket</h2>
      <p class="mb-4">To help us resolve your issue more quickly, please:</p>
      <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Check our <a href="/help" class="text-primary hover:underline">FAQ section</a> to see if your question has already been answered</li>
        <li>Include any relevant order numbers or product information</li>
        <li>Be as specific as possible about the issue you're experiencing</li>
        <li>Attach screenshots or photos if they help illustrate the problem</li>
      </ul>
    </div>
  </div>
</div>