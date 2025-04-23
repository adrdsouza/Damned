<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
-->

<script lang="ts">
  import { z } from "zod";
  import { superForm } from "sveltekit-superforms/client";
  import toast from "svelte-french-toast";
  
  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" })
  });
  
  const { form, errors, enhance } = superForm(formSchema, {
    id: 'newsletter',
    dataType: 'json',
    onSubmit: () => {
      // In a real app, this would submit to a server endpoint
      return {
        success: true
      };
    },
    onResult: ({ result }) => {
      if (result.type === 'success') {
        toast.success('Thank you for subscribing to our newsletter!');
        // Reset form field directly instead of reassigning the entire form object
        $form.email = '';
      }
    }
  });
</script>

<section class="py-16 bg-cream">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4">Join Our Newsletter</h2>
      <p class="mb-8 text-gray-700">
        Subscribe to receive updates on new products, special offers, and exclusive content.
      </p>
      
      <form method="POST" use:enhance class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
        <div class="flex-grow">
          <input 
            type="email" 
            id="email" 
            placeholder="Your email address" 
            aria-label="Email address for newsletter"
            bind:value={$form.email}
            class="w-full px-4 py-3 rounded-md border border-gray-300 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {#if $errors.email}
            <p class="text-red-500 text-sm mt-1 text-left">{$errors.email}</p>
          {/if}
        </div>
        <button 
          type="submit" 
          class="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
          aria-label="Subscribe to newsletter"
        >
          Subscribe
        </button>
      </form>
    </div>
  </div>
</section>