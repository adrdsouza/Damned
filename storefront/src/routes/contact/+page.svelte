<script lang="ts">
  import { ChevronRight } from "lucide-svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { z } from "zod";
  import toast from "svelte-french-toast";
  
  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    subject: z.string().min(2, { message: "Subject is required" }),
    message: z.string().min(10, { message: "Message must be at least 10 characters" })
  });
  
  const { form, errors, enhance } = superForm(formSchema, {
    id: 'contact',
    dataType: 'json',
    onSubmit: () => {
      // In a real app, this would submit to a server endpoint
      return {
        success: true
      };
    },
    onResult: ({ result }) => {
      if (result.type === 'success') {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        // Reset form
        $form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
      }
    }
  });
</script>

<svelte:head>
  <title>Contact Us | Damned Designs</title>
  <meta name="description" content="Get in touch with Damned Designs. We'd love to hear from you about our products, answer your questions, or discuss custom orders." />
</svelte:head>

<div class="container py-12">
  <div class="flex items-center text-sm mb-6">
    <a href="/" class="hover:underline">Home</a>
    <ChevronRight size={16} class="mx-2" />
    <span>Contact Us</span>
  </div>
  
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-8">Contact Us</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <p class="mb-6">
          We'd love to hear from you! Whether you have questions about our products, need assistance with an order, or want to discuss a custom design, our team is here to help.
        </p>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-bold mb-2">Email</h3>
            <p>info@damneddesigns.com</p>
          </div>
          
          <div>
            <h3 class="text-lg font-bold mb-2">Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>
          
          <div>
            <h3 class="text-lg font-bold mb-2">Hours</h3>
            <p>Monday - Friday: 9am - 5pm EST</p>
            <p>Saturday: 10am - 3pm EST</p>
            <p>Sunday: Closed</p>
          </div>
          
          <div>
            <h3 class="text-lg font-bold mb-2">Social Media</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-primary hover:text-gray-700">Instagram</a>
              <a href="#" class="text-primary hover:text-gray-700">Facebook</a>
              <a href="#" class="text-primary hover:text-gray-700">Twitter</a>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 class="text-2xl font-bold mb-6">Send us a message</h2>
        
        <form method="POST" use:enhance>
          <div class="mb-4">
            <label for="name" class="block mb-2 font-bold">Name</label>
            <input 
              type="text" 
              id="name" 
              bind:value={$form.name} 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {#if $errors.name}
              <p class="text-red-500 text-sm mt-1">{$errors.name}</p>
            {/if}
          </div>
          
          <div class="mb-4">
            <label for="email" class="block mb-2 font-bold">Email</label>
            <input 
              type="email" 
              id="email" 
              bind:value={$form.email} 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {#if $errors.email}
              <p class="text-red-500 text-sm mt-1">{$errors.email}</p>
            {/if}
          </div>
          
          <div class="mb-4">
            <label for="subject" class="block mb-2 font-bold">Subject</label>
            <input 
              type="text" 
              id="subject" 
              bind:value={$form.subject} 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {#if $errors.subject}
              <p class="text-red-500 text-sm mt-1">{$errors.subject}</p>
            {/if}
          </div>
          
          <div class="mb-6">
            <label for="message" class="block mb-2 font-bold">Message</label>
            <textarea 
              id="message" 
              bind:value={$form.message} 
              rows="5" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
            {#if $errors.message}
              <p class="text-red-500 text-sm mt-1">{$errors.message}</p>
            {/if}
          </div>
          
          <button type="submit" class="btn btn-primary w-full">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</div>