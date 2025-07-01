<template>
  <!-- Backdrop -->
  <teleport to="body">
    <div
      v-if="isOpen"
      :class="cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )"
      @click="handleBackdropClick"
    />
    
    <!-- Alert Dialog container -->
    <div
      v-if="isOpen"
      :class="cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 sm:rounded-lg',
        'animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]',
        content.customClass
      )"
      :style="content.customStyle"
      role="alertdialog"
      :aria-labelledby="content.title ? 'alert-dialog-title' : undefined"
      :aria-describedby="content.description ? 'alert-dialog-description' : undefined"
      @keydown="handleKeyDown"
      tabindex="-1"
    >
      <!-- Icon -->
      <div v-if="content.icon || content.variant" class="flex items-center justify-center">
        <div 
          :class="cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            content.variant === 'destructive' ? 'bg-destructive/10 text-destructive' : '',
            content.variant === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' : '',
            content.variant === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : '',
            content.variant === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : '',
            !content.variant && !content.icon ? 'bg-muted text-muted-foreground' : ''
          )"
        >
          <component
            v-if="content.icon"
            :is="content.icon"
            class="h-6 w-6"
          />
          <svg
            v-else-if="content.variant === 'destructive'"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <svg
            v-else-if="content.variant === 'warning'"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg
            v-else-if="content.variant === 'info'"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg
            v-else-if="content.variant === 'success'"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-2 text-center sm:text-left">
        <h2
          v-if="content.title"
          id="alert-dialog-title"
          class="text-lg font-semibold"
        >
          {{ content.title }}
        </h2>
        <p
          v-if="content.description"
          id="alert-dialog-description"
          class="text-sm text-muted-foreground"
        >
          {{ content.description }}
        </p>
        
        <!-- Custom content -->
        <div v-if="content.content" v-html="content.content" class="mt-4" />
        
        <!-- Input field for confirmation -->
        <div v-if="content.requireConfirmation" class="mt-4 space-y-2">
          <label
            v-if="content.confirmationLabel"
            for="confirmation-input"
            class="text-sm font-medium"
          >
            {{ content.confirmationLabel }}
          </label>
          <input
            id="confirmation-input"
            ref="confirmationInput"
            v-model="confirmationValue"
            :placeholder="content.confirmationPlaceholder"
            :class="cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )"
          />
        </div>
      </div>

      <!-- Actions -->
      <div 
        :class="cn(
          'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
          content.actionsClass
        )"
      >
        <!-- Cancel button -->
        <button
          v-if="content.showCancel !== false"
          @click="handleCancel"
          :class="cn(
            'inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          )"
        >
          {{ content.cancelLabel || 'Cancel' }}
        </button>
        
        <!-- Continue/Confirm button -->
        <button
          @click="handleConfirm"
          :disabled="isConfirmDisabled"
          :class="cn(
            'inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            // Variant styles
            content.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : '',
            content.variant === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : '',
            content.variant === 'info' ? 'bg-blue-600 text-white hover:bg-blue-700' : '',
            content.variant === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : '',
            !content.variant ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
          )"
        >
          <component
            v-if="content.confirmIcon"
            :is="content.confirmIcon"
            class="mr-2 h-4 w-4"
          />
          {{ content.confirmLabel || 'Continue' }}
        </button>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:open', 'confirm', 'cancel', 'close'],
  setup(props, { emit }) {
    // Import utility function
    const cn = (...inputs) => {
      return inputs.filter(Boolean).join(' ')
    }

    const isOpen = ref(props.open)
    const confirmationValue = ref('')
    const confirmationInput = ref(null)

    // Watch for external open changes
    watch(() => props.open, (newValue) => {
      isOpen.value = newValue
      if (newValue) {
        // Reset confirmation value
        confirmationValue.value = ''
        
        // Focus the confirmation input or first button
        nextTick(() => {
          if (props.content.requireConfirmation && confirmationInput.value) {
            confirmationInput.value.focus()
          } else {
            const firstButton = document.querySelector('[role="alertdialog"] button')
            if (firstButton) {
              firstButton.focus()
            }
          }
        })
      }
    })

    const isConfirmDisabled = computed(() => {
      if (props.content.requireConfirmation) {
        if (props.content.confirmationMatch) {
          return confirmationValue.value !== props.content.confirmationMatch
        }
        return !confirmationValue.value.trim()
      }
      return false
    })

    const closeDialog = () => {
      isOpen.value = false
      emit('update:open', false)
      emit('close')
    }

    const handleConfirm = () => {
      if (isConfirmDisabled.value) return

      emit('confirm', {
        confirmationValue: confirmationValue.value,
        content: props.content
      })
      
      if (props.content.closeOnConfirm !== false) {
        closeDialog()
      }
    }

    const handleCancel = () => {
      emit('cancel', {
        content: props.content
      })
      
      closeDialog()
    }

    const handleBackdropClick = () => {
      if (props.content.closeOnBackdrop !== false) {
        handleCancel()
      }
    }

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          if (props.content.closeOnEscape !== false) {
            event.preventDefault()
            handleCancel()
          }
          break
        case 'Enter':
          if (!props.content.requireConfirmation || !isConfirmDisabled.value) {
            event.preventDefault()
            handleConfirm()
          }
          break
      }
    }

    return {
      cn,
      isOpen,
      confirmationValue,
      confirmationInput,
      isConfirmDisabled,
      closeDialog,
      handleConfirm,
      handleCancel,
      handleBackdropClick,
      handleKeyDown
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 