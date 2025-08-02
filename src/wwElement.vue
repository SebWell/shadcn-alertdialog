<template>
  <!-- Backdrop -->
  <teleport to="body">
    <div
      v-if="content.isOpen"
      :class="backdropClasses"
      @click="handleBackdropClick"
    />
    
    <!-- Alert Dialog container -->
    <div
      v-if="content.isOpen"
      :class="dialogClasses"
      role="alertdialog"
      :aria-labelledby="content.title ? 'alert-dialog-title' : undefined"
      :aria-describedby="content.description ? 'alert-dialog-description' : undefined"
      @keydown="handleKeyDown"
      tabindex="-1"
    >
      <!-- Icon -->
      <div v-if="content.variant" class="dialog-icon-container">
        <div :class="getIconClasses()">
          <svg
            v-if="content.variant === 'destructive'"
            class="dialog-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <svg
            v-else-if="content.variant === 'warning'"
            class="dialog-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg
            v-else-if="content.variant === 'info'"
            class="dialog-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg
            v-else-if="content.variant === 'success'"
            class="dialog-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="dialog-content">
        <h2
          v-if="content.title"
          id="alert-dialog-title"
          class="dialog-title"
        >
          {{ content.title }}
        </h2>
        <p
          v-if="content.description"
          id="alert-dialog-description"
          class="dialog-description"
        >
          {{ content.description }}
        </p>
        
        <!-- Input field for confirmation -->
        <div v-if="content.requireConfirmation" class="dialog-confirmation">
          <label
            v-if="content.confirmationLabel"
            for="confirmation-input"
            class="dialog-confirmation-label"
          >
            {{ content.confirmationLabel }}
          </label>
          <input
            id="confirmation-input"
            ref="confirmationInput"
            v-model="confirmationValue"
            :placeholder="content.confirmationPlaceholder"
            class="dialog-confirmation-input"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="dialog-actions">
        <!-- Cancel button -->
        <button
          v-if="content.showCancel !== false"
          @click="handleCancel"
          class="dialog-button dialog-button-cancel"
        >
          {{ content.cancelLabel || 'Cancel' }}
        </button>
        
        <!-- Continue/Confirm button -->
        <button
          @click="handleConfirm"
          :disabled="isConfirmDisabled"
          :class="getConfirmButtonClasses()"
        >
          {{ content.confirmLabel || 'Continue' }}
        </button>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'

export default {
  name: 'ShadcnAlertDialog',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        isOpen: false,
        title: 'Are you absolutely sure?',
        description: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
        variant: 'destructive',
        showCancel: true,
        cancelLabel: 'Cancel',
        confirmLabel: 'Continue',
        requireConfirmation: false,
        confirmationLabel: "Type 'delete' to confirm",
        confirmationPlaceholder: 'delete',
        confirmationMatch: 'delete'
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  emits: ['trigger-event', 'confirm', 'cancel', 'close'],
  setup(props, { emit }) {
    const confirmationValue = ref('')
    const confirmationInput = ref(null)

    // Watch for dialog open changes
    watch(() => props.content.isOpen, (newValue) => {
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

    const backdropClasses = computed(() => {
      return 'dialog-backdrop'
    })

    const dialogClasses = computed(() => {
      return 'dialog-container'
    })

    const getIconClasses = () => {
      const baseClass = 'dialog-icon-wrapper'
      const variantClass = `dialog-icon-wrapper-${props.content.variant || 'default'}`
      return `${baseClass} ${variantClass}`
    }

    const getConfirmButtonClasses = () => {
      const baseClass = 'dialog-button dialog-button-confirm'
      const variantClass = `dialog-button-confirm-${props.content.variant || 'default'}`
      const disabledClass = isConfirmDisabled.value ? 'dialog-button-disabled' : ''
      return `${baseClass} ${variantClass} ${disabledClass}`.trim()
    }

    const isConfirmDisabled = computed(() => {
      if (props.content.requireConfirmation) {
        if (props.content.confirmationMatch) {
          return confirmationValue.value !== props.content.confirmationMatch
        }
        return !confirmationValue.value.trim()
      }
      return false
    })

    const handleConfirm = () => {
      if (isConfirmDisabled.value) return

      const eventData = {
        confirmationValue: confirmationValue.value,
        content: props.content
      }

      emit('confirm', eventData)
      emit('trigger-event', {
        domEvent: null,
        value: eventData
      })
    }

    const handleCancel = () => {
      const eventData = {
        content: props.content
      }

      emit('cancel', eventData)
      emit('trigger-event', {
        domEvent: null,
        value: eventData
      })
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
      confirmationValue,
      confirmationInput,
      isConfirmDisabled,
      backdropClasses,
      dialogClasses,
      getIconClasses,
      getConfirmButtonClasses,
      handleConfirm,
      handleCancel,
      handleBackdropClick,
      handleKeyDown
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(222.2, 84%, 4.9%);
  --muted-foreground: hsl(215.4, 16.3%, 46.9%);
  --border: hsl(214.3, 31.8%, 91.4%);
  --input: hsl(214.3, 31.8%, 91.4%);
  --ring: hsl(222.2, 84%, 4.9%);
  --destructive: hsl(0, 84.2%, 60.2%);
  --destructive-foreground: hsl(210, 40%, 98%);
  --primary: hsl(222.2, 47.4%, 11.2%);
  --primary-foreground: hsl(210, 40%, 98%);
}

/* Backdrop */
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

/* Dialog Container */
.dialog-container {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 50;
  display: grid;
  width: 100%;
  max-width: 32rem;
  transform: translate(-50%, -50%);
  gap: 16px;
  border: 1px solid var(--border);
  background-color: var(--background);
  padding: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  animation: dialog-in 0.3s ease-out;
}

@keyframes dialog-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Icon */
.dialog-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-icon-wrapper {
  display: flex;
  height: 48px;
  width: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.dialog-icon-wrapper-destructive {
  background-color: hsl(0, 84.2%, 97%);
  color: var(--destructive);
}

.dialog-icon-wrapper-warning {
  background-color: hsl(48, 96%, 95%);
  color: hsl(25, 95%, 30%);
}

.dialog-icon-wrapper-info {
  background-color: hsl(214, 100%, 97%);
  color: hsl(214, 84%, 56%);
}

.dialog-icon-wrapper-success {
  background-color: hsl(143, 85%, 96%);
  color: hsl(140, 84%, 39%);
}

.dialog-icon-wrapper-default {
  background-color: hsl(210, 40%, 96%);
  color: var(--muted-foreground);
}

.dialog-icon {
  height: 24px;
  width: 24px;
}

/* Content */
.dialog-content {
  gap: 8px;
  text-align: center;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--foreground);
}

.dialog-description {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1.5;
}

/* Confirmation Input */
.dialog-confirmation {
  margin-top: 16px;
  gap: 8px;
}

.dialog-confirmation-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--foreground);
}

.dialog-confirmation-input {
  display: flex;
  height: 40px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid var(--input);
  background-color: var(--background);
  padding: 8px 12px;
  font-size: 14px;
  color: var(--foreground);
  transition: border-color 0.2s;
}

.dialog-confirmation-input:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 2px var(--ring);
}

.dialog-confirmation-input::placeholder {
  color: var(--muted-foreground);
}

/* Actions */
.dialog-actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
}

@media (min-width: 640px) {
  .dialog-actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
  }
  
  .dialog-content {
    text-align: left;
  }
}

/* Buttons */
.dialog-button {
  display: inline-flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.dialog-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--ring);
}

.dialog-button-cancel {
  border: 1px solid var(--input);
  background-color: var(--background);
  color: var(--foreground);
}

.dialog-button-cancel:hover {
  background-color: hsl(210, 40%, 96%);
}

.dialog-button-confirm {
  color: var(--primary-foreground);
}

.dialog-button-confirm-default {
  background-color: var(--primary);
}

.dialog-button-confirm-default:hover {
  background-color: hsl(222.2, 47.4%, 8%);
}

.dialog-button-confirm-destructive {
  background-color: var(--destructive);
}

.dialog-button-confirm-destructive:hover {
  background-color: hsl(0, 84.2%, 55%);
}

.dialog-button-confirm-warning {
  background-color: hsl(38, 92%, 50%);
}

.dialog-button-confirm-warning:hover {
  background-color: hsl(38, 92%, 45%);
}

.dialog-button-confirm-info {
  background-color: hsl(214, 84%, 56%);
}

.dialog-button-confirm-info:hover {
  background-color: hsl(214, 84%, 51%);
}

.dialog-button-confirm-success {
  background-color: hsl(140, 84%, 39%);
}

.dialog-button-confirm-success:hover {
  background-color: hsl(140, 84%, 34%);
}

.dialog-button-disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>