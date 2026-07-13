<script setup lang="ts">
import { ref } from 'vue'
import { X } from '@lucide/vue'

const props = defineProps<{
  modelValue: string[]
  placeholder?: string
  separators?: string[] // default: [',', ' ']
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const inputValue = ref('')
const activeSeparators = props.separators ?? [',', ' ']

function addTag(raw: string) {
  const pattern = new RegExp(`[${activeSeparators.map((s) => (s === ' ' ? '\\s' : s)).join('')}]+`)
  const newTags = raw
    .split(pattern)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && !props.modelValue.includes(t))

  if (newTags.length > 0) {
    emit('update:modelValue', [...props.modelValue, ...newTags])
  }
  inputValue.value = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || activeSeparators.includes(e.key)) {
    e.preventDefault()
    addTag(inputValue.value)
  } else if (e.key === 'Backspace' && inputValue.value === '' && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1)
  }
}

function onBlur() {
  if (inputValue.value.trim()) {
    addTag(inputValue.value)
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') ?? ''
  addTag(pasted)
}

function removeTag(index: number) {
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

const containerRef = ref<HTMLElement | null>(null)

function focusInput() {
  containerRef.value?.querySelector('input')?.focus()
}
</script>

<template>
  <div
    ref="containerRef"
    class="flex flex-wrap gap-1.5 min-h-10 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm ring-offset-background cursor-text focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
    @click="focusInput"
  >
    <span
      v-for="(tag, i) in modelValue"
      :key="i"
      class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
    >
      {{ tag }}
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground transition-colors"
        @click.stop="removeTag(i)"
      >
        <X class="h-3 w-3" />
      </button>
    </span>
    <input
      v-model="inputValue"
      :placeholder="modelValue.length === 0 ? placeholder : ''"
      class="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground"
      @keydown="onKeydown"
      @blur="onBlur"
      @paste="onPaste"
    />
  </div>
</template>
